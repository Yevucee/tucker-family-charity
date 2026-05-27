import { PERSONALISED_HAT_PATH } from "./personalisedCharityHat";

import capNavy from "@/assets/shop/cap-navy.png";

/**
 * Shop page content — CMS-ready shape.
 *
 * When moving to a headless CMS, mirror these category keys:
 * - featured
 * - tucker_products
 * - partner_offers
 *
 * FEATURED: Update `featuredThisMonth` each month (or point main CTA at a payment URL).
 * PAYMENT: Set `paymentLink` / `ctaHref` on Tucker items to Yoco, PayFast, etc.
 * PARTNER: Set `externalUrl` and optional `checkoutCode` for the leave-site modal.
 */

/** Mirrors future CMS category field */
export type ShopCatalogCategory = "featured" | "tucker_products" | "partner_offers";

export interface FeaturedSupportingItem {
  id: string;
  category: "featured";
  title: string;
  shortDescription: string;
  image: string;
  ctaLabel: string;
  /** PAYMENT or internal link */
  ctaHref: string;
}

export interface FeaturedThisMonth {
  sectionTitle: string;
  main: {
    id: string;
    category: "featured";
    title: string;
    shortDescription: string;
    image: string;
    ctaLabel: string;
    ctaHref: string;
    /** Set true when ctaHref is a payment or external product URL */
    ctaOpensNewTab?: boolean;
  };
  /** Optional 1–2 spotlight items under the hero (leave empty if unused) */
  supporting?: FeaturedSupportingItem[];
}

export interface TuckerCatalogProduct {
  id: string;
  category: "tucker_products";
  title: string;
  shortDescription: string;
  image: string;
  /** e.g. "From R120" — omit when price is TBC */
  priceLabel?: string;
  ctaLabel: string;
  /**
   * PAYMENT: Hosted checkout (Yoco, PayFast, etc.).
   * Use mailto: or # until the live link is ready.
   */
  paymentLink: string;
  ctaOpensNewTab?: boolean;
  /** When set, the product card CTA uses in-app navigation (e.g. PDP). */
  productDetailPath?: string;
}

export interface PartnerCatalogOffer {
  id: string;
  category: "partner_offers";
  title: string;
  shortDescription: string;
  image: string;
  ctaLabel: string;
  externalUrl: string;
  /**
   * PARTNER CODE: Shown in the redirect modal. Omit or "" if no code —
   * modal copy adapts automatically.
   */
  checkoutCode?: string;
}

export interface ShopCatalog {
  featuredThisMonth: FeaturedThisMonth;
  tuckerProducts: TuckerCatalogProduct[];
  partnerOffers: PartnerCatalogOffer[];
}

export const shopCatalog: ShopCatalog = {
  featuredThisMonth: {
    sectionTitle: "Featured This Month",
    main: {
      id: "featured-spotlight",
      category: "featured",
      title: "Tucker Family Charity Wine",
      shortDescription:
        "Our white-label wine supports Tucker Family Charity with every bottle. Perfect for gifting or your own table—this month we're shining a light on community-powered giving.",
      image:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
      ctaLabel: "Shop featured wine",
      ctaHref: "mailto:info@tuckerfamilycharity.org?subject=Featured%20Wine%20Order",
      ctaOpensNewTab: false,
    },
    supporting: [
      {
        id: "featured-personalised-caps",
        category: "featured",
        title: "Personalised charity hats",
        shortDescription:
          "Custom caps in adult and kids sizes—choose your colour and add a name on the side. Every hat helps Oliver’s Village.",
        image: capNavy,
        ctaLabel: "View & order",
        ctaHref: PERSONALISED_HAT_PATH,
      },
    ],
  },
  tuckerProducts: [
    {
      id: "wine",
      category: "tucker_products",
      title: "Charity wine",
      shortDescription:
        "Premium South African red and white. Proceeds help support Tucker Family Charity’s initiatives.",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=Wine%20Order",
      ctaOpensNewTab: false,
    },
    {
      id: "caps",
      category: "tucker_products",
      title: "Personalised charity hat",
      shortDescription:
        "Premium cotton caps—pick your colour, add a name on the side, and support Oliver’s Village. Adult and kids sizes.",
      image: capNavy,
      priceLabel: "R250",
      ctaLabel: "View & order",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=Cap%20Purchase",
      ctaOpensNewTab: false,
      productDetailPath: PERSONALISED_HAT_PATH,
    },
    {
      id: "apparel",
      category: "tucker_products",
      title: "Tucker clothing",
      shortDescription: "Charity-branded apparel coming soon—join the waitlist by email.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=Clothing%20Waitlist",
      ctaOpensNewTab: false,
    },
  ],
  partnerOffers: [
    {
      id: "face-for-men",
      category: "partner_offers",
      title: "Face for Men",
      shortDescription: "Quality grooming and skincare—support the charity when you shop our partner.",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
      ctaLabel: "View offer",
      // PARTNER: replace with live partner storefront URL
      externalUrl: "https://example.com/partners/face-for-men",
      checkoutCode: "TUCKER10",
    },
    {
      id: "puma",
      category: "partner_offers",
      title: "Puma",
      shortDescription:
        "Sportswear and gear through our partner link—proceeds help support Tucker Family Charity’s initiatives.",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
      ctaLabel: "Shop offer",
      externalUrl: "https://www.puma.com",
      // No checkoutCode — modal uses shorter copy without code line
    },
  ],
};
