"""Cybersource sandbox smoke test (HTTP Signature auth).

Usage: python3 scripts/test_auth.py   (reads .env.local in the repo root)
Runs: 1) read-only reporting call to verify keys, 2) $1.00 test authorization.
"""
import base64, datetime, hashlib, hmac, json, os, pathlib, urllib.error, urllib.request

env = {}
for line in (pathlib.Path(__file__).resolve().parent.parent / ".env.local").read_text().splitlines():
    if line.strip() and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()

HOST = env["CYBS_RUN_ENVIRONMENT"]
MID = env["CYBS_MERCHANT_ID"]
KID = env["CYBS_KEY_ID"]
SECRET = env["CYBS_SHARED_SECRET"]


def call(method, path, body=None):
    date = datetime.datetime.now(datetime.timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
    headers = {"host": HOST, "date": date, "v-c-merchant-id": MID, "Content-Type": "application/json"}
    signed = "host date request-target v-c-merchant-id"
    sig_str = f"host: {HOST}\ndate: {date}\nrequest-target: {method.lower()} {path}\n"
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        digest = "SHA-256=" + base64.b64encode(hashlib.sha256(data).digest()).decode()
        headers["digest"] = digest
        sig_str += f"digest: {digest}\n"
        signed = "host date request-target digest v-c-merchant-id"
    sig_str += f"v-c-merchant-id: {MID}"
    sig = base64.b64encode(hmac.new(base64.b64decode(SECRET), sig_str.encode(), hashlib.sha256).digest()).decode()
    headers["signature"] = f'keyid="{KID}", algorithm="HmacSHA256", headers="{signed}", signature="{sig}"'
    req = urllib.request.Request(f"https://{HOST}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:600]


if __name__ == "__main__":
    status, _ = call("GET", "/reporting/v3/report-definitions")
    print("Key check (expect 200):", status)

    payment = {
        "clientReferenceInformation": {"code": "smoke-test"},
        "paymentInformation": {"card": {"number": "4111111111111111", "expirationMonth": "12", "expirationYear": "2031"}},
        "orderInformation": {
            "amountDetails": {"totalAmount": "1.00", "currency": "USD"},
            "billTo": {"firstName": "Test", "lastName": "Shopper", "address1": "1 Market St",
                       "locality": "San Francisco", "administrativeArea": "CA", "postalCode": "94105",
                       "country": "US", "email": "test@example.com"},
        },
    }
    status, resp = call("POST", "/pts/v2/payments", payment)
    if isinstance(resp, dict):
        print("Payment:", status, resp.get("status"), resp.get("id"))
    else:
        print("Payment:", status, resp)
