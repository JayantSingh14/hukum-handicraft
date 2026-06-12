package com.zosh.repository;

import com.zosh.model.Occasion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OccasionRepository extends JpaRepository<Occasion, Long> {
    Optional<Occasion> findByName(String name);
}
