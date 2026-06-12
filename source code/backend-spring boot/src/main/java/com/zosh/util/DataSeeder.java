package com.zosh.util;

import com.zosh.domain.HomeCategorySection;
import com.zosh.model.HomeCategory;
import com.zosh.repository.HomeCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Seeds the home_category table with HUKUM premium collections on startup.
 * Only runs if the table is empty, so it won't override admin customizations.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final HomeCategoryRepository homeCategoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (homeCategoryRepository.count() == 0) {
            System.out.println("[DataSeeder] Home category table is empty. Seeding HUKUM collections...");
            seedHomeCategories();
            System.out.println("[DataSeeder] Home categories seeded successfully.");
        } else {
            System.out.println("[DataSeeder] Home categories already exist. Skipping seed.");
        }
    }

    private void seedHomeCategories() {
        List<HomeCategory> categories = Arrays.asList(
            // ── ELECTRIC_CATEGORIES  (Horizontal Quick Nav Bar) ──────────────
            new HomeCategory(null, "Wall Art & Hangings",
                "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=400&q=80",
                "wall_art", HomeCategorySection.ELECTRIC_CATEGORIES),
            new HomeCategory(null, "Table Décor",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
                "table_decor", HomeCategorySection.ELECTRIC_CATEGORIES),
            new HomeCategory(null, "Lamps & Lanterns",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
                "lamps_lanterns", HomeCategorySection.ELECTRIC_CATEGORIES),
            new HomeCategory(null, "Pooja & Spiritual",
                "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&q=80",
                "pooja_spiritual", HomeCategorySection.ELECTRIC_CATEGORIES),
            new HomeCategory(null, "Corporate Gifting",
                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
                "corporate", HomeCategorySection.ELECTRIC_CATEGORIES),
            new HomeCategory(null, "Personalized Gifts",
                "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
                "personalized", HomeCategorySection.ELECTRIC_CATEGORIES),
            new HomeCategory(null, "Luxury Hampers",
                "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=400&q=80",
                "luxury_hampers", HomeCategorySection.ELECTRIC_CATEGORIES),

            // ── GRID section (Featured Lookbook – exactly 6 images required) ─
            new HomeCategory(null, "Heritage Wall Art",
                "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80",
                "wall_art", HomeCategorySection.GRID),
            new HomeCategory(null, "Luxury Table Décor",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
                "table_decor", HomeCategorySection.GRID),
            new HomeCategory(null, "Illuminated Elegance",
                "https://images.unsplash.com/photo-1565192647048-f997ded87920?w=800&q=80",
                "lamps_lanterns", HomeCategorySection.GRID),
            new HomeCategory(null, "Sacred Living",
                "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80",
                "pooja_spiritual", HomeCategorySection.GRID),
            new HomeCategory(null, "Executive Gifting",
                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
                "corporate", HomeCategorySection.GRID),
            new HomeCategory(null, "Personalized Luxury",
                "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
                "personalized", HomeCategorySection.GRID),

            // ── SHOP_BY_CATEGORIES (Circular category cards on home page) ────
            new HomeCategory(null, "Wall Art & Hangings",
                "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=400&q=80",
                "wall_art", HomeCategorySection.SHOP_BY_CATEGORIES),
            new HomeCategory(null, "Table Décor",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
                "table_decor", HomeCategorySection.SHOP_BY_CATEGORIES),
            new HomeCategory(null, "Lamps & Lanterns",
                "https://images.unsplash.com/photo-1565192647048-f997ded87920?w=400&q=80",
                "lamps_lanterns", HomeCategorySection.SHOP_BY_CATEGORIES),
            new HomeCategory(null, "Pooja & Spiritual",
                "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&q=80",
                "pooja_spiritual", HomeCategorySection.SHOP_BY_CATEGORIES),
            new HomeCategory(null, "Corporate Gifting",
                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
                "corporate_gifting", HomeCategorySection.SHOP_BY_CATEGORIES),
            new HomeCategory(null, "Personalized Gifts",
                "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
                "personalized", HomeCategorySection.SHOP_BY_CATEGORIES),
            new HomeCategory(null, "Luxury Gift Hampers",
                "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=400&q=80",
                "luxury_hampers", HomeCategorySection.SHOP_BY_CATEGORIES),

            // ── DEALS section (Discount carousel) ────────────────────────────
            new HomeCategory(null, "Wall Art Sale",
                "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&q=80",
                "wall_art", HomeCategorySection.DEALS),
            new HomeCategory(null, "Table Décor Sale",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
                "table_decor", HomeCategorySection.DEALS),
            new HomeCategory(null, "Gift Hampers Sale",
                "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&q=80",
                "luxury_hampers", HomeCategorySection.DEALS)
        );

        homeCategoryRepository.saveAll(categories);
    }
}
