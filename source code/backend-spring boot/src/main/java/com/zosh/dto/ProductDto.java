package com.zosh.dto;

import com.zosh.domain.GiftCategory;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ProductDto {

    private Long id;
    private String title;
    private String description;
    private int mrpPrice;
    private int sellingPrice;
    private int discountPercent;
    private int quantity;
    private List<String> images = new ArrayList<>();
    private int numRatings;
    private LocalDateTime createdAt;
    private GiftCategory giftCategory;
    private Long occasionId;
    private String occasionName;
    private Long recipientId;
    private String recipientName;
    private boolean personalized;
}
