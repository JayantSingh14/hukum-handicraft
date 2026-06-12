package com.zosh.service.impl;

import com.zosh.exception.ProductException;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.PersonalizedGift;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.CartRepository;
import com.zosh.service.CartService;
import com.zosh.service.PersonalizedGiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImplementation implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PersonalizedGiftService personalizedGiftService;

    @Override
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;
        for (CartItem cartsItem : cart.getCartItems()) {
            totalPrice += cartsItem.getMrpPrice();
            totalDiscountedPrice += cartsItem.getSellingPrice();
            totalItem += cartsItem.getQuantity();
        }

        cart.setTotalMrpPrice(totalPrice);
        cart.setTotalItem(cart.getCartItems().size());
        cart.setTotalSellingPrice(totalDiscountedPrice - cart.getCouponPrice());
        cart.setDiscount(calculateDiscountPercentage(totalPrice, totalDiscountedPrice));
        cart.setTotalItem(totalItem);

        return cartRepository.save(cart);
    }

    public static int calculateDiscountPercentage(double mrpPrice, double sellingPrice) {
        if (mrpPrice <= 0) {
            return 0;
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }

    @Override
    public CartItem addCartItem(User user,
                                Product product,
                                int quantity,
                                Long personalizedGiftId) throws ProductException {
        if (!product.isIn_stock()) {
            throw new ProductException("Product is out of stock");
        }

        if (product.getQuantity() > 0 && quantity > product.getQuantity()) {
            throw new ProductException("Only " + product.getQuantity() + " items available in stock");
        }

        Cart cart = findUserCart(user);

        PersonalizedGift personalizedGift = null;
        if (personalizedGiftId != null) {
            personalizedGift = personalizedGiftService.findById(personalizedGiftId);
        }

        CartItem isPresent = cartItemRepository.findByCartAndProductAndPersonalizedGift(
                cart, product, personalizedGift);

        if (isPresent == null) {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUserId(user.getId());
            cartItem.setPersonalizedGift(personalizedGift);

            int totalPrice = quantity * product.getSellingPrice();
            cartItem.setSellingPrice(totalPrice);
            cartItem.setMrpPrice(quantity * product.getMrpPrice());

            cart.getCartItems().add(cartItem);
            cartItem.setCart(cart);

            CartItem saved = cartItemRepository.save(cartItem);
            findUserCart(user);
            return saved;
        }

        isPresent.setQuantity(isPresent.getQuantity() + quantity);
        isPresent.setSellingPrice(isPresent.getQuantity() * product.getSellingPrice());
        isPresent.setMrpPrice(isPresent.getQuantity() * product.getMrpPrice());
        CartItem updated = cartItemRepository.save(isPresent);
        findUserCart(user);
        return updated;
    }

    @Override
    public void clearCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            return;
        }

        cart.getCartItems().clear();
        cart.setCouponCode(null);
        cart.setCouponPrice(0);
        cart.setTotalSellingPrice(0);
        cart.setTotalMrpPrice(0);
        cart.setTotalItem(0);
        cart.setDiscount(0);
        cartRepository.save(cart);
    }
}
