/**
 * Personalised Tucker Family Charity cap page: copy, Cheyna Dot URL, colours.
 * Orders are fulfilled on Cheyna Dot; this site only informs and links there.
 */

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

export interface HatColourVariant {
  slug: string;
  label: string;
  /** Swatch for thumbnails */
  swatchHex: string;
}

/** Tucker listing on Cheyna Dot (pre-selected variant). */
export const HAT_STORE_ORDER_URL =
  "https://www.cheynadot.co.za/collections/tucker-charity/products/personalised-tucker-charity-cap?variant=53243672166694";

export const HAT_STORE_DISPLAY_NAME = "Cheyna Dot";

export const ORDER_EMAIL = "info@tuckerfamilycharity.org";

export const PERSONALISED_HAT_PATH = "/shop/personalised-hat";

import { hatPageCopy as hatPageCopyBase } from "./copy/hatPageCopy.ts";

const BASE = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Production photos of each cap colour (charity embroidery design). */
export const HAT_COLOUR_IMAGE_BY_SLUG: Record<string, string> = {
  aqua: capAqua,
  black: capBlack,
  mustard: capMustard,
  red: capRed,
  grey: capGrey,
  olive: capOlive,
  chocolate: capChocolate,
  navy: capNavy,
  rust: capRust,
  khaki: capKhaki,
  maroon: capMaroon,
  orange: capOrange,
  pink: capPink,
};

export function hatImageForSlug(slug: string): string {
  const photo = HAT_COLOUR_IMAGE_BY_SLUG[slug];
  if (photo) return photo;
  return `${BASE}shop/hats/adult/${slug}.svg`;
}

export const hatPageCopy = {
  ...hatPageCopyBase,
  orderCta: `Order on ${HAT_STORE_DISPLAY_NAME}`,
  featuresHeading: "What you get",
  features: [
    "Washed cotton twill",
    "Unstructured fit, adjustable strap",
    "Name on the side",
    "Charity embroidery: tree logo on front, Tucker Family Charity and Est. 2009 on the back",
  ],
  coloursHeading: "Choose your colour",
  coloursBlurb:
    "Preview colours here. Stock and sizing are on Cheyna Dot when you click through.",
  questionsBlurb: "Questions about sizing or fulfilment?",
  questionsCtaEmail: `Email ${ORDER_EMAIL}`,
};

/** Same order as legacy adult picker (dropdown + swatch). */
export const hatGalleryColours: HatColourVariant[] = [
  { slug: "aqua", label: "Aqua", swatchHex: "#5eead4" },
  { slug: "black", label: "Black", swatchHex: "#171717" },
  { slug: "mustard", label: "Mustard", swatchHex: "#ca8a04" },
  { slug: "red", label: "Red", swatchHex: "#dc2626" },
  { slug: "grey", label: "Grey", swatchHex: "#6b7280" },
  { slug: "olive", label: "Olive", swatchHex: "#4d7c0f" },
  { slug: "chocolate", label: "Chocolate", swatchHex: "#78350f" },
  { slug: "navy", label: "Navy", swatchHex: "#1e3a8a" },
  { slug: "rust", label: "Rust", swatchHex: "#c2410c" },
  { slug: "khaki", label: "Khaki", swatchHex: "#a8a29e" },
  { slug: "maroon", label: "Maroon", swatchHex: "#7f1d1d" },
  { slug: "orange", label: "Orange", swatchHex: "#ea580c" },
  { slug: "pink", label: "Pink", swatchHex: "#db2777" },
];
