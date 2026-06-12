package com.zosh.controller;

import com.zosh.dto.CustomerProfileDto;
import com.zosh.exception.UserException;
import com.zosh.model.User;
import com.zosh.service.AdminCustomerService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final AdminCustomerService customerService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<List<User>> getCustomers(
            @RequestParam(required = false) String search,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(customerService.getAllCustomers(search));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerProfileDto> getCustomerProfile(
            @PathVariable Long customerId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(customerService.getCustomerProfile(customerId));
    }

    @PatchMapping("/{customerId}/block")
    public ResponseEntity<User> blockCustomer(
            @PathVariable Long customerId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User admin = adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(customerService.blockCustomer(customerId, admin.getEmail()));
    }

    @PatchMapping("/{customerId}/unblock")
    public ResponseEntity<User> unblockCustomer(
            @PathVariable Long customerId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User admin = adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(customerService.unblockCustomer(customerId, admin.getEmail()));
    }
}
