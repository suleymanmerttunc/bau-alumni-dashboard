package com.bau.alumni.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SearchService {

    @Value("${serpapi.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String searchAlumniOnGoogle(String firstName, String lastName) {
        try {
            // Sorgu: Kişinin LinkedIn profili ve iş yeri bilgilerini odak noktasına alıyoruz
            String query = firstName + " " + lastName + " Bahçeşehir Üniversitesi (linkedin OR şirket OR iş)";
            String url = "https://serpapi.com/search.json?q=" + query + "&api_key=" + apiKey;

            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            
            StringBuilder combinedData = new StringBuilder();

            // 1. Özet Kutucuğu (Answer Box) kontrolü
            JsonNode answerBox = root.path("answer_box");
            if (!answerBox.isMissingNode()) {
                combinedData.append("Özet: ").append(answerBox.path("snippet").asText("")).append(" | ");
            }

            // 2. Bilgi Paneli (Knowledge Graph) kontrolü
            JsonNode knowledgeGraph = root.path("knowledge_graph");
            if (!knowledgeGraph.isMissingNode()) {
                combinedData.append("Panel: ").append(knowledgeGraph.path("description").asText("")).append(" | ");
            }

            // 3. Organik Sonuçlar (İlk 5 Sonuç)
            JsonNode results = root.path("organic_results");
            if (results.isArray()) {
                for (int i = 0; i < Math.min(results.size(), 5); i++) {
                    JsonNode node = results.get(i);
                    combinedData.append(node.path("title").asText()).append(": ");
                    combinedData.append(node.path("snippet").asText()).append(" | ");
                }
            }
            
            return combinedData.toString();

        } catch (Exception e) {
            System.err.println("Arama hatası: " + e.getMessage());
            return "";
        }
    }
}