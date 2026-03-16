/**
 * Shop and auction products.
 * PAYMENT: Replace paymentLink with Yoco, PayFast, or external payment URL.
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

export interface ShopProduct {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  paymentLink: string; // PAYMENT: Replace with Yoco/PayFast URL
  ctaLabel: string;
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
    image: "", // Use imported auctionArtwork in Shop.tsx for this item
    featured: true,
  },
];

export const shopProducts: ShopProduct[] = [
  {
    id: "face-for-men",
    title: "Face for Men",
    shortDescription: "Quality grooming and skincare products. Support the charity with every purchase.",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
    paymentLink: "#", // PAYMENT: Replace with payment URL
    ctaLabel: "Shop Face for Men",
  },
  {
    id: "puma",
    title: "Puma",
    shortDescription: "Sportswear and gear. A portion of proceeds supports Oliver's Village.",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    paymentLink: "#", // PAYMENT: Replace with payment URL
    ctaLabel: "Shop Puma",
  },
  {
    id: "wine",
    title: "Tucker Family Charity Wine",
    shortDescription: "Premium South African red and white wine. 100% of proceeds to Oliver's Village.",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    paymentLink: "#", // PAYMENT: Replace with payment URL
    ctaLabel: "Enquire About Wine",
  },
  {
    id: "clothing",
    title: "Charity Clothing",
    shortDescription: "Branded caps and apparel. Wear your support for Oliver's Village.",
    image:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80",
    paymentLink: "#", // PAYMENT: Replace with payment URL
    ctaLabel: "Order Caps",
  },
];
