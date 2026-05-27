/**
 * Personalised charity hat — landing page copy, partner store URL, colour gallery assets.
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
  title: "Personalised charity hat",
  intro:
    "Premium washed cotton twill caps with Tucker Family Charity embroidery—add your name on the side. Adult and kids sizes.",
  heroSubline:
    "Colour, personalisation name, size and checkout all happen securely on our partner store—every purchase still supports Oliver’s Village through this programme.",
  impactLine: "Profits from this line support Oliver’s Village.",
  tagline: "Stand out. Give back. Wear your impact.",
  orderCta: `Order on ${HAT_STORE_DISPLAY_NAME}`,
  orderCtaNote: `You’ll finish your order on ${HAT_STORE_DISPLAY_NAME}; they print and dispatch the caps.`,
  featuresHeading: "What you get",
  features: [
    "Premium washed cotton twill",
    "Comfortable, unstructured dad-hat fit",
    "Adjustable strap with brass-tone buckle",
    "Your name personalised on the side",
    "Tucker Family Charity embroidery—tree logo on front, wording on back (Est. 2009)",
  ],
  coloursHeading: "Colours in the range",
  coloursBlurb:
    "Browse shades below—exact stock and sizing options are confirmed when you continue to Cheyna Dot.",
  questionsBlurb: "Questions about sizing or fulfilment?",
  questionsCtaEmail: `Email ${ORDER_EMAIL}`,
};

/** Gallery order matches typical display (grouped loosely by tone). */
export const hatGalleryColours: HatColourVariant[] = [
  { slug: "navy", label: "Navy", swatchHex: "#1e3a8a" },
  { slug: "black", label: "Black", swatchHex: "#171717" },
  { slug: "grey", label: "Grey", swatchHex: "#6b7280" },
  { slug: "aqua", label: "Aqua", swatchHex: "#5eead4" },
  { slug: "olive", label: "Olive", swatchHex: "#4d7c0f" },
  { slug: "khaki", label: "Khaki", swatchHex: "#a8a29e" },
  { slug: "chocolate", label: "Chocolate", swatchHex: "#78350f" },
  { slug: "maroon", label: "Maroon", swatchHex: "#7f1d1d" },
  { slug: "rust", label: "Rust", swatchHex: "#c2410c" },
  { slug: "orange", label: "Orange", swatchHex: "#ea580c" },
  { slug: "red", label: "Red", swatchHex: "#dc2626" },
  { slug: "pink", label: "Pink", swatchHex: "#db2777" },
  { slug: "mustard", label: "Mustard", swatchHex: "#ca8a04" },
];
