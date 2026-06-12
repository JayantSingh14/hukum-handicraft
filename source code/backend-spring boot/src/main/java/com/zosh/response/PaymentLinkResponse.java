package com.zosh.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentLinkResponse {

    private String payment_link_url;
    private String payment_link_id;
    private Long order_id;
    private String message;
    private String payment_method;
}
