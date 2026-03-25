/**
 * Auction items — optional future block on the Shop page (see SHOW_AUCTION_BANNER in Shop.tsx).
 * Bids / payment: configure `bidLink` to your hosted auction or payment page.
 */

export interface AuctionItem {
  id: string;
  title: string;
  donor: string;
  description: string;
  reserve?: string;
  bidLink: string;
  image: string;
  featured: boolean;
}

export const auctionItems: AuctionItem[] = [
  {
    id: "fred-schimmel",
    title: "Fred Schimmel, Abstract",
    donor: "Dale Sargent Fine Art",
    description:
      "Mixed media on paper, 65cm × 52cm (framed 83cm × 72cm), signed. Monthly fine art auction in partnership with Dale Sargent Fine Art.",
    reserve: "R25 000",
    bidLink: "https://www.giftsbyyou.com/product-page/fred-schimmel-abstract",
    image: "",
    featured: true,
  },
];
