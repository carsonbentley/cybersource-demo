import "server-only";
import cybersource from "cybersource-rest-client";

/**
 * Thin wrapper around the official cybersource-rest-client Node SDK.
 * Auth is HTTP Signature (shared secret), configured from the CYBS_* env vars.
 */

type SdkCallback = (error: SdkError | null, data: unknown, response: SdkResponse) => void;
type SdkResponse = { status?: number; text?: string; header?: Record<string, string> } | undefined;
type SdkError = { status?: number; response?: { text?: string }; message?: string };

export class CybersourceError extends Error {
  constructor(
    message: string,
    public status: number,
    public details: unknown,
  ) {
    super(message);
  }
}

function config() {
  const required = ["CYBS_RUN_ENVIRONMENT", "CYBS_MERCHANT_ID", "CYBS_KEY_ID", "CYBS_SHARED_SECRET"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new CybersourceError(`Missing env vars: ${missing.join(", ")}`, 500, null);
  }
  return {
    authenticationType: "http_signature",
    runEnvironment: process.env.CYBS_RUN_ENVIRONMENT,
    merchantID: process.env.CYBS_MERCHANT_ID,
    merchantKeyId: process.env.CYBS_KEY_ID,
    merchantsecretKey: process.env.CYBS_SHARED_SECRET,
    logConfiguration: { enableLog: false },
  };
}

/** Wraps an SDK callback-style call in a promise and normalizes errors. */
function call<T>(fn: (cb: SdkCallback) => void): Promise<{ data: T; status: number }> {
  return new Promise((resolve, reject) => {
    fn((error, data, response) => {
      if (error) {
        const text = error.response?.text;
        let details: unknown = text;
        try {
          details = text ? JSON.parse(text) : error.message;
        } catch {
          // Plain-text error body; keep it as is.
        }
        reject(new CybersourceError("Cybersource request failed", error.status ?? 502, details));
        return;
      }
      resolve({ data: data as T, status: response?.status ?? 200 });
    });
  });
}

/** Cents to the "12.34" string the APIs expect. */
export function toAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Origins the Unified Checkout page may run on. UC refuses to render on an origin that is not in
 * the capture context's targetOrigins. Cybersource rejects http://localhost URLs as invalid in a
 * deployed capture context, so localhost is only listed when running outside Vercel. On Vercel we
 * list the production domain plus this deployment's own URLs (covers preview deployments).
 */
export function targetOrigins(): string[] {
  const origins = new Set<string>(["https://cybersource-demo-three.vercel.app"]);
  if (process.env.VERCEL) {
    for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
      if (host) origins.add(`https://${host}`);
    }
  } else {
    origins.add(process.env.UC_LOCAL_ORIGIN || "http://localhost:3000");
  }
  for (const extra of (process.env.UC_EXTRA_ORIGINS ?? "").split(",")) {
    if (extra.trim()) origins.add(extra.trim());
  }
  return [...origins];
}

/** Unified Checkout client library version. Required by the capture context API. */
const UC_CLIENT_VERSION = process.env.UC_CLIENT_VERSION || "0.31";

const DEFAULT_PAYMENT_TYPES = ["PANENTRY", "CLICKTOPAY", "GOOGLEPAY"];

/**
 * Payment types to offer. Card entry, Click to Pay and Google Pay by default (Apple Pay is skipped
 * because it needs domain verification). Override with UC_PAYMENT_TYPES, e.g. "PANENTRY".
 */
function paymentTypes(): string[] {
  const fromEnv = (process.env.UC_PAYMENT_TYPES ?? "")
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_PAYMENT_TYPES;
}

async function requestCaptureContext(totalCents: number, allowedPaymentTypes: string[]) {
  const request = {
    clientVersion: UC_CLIENT_VERSION,
    targetOrigins: targetOrigins(),
    allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
    allowedPaymentTypes,
    country: "US",
    locale: "en_US",
    buttonType: "CHECKOUT",
    captureMandate: {
      billingType: "FULL",
      requestEmail: true,
      requestPhone: false,
      requestShipping: true,
      shipToCountries: ["US"],
      showAcceptedNetworkIcons: true,
    },
    orderInformation: {
      amountDetails: { totalAmount: toAmount(totalCents), currency: "USD" },
    },
  };
  const api = new cybersource.UnifiedCheckoutCaptureContextApi(config(), new cybersource.ApiClient());
  const { data } = await call<string>((cb) => api.generateUnifiedCheckoutCaptureContext(request, cb));
  return data;
}

