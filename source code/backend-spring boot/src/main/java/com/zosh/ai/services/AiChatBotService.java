package com.zosh.ai.services;

import com.zosh.exception.ProductException;
import com.zosh.response.ChatBotResponse;

public interface AiChatBotService {
    ChatBotResponse aiChatBot(String prompt, Long productId, Long userId) throws ProductException;
}
