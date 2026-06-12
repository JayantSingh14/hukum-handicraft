package com.zosh.controller;

import com.zosh.dto.AnalyticsReportDto;
import com.zosh.exception.UserException;
import com.zosh.service.AdminAnalyticsService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping("/daily")
    public ResponseEntity<AnalyticsReportDto> daily(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(analyticsService.getDailyReport());
    }

    @GetMapping("/weekly")
    public ResponseEntity<AnalyticsReportDto> weekly(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(analyticsService.getWeeklyReport());
    }

    @GetMapping("/monthly")
    public ResponseEntity<AnalyticsReportDto> monthly(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(analyticsService.getMonthlyReport());
    }

    @GetMapping("/yearly")
    public ResponseEntity<AnalyticsReportDto> yearly(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(analyticsService.getYearlyReport());
    }
}
