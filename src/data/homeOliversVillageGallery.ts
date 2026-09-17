/**
 * Home “About the Charity” carousel — landscape Oliver's Village / soup kitchen photos.
 */

import ov122 from "@/assets/OV-122.jpg";
import ov144 from "@/assets/OV-144.jpg";
import ov145 from "@/assets/OV-145.jpg";
import ovmd182 from "@/assets/OVMD-182.jpg";
import soupKitchen3 from "@/assets/Soup Kitchen 3.jpg";
import soupKitchen4 from "@/assets/Soup Kitchen 4.jpg";

export interface HomeGallerySlide {
  src: string;
  alt: string;
}

export const homeOliversVillageGallery: HomeGallerySlide[] = [
  {
    src: ov122,
    alt: "Volunteer serving children at Oliver's Village soup kitchen",
  },
  {
    src: ov144,
    alt: "Community members walking together at Oliver's Village",
  },
  {
    src: ov145,
    alt: "Conversation at Oliver's Village soup kitchen",
  },
  {
    src: ovmd182,
    alt: "Women receiving meals at Oliver's Village",
  },
  {
    src: soupKitchen3,
    alt: "Children dining at Oliver's Village soup kitchen",
  },
  {
    src: soupKitchen4,
    alt: "Community queue at Oliver's Village soup kitchen",
  },
];
