package com.zosh.service;

import com.zosh.exception.ProductException;
import com.zosh.model.InventoryLog;
import com.zosh.model.Product;
import com.zosh.request.StockAdjustmentRequest;

import java.util.List;

public interface InventoryService {
    List<Product> getLowStockProducts();
    List<Product> getOutOfStockProducts();
    List<InventoryLog> getInventoryHistory(Long productId);
    Product adjustStock(Long productId, StockAdjustmentRequest request, String changedBy) throws ProductException;
    void checkStockAlerts(Product product);
}
