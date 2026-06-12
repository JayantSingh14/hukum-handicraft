package com.zosh.service;

import com.zosh.model.HomepageBanner;

import java.util.List;

public interface HomepageBannerService {
    List<HomepageBanner> getAllBanners();
    List<HomepageBanner> getActiveBanners();
    List<HomepageBanner> getBannersBySection(String section);
    HomepageBanner createBanner(HomepageBanner banner);
    HomepageBanner updateBanner(Long id, HomepageBanner banner);
    void deleteBanner(Long id);
}
