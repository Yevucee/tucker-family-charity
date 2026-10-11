import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import type { PaymentCatalogEntry } from "@/hooks/usePaymentCatalog";
import { formatRands } from "@/hooks/usePaymentCatalog";
import { CheckoutError, startCheckout } from "@/lib/yocoCheckout";

interface YocoPayButtonProps {
  /** Row id in the TFC Payment Catalog Sheet (kind = product). */
  catalogItemId: string;
  /** Active products from usePaymentCatalog — the button hides itself if the row is missing or inactive. */
  products: PaymentCatalogEntry[] | undefined;
  className?: string;
}

/**
 * "Pay now" for a shop product priced in the Google Sheet. Hidden unless the Sheet row
 * exists with active = Y, so staff can switch a product on/off without code.
 */
export function YocoPayButton({ catalogItemId, products, className }: YocoPayButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const item = products?.find((p) => p.id === catalogItemId);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setSubmitting(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  if (!item) return null;

  const handleClick = async () => {
    if (submitting) return;
    setMessage("");
    setSubmitting(true);
    try {
      await startCheckout({ type: "product", itemId: item.id, quantity: 1 });
    } catch (err) {
      setMessage(err instanceof CheckoutError ? err.message : "We could not start the payment. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-auto space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className={
          className ??
          "inline-flex w-full items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60"
        }
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Lock className="w-4 h-4" aria-hidden />}
        {submitting ? "Opening secure payment…" : `Pay now — ${formatRands(item.priceZar)}`}
      </button>
      {message ? (
        <p className="text-sm text-red-800" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
