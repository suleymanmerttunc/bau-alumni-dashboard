package com.bau.alumni.controller;

import com.bau.alumni.service.impl.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET})
@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * Kariyer Simülasyonu Endpoint'i
     * URL: http://localhost:8080/api/ai/simulate
     */
    @PostMapping("/simulate")
    public ResponseEntity<String> simulate(@RequestBody Map<String, Object> payload) {
        try {
            // Frontend'den gelen verileri ayıklıyoruz
            String department = (String) payload.get("department");
            String grade = (String) payload.get("grade");
            String interest = (String) payload.get("interest");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> stats = (Map<String, Object>) payload.get("stats");

            // Servis katmanına gönderip cevabı alıyoruz
            String advice = aiService.generateSimulation(department, grade, interest, stats);
            
            return ResponseEntity.ok(advice);

        } catch (Exception e) {
            // Hata durumunda loglama ve kullanıcıya mesaj
            System.err.println("Controller Hatası: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Analiz başlatılamadı: " + e.getMessage());
        }
    }
    
    @PostMapping("/skills")
    public ResponseEntity<String> getSkills(@RequestBody Map<String, String> payload) {
        String interest = payload.get("interest");
        return ResponseEntity.ok(aiService.generateSkillRoadmap(interest));
    }
}