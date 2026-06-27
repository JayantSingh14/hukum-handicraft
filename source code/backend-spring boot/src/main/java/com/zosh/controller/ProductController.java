package com.zosh.controller;

import com.zosh.exception.ProductException;
import com.zosh.model.Product;
import com.zosh.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId) throws ProductException {
        Product product = productService.findProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProduct(@RequestParam(required = false) String query) {
        List<Product> products = productService.searchProduct(query);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String giftCategory,
            @RequestParam(required = false) Long occasionId,
            @RequestParam(required = false) Long recipientId,
            @RequestParam(required = false) Boolean personalized,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String stock,
            @RequestParam(required = false) String material,
            @RequestParam(defaultValue = "0") Integer pageNumber) {
        return new ResponseEntity<>(
                productService.getAllProduct(query, giftCategory, occasionId, recipientId, personalized,
                        minPrice, maxPrice, minDiscount, sort, stock, material, pageNumber),
                HttpStatus.OK);
    }

    /** Lightweight endpoint for homepage bestsellers — only featured products, max 12 */
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        List<Product> featured = productService.getFeaturedProducts();
        return new ResponseEntity<>(featured, HttpStatus.OK);
    }
}
