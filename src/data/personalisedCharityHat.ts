/**
 * Personalised charity hat PDP — variants, copy, and order helpers.
 * When per-colour photos exist, update `hatVariantImageSrc` to use slug paths.
 */

export type HatFit = "adult" | "kids";

export interface HatColourVariant {
  slug: string;
  label: string;
  /** Approximate swatch for the colour picker chip */
  swatchHex: string;
}

export const ORDER_EMAIL = "info@tuckerfamilycharity.org";

/** Set to a hosted checkout URL when ready; empty keeps mailto as the primary CTA. */
export const HAT_PAYMENT_LINK = "";

export const PERSONALISED_HAT_PATH = "/shop/personalised-hat";

const BASE = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Shared placeholder until `public/shop/hats/{adult|kids}/{slug}.png` exist. */
export function hatPlaceholderImageSrc(): string {
  return `${BASE}shop/hats/placeholder.png`;
}

export function hatVariantImageSrc(_fit: HatFit, _slug: string): string {
  return hatPlaceholderImageSrc();
}

export const hatPageCopy = {
  title: "Personalised charity hat",
  intro:
    "Grab your customised charity hat—premium washed cotton twill, comfortable unstructured fit, and an adjustable strap with a brass buckle. Designed for everyday wear.",
  priceLabel: "R250 per hat",
  impactLine: "100% of profits support Oliver’s Village.",
  tagline: "Stand out. Give back. Wear your impact.",
  features: [
    "Premium washed cotton twill",
    "Comfortable, unstructured fit",
    "Adjustable strap with brass buckle",
    "Designed for everyday wear",
  ],
  coloursHeading: "Choose your colour",
  fitAdultLabel: "Adult",
  fitKidsLabel: "Kids",
  personalisationLabel: "Name on the side of the hat",
  personalisationHint: "We’ll embroider or print this name on the side of your cap—exactly as you type it.",
  orderCtaEmail: "Email to order",
  orderCtaPay: "Pay online",
  orderCtaEmailSecondary: "Or order by email",
  nameRequiredMessage: "Please enter the name you want on the side of the hat.",
};

export const adultHatColours: HatColourVariant[] = [
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

/** Replace labels (and slugs if needed) when the five kids colours are confirmed. */
export const kidsHatColours: HatColourVariant[] = [
  { slug: "kids-1", label: "Kids colour — details to follow (1)", swatchHex: "#94a3b8" },
  { slug: "kids-2", label: "Kids colour — details to follow (2)", swatchHex: "#64748b" },
  { slug: "kids-3", label: "Kids colour — details to follow (3)", swatchHex: "#78716c" },
  { slug: "kids-4", label: "Kids colour — details to follow (4)", swatchHex: "#a1a1aa" },
  { slug: "kids-5", label: "Kids colour — details to follow (5)", swatchHex: "#71717a" },
];

export function hatVariantsForFit(fit: HatFit): HatColourVariant[] {
  return fit === "adult" ? adultHatColours : kidsHatColours;
}

export function buildHatOrderMailto(params: {
  fit: HatFit;
  colourLabel: string;
  sideName: string;
}): string {
  const subject = encodeURIComponent("Personalised charity hat order");
  const fitLabel = params.fit === "adult" ? "Adult" : "Kids";
  const body = encodeURIComponent(
    `I'd like to order a personalised charity hat.\n\n` +
      `Fit: ${fitLabel}\n` +
      `Colour: ${params.colourLabel}\n` +
      `Name on side of hat: ${params.sideName}\n\n` +
      `Happy to complete payment when the checkout link is available.`
  );
  return `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
}
