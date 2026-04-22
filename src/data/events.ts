/**
 * Events data for Tucker Family Charity.
 * Past events: one cover image on the site; albumLink = Google Photos shared album URL (use the full photos.google.com/share/… link so “View gallery” opens the album, not the Photos home).
 */

/** Served from `public/past-events/` so GitHub Pages base path resolves correctly. */
const pastEventCharityDinner2019Cover = `${import.meta.env.BASE_URL}past-events/charity-dinner-2019-cover.png`;
const pastEventCharityDinner2024Cover = `${import.meta.env.BASE_URL}past-events/charity-dinner-2024-cover.png`;
const pastEventPadelIiiCover = `${import.meta.env.BASE_URL}past-events/padel-iii-cover.png`;
const pastEventPadelVCover = `${import.meta.env.BASE_URL}past-events/padel-v-cover.png`;
const pastEventBlaireAthollGolfCover = `${import.meta.env.BASE_URL}past-events/blaire-atholl-golf-cover.png`;
const pastEventRhinoAndLionTaggingCover = `${import.meta.env.BASE_URL}past-events/rhino-and-lion-tagging-cover.png`;
const pastEventStefTerblancheLawrenceBrittanCover = `${import.meta.env.BASE_URL}past-events/stef-terblanche-lawrence-brittan-cover.png`;
const pastEventT20SaVsWestIndiesCover = `${import.meta.env.BASE_URL}past-events/t20-sa-vs-west-indies-cover.png`;
const pastEventLeopardCreek2025Cover = `${import.meta.env.BASE_URL}past-events/leopard-creek-2025-cover.png`;
const pastEventWatershed2025Cover = `${import.meta.env.BASE_URL}past-events/watershed-2025-cover.png`;

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
    title: "Spring Fundraiser Gala",
    date: "April 15, 2026",
    time: "6:00 PM - 10:00 PM",
    location: "Johannesburg Community Center",
    address: "Venue TBC — check back for details",
    image:
      "https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMG91dGRvb3IlMjBwZW9wbGV8ZW58MXx8fHwxNzczMTMyMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Join us for an unforgettable evening of music, food, and community as we celebrate the collective impact we're making on education at Oliver's Village.",
    attendees: "150+ expected",
    category: "Fundraiser",
    ctaLabel: "Register for Event",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Event Registration: Spring Fundraiser Gala",
    ctaType: "mailto",
  },
  {
    id: 2,
    title: "Charity Wine Tasting",
    date: "May 22, 2026",
    time: "5:00 PM - 8:00 PM",
    location: "The Vineyard, Constantia",
    address: "Wine Route, Constantia Valley",
    image:
      "https://images.unsplash.com/photo-1771924368588-507c6a048363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzMwNDU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Sample exquisite South African wines in a beautiful vineyard setting while supporting a great cause. All proceeds benefit Oliver's Village beneficiaries.",
    attendees: "80+ expected",
    category: "Fundraiser",
    ctaLabel: "Register for Event",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Event Registration: Charity Wine Tasting",
    ctaType: "mailto",
  },
  {
    id: 3,
    title: "School Visit Day",
    date: "June 10, 2026",
    time: "9:00 AM - 2:00 PM",
    location: "Oliver's Village",
    address: "Oliver's Village School, Johannesburg",
    image:
      "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwc2Nob29sJTIwZWR1Y2F0aW9uJTIwYm9va3N8ZW58MXx8fHwxNzczMTMyMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Experience the magic of Oliver's Village firsthand! Meet the children and teachers, tour the facilities, and see the direct impact of your support.",
    attendees: "40+ expected",
    category: "Community",
    ctaLabel: "Register for Event",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Event Registration: School Visit Day",
    ctaType: "mailto",
  },
  {
    id: 4,
    title: "Summer Fun Run",
    date: "July 20, 2026",
    time: "7:00 AM - 11:00 AM",
    location: "Delta Park",
    address: "Victory Park, Johannesburg",
    image:
      "https://images.unsplash.com/photo-1770842655322-bcfd1c4be229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY2hpbGRyZW4lMjBjb21tdW5pdHklMjBzbWlsaW5nJTIwaGFwcHl8ZW58MXx8fHwxNzczMTMyMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Run, walk, or jog for education! 5K and 10K routes available for all fitness levels. Family-friendly event.",
    attendees: "200+ expected",
    category: "Fundraiser",
    ctaLabel: "Register for Event",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Event Registration: Summer Fun Run",
    ctaType: "mailto",
  },
  {
    id: 5,
    title: "Annual Charity Auction",
    date: "August 30, 2026",
    time: "6:30 PM - 10:00 PM",
    location: "The Grand Hall",
    address: "Sandton Convention Centre, Johannesburg",
    image:
      "https://images.unsplash.com/photo-1706323625335-dad461b68fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMGltcHJvdmVtZW50fGVufDF8fHx8MTc3MzEzMjMwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Our biggest fundraiser of the year! Bid on incredible items including art, experiences, vacations, and exclusive packages.",
    attendees: "250+ expected",
    category: "Fundraiser",
    ctaLabel: "Register for Event",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Event Registration: Annual Charity Auction",
    ctaType: "mailto",
  },
  {
    id: 6,
    title: "Back-to-School Supply Drive",
    date: "September 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Multiple Locations",
    address: "Drop-off points TBC — contact us for details",
    image:
      "https://images.unsplash.com/photo-1683879025805-a268b690613e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzdXBwbGllcyUyMHBlbmNpbHMlMjBib29rc3xlbnwxfHx8fDE3NzMxMzIzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Help us prepare children for a successful school year! Donate school supplies, books, backpacks, and uniforms.",
    attendees: "Community-wide",
    category: "Drive",
    ctaLabel: "Get Involved",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Supply Drive Enquiry",
    ctaType: "mailto",
  },
];

