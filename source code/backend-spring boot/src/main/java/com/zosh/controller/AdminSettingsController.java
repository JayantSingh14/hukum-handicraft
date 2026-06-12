package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.model.StoreSettings;
import com.zosh.service.StoreSettingsService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final StoreSettingsService settingsService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<StoreSettings> getSettings(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<StoreSettings> updateSettings(
            @RequestBody StoreSettings settings,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(settingsService.updateSettings(settings));
    }
}
