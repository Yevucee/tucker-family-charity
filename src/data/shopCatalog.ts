import { PERSONALISED_HAT_PATH } from "./personalisedCharityHat";

import capAqua from "@/assets/shop/cap-aqua.png";
import capBlack from "@/assets/shop/cap-black.png";
import capChocolate from "@/assets/shop/cap-chocolate.png";
import capGrey from "@/assets/shop/cap-grey.png";
import capKhaki from "@/assets/shop/cap-khaki.png";
import capMaroon from "@/assets/shop/cap-maroon.png";
import capMustard from "@/assets/shop/cap-mustard.png";
import capNavy from "@/assets/shop/cap-navy.png";
import capOlive from "@/assets/shop/cap-olive.png";
import capOrange from "@/assets/shop/cap-orange.png";
import capPink from "@/assets/shop/cap-pink.png";
import capRed from "@/assets/shop/cap-red.png";
import capRust from "@/assets/shop/cap-rust.png";

/** Shared copy for Tucker Family Charity embroidered dad caps (per-colour grid items). */
const TFC_EMBROIDERED_CAP_DESCRIPTION =
  'Tree-of-life heart logo on the front; “TUCKER FAMILY CHARITY” and Est. 2009 on the back; “J9” on the side. Washed cotton twill dad cap with an adjustable strap and brass slider.';

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
        id: "featured-tfc-embroidered-caps",
        category: "featured",
        title: "TFC embroidered dad caps",
        shortDescription:
          "Tree-of-life heart logo on the front; Tucker Family Charity branding on the back. Multiple colours in stock—order by email.",
        image: capNavy,
        ctaLabel: "View all colours",
        ctaHref: "/shop#tucker-products",
      },
      {
        id: "featured-personalised-caps",
        category: "featured",
        title: "Personalised charity hats",
        shortDescription:
          "Custom caps in adult and kids sizes—choose your colour and add a name on the side. Every hat helps Oliver’s Village.",
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80",
      priceLabel: "R250",
      ctaLabel: "View & order",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=Cap%20Purchase",
      ctaOpensNewTab: false,
      productDetailPath: PERSONALISED_HAT_PATH,
    },
    {
      id: "tfc_cap_aqua",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Aqua",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capAqua,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Aqua",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_black",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Black",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capBlack,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Black",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_chocolate",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Chocolate",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capChocolate,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Chocolate",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_grey",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Grey",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capGrey,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Grey",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_khaki",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Khaki",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capKhaki,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Khaki",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_maroon",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Maroon",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capMaroon,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Maroon",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_mustard",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Mustard",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capMustard,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Mustard",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_navy",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Navy",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capNavy,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Navy",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_olive",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Olive",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capOlive,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Olive",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_orange",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Orange (rust tone)",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capOrange,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink:
        "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Orange%20%28rust%20tone%29",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_pink",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Pink (dusty mauve)",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capPink,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink:
        "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Pink%20%28dusty%20mauve%29",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_red",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Red (brick)",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capRed,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Red%20%28brick%29",
      ctaOpensNewTab: false,
    },
    {
      id: "tfc_cap_rust",
      category: "tucker_products",
      title: "Tucker Family Charity cap — Rust (terracotta)",
      shortDescription: TFC_EMBROIDERED_CAP_DESCRIPTION,
      image: capRust,
      priceLabel: "Price on enquiry",
      ctaLabel: "Order now",
      paymentLink:
        "mailto:info@tuckerfamilycharity.org?subject=TFC%20Embroidered%20Cap%20-%20Rust%20%28terracotta%29",
      ctaOpensNewTab: false,
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
