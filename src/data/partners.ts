/**
 * Partners for Tucker Family Charity.
 *
 * `websiteUrl` — link targets for the partner grid (opens in new tab).
 * `logo` — optional absolute URL to a hosted logo; when null, UI uses Google’s
 * favicon service from the site hostname (no scraping; edit `logo` to override).
 *
 * Verify spelling-sensitive rows (Acotraining, EVO, Moonstone, Macron TBC) when URLs are confirmed.
 */

export interface Partner {
  id: string;
  name: string;
  /** Full URL to a logo image; omit to use favicon derived from websiteUrl */
  logo: string | null;
  description: string;
  /** Public website; null if not confirmed yet */
  websiteUrl: string | null;
}

export const partners: Partner[] = [
  {
    id: "metawell",
    name: "Metawell",
    logo: null,
    description: "Supporting community wellbeing and charity activities.",
    websiteUrl: "https://www.metawell.co.za/",
  },
  {
    id: "axis-house",
    name: "Axis House",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.axishouse.co.za/",
  },
  {
    id: "bodiscent",
    name: "Bodiscent",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://bodiscent.co.za/",
  },
  {
    id: "boucher-legacy-project",
    name: "Boucher Legacy Project",
    logo: null,
    description: "Wildlife conservation and legacy fundraising partner.",
    websiteUrl: "https://www.boucherlegacy.co.za/",
  },
  {
    id: "dale-sargent-fine-arts",
    name: "Dale Sargent Fine Arts",
    logo: null,
    description: "Fine art and auction partner supporting fundraising.",
    websiteUrl: "https://dalesargentart.com/",
  },
  {
    id: "elgin-wines",
    name: "Elgin Wines",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.winesofelgin.co.za/",
  },
  {
    id: "acotraining",
    name: "Acotraining",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: null,
  },
  {
    id: "evo",
    name: "EVO",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: null,
  },
  {
    id: "face-for-him",
    name: "Face for him",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.faceforhim.co.za/",
  },
  {
    id: "golds-gym",
    name: "Golds Gym",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.goldsgymsandton.co.za/",
  },
  {
    id: "macron-tbc",
    name: "Macron- TBC",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.macron.com/",
  },
  {
    id: "moonstone-lodge",
    name: "Moonstone Lodge",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: null,
  },
  {
    id: "norman-goodfellows",
    name: "Norman Goodfellows",
    logo: null,
    description: "Supporting fundraising and event initiatives.",
    websiteUrl: "https://www.ngf.co.za/",
  },
  {
    id: "padel-and-social",
    name: "Padel and Social",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://padelandsocialclub.com/",
  },
  {
    id: "pam-golding-tbc",
    name: "Pam Golding- TBC",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.pamgolding.co.za/",
  },
  {
    id: "preidelands",
    name: "Preidelands",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://pridelands.co.za/",
  },
  {
    id: "power2health",
    name: "Power2Health",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.power2health.co.za/",
  },
  {
    id: "saseka",
    name: "Saseka",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.thornybush.com/lodge/saseka-tented-camp/",
  },
  {
    id: "wild-earth",
    name: "Wild Earth",
    logo: null,
    description: "Partner supporting Tucker Family Charity initiatives.",
    websiteUrl: "https://www.wildearthza.co.za/",
  },
];

/** Favicon URL for a partner (static, no HTML scraping). */
export function partnerFaviconUrl(websiteUrl: string | null): string | null {
  if (!websiteUrl) return null;
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, "");
    if (!host) return null;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  } catch {
    return null;
  }
}

/** Resolved logo: explicit asset, else favicon from website */
export function partnerDisplayLogo(partner: Partner): string | null {
  return partner.logo ?? partnerFaviconUrl(partner.websiteUrl);
}
