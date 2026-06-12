package com.zosh.request;

import com.zosh.domain.GiftCategory;
import com.zosh.domain.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    private String title;
    private String description;
    private String shortDescription;
    private String sku;
    private String brand;
    private Long categoryId;
    private Long subcategoryId;
    private int mrpPrice;
    private int sellingPrice;
    private int quantity;
    private int lowStockThreshold;
    private List<String> images = new ArrayList<>();
    private String thumbnailImage;
    private List<String> tags = new ArrayList<>();
    private GiftCategory giftCategory;
    private Long occasionId;
    private Long recipientId;
    private boolean personalized;
    private boolean allowCustomerTextInput;
    private boolean allowCustomerImageUpload;
    private String customInstructions;
    private int personalizationCharges;
    private boolean featured;
    private ProductStatus status;
}
