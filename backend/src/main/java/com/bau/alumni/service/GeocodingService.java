package com.bau.alumni.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeocodingService {

    public Map<String, Double> getCoordinates(String city, String country) {
        try {
            // URL Encoding işlemini Spring'in UriComponentsBuilder'ı ile güvenli yapıyoruz
            String url = UriComponentsBuilder.fromHttpUrl("https://nominatim.openstreetmap.org/search")
                    .queryParam("city", city)
                    .queryParam("country", country)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .toUriString();
            
            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "BAU_Alumni_Capstone_Project");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            
            if (root.isArray() && root.size() > 0) {
                JsonNode location = root.get(0);
                Map<String, Double> coords = new HashMap<>();
                coords.put("lat", location.get("lat").asDouble());
                coords.put("lng", location.get("lon").asDouble()); // 'lon' değerini 'lng' olarak haritaya uygun isimlendirdik
                return coords;
            }
        } catch (Exception e) {
            System.err.println("!!! LOKASYON HATASI: " + city + ", " + country + " bulunamadı. Hata: " + e.getMessage());
        }
        
        return null;
    }
}