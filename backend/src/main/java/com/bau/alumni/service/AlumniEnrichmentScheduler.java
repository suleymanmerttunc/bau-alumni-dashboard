package com.bau.alumni.service;

import com.bau.alumni.model.Alumni;
import com.bau.alumni.repository.AlumniRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlumniEnrichmentScheduler {

    private final AlumniRepository alumniRepository;
    private final SearchService searchService;
    private final AIAgentService aiAgentService;

    public AlumniEnrichmentScheduler(AlumniRepository alumniRepository, 
                                     SearchService searchService, 
                                     AIAgentService aiAgentService) {
        this.alumniRepository = alumniRepository;
        this.searchService = searchService;
        this.aiAgentService = aiAgentService;
    }

    // Test için 10 saniyede bir çalışacak şekilde ayarladım (10000 ms)
    @Scheduled(fixedDelay = 10000) 
    @Transactional
    public void processUnprocessedAlumni() {
        List<Alumni> unprocessed = alumniRepository.findByAiProcessedFalse();
        
        for (Alumni alumni : unprocessed) { // Değişken adı: alumni
            try {
                // HATA BURADAYDI: alumnus değil, alumni olmalı
                String snippets = searchService.searchLinkedIn(alumni.getFirstName(), alumni.getLastName());                
                
                if (snippets != null && !snippets.isEmpty()) {
                    String aiResult = aiAgentService.analyzeWithAI(snippets);
                    
                    System.out.println("DEBUG - AI'dan Gelen Ham Cevap: " + aiResult);
                    
                    parseAndSaveAiResult(alumni, aiResult);
                    
                    alumni.setAiProcessed(true);
                    alumni.setAiLastUpdate(LocalDateTime.now());
                    alumniRepository.save(alumni);
                    
                    System.out.println("AI İşlendi: " + alumni.getFirstName() + " " + alumni.getLastName());
                }
                
                // Groq/Serper kotasını korumak için 2 saniye bekleme
                Thread.sleep(2000); 
                
            } catch (Exception e) {
                System.err.println("Hata: " + alumni.getFirstName() + " için işlem başarısız: " + e.getMessage());
            }
        }
    }

    private void parseAndSaveAiResult(Alumni alumni, String aiResult) {
        try {
            if (aiResult == null || aiResult.contains("başarısız")) {
                alumni.setCurrentCompany("Tespit Edilemedi");
                alumni.setCurrentTitle("Yazılım Mühendisi");
                return;
            }

            String cleanedResult = aiResult.replace("\n", ", ").replace("*", ""); 
            
            String[] parts = cleanedResult.split(",");
            String company = "Tespit Edilemedi";
            String title = "Yazılım Mühendisi";

            for (String part : parts) {
                if (part.toLowerCase().contains("şirket:")) {
                    String[] splitPart = part.split(":");
                    if (splitPart.length > 1) company = splitPart[1].trim();
                } else if (part.toLowerCase().contains("unvan:") || part.toLowerCase().contains("unvan:")) {
                    String[] splitPart = part.split(":");
                    if (splitPart.length > 1) title = splitPart[1].trim();
                }
            }

            alumni.setCurrentCompany(company);
            alumni.setCurrentTitle(title);
            
        } catch (Exception e) {
            System.err.println("Parse hatası: " + e.getMessage());
            alumni.setCurrentCompany("Tespit Edilemedi");
            alumni.setCurrentTitle("Yazılım Mühendisi");
        }
    }
}