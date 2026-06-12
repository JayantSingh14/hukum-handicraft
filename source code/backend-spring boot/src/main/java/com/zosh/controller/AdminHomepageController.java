package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.model.HomepageBanner;
import com.zosh.service.HomepageBannerService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/homepage")
@RequiredArgsConstructor
public class AdminHomepageController {

    private final HomepageBannerService bannerService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping("/banners")
    public ResponseEntity<List<HomepageBanner>> getBanners(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    @PostMapping("/banners")
    public ResponseEntity<HomepageBanner> createBanner(
            @RequestBody HomepageBanner banner,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return new ResponseEntity<>(bannerService.createBanner(banner), HttpStatus.CREATED);
    }

    @PatchMapping("/banners/{id}")
    public ResponseEntity<HomepageBanner> updateBanner(
            @PathVariable Long id,
            @RequestBody HomepageBanner banner,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(bannerService.updateBanner(id, banner));
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<Void> deleteBanner(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        bannerService.deleteBanner(id);
        return ResponseEntity.ok().build();
    }
}
