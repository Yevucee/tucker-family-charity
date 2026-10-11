import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { formatRands, usePaymentCatalog } from "@/hooks/usePaymentCatalog";
import { CheckoutError, startCheckout } from "@/lib/yocoCheckout";

/**
 * Card donations via Yoco. Preset amounts come from the "TFC Payment Catalog" Google Sheet
 * (Catalog tab, kind = donation) — staff change them there, not in code.
 */
export function YocoDonationPanel() {
  const { catalog, loading, error } = usePaymentCatalog();
  const [selectedId, setSelectedId] = useState<string>("");
  const [customAmount, setCustomAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Back button from Yoco restores this page from cache — re-enable the button.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setSubmitting(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const settings = catalog?.settings;
  const presets = catalog?.donations ?? [];
  const usingCustom = !selectedId && customAmount.trim() !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setMessage("");

    let request: Parameters<typeof startCheckout>[0];
    if (selectedId) {
      request = { type: "donation", itemId: selectedId };
    } else {
      const amount = Number(customAmount.replace(/[^\d]/g, ""));
      if (!settings?.allowCustomAmount || !Number.isInteger(amount) || amount <= 0) {
        setMessage("Please choose an amount.");
        return;
      }
      if (amount < settings.minAmountZar || amount > settings.maxAmountZar) {
        setMessage(
          `Please enter an amount between ${formatRands(settings.minAmountZar)} and ${formatRands(settings.maxAmountZar)}.`,
        );
        return;
      }
      request = { type: "donation", amountZar: amount };
    }

    setSubmitting(true);
    try {
      await startCheckout(request);
    } catch (err) {
      setMessage(err instanceof CheckoutError ? err.message : "We could not start the payment. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-neutral-600">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Loading donation options…
      </p>
    );
  }

  if (error || !catalog || (presets.length === 0 && !settings?.allowCustomAmount)) {
    return (
      <p className="text-neutral-600">
        Online card donations are temporarily unavailable. Please try again later or contact us below.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {presets.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-800 mb-3">Choose an amount</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map((preset) => {
              const active = selectedId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedId(preset.id);
                    setCustomAmount("");
                    setMessage("");
                  }}
                  className={[
                    "rounded-xl border-2 px-4 py-3 font-bold transition-colors",
                    active
                      ? "border-orange-600 bg-orange-600 text-white"
                      : "border-amber-200 bg-white text-neutral-900 hover:border-orange-400",
                  ].join(" ")}
                  title={preset.description || undefined}
                >
                  {formatRands(preset.priceZar)}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {settings?.allowCustomAmount ? (
        <label className="block">
          <span className="block text-sm font-semibold text-neutral-800 mb-1.5">
            {presets.length > 0 ? "Or enter your own amount (R)" : "Donation amount (R)"}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={settings.minAmountZar}
            max={settings.maxAmountZar}
            step={1}
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              if (e.target.value) setSelectedId("");
              setMessage("");
            }}
            placeholder={`From ${formatRands(settings.minAmountZar)}`}
            className="w-full sm:w-64 rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </label>
      ) : null}

      {message ? (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting || (!selectedId && !usingCustom)}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <Lock className="w-4 h-4" aria-hidden />}
          {submitting ? "Opening secure payment…" : "Donate securely by card"}
        </button>
        <span className="text-xs text-neutral-500">Payments are processed securely by Yoco.</span>
      </div>
    </form>
  );
}
