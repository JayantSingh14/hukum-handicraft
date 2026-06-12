package com.zosh.repository;

import com.zosh.model.HomepageBanner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomepageBannerRepository extends JpaRepository<HomepageBanner, Long> {
    List<HomepageBanner> findByActiveTrueOrderByDisplayOrderAsc();
    List<HomepageBanner> findBySectionOrderByDisplayOrderAsc(String section);
}
