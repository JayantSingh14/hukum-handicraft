const KEY = "hukum_recently_viewed";
const MAX = 6;

export interface RecentProduct {
    id: number;
    title: string;
    images: string[];
    sellingPrice: number;
    mrpPrice: number;
    discountPercent?: number;
    giftCategory?: string;
}

export const saveRecentlyViewed = (product: RecentProduct) => {
    try {
        const existing: RecentProduct[] = JSON.parse(localStorage.getItem(KEY) || "[]");
        const filtered = existing.filter(p => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, MAX);
        localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
};

export const getRecentlyViewed = (): RecentProduct[] => {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
};
