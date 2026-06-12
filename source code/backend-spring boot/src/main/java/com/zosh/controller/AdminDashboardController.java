package com.zosh.controller;

import com.zosh.dto.DashboardDto;
import com.zosh.exception.UserException;
import com.zosh.service.AdminDashboardService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}
