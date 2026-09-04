/**
 * Silent auction items — first slide in Featured This Month (Home + Shop).
 * Update when a new Dale Sargent Art Gallery auction goes live.
 */

export interface AuctionItem {
  id: string;
  title: string;
  donor: string;
  description: string;
  /** e.g. "Starting bid R16,500" */
  reserve?: string;
  bidLink: string;
  featured: boolean;
  /** Human-readable close date/time shown on the card */
  closesAt?: string;
}

export const auctionItems: AuctionItem[] = [
  {
    id: "dominic-tshabangu-behind-table-mountain",
    title: "Dominic Tshabangu — “Behind Table Mountain”",
    donor: "Dale Sargent Art Gallery",
    description:
      "Original acrylic and collage on paper, 84cm × 82cm, signed and dated 2016. Secret silent auction — nobody can see what you bid, and you may place multiple bids to stay in the running.",
    reserve: "Starting bid R16,500",
    bidLink: "https://www.giftsbyyou.com/product-page/behind-table-mountain",
    featured: true,
    closesAt: "30 September 2026 at 20:45",
  },
];
