/**
 * Tucker Family Charity wine range — page copy, bottle variants, order mailto.
 */

import wineChloe from "@/assets/shop/wine-chloe.png";
import wineElla from "@/assets/shop/wine-ella.png";
import wineMadison from "@/assets/shop/wine-madison.png";

export const ORDER_EMAIL = "info@tuckerfamilycharity.org";

export const CHARITY_WINE_PATH = "/shop/wine";

export interface CharityWineVariant {
  slug: string;
  name: string;
  vintage: number;
  varietal: string;
  image: string;
}

export const charityWineVariants: CharityWineVariant[] = [
  {
    slug: "chloe",
    name: "Chloe",
    vintage: 2024,
    varietal: "Sauvignon Blanc",
    image: wineChloe,
  },
  {
    slug: "ella",
    name: "Ella",
    vintage: 2025,
    varietal: "Pinot Noir",
    image: wineElla,
  },
  {
    slug: "madison",
    name: "Madison",
    vintage: 2021,
    varietal: "Merlot / Shiraz",
    image: wineMadison,
  },
];

export function wineDisplayName(wine: CharityWineVariant): string {
  return `${wine.name} ${wine.vintage}`;
}

export function wineFullLabel(wine: CharityWineVariant): string {
  return `${wine.name} ${wine.vintage} (${wine.varietal})`;
}

export function wineOrderMailto(wine: CharityWineVariant, quantity: number, notes?: string): string {
  const label = wineFullLabel(wine);
  const subject = encodeURIComponent(`${label} — Wine Order`);
  const lines = [
    "Hi,",
    "",
    "I'd like to place a wine order:",
    "",
    `Wine: ${label}`,
    `Quantity: ${Math.max(1, quantity)} bottle(s)`,
  ];
  const trimmedNotes = notes?.trim();
  if (trimmedNotes) {
    lines.push("", "Notes:", trimmedNotes);
  }
  lines.push("", "Thank you.");
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
}

export const winePageCopy = {
  title: "Tucker Family Charity Wine",
  intro:
    "White-label South African wines in partnership with Tucker Family Charity and in support of Oliver’s Village.",
  impactLine: "Every bottle helps support our initiatives.",
  orderCta: "Send order enquiry",
  featuresHeading: "About the range",
  features: [
    "Chloe Sauvignon Blanc 2024",
    "Ella Pinot Noir 2025",
    "Madison Merlot / Shiraz 2021",
    "Wine of South Africa — charity partnership label on every bottle",
  ],
  chooseHeading: "Choose your wine",
  chooseBlurb: "Select a bottle, set your quantity, then send an order enquiry by email.",
  quantityLabel: "Quantity (bottles)",
  notesLabel: "Notes (optional)",
  notesPlaceholder: "Delivery address, gift message, or questions…",
  questionsBlurb: "Questions about pricing or availability?",
  questionsCtaEmail: `Email ${ORDER_EMAIL}`,
};
