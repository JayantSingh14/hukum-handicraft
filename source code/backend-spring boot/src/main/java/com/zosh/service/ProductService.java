package com.zosh.service;

import com.zosh.exception.ProductException;
import com.zosh.model.Product;
import com.zosh.request.CreateProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    Product createProductByAdmin(CreateProductRequest req) throws ProductException;

    void deleteProduct(Long productId) throws ProductException;

    Product updateProduct(Long productId, Product product) throws ProductException;

    Product updateProductStock(Long productId) throws ProductException;

    Product findProductById(Long id) throws ProductException;

    List<Product> searchProduct(String query);

    Page<Product> getAllProduct(String giftCategory,
                                Long occasionId,
                                Long recipientId,
                                Boolean personalized,
                                Integer minPrice,
                                Integer maxPrice,
                                Integer minDiscount,
                                String sort,
                                String stock,
                                Integer pageNumber);

    List<Product> recentlyAddedProduct();

    List<Product> getAllProductsForAdmin();

    Product duplicateProduct(Long productId, String adminEmail) throws ProductException;

    Product enableProduct(Long productId) throws ProductException;

    Product disableProduct(Long productId) throws ProductException;

    Product toggleFeatured(Long productId) throws ProductException;
}
