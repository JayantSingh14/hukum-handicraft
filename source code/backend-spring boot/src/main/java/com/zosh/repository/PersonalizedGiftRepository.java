package com.zosh.repository;

import com.zosh.model.PersonalizedGift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonalizedGiftRepository extends JpaRepository<PersonalizedGift, Long> {
    List<PersonalizedGift> findByUserId(Long userId);
}
