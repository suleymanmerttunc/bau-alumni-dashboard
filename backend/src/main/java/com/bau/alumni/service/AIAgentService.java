package com.bau.alumni.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIAgentService {

    @Value("${groq.api.key}")
    private String groqKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String analyzeWithAI(String searchSnippets) {
        // Groq API Endpoint (OpenAI uyumlu)
        String url = "https://api.groq.com/openai/v1/chat/completions";

        try {
            // Groq çok hızlıdır ama ücretsiz kotada saniyede çok istek atarsan engeller
            Thread.sleep(2000); 

            // Groq/OpenAI formatında JSON hazırlama
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.1-8b-instant");
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", "Sen bir kariyer analiz uzmanısın. Sadece şu formatta cevap ver: Şirket: [İsim], Unvan: [İsim]"));
            messages.add(Map.of("role", "user", "content", "Bu verilerden kişinin şu anki şirketini ve unvanını bul: " + searchSnippets));
            
            requestBody.put("messages", messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqKey); // Groq 'Bearer' token bekler
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // API İsteği
            String response = restTemplate.postForObject(url, request, String.class);
            
            // Groq JSON Parsing (choices -> message -> content)
            JsonNode root = objectMapper.readTree(response);
            return root.path("choices").get(0)
                       .path("message").path("content")
                       .asText().trim();

        } catch (Exception e) {
            System.err.println("!!! GROQ HATASI: " + e.getMessage());
            return "Analiz başarısız.";
        }
    }
}