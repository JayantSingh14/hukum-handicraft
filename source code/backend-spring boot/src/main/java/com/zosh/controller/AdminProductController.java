package com.zosh.controller;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.request.CreateProductRequest;
import com.zosh.request.StockAdjustmentRequest;
import com.zosh.service.InventoryService;
import com.zosh.service.ProductService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final InventoryService inventoryService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody CreateProductRequest request,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        adminAuthHelper.requireAdmin(jwt);
        return new ResponseEntity<>(productService.createProductByAdmin(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody Product product,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(productService.updateProduct(productId, product));
    }

    @PatchMapping("/{productId}/stock")
    public ResponseEntity<Product> updateProductStock(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(productService.updateProductStock(productId));
    }

    @PostMapping("/{productId}/duplicate")
    public ResponseEntity<Product> duplicateProduct(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User admin = adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(productService.duplicateProduct(productId, admin.getEmail()));
    }

    @PatchMapping("/{productId}/enable")
    public ResponseEntity<Product> enableProduct(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(productService.enableProduct(productId));
    }

    @PatchMapping("/{productId}/disable")
    public ResponseEntity<Product> disableProduct(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(productService.disableProduct(productId));
    }

    @PatchMapping("/{productId}/featured")
    public ResponseEntity<Product> toggleFeatured(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(productService.toggleFeatured(productId));
    }

    @PostMapping("/{productId}/adjust-stock")
    public ResponseEntity<Product> adjustStock(
            @PathVariable Long productId,
            @RequestBody StockAdjustmentRequest request,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User admin = adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(inventoryService.adjustStock(productId, request, admin.getEmail()));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        adminAuthHelper.requireAdmin(jwt);
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }
}
