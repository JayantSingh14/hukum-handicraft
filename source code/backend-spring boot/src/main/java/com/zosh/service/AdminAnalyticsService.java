package com.zosh.service;

import com.zosh.dto.AnalyticsReportDto;

public interface AdminAnalyticsService {
    AnalyticsReportDto getDailyReport();
    AnalyticsReportDto getWeeklyReport();
    AnalyticsReportDto getMonthlyReport();
    AnalyticsReportDto getYearlyReport();
}
