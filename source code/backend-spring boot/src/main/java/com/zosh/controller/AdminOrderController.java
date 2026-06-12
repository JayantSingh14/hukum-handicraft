package com.zosh.controller;

import com.zosh.domain.OrderStatus;
import com.zosh.exception.OrderException;
import com.zosh.exception.UserException;
import com.zosh.model.Order;
import com.zosh.model.User;
import com.zosh.request.UpdateOrderStatusRequest;
import com.zosh.service.AdminOrderService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String search,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(adminOrderService.getAllOrders(status, search));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderDetails(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws UserException, OrderException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(adminOrderService.getOrderDetails(orderId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request,
            @RequestHeader("Authorization") String jwt) throws UserException, OrderException {
        User admin = adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(adminOrderService.updateOrderStatus(orderId, request, admin.getEmail()));
    }
}
