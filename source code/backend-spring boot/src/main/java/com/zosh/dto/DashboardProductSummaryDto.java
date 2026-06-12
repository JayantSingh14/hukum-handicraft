package com.zosh.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardProductSummaryDto {
    private Long id;
    private String title;
    private int quantity;
}
