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

    @Scheduled(fixedDelay = 3600000) 
    @Transactional
    public void processUnprocessedAlumni() {
        List<Alumni> unprocessed = alumniRepository.findByAiProcessedFalse();
        
        for (Alumni alumni : unprocessed) {
            try {
                String snippets = searchService.searchAlumniOnGoogle(alumni.getFirstName(), alumni.getLastName());
                
                if (!snippets.isEmpty()) {
                    String aiResult = aiAgentService.analyzeWithAI(snippets);
                    
                    // --- DEBUG SATIRI BURAYA GELECEK ---
                    System.out.println("DEBUG - AI'dan Gelen Ham Cevap: " + aiResult);
                    
                    parseAndSaveAiResult(alumni, aiResult);
                    
                    alumni.setAiProcessed(true);
                    alumni.setAiLastUpdate(LocalDateTime.now());
                    alumniRepository.save(alumni);
                    
                    System.out.println("AI İşlendi: " + alumni.getFirstName() + " " + alumni.getLastName());
                }
                
                Thread.sleep(2000); 
                
            } catch (Exception e) {
                System.err.println("Hata: " + alumni.getFirstName() + " için işlem başarısız: " + e.getMessage());
            }
        }
    }

    // Bu metodu "garantici" versiyonla güncelledik
    private void parseAndSaveAiResult(Alumni alumni, String aiResult) {
        try {
            // AI bazen alt alta yazar veya yıldız (**) koyar, onları temizleyip tek satıra çekiyoruz
            String cleanedResult = aiResult.replace("\n", ", ").replace("*", ""); 
            
            String[] parts = cleanedResult.split(",");
            String company = "Tespit Edilemedi";
            String title = "Yazılım Mühendisi";

            for (String part : parts) {
                if (part.toLowerCase().contains("şirket:")) {
                    company = part.split(":")[1].trim();
                } else if (part.toLowerCase().contains("unvan:")) {
                    title = part.split(":")[1].trim();
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