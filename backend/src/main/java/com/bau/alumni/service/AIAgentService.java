package com.bau.alumni.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIAgentService {

    @Value("${google.ai.api.key}")
    private String geminiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String analyzeWithAI(String searchSnippets) {
    	// Görseldeki modele (Gemini 3 Flash) göre URL'yi güncelliyoruz
    	String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" + geminiKey;
    	
        try {
            // AI'ya araştırmacı bir rol veriyoruz
            String promptText = "Sen bir kariyer analiz uzmanısın. Aşağıdaki karmaşık internet verilerinden bu kişinin ŞU AN çalıştığı şirketi ve unvanını bul.\n" +
                                "Cevabı SADECE şu formatta ver: Şirket: [İsim], Unvan: [İsim]\n" +
                                "Not: Bulamazsan 'Tespit Edilemedi' ve 'Yazılım Mühendisi' yaz.\n\nVeri: " + searchSnippets;

            // Güvenli JSON Payload hazırlama
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", promptText);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", Collections.singletonList(textPart));

            Map<String, Object> contents = new HashMap<>();
            contents.put("contents", Collections.singletonList(parts));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(contents, headers);

            String response = restTemplate.postForObject(url, request, String.class);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            
            return root.path("candidates").get(0)
                       .path("content").path("parts").get(0)
                       .path("text").asText();

        } catch (Exception e) {
            System.err.println("!!! GEMINI HATASI: " + e.getMessage());
            return "Analiz başarısız.";
        }
    }
}