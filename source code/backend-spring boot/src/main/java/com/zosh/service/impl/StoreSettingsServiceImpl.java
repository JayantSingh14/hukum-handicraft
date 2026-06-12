package com.zosh.service.impl;

import com.zosh.model.StoreSettings;
import com.zosh.repository.StoreSettingsRepository;
import com.zosh.service.StoreSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreSettingsServiceImpl implements StoreSettingsService {

    private final StoreSettingsRepository storeSettingsRepository;

    @Override
    public StoreSettings getSettings() {
        return storeSettingsRepository.findAll().stream().findFirst()
                .orElseGet(() -> storeSettingsRepository.save(
                        StoreSettings.builder().storeName("Hukum").build()));
    }

    @Override
    public StoreSettings updateSettings(StoreSettings settings) {
        StoreSettings existing = getSettings();
        existing.setStoreName(settings.getStoreName());
        existing.setStoreLogo(settings.getStoreLogo());
        existing.setContactNumber(settings.getContactNumber());
        existing.setSupportEmail(settings.getSupportEmail());
        existing.setFacebookUrl(settings.getFacebookUrl());
        existing.setInstagramUrl(settings.getInstagramUrl());
        existing.setTwitterUrl(settings.getTwitterUrl());
        existing.setYoutubeUrl(settings.getYoutubeUrl());
        existing.setRazorpayEnabled(settings.isRazorpayEnabled());
        existing.setStripeEnabled(settings.isStripeEnabled());
        existing.setSmtpHost(settings.getSmtpHost());
        existing.setSmtpPort(settings.getSmtpPort());
        existing.setSmtpUsername(settings.getSmtpUsername());
        existing.setSmtpPassword(settings.getSmtpPassword());
        existing.setSmtpEnabled(settings.isSmtpEnabled());
        return storeSettingsRepository.save(existing);
    }
}
