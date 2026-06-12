import { giftCategories } from "../giftCategories";

export const mainCategory = giftCategories.map((cat) => ({
  name: cat.name,
  categoryId: cat.categoryId,
  giftCategory: cat.value,
  level: 1,
}));
