import { useEffect } from "react";
import { Link } from "react-router";
import { CheckCircle2, CircleSlash, AlertTriangle } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type Outcome = "success" | "cancelled" | "failed";
type Flow = "shop" | "donate";

const CONTACT_EMAIL = "info@tuckerfamilycharity.org";

const copy: Record<Flow, Record<Outcome, { title: string; body: string }>> = {
  shop: {
    success: {
      title: "Thank you for your order",
      body: "Your payment was received by Yoco. We will be in touch by email to confirm your order and arrange delivery.",
    },
    cancelled: {
      title: "Payment cancelled",
      body: "No payment was taken. Your order has not been placed — you can go back and try again whenever you are ready.",
    },
    failed: {
      title: "Payment did not go through",
      body: "Your card was not charged. Please try again, use a different card, or contact us and we will help you complete your order.",
    },
  },
  donate: {
    success: {
      title: "Thank you for your donation",
      body: "Your generosity makes a real difference. Yoco will email you a receipt for your payment.",
    },
    cancelled: {
      title: "Donation cancelled",
      body: "No payment was taken. You are welcome to try again at any time.",
    },
    failed: {
      title: "Donation did not go through",
      body: "Your card was not charged. Please try again, use a different card, or contact us for other ways to give.",
    },
  },
};

/**
 * Landing pages for Yoco redirects. UX only — the Yoco webhook (Railway API) is the
 * proof of payment, never this page.
 */
export function PaymentResult({ flow, outcome }: { flow: Flow; outcome: Outcome }) {
  const { title, body } = copy[flow][outcome];
  const Icon = outcome === "success" ? CheckCircle2 : outcome === "cancelled" ? CircleSlash : AlertTriangle;
  const retryPath = flow === "donate" ? "/donate/" : "/shop/";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Tucker Family Charity`;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, [title]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content" className="py-20 md:py-28">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Icon
            className={`w-14 h-14 mx-auto ${outcome === "success" ? "text-amber-600" : "text-neutral-500"}`}
            aria-hidden
          />
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{title}</h1>
          <p className="text-lg text-neutral-700 leading-relaxed">{body}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {outcome === "success" ? (
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
              >
                Back to home
              </Link>
            ) : (
              <Link
                to={retryPath}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
              >
                Try again
              </Link>
            )}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-amber-600 text-amber-800 font-semibold hover:bg-amber-50 transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const ShopPaymentSuccess = () => <PaymentResult flow="shop" outcome="success" />;
export const ShopPaymentCancelled = () => <PaymentResult flow="shop" outcome="cancelled" />;
export const ShopPaymentFailed = () => <PaymentResult flow="shop" outcome="failed" />;
export const DonateThankYou = () => <PaymentResult flow="donate" outcome="success" />;
export const DonateCancelled = () => <PaymentResult flow="donate" outcome="cancelled" />;
export const DonateFailed = () => <PaymentResult flow="donate" outcome="failed" />;
