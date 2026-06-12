package com.zosh.mapper;

import com.zosh.dto.ProductDto;
import com.zosh.model.Product;

public class ProductMapper {

    public static ProductDto toProductDto(Product product) {
        if (product == null) {
            return null;
        }
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setTitle(product.getTitle());
        productDto.setDescription(product.getDescription());
        productDto.setMrpPrice(product.getMrpPrice());
        productDto.setSellingPrice(product.getSellingPrice());
        productDto.setDiscountPercent(product.getDiscountPercent());
        productDto.setQuantity(product.getQuantity());
        productDto.setImages(product.getImages());
        productDto.setNumRatings(product.getNumRatings());
        productDto.setCreatedAt(product.getCreatedAt());
        productDto.setGiftCategory(product.getGiftCategory());
        productDto.setPersonalized(product.isPersonalized());
        if (product.getOccasion() != null) {
            productDto.setOccasionId(product.getOccasion().getId());
            productDto.setOccasionName(product.getOccasion().getName());
        }
        if (product.getRecipient() != null) {
            productDto.setRecipientId(product.getRecipient().getId());
            productDto.setRecipientName(product.getRecipient().getName());
        }
        return productDto;
    }
}
