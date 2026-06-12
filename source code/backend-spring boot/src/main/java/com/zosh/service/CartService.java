package com.zosh.service;

import com.zosh.exception.ProductException;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.Product;
import com.zosh.model.User;

public interface CartService {

    CartItem addCartItem(User user,
                         Product product,
                         int quantity,
                         Long personalizedGiftId) throws ProductException;

    Cart findUserCart(User user);

    void clearCart(User user);
}
