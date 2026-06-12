package com.zosh.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePersonalizedGiftRequest {
    private Long productId;
    private String uploadedImage;
    private String customMessage;
}
