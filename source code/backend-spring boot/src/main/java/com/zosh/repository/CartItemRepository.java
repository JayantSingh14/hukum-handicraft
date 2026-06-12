package com.zosh.repository;

import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.PersonalizedGift;
import com.zosh.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    CartItem findByCartAndProductAndPersonalizedGift(Cart cart, Product product, PersonalizedGift personalizedGift);
}
