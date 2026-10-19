/**
 * Yoco return URLs. These are NOT in the sitemap and are noindex, but they must be prerendered:
 * GitHub Pages has no SPA fallback, so without a real index.html the customer lands on an HTTP 404
 * right after paying (and in-app browsers such as WhatsApp may never reach the React app).
 *
 * Keep paths in sync with `resultPaths` in api/lib/checkoutPlans.ts and with src/app/routes.ts.
 */
import type { PageDef } from "./head.ts";

export const CHECKOUT_ROBOTS_META = "noindex, nofollow";

function shell(main: string): string {
  return `<div id="static-prerender" data-prerender="true"><main id="main-content">${main}</main></div>`;
}

const shopLinks = `<p><a href="/shop/wine/">Back to the wine shop</a> · <a href="/">Home</a></p>`;
const donateLinks = `<p><a href="/donate/">Back to Support Us</a> · <a href="/">Home</a></p>`;

export const CHECKOUT_LANDING_PAGES: PageDef[] = [
  {
    path: "/shop/payment/success",
    title: "Thank you for your order | Tucker Family Charity",
    description: "Your payment was received. Thank you for supporting Tucker Family Charity.",
    noindex: true,
    staticHtml: shell(
      `<h1>Thank you for your order</h1><p>Your payment was received. We will email you to confirm your order and arrange delivery.</p>${shopLinks}`,
    ),
  },
  {
    path: "/shop/payment/cancelled",
    title: "Payment cancelled | Tucker Family Charity",
    description: "No payment was taken. You can return to the shop and try again whenever you are ready.",
    noindex: true,
    staticHtml: shell(
      `<h1>Payment cancelled</h1><p>No payment was taken. Your order has not been placed — you can go back and try again whenever you are ready.</p>${shopLinks}`,
    ),
  },
  {
    path: "/shop/payment/failed",
    title: "Payment did not go through | Tucker Family Charity",
    description: "Your card was not charged. Please try again or contact Tucker Family Charity for help.",
    noindex: true,
    staticHtml: shell(
      `<h1>Payment did not go through</h1><p>Your card was not charged. Please try again, use a different card, or contact us and we will help you complete your order.</p>${shopLinks}`,
    ),
  },
  {
    path: "/donate/thank-you",
    title: "Thank you for your donation | Tucker Family Charity",
    description: "Your donation was received. Thank you for supporting Tucker Family Charity.",
    noindex: true,
    staticHtml: shell(
      `<h1>Thank you for your donation</h1><p>Your generosity makes a real difference. Yoco will email you a receipt for your payment.</p>${donateLinks}`,
    ),
  },
  {
    path: "/donate/cancelled",
    title: "Donation cancelled | Tucker Family Charity",
    description: "No payment was taken. You are welcome to try again at any time.",
    noindex: true,
    staticHtml: shell(
      `<h1>Donation cancelled</h1><p>No payment was taken. You are welcome to try again at any time.</p>${donateLinks}`,
    ),
  },
  {
    path: "/donate/failed",
    title: "Donation did not go through | Tucker Family Charity",
    description: "Your card was not charged. Please try again or contact Tucker Family Charity for other ways to give.",
    noindex: true,
    staticHtml: shell(
      `<h1>Donation did not go through</h1><p>Your card was not charged. Please try again, use a different card, or contact us for other ways to give.</p>${donateLinks}`,
    ),
  },
];
