package com.zosh.service.impl;

import com.zosh.domain.AccountStatus;
import com.zosh.domain.PaymentStatus;
import com.zosh.domain.USER_ROLE;
import com.zosh.dto.CustomerProfileDto;
import com.zosh.exception.UserException;
import com.zosh.model.Order;
import com.zosh.model.User;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.AdminCustomerService;
import com.zosh.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCustomerServiceImpl implements AdminCustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final AuditLogService auditLogService;

    @Override
    public List<User> getAllCustomers(String search) {
        if (search != null && !search.isBlank()) {
            return userRepository.searchCustomers(USER_ROLE.ROLE_CUSTOMER, search);
        }
        return userRepository.findByRoleOrderByCreatedAtDesc(USER_ROLE.ROLE_CUSTOMER);
    }

    @Override
    public CustomerProfileDto getCustomerProfile(Long customerId) throws UserException {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new UserException("Customer not found"));

        List<Order> orders = orderRepository.findByUserId(customerId);
        double totalSpend = orders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.COMPLETED)
                .mapToDouble(o -> o.getTotalSellingPrice() != null ? o.getTotalSellingPrice() : 0)
                .sum();

        return CustomerProfileDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .registrationDate(user.getCreatedAt())
                .accountStatus(user.getAccountStatus())
                .totalOrders(orders.size())
                .totalSpend(totalSpend)
                .orderHistory(orders)
                .build();
    }

    @Override
    public User blockCustomer(Long customerId, String adminEmail) throws UserException {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new UserException("Customer not found"));
        user.setAccountStatus(AccountStatus.BANNED);
        auditLogService.log("BLOCK", "User", customerId, adminEmail, "Customer blocked");
        return userRepository.save(user);
    }

    @Override
    public User unblockCustomer(Long customerId, String adminEmail) throws UserException {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new UserException("Customer not found"));
        user.setAccountStatus(AccountStatus.ACTIVE);
        auditLogService.log("UNBLOCK", "User", customerId, adminEmail, "Customer unblocked");
        return userRepository.save(user);
    }
}
