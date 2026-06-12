package com.zosh.service.impl;

import com.zosh.domain.NotificationType;
import com.zosh.domain.OrderStatus;
import com.zosh.exception.OrderException;
import com.zosh.model.Order;
import com.zosh.model.OrderStatusHistory;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.OrderStatusHistoryRepository;
import com.zosh.request.UpdateOrderStatusRequest;
import com.zosh.service.AdminOrderService;
import com.zosh.service.AuditLogService;
import com.zosh.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    public List<Order> getAllOrders(OrderStatus status, String search) {
        return orderRepository.searchOrders(status, search);
    }

    @Override
    public Order getOrderDetails(Long orderId) throws OrderException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("Order not found: " + orderId));
    }

    @Override
    public Order updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, String adminEmail) throws OrderException {
        Order order = getOrderDetails(orderId);
        OrderStatus newStatus = request.getStatus();

        order.setOrderStatus(newStatus);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .status(newStatus)
                .note(request.getNote())
                .changedBy(adminEmail)
                .build();
        order.getStatusHistory().add(history);
        statusHistoryRepository.save(history);

        if (newStatus == OrderStatus.RETURN_REQUESTED) {
            notificationService.createAdminNotification(
                    "Return requested for order " + order.getOrderId(), NotificationType.RETURN_REQUEST);
        } else if (newStatus == OrderStatus.REFUNDED) {
            notificationService.createAdminNotification(
                    "Refund processed for order " + order.getOrderId(), NotificationType.REFUND_REQUEST);
        }

        auditLogService.log("UPDATE_STATUS", "Order", orderId, adminEmail, "Status changed to " + newStatus);
        return orderRepository.save(order);
    }
}
