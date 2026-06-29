package com.zosh.ai.controllers;

import com.zosh.ai.services.AiChatBotService;
import com.zosh.model.User;
import com.zosh.request.Prompt;
import com.zosh.response.ChatBotResponse;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ai/chat")
public class AiChatBotController {

    private final AiChatBotService aiChatBotService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ChatBotResponse> generate(
            @RequestBody Prompt prompt,
            @RequestParam(required = false) Long productId,
            @RequestHeader(required = false, name = "Authorization") String jwt) throws Exception {

        String message = prompt.getPrompt();
        if (productId != null) {
            message = "The user is viewing product ID " + productId + ". " + message;
        }

        User user = new User();
        if (jwt != null && jwt.startsWith("Bearer ") && jwt.length() > 7) {
            try {
                user = userService.findUserProfileByJwt(jwt);
            } catch (Exception ignored) {}
        }

        ChatBotResponse response = aiChatBotService.aiChatBot(message, productId, user.getId());
        return ResponseEntity.ok(response);
    }
}
