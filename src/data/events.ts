/**
 * Events data for Tucker Family Charity.
 * GOOGLE PHOTOS: Replace albumLink values with real Google Photos album URLs.
 */

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
  photos: string[];
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
      "Sample exquisite South African wines in a beautiful vineyard setting while supporting a great cause. All proceeds benefit Oliver's Village students.",
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
      "Experience the magic of Oliver's Village firsthand! Meet the students and teachers, tour the facilities, and see the direct impact of your support.",
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
      "Help us prepare students for a successful school year! Donate school supplies, books, backpacks, and uniforms.",
    attendees: "Community-wide",
    category: "Drive",
    ctaLabel: "Get Involved",
    ctaLink: "mailto:info@tuckerfamilycharity.org?subject=Supply Drive Enquiry",
    ctaType: "mailto",
  },
];

// GOOGLE PHOTOS: Replace albumLink with real Google Photos album URL for each event
const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const pastEvents: PastEvent[] = [
  {
    id: 1,
    title: "Black Tie 2024",
    slug: "black-tie-2024",
    shortDescription:
      "An elegant evening of fine dining, live entertainment, and fundraising for Oliver's Village. Our community came together in style to support education and opportunity.",
    photos: [
      unsplash("1768776179834-93e6cafc6d97"),
      unsplash("1771924368588-507c6a048363"),
      unsplash("1706323625335-dad461b68fe5"),
      unsplash("1770842655322-bcfd1c4be229"),
      unsplash("1683879025805-a268b690613e"),
      unsplash("1666281269793-da06484657e8"),
    ],
    albumLink: "https://photos.google.com/", // GOOGLE PHOTOS: Replace with Black Tie 2024 album URL
  },
  {
    id: 2,
    title: "Watershed 2025",
    slug: "watershed-2025",
    shortDescription:
      "A memorable day at Watershed with family, friends, and supporters. Great food, beautiful surroundings, and funds raised for Oliver's Village.",
    photos: [
      unsplash("1771924368588-507c6a048363"),
      unsplash("1768776179834-93e6cafc6d97"),
      unsplash("1666281269793-da06484657e8"),
      unsplash("1770842655322-bcfd1c4be229"),
      unsplash("1706323625335-dad461b68fe5"),
      unsplash("1683879025805-a268b690613e"),
    ],
    albumLink: "https://photos.google.com/", // GOOGLE PHOTOS: Replace with Watershed 2025 album URL
  },
  {
    id: 3,
    title: "Couples Padel 1 to 7",
    slug: "couples-padel-1-7",
    shortDescription:
      "Seven editions of our popular Couples Padel tournaments. Fun, fitness, and fundraising—all in support of Oliver's Village. Thank you to all participants and sponsors.",
    photos: [
      unsplash("1770842655322-bcfd1c4be229"),
      unsplash("1768776179834-93e6cafc6d97"),
      unsplash("1771924368588-507c6a048363"),
      unsplash("1706323625335-dad461b68fe5"),
      unsplash("1683879025805-a268b690613e"),
      unsplash("1666281269793-da06484657e8"),
    ],
    albumLink: "https://photos.google.com/", // GOOGLE PHOTOS: Replace with Couples Padel album URL
  },
  {
    id: 4,
    title: "Black Tie 2026",
    slug: "black-tie-2026",
    shortDescription:
      "Our flagship annual gala. An unforgettable night of celebration, auction, and community spirit—all in support of education at Oliver's Village.",
    photos: [
      unsplash("1706323625335-dad461b68fe5"),
      unsplash("1771924368588-507c6a048363"),
      unsplash("1768776179834-93e6cafc6d97"),
      unsplash("1683879025805-a268b690613e"),
      unsplash("1770842655322-bcfd1c4be229"),
      unsplash("1666281269793-da06484657e8"),
    ],
    albumLink: "https://photos.google.com/", // GOOGLE PHOTOS: Replace with Black Tie 2026 album URL
  },
];
