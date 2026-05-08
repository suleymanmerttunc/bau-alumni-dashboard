package com.bau.alumni.controller;

import com.bau.alumni.service.impl.AIService;
import com.bau.alumni.dto.InterviewQuestion;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;
    private final ObjectMapper objectMapper;

    public AIController(AIService aiService, ObjectMapper objectMapper) {
        this.aiService = aiService;
        this.objectMapper = objectMapper;
    }

    /**
     * Kariyer Simülasyonu Tavsiyesi
     */
    @PostMapping("/simulate")
    public ResponseEntity<String> simulate(@RequestBody Map<String, Object> payload) {
        try {
            String department = (String) payload.get("department");
            String grade = (String) payload.get("grade");
            String interest = (String) payload.get("interest");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> stats = (Map<String, Object>) payload.get("stats");

            String advice = aiService.generateSimulation(department, grade, interest, stats);
            return ResponseEntity.ok(advice);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Analiz hatası: " + e.getMessage());
        }
    }

    /**
     * Yetenek Yol Haritası (Skills)
     */
    @PostMapping("/skills")
    public ResponseEntity<String> getSkills(@RequestBody Map<String, String> payload) {
        String interest = payload.get("interest");
        return ResponseEntity.ok(aiService.generateSkillRoadmap(interest));
    }

    /**
     * PDF Dosyasından Mülakat Soruları Üretme
     * Frontend'den cvFile (File) ve jd (String) bekler.
     */
    @PostMapping("/generate-with-pdf")
    public ResponseEntity<String> generateWithPdf(
            @RequestParam("cvFile") MultipartFile file,
            @RequestParam("jd") String jd) {
        try {
            // 1. PDF'i Metne Çevir (Server-side Parsing)
            PDDocument document = PDDocument.load(file.getInputStream());
            PDFTextStripper stripper = new PDFTextStripper();
            String cvText = stripper.getText(document);
            document.close();

            // 2. Metni AI Service'e Gönderip Soruları Al
            String jsonQuestions = aiService.generateInterviewQuestions(cvText, jd);
            return ResponseEntity.ok(jsonQuestions);
        } catch (Exception e) {
            System.err.println("PDF Okuma Hatası: " + e.getMessage());
            return ResponseEntity.internalServerError().body("{\"error\": \"PDF okunamadı: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Mülakat Cevaplarını Değerlendirme (Final Raporu)
     */
    @PostMapping("/evaluate-answers")
    public ResponseEntity<String> evaluate(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Soruları List olarak al
            List<InterviewQuestion> questions = objectMapper.convertValue(
                payload.get("questions"), 
                new TypeReference<List<InterviewQuestion>>() {}
            );
            
            // 2. Cevapları List olarak al
            @SuppressWarnings("unchecked")
            List<String> answers = (List<String>) payload.get("answers");

            // 3. AIService'e bu iki listeyi ayrı ayrı gönder (Kırmızıyı bu çözecek)
            String jsonReport = aiService.evaluateInterview(questions, answers); 
            
            return ResponseEntity.ok(jsonReport);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Değerlendirme hatası\"}");
        }
    }
    
    @PostMapping("/match-cv")
    public ResponseEntity<String> matchCV(
            @RequestParam("cvFile") MultipartFile cvFile,
            @RequestParam("jdText") String jdText) {
        
        String cvContent = aiService.extractTextFromPdf(cvFile);
        String analysis = aiService.calculateMatchScore(cvContent, jdText);
        
        return ResponseEntity.ok(analysis);
    }
}