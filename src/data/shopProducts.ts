/**
 * Silent auction items — first slide in Featured This Month (Home + Shop).
 * Update when a new Dale Sargent Art Gallery auction goes live.
 */

export interface AuctionItem {
  id: string;
  title: string;
  donor: string;
  description: string;
  /** Bundled or absolute URL for the carousel */
  image: string;
  /** e.g. "Starting bid R16,500" */
  reserve?: string;
  bidLink: string;
  featured: boolean;
  /** Human-readable close date/time shown on the card */
  closesAt?: string;
}

/** Empty when no Dale Sargent / Gifts By You silent auction is live. */
export const auctionItems: AuctionItem[] = [];
