import type { GiftCategory } from "../types/productTypes";

const categoryIdToGiftCategory: Record<string, GiftCategory> = {
  wall_art: "WALL_ART",
  table_decor: "TABLE_DECOR",
  lamps_lanterns: "LAMPS_LANTERNS",
  pooja_spiritual: "POOJA_SPIRITUAL",
  corporate: "CORPORATE",
  personalized: "PERSONALIZED",
  luxury_hampers: "LUXURY_HAMPERS",
};

export function mapCategoryIdToGiftCategory(categoryId?: string): GiftCategory | undefined {
  if (!categoryId) return undefined;
  return categoryIdToGiftCategory[categoryId.toLowerCase()];
}

export function formatGiftCategoryLabel(categoryId?: string): string {
  if (!categoryId) return "All Gifts";
  return categoryId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