/**
 * POST /up/v1/capture-contexts: returns the capture context JWT for this order.
 *
 * If Cybersource rejects the request (for example because Click to Pay or Google Pay is not set up
 * on the account), it retries once with card entry only, so checkout still works.
 */
export async function createCaptureContext(
  totalCents: number,
): Promise<{ captureContext: string; paymentTypes: string[]; fallbackReason?: unknown }> {
  const types = paymentTypes();
  try {
    return { captureContext: await requestCaptureContext(totalCents, types), paymentTypes: types };
  } catch (err) {
    const e = err as CybersourceError;
    const cardOnly = ["PANENTRY"];
    if (e.status !== 400 || types.join() === cardOnly.join()) throw err;
    console.warn("capture context rejected, retrying with card entry only", e.details);
    return {
      captureContext: await requestCaptureContext(totalCents, cardOnly),
      paymentTypes: cardOnly,
      fallbackReason: e.details,
    };
  }
}

export type PaymentResult = {
  id: string;
  status: string;
  approved: boolean;
  reason?: string;
  message?: string;
  authorizedAmount?: string;
  raw: Record<string, unknown>;
};

function toPaymentResult(data: Record<string, unknown>): PaymentResult {
  const status = String(data.status ?? "UNKNOWN");
  const error = data.errorInformation as { reason?: string; message?: string } | undefined;
  const amount = (data.orderInformation as { amountDetails?: { authorizedAmount?: string } })
    ?.amountDetails?.authorizedAmount;
  return {
    id: String(data.id ?? ""),
    status,
    approved: status === "AUTHORIZED",
    reason: error?.reason,
    message: error?.message,
    authorizedAmount: amount,
    raw: data,
  };
}

/**
 * POST /pts/v2/payments with the Unified Checkout transient token. The token carries the card (or
 * Click to Pay / Google Pay credential) plus the billing and shipping details the shopper entered,
 * so the request only needs the amount and our order reference.
 *
 * Authorization only (capture: false). Capture, void and refund come later from the admin page.
 */
export async function authorizeTransientToken(opts: {
  transientToken: string;
  totalCents: number;
  orderId: string;
}): Promise<PaymentResult> {
  const request = {
    clientReferenceInformation: { code: opts.orderId },
    processingInformation: { capture: false },
    tokenInformation: { transientTokenJwt: opts.transientToken },
    orderInformation: {
      amountDetails: { totalAmount: toAmount(opts.totalCents), currency: "USD" },
    },
  };
  const api = new cybersource.PaymentsApi(config(), new cybersource.ApiClient());
  const { data } = await call<Record<string, unknown>>((cb) => api.createPayment(request, cb));
  return toPaymentResult(data);
}

/** $1.00 authorization with the 4111 test card. Same request as scripts/test_auth.py, via the SDK. */
export async function authorizeTestCard(): Promise<PaymentResult> {
  const request = {
    clientReferenceInformation: { code: `smoke-${Date.now()}` },
    paymentInformation: {
      card: { number: "4111111111111111", expirationMonth: "12", expirationYear: "2031" },
    },
    orderInformation: {
      amountDetails: { totalAmount: "1.00", currency: "USD" },
      billTo: {
        firstName: "Test",
        lastName: "Shopper",
        address1: "1 Market St",
        locality: "San Francisco",
        administrativeArea: "CA",
        postalCode: "94105",
        country: "US",
        email: "test@example.com",
      },
    },
  };
  const api = new cybersource.PaymentsApi(config(), new cybersource.ApiClient());
  const { data } = await call<Record<string, unknown>>((cb) => api.createPayment(request, cb));
  return toPaymentResult(data);
}

/**
 * Reads a JWT payload without verifying it. Used only to show the shopper what they paid with.
 * The payment itself is authorized by Cybersource, which validates the token server side.
 */
export function decodeJwtPayload(jwt: string): Record<string, unknown> | null {
  try {
    const part = jwt.split(".")[1];
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
