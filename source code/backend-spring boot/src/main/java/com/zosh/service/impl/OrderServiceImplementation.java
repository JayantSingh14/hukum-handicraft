package com.zosh.service.impl;

import com.zosh.domain.OrderStatus;
import com.zosh.domain.PaymentStatus;
import com.zosh.exception.OrderException;
import com.zosh.model.*;
import com.zosh.repository.AddressRepository;
import com.zosh.repository.OrderItemRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.CartService;
import com.zosh.service.NotificationService;
import com.zosh.service.OrderItemService;
import com.zosh.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImplementation implements OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OrderItemService orderItemService;
    private final OrderItemRepository orderItemRepository;
    private final NotificationService notificationService;

    @Override
    public Set<Order> createOrder(User user, Address shippAddress, Cart cart) {
        if (!user.getAddresses().contains(shippAddress)) {
            user.getAddresses().add(shippAddress);
        }

        Address address = addressRepository.save(shippAddress);
        List<CartItem> cartItems = new ArrayList<>(cart.getCartItems());
        Set<Order> orders = new HashSet<>();

        if (!cartItems.isEmpty()) {
            int totalOrderPrice = cartItems.stream().mapToInt(CartItem::getSellingPrice).sum();
            int totalMrp = cartItems.stream().mapToInt(CartItem::getMrpPrice).sum();
            int totalItem = cartItems.stream().mapToInt(CartItem::getQuantity).sum();

            Order createdOrder = new Order();
            createdOrder.setUser(user);
            createdOrder.setOrderId("HKM-" + System.currentTimeMillis());
            createdOrder.setTotalMrpPrice(totalMrp);
            createdOrder.setTotalSellingPrice(totalOrderPrice);
            createdOrder.setTotalItem(totalItem);
            createdOrder.setShippingAddress(address);
            createdOrder.setOrderStatus(OrderStatus.PENDING);
            createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);

            Order savedOrder = orderRepository.save(createdOrder);
            orders.add(savedOrder);

            notificationService.notifyNewOrder(savedOrder.getOrderId());

            for (CartItem item : cartItems) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setMrpPrice(item.getMrpPrice());
                orderItem.setProduct(item.getProduct());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setPersonalizedGift(item.getPersonalizedGift());
                orderItem.setUserId(item.getUserId());
                orderItem.setSellingPrice(item.getSellingPrice());
                savedOrder.getOrderItems().add(orderItem);
                orderItemRepository.save(orderItem);
            }
        }

        return orders;
    }

    @Override
    public Order findOrderById(Long orderId) throws OrderException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("order not exist with id " + orderId));
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long orderId) throws OrderException {
        findOrderById(orderId);
        orderRepository.deleteById(orderId);
    }

    @Override
    public Order cancelOrder(Long orderId, User user) throws OrderException {
        Order order = findOrderById(orderId);
        if (user.getId() != order.getUser().getId()) {
            throw new OrderException("you can't perform this action " + orderId);
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}
