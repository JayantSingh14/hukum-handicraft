package com.zosh.service;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.model.PersonalizedGift;

import java.util.List;

public interface PersonalizedGiftService {
    PersonalizedGift createPersonalizedGift(Long productId, Long userId,
                                             String uploadedImage, String customMessage)
            throws ProductException, UserException;

    PersonalizedGift findById(Long id);

    List<PersonalizedGift> findByUserId(Long userId);

    void delete(Long id);
}
