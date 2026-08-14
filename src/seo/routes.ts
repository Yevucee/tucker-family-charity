import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Schema.org @type for page-level JSON-LD (optional). */
  schemaType?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "DonateAction";
};

function meta(path: string, title: string, description: string, schemaType?: PageMeta["schemaType"]): PageMeta {
  return { path, title, description, schemaType };
}

/** Indexable public routes (excludes redirects and catch-all). */
export const INDEXABLE_ROUTES: PageMeta[] = [
  meta(
    "/",
    `${SITE_NAME} — Connecting People, Creating Opportunity`,
    SITE_DESCRIPTION,
  ),
  meta(
    "/about",
    `About Us | ${SITE_NAME}`,
    "The story of Tucker Family Charity — a family-led foundation supporting education, Oliver's Village, and community development in South Africa since 2009.",
    "AboutPage",
  ),
  meta(
    "/olivers-village",
    `Oliver's Village | ${SITE_NAME}`,
    "Learn how Tucker Family Charity supports Oliver's Village — a community education centre in Putfontein, Benoni providing education, skills development, and food security.",
  ),
  meta(
    "/events",
    `Events & Activities | ${SITE_NAME}`,
    "Upcoming charity events, fundraisers, and community activities organised by Tucker Family Charity and partners.",
  ),
  meta(
    "/shop",
    `Shop & Offers | ${SITE_NAME}`,
    "Charity merchandise, personalised hats, wine, and partner offers that support Tucker Family Charity programmes.",
  ),
  meta(
    "/shop/personalised-hat",
    `Personalised Charity Hat | ${SITE_NAME}`,
    "Order a personalised Tucker Family Charity cap — adult and kids styles with custom embroidery to support our community work.",
  ),
  meta(
    "/shop/wine",
    `Charity Wine | ${SITE_NAME}`,
    "Purchase Tucker Family Charity wine — curated bottles where proceeds support education and community programmes.",
  ),
  meta(
    "/partners",
    `Our Partners | ${SITE_NAME}`,
    "Organisations and businesses partnering with Tucker Family Charity to create practical opportunities and uplift communities.",
  ),
  meta(
    "/donate",
    `Support Us | ${SITE_NAME}`,
    "Donate, volunteer, or contribute items to Tucker Family Charity — financial gifts, time, and material donations welcome.",
    "DonateAction",
  ),
  meta(
    "/keep-it-in-the-family",
    `Keep It In The Family | ${SITE_NAME}`,
    "A Tucker Family Charity network directory connecting families with trusted local services, trades, and professionals.",
  ),
  meta(
    "/keep-it-in-the-family/library",
    `Resource Library | Keep It In The Family | ${SITE_NAME}`,
    "Curated podcasts, talks, books, and videos recommended by the Keep It In The Family community network.",
    "CollectionPage",
  ),
  meta(
    "/golf-learnership-programme",
    `Golf Learnership Programme | ${SITE_NAME}`,
    "A structured golf learnership programme supported by Tucker Family Charity and Afrika Tikkun — practical exposure, discipline, and future readiness for young learners.",
  ),
  meta(
    "/property-partnerships",
    `Property Partnerships | ${SITE_NAME}`,
    "Property listings and partnership opportunities connected to Tucker Family Charity — enquire about featured homes and community support.",
  ),
  meta(
    "/work-opportunities/looking-for-work",
    `Looking for Work | Work Opportunities | ${SITE_NAME}`,
    "Browse candidate profiles from the Tucker Family Charity network — people looking for work placements and opportunities.",
  ),
  meta(
    "/work-opportunities/work-available",
    `Work Available | Work Opportunities | ${SITE_NAME}`,
    "Browse work roles and placements shared through the Tucker Family Charity community network.",
  ),
];

const ROUTE_MAP = new Map(INDEXABLE_ROUTES.map((route) => [route.path, route]));

export function canonicalUrl(path: string): string {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

export function getPageMeta(pathname: string): PageMeta {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return ROUTE_MAP.get(normalized) ?? ROUTE_MAP.get("/")!;
}