/** Unsplash cover for past events without a local hero image. */
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

/**
 * Oldest first where the title includes a year. Undated albums sit between
 * Charity Dinner 2019 and Charity Dinner 2024; adjust if you have exact dates.
 */
export const pastEvents: PastEvent[] = [
  {
    id: 1,
    title: "Charity Dinner 2019",
    slug: "charity-dinner-2019",
    shortDescription:
      "Our annual charity dinner — an evening of community and fundraising in support of Oliver's Village and our beneficiaries.",
    coverImage: pastEventCharityDinner2019Cover,
    // https://photos.app.goo.gl/cvowNfCUYC4oapQr9
    albumLink:
      "https://photos.google.com/share/AF1QipNkazJvwoPxkYQrOW6hCnUSUZncKi1mQiETMeyd3_AdK4O8RxpVQRR-cuWLdxNipw?key=akRTU1J5ZjBjRUEwcGVFVGtacjBhOEY1Z1BYUmR3",
  },
  {
    id: 2,
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
    id: 3,
    title: "Padel IV",
    slug: "padel-iv",
    shortDescription:
      "Another great Couples Padel tournament — fitness, friends, and fundraising for Oliver's Village.",
    coverImage: unsplash("1666281269793-da06484657e8"),
    // https://photos.app.goo.gl/TY8jbbP1T2SauiyC9
    albumLink:
      "https://photos.google.com/share/AF1QipP70SOGXE6Qg7pfUqp6tz1h3zSWolnDq4ARk9Td1HXOOvCsulhfYmCBGag7XETkqg?key=a1ZNenlHc0hQbGwzUlN2eTR5aDFzQzE1b2tfYjN3",
  },
  {
    id: 4,
    title: "Couples Padel V",
    slug: "padel-v",
    shortDescription:
      "Another Couples Padel day — on court in support of Oliver's Village, with the same fun and team spirit you expect.",
    coverImage: pastEventPadelVCover,
    albumLink: "https://photos.google.com/", // Add shared Google Photos album URL when you have it
  },
  {
    id: 5,
    title: "Padel VI",
    slug: "padel-vi",
    shortDescription:
      "Padel, prizes, and purpose — a brilliant day of sport supporting Oliver's Village.",
    coverImage: unsplash("1771924368588-507c6a048363"),
    // https://photos.app.goo.gl/RGfF8Fx2ZfHMB9Wk9
    albumLink:
      "https://photos.google.com/share/AF1QipNiMrl-OtDYFw3s76IPzg5oPWABp-F7EHqITf_LAUohHH3ncFUgDSJM5QaUslBarA?key=V0tSSGJFUGNXTU92VmdOdzZlU2NQcDdLMmtRVHpB",
  },
  {
    id: 6,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
    title: "Leopard Creek 2025",
    slug: "leopard-creek-2025",
    shortDescription:
      "Mark Stevens and Jobby Roos won this Leopard Creek trip at our gala auction — three days of golf, safari, and hospitality. Huge thanks to everyone who welcomed us; all in support of Oliver's Village and the Boucher Legacy.",
    coverImage: pastEventLeopardCreek2025Cover,
    // https://photos.app.goo.gl/FyPwYqpdwxJEDmFW9
    albumLink:
      "https://photos.google.com/share/AF1QipNz9c6FqlGq1Q3W_JpMWT_wrnzrOlxaAd75Ttf3GrxVt8M8lUeOQ47nj8x-KVpU8g?key=MFlnSV9Bd3RrbldHMVNXbUdra1kzSjdtb0pBTTN3",
  },
];
