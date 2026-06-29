package com.zosh.ai.services;

import com.zosh.dto.ProductDto;
import com.zosh.exception.ProductException;
import com.zosh.mapper.ProductMapper;
import com.zosh.model.Cart;
import com.zosh.model.Order;
import com.zosh.model.Product;
import com.zosh.repository.CartRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.response.ChatBotResponse;
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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatBotServiceImpl implements AiChatBotService {

    @Value("${groq.api.key}")
    private String GROQ_API_KEY;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.3-70b-versatile";

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public ChatBotResponse aiChatBot(String prompt, Long productId, Long userId) throws ProductException {
        try {
            // Build user context
            StringBuilder context = new StringBuilder();
            if (userId != null) {
                try {
                    Cart cart = cartRepository.findByUserId(userId);
                    if (cart != null && cart.getCartItems() != null && !cart.getCartItems().isEmpty()) {
                        context.append("User has ").append(cart.getCartItems().size()).append(" item(s) in cart. ");
                    }
                    List<Order> orders = orderRepository.findByUserId(userId);
                    if (orders != null && !orders.isEmpty()) {
                        context.append("User has ").append(orders.size()).append(" order(s). ");
                        context.append("Latest order status: ").append(orders.get(0).getOrderStatus()).append(". ");
                    }
                } catch (Exception ignored) {}
            }

            String systemPrompt = "You are HUKUM's Artisan Assistant for a premium Indian handicraft luxury e-commerce store. " +
                "HUKUM sells handcrafted wall art, table decor, lamps, lanterns, pooja items, corporate gifts, and personalized gifts made by Indian artisans.\n\n" +
                (context.length() > 0 ? "User context: " + context + "\n\n" : "") +
                "IMPORTANT: Respond ONLY in valid JSON (no markdown, no code blocks, just raw JSON):\n" +
                "{\n" +
                "  \"message\": \"Your warm helpful response here\",\n" +
                "  \"searchQuery\": \"keyword\"\n" +
                "}\n\n" +
                "Set searchQuery to a SHORT keyword (1-3 words) when user asks about products, collections, recommendations, or categories.\n" +
                "Set searchQuery to null for: greetings, cart/order questions, general questions.\n" +
                "Examples:\n" +
                "- 'show me wall art' → searchQuery: 'wall art'\n" +
                "- 'I need a gift' → searchQuery: 'gift'\n" +
                "- 'something for diwali' → searchQuery: 'diwali'\n" +
                "- 'what is in my cart' → searchQuery: null\n" +
                "- 'hello' → searchQuery: null";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + GROQ_API_KEY.trim());

            JSONObject requestBody = new JSONObject()
                    .put("model", MODEL)
                    .put("temperature", 0.7)
                    .put("max_tokens", 400)
                    .put("response_format", new JSONObject().put("type", "json_object"))
                    .put("messages", new JSONArray()
                            .put(new JSONObject().put("role", "system").put("content", systemPrompt))
                            .put(new JSONObject().put("role", "user").put("content", prompt)));

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(GROQ_URL, request, String.class);

            JSONObject json = new JSONObject(response.getBody());
            String content = json.getJSONArray("choices")
                                 .getJSONObject(0)
                                 .getJSONObject("message")
                                 .getString("content");

            JSONObject parsed = new JSONObject(content);
            String message = parsed.optString("message", "How can I help you explore HUKUM's collection?");
            String searchQuery = parsed.optString("searchQuery", "");

            // Search products if AI requested it
            List<ProductDto> productDtos = new ArrayList<>();
            if (!searchQuery.isEmpty() && !searchQuery.equals("null")) {
                try {
                    List<Product> products = productRepository.searchProduct(searchQuery);
                    productDtos = products.stream()
                            .limit(4)
                            .map(ProductMapper::toProductDto)
                            .collect(Collectors.toList());

                    // If no results for exact query, try first word
                    if (productDtos.isEmpty() && searchQuery.contains(" ")) {
                        String firstWord = searchQuery.split(" ")[0];
                        products = productRepository.searchProduct(firstWord);
                        productDtos = products.stream()
                                .limit(4)
                                .map(ProductMapper::toProductDto)
                                .collect(Collectors.toList());
                    }
                } catch (Exception e) {
                    System.err.println("Product search error: " + e.getMessage());
                }
            }

            return new ChatBotResponse(message, productDtos, true);

        } catch (Exception e) {
            System.err.println("AI ChatBot error: " + e.getMessage());
            return new ChatBotResponse(
                "I'm having trouble connecting right now. Please try again in a moment.",
                new ArrayList<>(), false);
        }
    }
}
