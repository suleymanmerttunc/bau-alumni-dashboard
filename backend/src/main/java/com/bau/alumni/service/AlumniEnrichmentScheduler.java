package com.bau.alumni.service;

import com.bau.alumni.model.Alumni;
import com.bau.alumni.model.Sector;
import com.bau.alumni.repository.AlumniRepository;
import com.bau.alumni.service.impl.AIService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlumniEnrichmentScheduler {

    private final AlumniRepository alumniRepository;
    private final SearchService searchService;
    private final AIService aiService; 
    private final ObjectMapper objectMapper = new ObjectMapper(); 
    private final RestTemplate restTemplate = new RestTemplate(); // Harici API sorguları için

    public AlumniEnrichmentScheduler(AlumniRepository alumniRepository, 
                                     SearchService searchService, 
                                     AIService aiService) {
        this.alumniRepository = alumniRepository;
        this.searchService = searchService;
        this.aiService = aiService;
    }

    @Scheduled(fixedDelay = 10000) 
    @Transactional
    public void processUnprocessedAlumni() {
        List<Alumni> unprocessed = alumniRepository.findByAiProcessedFalse();
        
        for (Alumni alumni : unprocessed) {
            try {
                String snippets = searchService.searchLinkedIn(alumni.getFirstName(), alumni.getLastName());                
                
                if (snippets != null && !snippets.isEmpty()) {
                    String aiJsonResult = aiService.analyzeCompanyAndSector(snippets);
                    
                    System.out.println("DEBUG - AI'dan Gelen Yeni Cevap: " + aiJsonResult);
                    
                    parseAndSaveAiJsonResult(alumni, aiJsonResult);
                    
                    alumni.setAiProcessed(true);
                    alumni.setAiLastUpdate(LocalDateTime.now());
                    alumniRepository.save(alumni);
                    
                    System.out.println("AI ve Lokasyon İşlendi: " + alumni.getFirstName() + " " + alumni.getLastName());
                }
                
                Thread.sleep(3500); 
                
            } catch (Exception e) {
                System.err.println("Hata: " + alumni.getFirstName() + " için işlem başarısız: " + e.getMessage());
            }
        }
    }

    private void parseAndSaveAiJsonResult(Alumni alumni, String aiJsonResult) {
        try {
            JsonNode rootNode = objectMapper.readTree(aiJsonResult);
            
            String company = rootNode.has("company") ? rootNode.get("company").asText() : "Tespit Edilemedi";
            String title = rootNode.has("title") ? rootNode.get("title").asText() : "Yazılım Mühendisi";
            int sectorId = rootNode.has("sectorId") ? rootNode.get("sectorId").asInt() : 1; 
            
            alumni.setCurrentCompany(company);
            alumni.setCurrentTitle(title);
            
            Sector temporarySector = new Sector();
            temporarySector.setId((long) sectorId);
            alumni.setSector(temporarySector);
            
            // Konum Bilgileri (AI'dan gelen canlı metin)
            String country = rootNode.has("country") ? rootNode.get("country").asText() : "Türkiye";
            String city = rootNode.has("city") ? rootNode.get("city").asText() : "İstanbul";
            
            alumni.setCountry(country);
            alumni.setCity(city);
            
            // 🚀 DİNAMİK GEOCÓDING MOTORU: İnternetten koordinatları canlı çekiyoruz
            double[] coords = fetchCoordinatesFromApi(city, country);
            alumni.setLatitude(coords[0]);
            alumni.setLongitude(coords[1]);
            
        } catch (Exception e) {
            System.err.println("JSON Parse hatası, varsayılanlar atanıyor: " + e.getMessage());
            alumni.setCurrentCompany("Tespit Edilemedi");
            alumni.setCurrentTitle("Tespit Edilemedi");
            
            Sector defaultSector = new Sector();
            defaultSector.setId(1L);
            alumni.setSector(defaultSector);
            
            alumni.setCountry("Türkiye");
            alumni.setCity("İstanbul");
            alumni.setLatitude(41.0082);
            alumni.setLongitude(28.9784);
        }
    }
    /**
     * 🌍 OpenStreetMap Nominatim API kullanarak şehir ve ülkeye göre anlık koordinat çeken GÜVENLİ metot
     */
    private double[] fetchCoordinatesFromApi(String city, String country) {
        try {
            // URL formatını oluşturuyoruz
            String url = String.format("https://nominatim.openstreetmap.org/search?city=%s&country=%s&format=json&limit=1", city, country);
            
            // 🚀 KATID KURAL: Nominatim politikalarına uygun HTTP Header'ları hazırlıyoruz
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            
            // Kendimizi yasal bir uygulama olarak tanıtıyoruz (E-posta adresinizi veya okul projesi ismini yazmak engellenmeyi sıfırlar)
            headers.set("User-Agent", "BAUAlumniKariyerSistemi/1.0 (suleyman.tunc@bahcesehir.edu.tr)");
            headers.set("Accept", "application/json");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

            // İstegi exchange metodu ile header ekleyerek atıyoruz
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                
                if (responseJson.isArray() && responseJson.size() > 0) {
                    JsonNode firstResult = responseJson.get(0);
                    double lat = firstResult.get("lat").asDouble();
                    double lon = firstResult.get("lon").asDouble();
                    
                    System.out.println("🌍 CANLI GEOCÓDING BAŞARILI -> " + city + ": " + lat + ", " + lon);
                    return new double[]{lat, lon};
                }
            }
        } catch (Exception e) {
            System.err.println("Geocoding API hatası: " + e.getMessage());
        }
        
        // API limiti veya geçici blok durumunda sistemin çökmemesi için default İstanbul koordinatı
        System.out.println("⚠️ Canlı koordinat bulunamadı veya API politikasına takıldı. Varsayılan (İstanbul) atandı.");
        return new double[]{41.0082, 28.9784};
    }
}