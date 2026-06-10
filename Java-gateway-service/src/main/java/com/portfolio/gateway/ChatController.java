package com.portfolio.gateway;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"https://diana-portfolio-chi.vercel.app", "http://localhost"})
public class ChatController {

    private static final String PYTHON_SERVICE_URL = "https://diana-python-ai.onrender.com/api/chat";

    @PostMapping("/portfolio-chat")
    public String handleUserChat(@RequestBody Map<String, String> payload) {
        try {
            String userMessage = payload.getOrDefault("message", "");
            String escaped = userMessage.replace("\\", "\\\\").replace("\"", "\\\"");
            String jsonBody = "{\"message\":\"" + escaped + "\"}";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(PYTHON_SERVICE_URL))
                    .header("Content-Type", "application/json; charset=utf-8")
                    .header("X-Internal-Secret", "SuperSecureJavaToPythonToken123")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();

        } catch (Exception e) {
            return "{\"error\": \"Java Gateway Error: " + e.getMessage() + "\"}";
        }
    }
}