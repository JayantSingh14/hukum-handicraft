import type { GiftCategory } from "../types/productTypes";

export const giftCategories: {
  name: string;
  value: GiftCategory;
  categoryId: string;
  image: string;
  subtitle: string;
}[] = [
  {
    name: "Wall Art & Hangings",
    value: "WALL_ART",
    categoryId: "wall_art",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80",
    subtitle: "Heritage Wall Art",
  },
  {
    name: "Table Décor",
    value: "TABLE_DECOR",
    categoryId: "table_decor",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80",
    subtitle: "Luxury Table Décor",
  },
  {
    name: "Lamps & Lanterns",
    value: "LAMPS_LANTERNS",
    categoryId: "lamps_lanterns",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    subtitle: "Illuminated Elegance",
  },
  {
    name: "Pooja & Spiritual Collection",
    value: "POOJA_SPIRITUAL",
    categoryId: "pooja_spiritual",
    image: "https://images.unsplash.com/photo-1608976478549-b5c00e127393?w=800&q=80",
    subtitle: "Sacred Living",
  },
  {
    name: "Corporate Gifting",
    value: "CORPORATE",
    categoryId: "corporate",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    subtitle: "Executive Gifting",
  },
  {
    name: "Personalized Gifts",
    value: "PERSONALIZED",
    categoryId: "personalized",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=80",
    subtitle: "Personalized Luxury",
  },
  {
    name: "Luxury Gift Hampers",
    value: "LUXURY_HAMPERS",
    categoryId: "luxury_hampers",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    subtitle: "Curated Gift Hampers",
  },
];
