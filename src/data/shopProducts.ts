/**
 * Silent auction items — first slide in Featured This Month (Home + Shop).
 * Update when a new Dale Sargent Art Gallery auction goes live.
 */

import auctionFredSchimmelHornbill from "@/assets/shop/auction-fred-schimmel-yellow-billed-hornbill.png";

export interface AuctionItem {
  id: string;
  title: string;
  donor: string;
  description: string;
  image: string;
  /** e.g. "Starting bid R16,500" */
  reserve?: string;
  bidLink: string;
  featured: boolean;
  /** Human-readable close date/time shown on the card */
  closesAt?: string;
}

export const auctionItems: AuctionItem[] = [
  {
    id: "fred-schimmel-yellow-billed-hornbill",
    title: "Fred Schimmel — Yellow-billed Hornbill",
    donor: "Dale Sargent Art Gallery",
    description:
      "Striking Fred Schimmel screenprint of a Yellow-billed Hornbill. The artwork measures 58cm × 45.5cm and is signed and dated 1968 by the artist. Secret silent auction — nobody can see what you bid, and you may place multiple bids to stay in the running.",
    image: auctionFredSchimmelHornbill,
    reserve: "Starting bid R8,500",
    bidLink: "https://www.giftsbyyou.com/product-page/fred-schimmel-yellow-billed-hornbill",
    featured: true,
  },
];
