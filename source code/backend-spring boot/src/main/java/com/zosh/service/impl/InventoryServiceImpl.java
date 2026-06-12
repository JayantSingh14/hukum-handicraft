package com.zosh.service.impl;

import com.zosh.domain.InventoryChangeType;
import com.zosh.domain.ProductStatus;
import com.zosh.exception.ProductException;
import com.zosh.model.InventoryLog;
import com.zosh.model.Product;
import com.zosh.repository.InventoryLogRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.request.StockAdjustmentRequest;
import com.zosh.service.InventoryService;
import com.zosh.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final NotificationService notificationService;

    @Override
    public List<Product> getLowStockProducts() {
        return productRepository.findByQuantityLessThanEqualAndStatus(10, ProductStatus.ACTIVE);
    }

    @Override
    public List<Product> getOutOfStockProducts() {
        return productRepository.findByQuantityEqualsAndStatus(0, ProductStatus.ACTIVE);
    }

    @Override
    public List<InventoryLog> getInventoryHistory(Long productId) {
        return inventoryLogRepository.findByProductIdOrderByChangedAtDesc(productId);
    }

    @Override
    public Product adjustStock(Long productId, StockAdjustmentRequest request, String changedBy) throws ProductException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found"));

        int previousQty = product.getQuantity();
        int newQty = previousQty + request.getQuantity();
        if (newQty < 0) {
            throw new ProductException("Stock cannot be negative");
        }

        product.setQuantity(newQty);
        product.setIn_stock(newQty > 0);
        Product saved = productRepository.save(product);

        InventoryLog log = InventoryLog.builder()
                .product(saved)
                .previousQuantity(previousQty)
                .newQuantity(newQty)
                .changeAmount(request.getQuantity())
                .changeType(request.getChangeType() != null ? request.getChangeType() : InventoryChangeType.ADJUSTMENT)
                .note(request.getNote())
                .changedBy(changedBy)
                .build();
        inventoryLogRepository.save(log);

        checkStockAlerts(saved);
        return saved;
    }

    @Override
    public void checkStockAlerts(Product product) {
        if (product.getQuantity() == 0) {
            notificationService.notifyOutOfStock(product.getTitle());
        } else if (product.getQuantity() <= product.getLowStockThreshold()) {
            notificationService.notifyLowStock(product.getTitle(), product.getQuantity());
        }
    }
}
