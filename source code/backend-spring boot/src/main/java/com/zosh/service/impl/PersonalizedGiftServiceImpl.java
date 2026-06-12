package com.zosh.service.impl;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.model.PersonalizedGift;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.repository.PersonalizedGiftRepository;
import com.zosh.service.PersonalizedGiftService;
import com.zosh.service.ProductService;
import com.zosh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalizedGiftServiceImpl implements PersonalizedGiftService {

    private final PersonalizedGiftRepository personalizedGiftRepository;
    private final ProductService productService;
    private final UserRepository userRepository;

    @Override
    public PersonalizedGift createPersonalizedGift(Long productId, Long userId,
                                                   String uploadedImage, String customMessage)
            throws ProductException, UserException {
        Product product = productService.findProductById(productId);
        if (!product.isPersonalized()) {
            throw new ProductException("This product does not support personalization");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
        PersonalizedGift gift = new PersonalizedGift();
        gift.setProduct(product);
        gift.setUser(user);
        gift.setUploadedImage(uploadedImage);
        gift.setCustomMessage(customMessage);
        return personalizedGiftRepository.save(gift);
    }

    @Override
    public PersonalizedGift findById(Long id) {
        return personalizedGiftRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Personalized gift not found"));
    }

    @Override
    public List<PersonalizedGift> findByUserId(Long userId) {
        return personalizedGiftRepository.findByUserId(userId);
    }

    @Override
    public void delete(Long id) {
        personalizedGiftRepository.delete(findById(id));
    }
}
