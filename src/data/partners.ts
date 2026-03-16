/**
 * Partners data for Tucker Family Charity.
 * Add logo paths when available; placeholder logos used until then.
 */

export interface Partner {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  url?: string;
}

export const partners: Partner[] = [
  {
    id: "metawell",
    name: "Metawell",
    logo: null, // Add path e.g. "/partners/metawell.png" when logo available
    description: "Supporting community wellbeing and charity activities.",
  },
  {
    id: "norman-good-fellas",
    name: "Norman Good Fellas",
    logo: null, // Add path e.g. "/partners/norman-good-fellas.png" when logo available
    description: "Supporting fundraising and event initiatives.",
  },
];
