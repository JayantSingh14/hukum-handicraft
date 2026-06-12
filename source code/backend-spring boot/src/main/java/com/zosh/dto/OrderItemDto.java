package com.zosh.dto;

import lombok.Data;

@Data
public class OrderItemDto {

    private Long id;
    private Long productId;
    private String productTitle;
    private Long personalizedGiftId;
    private String customMessage;
    private String uploadedImage;
    private int quantity;
    private Integer mrpPrice;
    private Integer sellingPrice;
}
