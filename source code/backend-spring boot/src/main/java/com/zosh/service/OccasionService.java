package com.zosh.service;

import com.zosh.model.Occasion;

import java.util.List;

public interface OccasionService {
    Occasion createOccasion(String name);
    Occasion findById(Long id);
    List<Occasion> findAll();
    Occasion update(Long id, String name);
    void delete(Long id);
}
