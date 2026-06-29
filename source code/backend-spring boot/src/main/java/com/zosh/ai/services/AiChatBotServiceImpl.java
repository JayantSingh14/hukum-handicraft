package com.zosh.ai.services;

import com.zosh.exception.ProductException;
import com.zosh.mapper.OrderMapper;
import com.zosh.model.Cart;
import com.zosh.model.Order;
import com.zosh.model.User;
import com.zosh.repository.CartRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.UserRepository;
import com.zosh.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiChatBotServiceImpl implements AiChatBotService {

    @Value("${groq.api.key}")
    private String GROQ_API_KEY;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.3-70b-versatile";

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public ApiResponse aiChatBot(String prompt, Long productId, Long userId) throws ProductException {
        try {
            // Build context from user data if logged in
            StringBuilder context = new StringBuilder();
            context.append("You are HUKUM's Artisan Assistant — a helpful, warm AI for a premium Indian handicraft luxury e-commerce store. ")
                   .append("Help users with product questions, cart details, and order history. Be concise and elegant.\n\n");

            if (userId != null) {
                try {
                    Cart cart = cartRepository.findByUserId(userId);
                    if (cart != null && cart.getCartItems() != null && !cart.getCartItems().isEmpty()) {
                        context.append("User's cart has ").append(cart.getCartItems().size()).append(" item(s).\n");
                    }

                    List<Order> orders = orderRepository.findByUserId(userId);
                    if (orders != null && !orders.isEmpty()) {
                        context.append("User has ").append(orders.size()).append(" order(s) total.\n");
                        Order latest = orders.get(0);
                        context.append("Latest order status: ").append(latest.getOrderStatus()).append(".\n");
                    }
                } catch (Exception e) {
                    // ignore context fetch errors
                }
            }

            if (productId != null) {
                context.append("User is asking about product ID: ").append(productId).append(".\n");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + GROQ_API_KEY);

            JSONObject requestBody = new JSONObject()
                    .put("model", MODEL)
                    .put("temperature", 0.7)
                    .put("max_tokens", 512)
                    .put("messages", new JSONArray()
                            .put(new JSONObject()
                                    .put("role", "system")
                                    .put("content", context.toString()))
                            .put(new JSONObject()
                                    .put("role", "user")
                                    .put("content", prompt)));

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(GROQ_URL, request, String.class);

            JSONObject json = new JSONObject(response.getBody());
            String text = json.getJSONArray("choices")
                             .getJSONObject(0)
                             .getJSONObject("message")
                             .getString("content");

            ApiResponse res = new ApiResponse();
            res.setMessage(text);
            return res;

        } catch (Exception e) {
            System.err.println("AI ChatBot error: " + e.getMessage());
            ApiResponse res = new ApiResponse();
            res.setMessage("I'm having trouble connecting right now. Please try again in a moment.");
            return res;
        }
    }
}
