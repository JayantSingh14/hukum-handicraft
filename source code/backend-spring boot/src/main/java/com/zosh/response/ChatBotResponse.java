package com.zosh.response;

import com.zosh.dto.ProductDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatBotResponse {
    private String message;
    private List<ProductDto> products;
    private boolean status;
}
