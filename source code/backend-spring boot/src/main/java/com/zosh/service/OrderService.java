package com.zosh.service;

import com.zosh.domain.OrderStatus;
import com.zosh.exception.OrderException;
import com.zosh.model.*;

import java.util.List;
import java.util.Set;

public interface OrderService {

    Set<Order> createOrder(User user, Address shippingAddress, Cart cart);

    Order findOrderById(Long orderId) throws OrderException;

    List<Order> usersOrderHistory(Long userId);

    Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws OrderException;

    void deleteOrder(Long orderId) throws OrderException;

    Order cancelOrder(Long orderId, User user) throws OrderException;
}
