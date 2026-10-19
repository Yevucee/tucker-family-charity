/**
 * Browser side of Yoco checkout: asks the Railway API to create a checkout, then redirects
 * to Yoco's hosted payment page. Prices are looked up server-side — the browser only sends
 * ids / quantities (and a custom donation amount, bounded by the Sheet settings).
 */

import { YOCO_CHECKOUT_API_URL } from "@/config";
import type { WineDeliveryZone } from "@/data/winePricing";
import { rememberCheckout } from "@/lib/yocoCheckoutReturn";

export type CheckoutRequest =
  | { type: "donation"; itemId: string }
  | { type: "donation"; amountZar: number }
  | { type: "product"; itemId: string; quantity?: number }
  | {
      type: "wine";
      lines: Array<{ wineSlug: string; caseQuantity: number }>;
      deliveryZone: WineDeliveryZone;
      deliveryAddress: string;
      notes?: string;
      customer: { name: string; email: string; phone: string };
    };

export class CheckoutError extends Error {}

export async function createCheckout(request: CheckoutRequest): Promise<string> {
  if (!YOCO_CHECKOUT_API_URL) throw new CheckoutError("Online payments are not available right now.");

  let res: Response;
  try {
    res = await fetch(`${YOCO_CHECKOUT_API_URL}/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new CheckoutError("We could not reach the payment service. Please check your connection and try again.");
  }

  let data: { redirectUrl?: string; error?: string } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    /* non-JSON */
  }
  if (!res.ok || !data.redirectUrl) {
    throw new CheckoutError(data.error || "We could not start the payment. Please try again shortly.");
  }
  return data.redirectUrl;
}

/**
 * Creates the checkout and sends the browser to Yoco. Resolves only on error.
 * `location.replace` keeps the pre-payment page out of history, so Back from the
 * return page does not resurrect a stale form.
 */
export async function startCheckout(request: CheckoutRequest): Promise<void> {
  const redirectUrl = await createCheckout(request);
  rememberCheckout(
    request.type === "wine"
      ? { flow: "shop", kind: "wine", email: request.customer.email }
      : request.type === "product"
        ? { flow: "shop", kind: "product" }
        : { flow: "donate", kind: "donation" },
  );
  window.location.replace(redirectUrl);
}
