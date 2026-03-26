import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

const REDIRECT_MS = 3000;

type PartnerExitModalProps = {
  open: boolean;
  /** Partner storefront URL */
  targetUrl: string;
  /** PARTNER CODE: omit or empty when no code applies (copy shortens automatically) */
  checkoutCode?: string | null;
  onClose: () => void;
};

/**
 * Lightweight leave-site notice before opening partner URLs.
 * Reusable per offer via `checkoutCode` and `targetUrl`.
 */
export function PartnerExitModal({
  open,
  targetUrl,
  checkoutCode,
  onClose,
}: PartnerExitModalProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const clearTimer = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!open) {
      clearTimer();
      return;
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      onCloseRef.current();
    }, REDIRECT_MS);
    return clearTimer;
  }, [open, targetUrl]);

  if (!open) return null;

  const code = checkoutCode?.trim();
  const hasCode = Boolean(code);

  const continueToPartner = () => {
    clearTimer();
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-exit-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-amber-200/80">
        <h2 id="partner-exit-title" className="text-xl font-bold text-neutral-900 mb-4">
          Leaving our site
        </h2>
        {hasCode ? (
          <p className="text-neutral-700 leading-relaxed mb-4">
            You&apos;re being redirected to our partner site. If it does not apply automatically,
            please use code:{" "}
            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              {code}
            </span>{" "}
            at checkout.
          </p>
        ) : (
          <p className="text-neutral-700 leading-relaxed mb-4">
            You&apos;re being redirected to our partner site.
          </p>
        )}
        <p className="text-sm text-amber-900/55 mb-6">
          Opening in a new tab automatically in a few seconds, or use the button below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={continueToPartner}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Continue now
            <ExternalLink className="w-4 h-4 shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => {
              clearTimer();
              onClose();
            }}
            className="flex-1 px-5 py-3 rounded-lg font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200/80 transition-colors"
          >
            Stay here
          </button>
        </div>
      </div>
    </div>
  );
}
