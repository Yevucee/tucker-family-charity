/**
 * Events data for Tucker Family Charity.
 * Past events: one cover image on the site; albumLink = Google Photos shared album URL (use the full photos.google.com/share/… link so “View gallery” opens the album, not the Photos home).
 */

/** Served from `public/past-events/` so GitHub Pages base path resolves correctly. */
const pastEventCharityDinner2019Cover = `${import.meta.env.BASE_URL}past-events/charity-dinner-2019-cover.png`;
const pastEventCharityDinner2024Cover = `${import.meta.env.BASE_URL}past-events/charity-dinner-2024-cover.png`;
const pastEventPadelIiiCover = `${import.meta.env.BASE_URL}past-events/padel-iii-cover.png`;
const pastEventPadelIvCover = `${import.meta.env.BASE_URL}past-events/padel-iv-cover.png`;
const pastEventPadelViCover = `${import.meta.env.BASE_URL}past-events/padel-vi-cover.png`;
const pastEventBlaireAthollGolfCover = `${import.meta.env.BASE_URL}past-events/blaire-atholl-golf-cover.png`;
const pastEventRhinoAndLionTaggingCover = `${import.meta.env.BASE_URL}past-events/rhino-and-lion-tagging-cover.png`;
const pastEventStefTerblancheLawrenceBrittanCover = `${import.meta.env.BASE_URL}past-events/stef-terblanche-lawrence-brittan-cover.png`;
const pastEventT20SaVsWestIndiesCover = `${import.meta.env.BASE_URL}past-events/t20-sa-vs-west-indies-cover.png`;
const pastEventLeopardCreek2025Cover = `${import.meta.env.BASE_URL}past-events/leopard-creek-2025-cover.png`;
const pastEventWatershed2025Cover = `${import.meta.env.BASE_URL}past-events/watershed-2025-cover.png`;
const pastEventRemyMartinDinnerCover = `${import.meta.env.BASE_URL}past-events/remy-martin-dinner-cover.png`;

/** Upcoming event hero from `public/upcoming/` (GitHub Pages base path). */
const upcomingCouplesPadelViiPlaceholder = `${import.meta.env.BASE_URL}upcoming/couples-padel-vii-placeholder.png`;
const upcomingAustraliaVsSaCricketPlaceholder = `${import.meta.env.BASE_URL}upcoming/australia-vs-sa-cricket-placeholder.png`;
const upcomingSaVsBangladeshTestPlaceholder = `${import.meta.env.BASE_URL}upcoming/sa-vs-bangladesh-test-placeholder.png`;
const upcomingSaVsEnglandTestPlaceholder = `${import.meta.env.BASE_URL}upcoming/sa-vs-england-test-placeholder.png`;

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  image: string;
  description: string;
  attendees: string;
  category: string;
  ctaLabel: string;
  ctaLink: string;
  ctaType: "mailto" | "external";
  /** ISO date (YYYY-MM-DD). After this day, the event is treated as past. */
  endsOn: string;
}

