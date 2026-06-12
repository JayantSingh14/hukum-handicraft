package com.zosh.service.impl;

import com.zosh.exception.UserException;
import com.zosh.model.Address;
import com.zosh.model.User;
import com.zosh.repository.AddressRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public List<Address> getUserAddresses(User user) {
        return user.getAddresses().stream().toList();
    }

    @Override
    public Address addAddress(User user, Address address) {
        if (address.isDefault()) {
            clearDefaultAddresses(user);
        }
        Address saved = addressRepository.save(address);
        user.getAddresses().add(saved);
        userRepository.save(user);
        return saved;
    }

    @Override
    public Address updateAddress(User user, Long addressId, Address updated) throws UserException {
        Address existing = findUserAddress(user, addressId);
        existing.setName(updated.getName());
        existing.setLocality(updated.getLocality());
        existing.setAddress(updated.getAddress());
        existing.setCity(updated.getCity());
        existing.setState(updated.getState());
        existing.setPinCode(updated.getPinCode());
        existing.setMobile(updated.getMobile());
        existing.setAddressType(updated.getAddressType());
        if (updated.isDefault()) {
            clearDefaultAddresses(user);
            existing.setDefault(true);
        }
        return addressRepository.save(existing);
    }

    @Override
    public void deleteAddress(User user, Long addressId) throws UserException {
        Address address = findUserAddress(user, addressId);
        user.getAddresses().remove(address);
        userRepository.save(user);
        addressRepository.delete(address);
    }

    @Override
    public Address setDefaultAddress(User user, Long addressId) throws UserException {
        clearDefaultAddresses(user);
        Address address = findUserAddress(user, addressId);
        address.setDefault(true);
        return addressRepository.save(address);
    }

    private Address findUserAddress(User user, Long addressId) throws UserException {
        return user.getAddresses().stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new UserException("Address not found"));
    }

    private void clearDefaultAddresses(User user) {
        Set<Address> addresses = user.getAddresses();
        for (Address addr : addresses) {
            addr.setDefault(false);
        }
    }
}
