package com.zosh.service;

import com.zosh.domain.AccountStatus;
import com.zosh.dto.CustomerProfileDto;
import com.zosh.exception.UserException;
import com.zosh.model.User;

import java.util.List;

public interface AdminCustomerService {
    List<User> getAllCustomers(String search);
    CustomerProfileDto getCustomerProfile(Long customerId) throws UserException;
    User blockCustomer(Long customerId, String adminEmail) throws UserException;
    User unblockCustomer(Long customerId, String adminEmail) throws UserException;
}