export interface PastEvent {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  /** Single hero image shown on the Events page */
  coverImage: string;
  /** Google Photos album or Drive folder share URL for the full gallery */
  albumLink: string;
}

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    title: "Couples Padel VII",
    date: "Sunday, 31 May 2026",
    time: "Time TBC",
    location: "Venue to be announced",
    address: "Johannesburg area — details to follow",
    image: upcomingCouplesPadelViiPlaceholder,
    description:
      "Our next Couples Padel tournament in the series — same energy, new year. On-court fun and fundraising for Oliver's Village. Save the date; format and sign-up information will be shared closer to the time.",
    attendees: "Couples & supporters",
    category: "Padel",
    ctaLabel: "Get updates",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Couples%20Padel%20VII%20%E2%80%94%20interest",
    ctaType: "mailto",
    endsOn: "2026-05-31",
  },
  {
    id: 2,
    title: "Australia vs South Africa",
    date: "Saturday, 27 September 2026",
    time: "Session TBC",
    location: "Venue TBC (South Africa series)",
    address: "Check CSA fixtures when released",
    image: upcomingAustraliaVsSaCricketPlaceholder,
    description:
      "Join fellow supporters to watch Australia take on the Proteas. A Tucker Family Charity day out for cricket and community. Final venue and format will be confirmed with the season schedule.",
    attendees: "Open to all supporters",
    category: "Cricket",
    ctaLabel: "Register interest",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Australia%20vs%20SA%20%28Sept%202026%20%E2%80%94%20interest",
    ctaType: "mailto",
    endsOn: "2026-09-27",
  },
  {
    id: 3,
    title: "South Africa vs Bangladesh (Test)",
    date: "15-19 November 2026",
    time: "Five-day Test · times TBC",
    location: "Venue TBC (South Africa series)",
    address: "Check CSA fixtures when released",
    image: upcomingSaVsBangladeshTestPlaceholder,
    description:
      "Support the Proteas in a Test match against Bangladesh as part of the home summer. A perfect stretch for a charity group outing once venues are confirmed.",
    attendees: "Open to all supporters",
    category: "Cricket",
    ctaLabel: "Register interest",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=SA%20vs%20Bangladesh%20Test%20%E2%80%94%20interest",
    ctaType: "mailto",
    endsOn: "2026-11-19",
  },
  {
    id: 4,
    title: "South Africa vs England (Test)",
    date: "17-21 December 2026",
    time: "Five-day Test · times TBC",
    location: "Venue TBC (South Africa series)",
    address: "Check CSA fixtures when released",
    image: upcomingSaVsEnglandTestPlaceholder,
    description:
      "End the year with red-ball action as England tour South Africa. Plan your Tucker Family Charity get-together around the schedule when stadiums and sessions are finalised.",
    attendees: "Open to all supporters",
    category: "Cricket",
    ctaLabel: "Register interest",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=SA%20vs%20England%20Test%20%E2%80%94%20interest",
    ctaType: "mailto",
    endsOn: "2026-12-21",
  },
];

/**
 * Newest first (approximate: dated titles and prior oldest-first sequence reversed).
 * Adjust order if you have exact event dates.
 */
