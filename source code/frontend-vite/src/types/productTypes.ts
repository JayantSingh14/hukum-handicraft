export type GiftCategory =
  | "WALL_ART"
  | "TABLE_DECOR"
  | "LAMPS_LANTERNS"
  | "POOJA_SPIRITUAL"
  | "CORPORATE"
  | "PERSONALIZED"
  | "LUXURY_HAMPERS";

export interface Occasion {
  id: number;
  name: string;
}

export interface PersonalizedGift {
  id?: number;
  uploadedImage: string;
  customMessage: string;
  productId?: number;
}

export interface Product {
  id?: number;
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  discountPercent?: number;
  quantity?: number;
  images: string[];
  numRatings?: number;
  giftCategory?: GiftCategory;
  occasion?: Occasion;
  personalized?: boolean;
  createdAt?: Date;
  in_stock?: boolean;
}
