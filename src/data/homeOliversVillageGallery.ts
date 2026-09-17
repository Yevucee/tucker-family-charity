/**
 * Landscape photos for the Home “About the Charity” carousel (Oliver's Village).
 */

import aerialVillage from "@/assets/OV photo_s for Website/Aerial (1).jpg";
import aerialEcd from "@/assets/OV photo_s for Website/Aerial ECD.jpg";
import soupKitchenWide from "@/assets/OV photo_s for Website/Extra photo 4 (Soup Kitchen).jpg";
import soupKitchen from "@/assets/OV photo_s for Website/Soup Kitchen 5.jpg";
import foodGardens from "@/assets/OV photo_s for Website/Extra photo 1 (Food Gardens).jpg";
import agriTraining from "@/assets/OV photo_s for Website/Extra photo 2 (Agri Training Centre).jpeg";
import waterHarvesting from "@/assets/OV photo_s for Website/Water Harvesting.jpeg";
import agriculture from "@/assets/OV photo_s for Website/Agricultural 2.png";

export interface HomeGallerySlide {
  src: string;
  alt: string;
}

export const homeOliversVillageGallery: HomeGallerySlide[] = [
  {
    src: aerialVillage,
    alt: "Aerial view of Oliver's Village, Putfontein Benoni",
  },
  {
    src: aerialEcd,
    alt: "Oliver's Village early childhood development centre from the air",
  },
  {
    src: soupKitchenWide,
    alt: "Soup kitchen and feeding programme at Oliver's Village",
  },
  {
    src: soupKitchen,
    alt: "Community meals at Oliver's Village soup kitchen",
  },
  {
    src: foodGardens,
    alt: "Food gardens at Oliver's Village",
  },
  {
    src: agriTraining,
    alt: "Agricultural training centre at Oliver's Village",
  },
  {
    src: waterHarvesting,
    alt: "Water harvesting project at Oliver's Village",
  },
  {
    src: agriculture,
    alt: "Agricultural programme at Oliver's Village",
  },
];