export const pastEvents: PastEvent[] = [
  {
    id: 1,
    title: "Rémy Martin Dinner Experience",
    slug: "remy-martin-dinner-2026",
    shortDescription:
      "An intimate cognac and brandy evening at The Whisky Vault, Illovo — curated canapés, full dinner, and fundraising for Oliver's Village with Rémy Martin and the Tucker Family Charity.",
    coverImage: pastEventRemyMartinDinnerCover,
    // https://photos.google.com/album/AF1QipNYwR_eTKohxiazwFnCqYm_SbqVHsCWRyoQuHYt
    albumLink:
      "https://photos.google.com/album/AF1QipNYwR_eTKohxiazwFnCqYm_SbqVHsCWRyoQuHYt",
  },
  {
    id: 2,
    title: "Leopard Creek 2025",
    slug: "leopard-creek-2025",
    shortDescription:
      "Mark Stevens and Jobby Roos won this Leopard Creek trip at our gala auction — three days of golf, safari, and hospitality. Huge thanks to everyone who welcomed us; all in support of Oliver's Village and the Boucher Legacy.",
    coverImage: pastEventLeopardCreek2025Cover,
    // https://photos.app.goo.gl/FyPwYqpdwxJEDmFW9
    albumLink:
      "https://photos.google.com/share/AF1QipNz9c6FqlGq1Q3W_JpMWT_wrnzrOlxaAd75Ttf3GrxVt8M8lUeOQ47nj8x-KVpU8g?key=MFlnSV9Bd3RrbldHMVNXbUdra1kzSjdtb0pBTTN3",
  },
  {
    id: 3,
    title: "Watershed 2025",
    slug: "watershed-2025",
    shortDescription:
      "A memorable day at Watershed with family, friends, and supporters. Great food, beautiful surroundings, and funds raised for Oliver's Village.",
    coverImage: pastEventWatershed2025Cover,
    // https://photos.app.goo.gl/vMYt6QQzYYgf1qYg8
    albumLink:
      "https://photos.google.com/share/AF1QipM1rtvQscLaTpJzDDNeMVVWKJOX56ta170x89ZmMOndyQJiBs2CLfr7Kzu597h3-A?key=WHVYald3c0NqTjlDYmV3NV8teU01MTE5SlU4TTZR",
  },
  {
    id: 4,
    title: "Charity Dinner 2024",
    slug: "charity-dinner-2024",
    shortDescription:
      "Our annual charity dinner — friends, food, and fundraising to change lives at Oliver's Village.",
    coverImage: pastEventCharityDinner2024Cover,
    // https://photos.app.goo.gl/9hqgVm1EX7aHn3r86
    albumLink:
      "https://photos.google.com/share/AF1QipNkMeDPJRSwdATzxPiDiACLsbFGfsuP-sBn0E4sVD2T8wEDH-3fcFRdI5uHOBrW3Q?key=VlZjeDJrQzNtdy1VTlJvUXR4SkRURjBtcE5HU3l3",
  },
  {
    id: 5,
    title: "T20 SA vs West Indies",
    slug: "t20-sa-vs-west-indies",
    shortDescription:
      "T20 action with the Proteas and West Indies — a memorable day at the ground with our charity family.",
    coverImage: pastEventT20SaVsWestIndiesCover,
    // https://photos.app.goo.gl/dVbaviioL25wTTCE6
    albumLink:
      "https://photos.google.com/share/AF1QipPcCAQ2KgDjzZAVblyW3tNJXJ-IjsJTqTkYPBVFxNVpbWbtHw8aX1qeQ29avcPPfg?key=U0dEbzh4S2lNWTN6VEFTdVdqRlV1V0JpbW5FYWdR",
  },
  {
    id: 6,
    title: "Stef Terblanche / Lawrence Brittan Dinner",
    slug: "stef-terblanche-lawrence-brittan",
    shortDescription:
      "An evening with Stef Terblanche and Lawrence Brittan — great company and support for Oliver's Village.",
    coverImage: pastEventStefTerblancheLawrenceBrittanCover,
    // https://photos.app.goo.gl/eDTwMHRiEvAh5RpM9
    albumLink:
      "https://photos.google.com/share/AF1QipPe_46XZ71hiOp97HX7NAHJuGo8J07Ob0XMZLK3f0t-hPk0gy3x0JKVUXN4bANz3Q?key=b1llRlVTV0EyTFpQYXJ2MC0yN2t3TDhhV3ZEeFlB",
  },
  {
    id: 7,
    title: "Rhino and Lion Tagging",
    slug: "rhino-and-lion-tagging",
    shortDescription:
      "A powerful conservation day — rhino and lion tagging, with our community behind Oliver's Village.",
    coverImage: pastEventRhinoAndLionTaggingCover,
    // https://photos.app.goo.gl/aj67GUQT9AeJhBqG8
    albumLink:
      "https://photos.google.com/share/AF1QipPlFCJ9eX0Wn0gopcbVnhk3cH47ORIzgLb08b4cNil2ZrN7kHGo7qaLWd8z8HzgqA?key=dE80cG9VU1d2STdiNUlaTnVhVVVIWVRrN3JNVm1B",
  },
  {
    id: 8,
    title: "Blaire Atholl Golf",
    slug: "blaire-atholl-golf",
    shortDescription:
      "A day on the course at Blair Atholl — golf, company, and support for education at Oliver's Village.",
    coverImage: pastEventBlaireAthollGolfCover,
    // https://photos.app.goo.gl/JD7eSGqbYJvmACbG9
    albumLink:
      "https://photos.google.com/share/AF1QipORLSQwV4sbc6UNTLvpKZT_dbh-baLfW_ws8mGV4f7YNMc8WKk433LpAm00L5qDxA?key=ZGxmVXNWTmxlN3I5bXdEd1ZiczViWUJiLWdXRjFn",
  },
  {
    id: 9,
    title: "Couples Padel VI",
    slug: "padel-vi",
    shortDescription:
      "Padel, prizes, and purpose — a brilliant day of sport supporting Oliver's Village.",
    coverImage: pastEventPadelViCover,
    // https://photos.app.goo.gl/RGfF8Fx2ZfHMB9Wk9
    albumLink:
      "https://photos.google.com/share/AF1QipNiMrl-OtDYFw3s76IPzg5oPWABp-F7EHqITf_LAUohHH3ncFUgDSJM5QaUslBarA?key=V0tSSGJFUGNXTU92VmdOdzZlU2NQcDdLMmtRVHpB",
  },
  {
    id: 10,
    title: "Couples Padel IV",
    slug: "padel-iv",
    shortDescription:
      "Another great Couples Padel tournament — fitness, friends, and fundraising for Oliver's Village.",
    coverImage: pastEventPadelIvCover,
    // https://photos.app.goo.gl/TY8jbbP1T2SauiyC9
    albumLink:
      "https://photos.google.com/share/AF1QipP70SOGXE6Qg7pfUqp6tz1h3zSWolnDq4ARk9Td1HXOOvCsulhfYmCBGag7XETkqg?key=a1ZNenlHc0hQbGwzUlN2eTR5aDFzQzE1b2tfYjN3",
  },
  {
    id: 11,
    title: "Couples Padel III — Valentines",
    slug: "padel-iii",
    shortDescription:
      "Couples Padel — Valentine's edition: fun on court and funds raised for Oliver's Village — thank you to every pair who played.",
    coverImage: pastEventPadelIiiCover,
    // https://photos.app.goo.gl/g5caZiwTWhMfe3s88
    albumLink:
      "https://photos.google.com/share/AF1QipMsek1ptSkW7x14Qs_6VAr1iWRaT2jBYFtzDBHoPfTscd8W_L6WDoY9qJvkuzXZ3g?key=b0NTeldEYzNYZW9VMEZWeG9MbG1pRXJSZzN2RUhB",
  },
  {
    id: 12,
    title: "Charity Dinner 2019",
    slug: "charity-dinner-2019",
    shortDescription:
      "Our annual charity dinner — an evening of community and fundraising in support of Oliver's Village and our beneficiaries.",
    coverImage: pastEventCharityDinner2019Cover,
    // https://photos.app.goo.gl/cvowNfCUYC4oapQr9
    albumLink:
      "https://photos.google.com/share/AF1QipNkazJvwoPxkYQrOW6hCnUSUZncKi1mQiETMeyd3_AdK4O8RxpVQRR-cuWLdxNipw?key=akRTU1J5ZjBjRUEwcGVFVGtacjBhOEY1Z1BYUmR3",
  },
];

