package com.zosh.ai.services;

import com.zosh.exception.ProductException;
import com.zosh.mapper.OrderMapper;
import com.zosh.mapper.ProductMapper;
import com.zosh.model.Cart;
import com.zosh.model.Order;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.repository.CartRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.repository.UserRepository;
import com.zosh.response.ApiResponse;
import com.zosh.response.FunctionResponse;
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

    @Value("${gemini.api.key}")
    private String GEMINI_API_KEY;

    private static final String GEMINI_MODEL = "gemini-2.0-flash";
    private static final String SYSTEM_INSTRUCTION =
            "You are HUKUM's Artisan Assistant — a helpful, warm, and knowledgeable AI for a premium Indian handicraft luxury e-commerce store. " +
            "Help users explore products, understand their cart, check order history, and discover the craft behind each piece. " +
            "Be concise, elegant, and friendly. If you cannot find specific information, politely say so.";

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private static final String GEMINI_BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/";

    private String geminiUrl() {
        return GEMINI_BASE_URL + GEMINI_MODEL + ":generateContent";
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // x-goog-api-key works for both AIza... and AQ. format keys
        headers.set("x-goog-api-key", GEMINI_API_KEY);
        return headers;
    }

    private JSONArray createFunctionDeclarations() {
        return new JSONArray()
                .put(new JSONObject()
                        .put("name", "getUserCart")
                        .put("description", "Retrieve the user's current cart details including items, quantities and totals")
                        .put("parameters", new JSONObject()
                                .put("type", "OBJECT")
                                .put("properties", new JSONObject()
                                        .put("cart", new JSONObject()
                                                .put("type", "STRING")
                                                .put("description", "Cart details")))
                                .put("required", new JSONArray().put("cart"))))
                .put(new JSONObject()
                        .put("name", "getUsersOrder")
                        .put("description", "Retrieve the user's order history including past and current orders")
                        .put("parameters", new JSONObject()
                                .put("type", "OBJECT")
                                .put("properties", new JSONObject()
                                        .put("order", new JSONObject()
                                                .put("type", "STRING")
                                                .put("description", "Order details")))
                                .put("required", new JSONArray().put("order"))))
                .put(new JSONObject()
                        .put("name", "getProductDetails")
                        .put("description", "Retrieve details about a specific product")
                        .put("parameters", new JSONObject()
                                .put("type", "OBJECT")
                                .put("properties", new JSONObject()
                                        .put("product", new JSONObject()
                                                .put("type", "STRING")
                                                .put("description", "Product details")))
                                .put("required", new JSONArray().put("product"))));
    }

    private FunctionResponse processFunctionCall(JSONObject functionCall, Long productId, Long userId) throws ProductException {
        String functionName = functionCall.getString("name");
        FunctionResponse res = new FunctionResponse();
        res.setFunctionName(functionName);

        switch (functionName) {
            case "getUserCart":
                Cart cart = cartRepository.findByUserId(userId);
                if (cart != null) res.setUserCart(cart);
                break;
            case "getUsersOrder":
                List<Order> orders = orderRepository.findByUserId(userId);
                User user = userRepository.findById(userId).orElse(null);
                res.setOrderHistory(OrderMapper.toOrderHistory(orders, user));
                break;
            case "getProductDetails":
                if (productId != null) {
                    Product product = productRepository.findById(productId).orElseThrow(
                            () -> new ProductException("Product not found"));
                    res.setProduct(product);
                }
                break;
            default:
                throw new IllegalArgumentException("Unsupported function: " + functionName);
        }
        return res;
    }

    @Override
    public ApiResponse aiChatBot(String prompt, Long productId, Long userId) throws ProductException {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // First call: ask Gemini (with function declarations) to decide how to respond
            JSONObject requestBody = new JSONObject()
                    .put("systemInstruction", new JSONObject()
                            .put("parts", new JSONArray()
                                    .put(new JSONObject().put("text", SYSTEM_INSTRUCTION))))
                    .put("contents", new JSONArray()
                            .put(new JSONObject()
                                    .put("role", "user")
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject().put("text", prompt)))))
                    .put("tools", new JSONArray()
                            .put(new JSONObject()
                                    .put("functionDeclarations", createFunctionDeclarations())));

            HttpEntity<String> request1 = new HttpEntity<>(requestBody.toString(), buildHeaders());
            ResponseEntity<String> response1 = restTemplate.postForEntity(geminiUrl(), request1, String.class);

            JSONObject json1 = new JSONObject(response1.getBody());
            JSONArray candidates1 = json1.getJSONArray("candidates");
            JSONObject content1 = candidates1.getJSONObject(0).getJSONObject("content");
            JSONObject firstPart = content1.getJSONArray("parts").getJSONObject(0);

            // If Gemini returned text directly (no function call needed), return it
            if (!firstPart.has("functionCall")) {
                ApiResponse res = new ApiResponse();
                res.setMessage(firstPart.optString("text", "I'm here to help! Ask me about your cart, orders, or our handicraft products."));
                return res;
            }

            // Gemini wants to call a function — process it
            FunctionResponse funcRes = processFunctionCall(firstPart.getJSONObject("functionCall"), productId, userId);

            // Second call: send function result back to Gemini for the final answer
            JSONObject body2 = new JSONObject()
                    .put("systemInstruction", new JSONObject()
                            .put("parts", new JSONArray()
                                    .put(new JSONObject().put("text", SYSTEM_INSTRUCTION))))
                    .put("contents", new JSONArray()
                            .put(new JSONObject()
                                    .put("role", "user")
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject().put("text", prompt))))
                            .put(new JSONObject()
                                    .put("role", "model")
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject()
                                                    .put("functionCall", new JSONObject()
                                                            .put("name", funcRes.getFunctionName())
                                                            .put("args", new JSONObject()
                                                                    .put("cart", funcRes.getUserCart() != null ? funcRes.getUserCart().getId() : null)
                                                                    .put("order", funcRes.getOrderHistory() != null ? funcRes.getOrderHistory().toString() : null)
                                                                    .put("product", funcRes.getProduct() != null ? ProductMapper.toProductDto(funcRes.getProduct()).toString() : null))))))
                            .put(new JSONObject()
                                    .put("role", "function")
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject()
                                                    .put("functionResponse", new JSONObject()
                                                            .put("name", funcRes.getFunctionName())
                                                            .put("response", new JSONObject()
                                                                    .put("name", funcRes.getFunctionName())
                                                                    .put("content", funcRes.toString())))))))
                    .put("tools", new JSONArray()
                            .put(new JSONObject()
                                    .put("functionDeclarations", createFunctionDeclarations())));

            HttpEntity<String> request2 = new HttpEntity<>(body2.toString(), buildHeaders());
            ResponseEntity<String> response2 = restTemplate.postForEntity(geminiUrl(), request2, String.class);

            JSONObject json2 = new JSONObject(response2.getBody());
            JSONArray candidates2 = json2.getJSONArray("candidates");
            JSONObject content2 = candidates2.getJSONObject(0).getJSONObject("content");
            JSONObject part2 = content2.getJSONArray("parts").getJSONObject(0);

            String text = part2.optString("text", "I found your information but couldn't format a response. Please try again.");

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
