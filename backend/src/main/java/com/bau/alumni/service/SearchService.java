package com.bau.alumni.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SearchService {

    @Value("${serper.api.key}")
    private String serperKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String searchLinkedIn(String firstName, String lastName) {
        String url = "https://google.serper.dev/search";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", serperKey);

            // Sorguyu spesifik hale getiriyoruz: İsim + Soyisim + Okul + Bölüm + LinkedIn
            String query = firstName + " " + lastName + " Software Engineering Bahçeşehir Üniversitesi linkedin";
            
            Map<String, Object> body = new HashMap<>();
            body.put("q", query);
            body.put("num", 5); // Daha fazla sonuç arasından snippet toplamak için 5'e çıkardık

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, entity, String.class);

            JsonNode root = objectMapper.readTree(response);
            StringBuilder snippets = new StringBuilder();

            JsonNode organicResults = root.path("organic");
            if (organicResults.isArray()) {
                for (int i = 0; i < Math.min(organicResults.size(), 3); i++) {
                    snippets.append(organicResults.get(i).path("snippet").asText()).append(" ");
                }
            }

            return snippets.toString();

        } catch (Exception e) {
            System.err.println("!!! SERPER HATASI: " + e.getMessage());
            return "";
        }
    }
}