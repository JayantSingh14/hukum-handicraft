package com.zosh.service;

import com.zosh.exception.UserException;
import com.zosh.model.Address;
import com.zosh.model.User;

import java.util.List;

public interface AddressService {
    List<Address> getUserAddresses(User user);
    Address addAddress(User user, Address address);
    Address updateAddress(User user, Long addressId, Address address) throws UserException;
    void deleteAddress(User user, Long addressId) throws UserException;
    Address setDefaultAddress(User user, Long addressId) throws UserException;
}
