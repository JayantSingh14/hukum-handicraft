package com.zosh.service.impl;

import com.zosh.model.Occasion;
import com.zosh.repository.OccasionRepository;
import com.zosh.service.OccasionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OccasionServiceImpl implements OccasionService {

    private final OccasionRepository occasionRepository;

    @Override
    public Occasion createOccasion(String name) {
        return occasionRepository.findByName(name)
                .orElseGet(() -> occasionRepository.save(new Occasion(null, name)));
    }

    @Override
    public Occasion findById(Long id) {
        return occasionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Occasion not found"));
    }

    @Override
    public List<Occasion> findAll() {
        return occasionRepository.findAll();
    }

    @Override
    public Occasion update(Long id, String name) {
        Occasion occasion = findById(id);
        occasion.setName(name);
        return occasionRepository.save(occasion);
    }

    @Override
    public void delete(Long id) {
        occasionRepository.delete(findById(id));
    }
}
