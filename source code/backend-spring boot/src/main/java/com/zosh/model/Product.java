package com.zosh.model;

import com.zosh.domain.GiftCategory;
import com.zosh.domain.ProductStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    @Column(unique = true)
    private String sku;

    private String brand = "Hukum";

    @ManyToOne
    private Category category;

    @ManyToOne
    private Category subcategory;

    private int mrpPrice;

    private int sellingPrice;

    private int discountPercent;

    private int quantity;

    private int lowStockThreshold = 10;

    @ElementCollection
    private List<String> images = new ArrayList<>();

    private String thumbnailImage;

    @ElementCollection
    private List<String> tags = new ArrayList<>();

    private int numRatings;

    @Enumerated(EnumType.STRING)
    private GiftCategory giftCategory;

    @ManyToOne
    private Occasion occasion;

    @ManyToOne
    private Recipient recipient;

    private boolean personalized;

    private boolean allowCustomerTextInput;

    private boolean allowCustomerImageUpload;

    @Column(columnDefinition = "TEXT")
    private String customInstructions;

    private int personalizationCharges;

    private boolean featured;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.ACTIVE;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    private boolean in_stock = true;
}
