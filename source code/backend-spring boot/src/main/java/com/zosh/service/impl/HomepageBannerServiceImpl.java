package com.zosh.service.impl;

import com.zosh.model.HomepageBanner;
import com.zosh.repository.HomepageBannerRepository;
import com.zosh.service.HomepageBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomepageBannerServiceImpl implements HomepageBannerService {

    private final HomepageBannerRepository bannerRepository;

    @Override
    public List<HomepageBanner> getAllBanners() {
        return bannerRepository.findAll();
    }

    @Override
    public List<HomepageBanner> getActiveBanners() {
        return bannerRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public List<HomepageBanner> getBannersBySection(String section) {
        return bannerRepository.findBySectionOrderByDisplayOrderAsc(section);
    }

    @Override
    public HomepageBanner createBanner(HomepageBanner banner) {
        return bannerRepository.save(banner);
    }

    @Override
    public HomepageBanner updateBanner(Long id, HomepageBanner banner) {
        HomepageBanner existing = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));
        existing.setTitle(banner.getTitle());
        existing.setSubtitle(banner.getSubtitle());
        existing.setImageUrl(banner.getImageUrl());
        existing.setLinkUrl(banner.getLinkUrl());
        existing.setSection(banner.getSection());
        existing.setDisplayOrder(banner.getDisplayOrder());
        existing.setActive(banner.isActive());
        return bannerRepository.save(existing);
    }

    @Override
    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }
}
