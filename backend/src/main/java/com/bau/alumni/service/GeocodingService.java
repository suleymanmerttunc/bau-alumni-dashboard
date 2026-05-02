package com.bau.alumni.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeocodingService {

    public double[] getCoordinates(String city, String country) {
        try {
            // 1. OpenStreetMap'e soracağımız URL'i hazırlıyoruz
            String url = "https://nominatim.openstreetmap.org/search?city=" + city + "&country=" + country + "&format=json&limit=1";
            
            RestTemplate restTemplate = new RestTemplate();
            
            // 2. API bizi engellemesin diye kimliğimizi (User-Agent) belirtiyoruz
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "BAU_Alumni_Capstone_Project");
            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
            
            // 3. İsteği atıyoruz
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            // 4. Gelen JSON yanıtını okuyup Enlem ve Boylam değerlerini çekiyoruz
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            
            if (root.isArray() && root.size() > 0) {
                JsonNode location = root.get(0);
                double lat = location.get("lat").asDouble();
                double lon = location.get("lon").asDouble();
                return new double[]{lat, lon}; // [Enlem, Boylam] dizisi döner
            }
        } catch (Exception e) {
            System.out.println("Koordinat bulunamadı: " + city + " - Hata: " + e.getMessage());
        }
        
        return null; // Eğer şehir bulunmazsa veya API çökerse sistemi patlatmamak için null dönüyoruz
    }
}