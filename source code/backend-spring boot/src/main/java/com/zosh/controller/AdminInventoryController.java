package com.zosh.controller;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.model.InventoryLog;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.request.StockAdjustmentRequest;
import com.zosh.service.InventoryService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/inventory")
@RequiredArgsConstructor
public class AdminInventoryController {

    private final InventoryService inventoryService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStock(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(inventoryService.getLowStockProducts());
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<Product>> getOutOfStock(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(inventoryService.getOutOfStockProducts());
    }

    @GetMapping("/{productId}/history")
    public ResponseEntity<List<InventoryLog>> getHistory(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(inventoryService.getInventoryHistory(productId));
    }

    @PostMapping("/{productId}/adjust")
    public ResponseEntity<Product> adjustStock(
            @PathVariable Long productId,
            @RequestBody StockAdjustmentRequest request,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User admin = adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(inventoryService.adjustStock(productId, request, admin.getEmail()));
    }
}