function parseEndsOn(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Upcoming events whose end date is today or later. */
export function getActiveUpcomingEvents(now = new Date()): UpcomingEvent[] {
  const today = startOfDay(now);
  return upcomingEvents.filter((e) => parseEndsOn(e.endsOn) >= today);
}

function expiredUpcomingToPast(event: UpcomingEvent): PastEvent {
  const firstSentence = event.description.split(/(?<=[.!?])\s+/)[0] ?? event.description;
  return {
    id: 1000 + event.id,
    title: event.title,
    slug: slugFromTitle(event.title),
    shortDescription: firstSentence.length > 280 ? `${firstSentence.slice(0, 277)}…` : firstSentence,
    coverImage: event.image,
    albumLink: `mailto:info@tuckerfamilycharity.org?subject=${encodeURIComponent(`${event.title} — follow-up`)}`,
  };
}

/** Recently ended upcoming events, newest first, for the Past Events section. */
export function getRecentlyPastUpcomingEvents(now = new Date()): PastEvent[] {
  const today = startOfDay(now);
  return upcomingEvents
    .filter((e) => parseEndsOn(e.endsOn) < today)
    .sort((a, b) => b.endsOn.localeCompare(a.endsOn))
    .map(expiredUpcomingToPast);
}

/** Static past events plus recently ended upcoming listings. */
export function getAllPastEvents(now = new Date()): PastEvent[] {
  return [...getRecentlyPastUpcomingEvents(now), ...pastEvents];
}
