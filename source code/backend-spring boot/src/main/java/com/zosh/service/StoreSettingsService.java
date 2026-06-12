package com.zosh.service;

import com.zosh.model.StoreSettings;

public interface StoreSettingsService {
    StoreSettings getSettings();
    StoreSettings updateSettings(StoreSettings settings);
}
