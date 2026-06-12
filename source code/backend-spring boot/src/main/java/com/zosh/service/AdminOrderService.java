package com.zosh.service;

import com.zosh.domain.OrderStatus;
import com.zosh.exception.OrderException;
import com.zosh.model.Order;
import com.zosh.request.UpdateOrderStatusRequest;

import java.util.List;

public interface AdminOrderService {
    List<Order> getAllOrders(OrderStatus status, String search);
    Order getOrderDetails(Long orderId) throws OrderException;
    Order updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, String adminEmail) throws OrderException;
}
