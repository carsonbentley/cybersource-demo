/**
 * Browser side of Unified Checkout.
 *
 * The capture context is a JWT. Its payload names the exact Unified Checkout client library to load
 * (and its Subresource Integrity hash), so the script version always matches the capture context.
 */

type UnifiedPayments = {
  show: (options: { containers: { paymentSelection: string; paymentScreen?: string } }) => Promise<string>;
};
type AcceptInstance = { unifiedPayments: (sidebar?: boolean) => Promise<UnifiedPayments> };

declare global {
  interface Window {
    Accept?: (captureContext: string) => Promise<AcceptInstance>;
  }
}

type CaptureContextPayload = {
  ctx?: { data?: { clientLibrary?: string; clientLibraryIntegrity?: string } }[];
};

function decodePayload(jwt: string): CaptureContextPayload {
  const part = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = part + "=".repeat((4 - (part.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

const loaded = new Map<string, Promise<void>>();

function loadScript(src: string, integrity?: string): Promise<void> {
  const existing = loaded.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = "anonymous";
    }
    script.onload = () => resolve();
    script.onerror = () => {
      loaded.delete(src);
      reject(new Error("Could not load the Unified Checkout library"));
    };
    document.head.appendChild(script);
  });
  loaded.set(src, promise);
  return promise;
}

/**
 * Loads Unified Checkout, renders the payment buttons (card, Click to Pay, Google Pay) into
 * `paymentSelection`, and resolves with the transient token once the shopper finishes.
 */
export async function runUnifiedCheckout(
  captureContext: string,
  containers: { paymentSelection: string; paymentScreen: string },
): Promise<string> {
  const data = decodePayload(captureContext).ctx?.[0]?.data;
  if (!data?.clientLibrary) throw new Error("Capture context has no client library URL");
  await loadScript(data.clientLibrary, data.clientLibraryIntegrity);
  if (!window.Accept) throw new Error("Unified Checkout library did not load");

  const accept = await window.Accept(captureContext);
  const up = await accept.unifiedPayments(false); // false = render inline, not in a sidebar
  return up.show({ containers });
}
