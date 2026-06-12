import { giftCategories } from "./giftCategories";

export const homeCategories = [
  ...giftCategories.map((cat) => ({
    categoryId: cat.categoryId,
    giftCategory: cat.value,
    section: "GRID",
    name: cat.name,
    image: cat.image,
  })),
  ...giftCategories.slice(0, 4).map((cat) => ({
    categoryId: cat.categoryId,
    giftCategory: cat.value,
    section: "DEALS",
    name: `${cat.name} Specials`,
    image: cat.image,
  })),
  ...giftCategories.map((cat) => ({
    categoryId: cat.categoryId,
    giftCategory: cat.value,
    section: "SHOP_BY_CATEGORIES",
    name: `Shop ${cat.name} Gifts`,
    image: cat.image,
  })),
];
