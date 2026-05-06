package com.bau.alumni.controller;

import com.bau.alumni.dto.InterviewQuestion;
import com.bau.alumni.service.impl.AIService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final AIService aiService;
    private final ObjectMapper objectMapper; // JSON dönüşümü için

    public InterviewController(AIService aiService, ObjectMapper objectMapper) { 
        this.aiService = aiService; 
        this.objectMapper = objectMapper;
    }

    @PostMapping("/generate-questions")
    public ResponseEntity<String> getQuestions(@RequestBody Map<String, String> payload) {
        // Servisteki metod ismi generateInterviewQuestions olarak güncellendi
        String json = aiService.generateInterviewQuestions(payload.get("cv"), payload.get("jobDescription"));
        return ResponseEntity.ok(json);
    }

    @PostMapping("/evaluate-answers")
    public ResponseEntity<String> evaluate(@RequestBody Map<String, Object> payload) {
        try {
            String cv = (String) payload.get("cv");
            String jd = (String) payload.get("jobDescription");
            
            // Gelen karmaşık listeleri DTO ve String listesine çeviriyoruz
            List<InterviewQuestion> questions = objectMapper.convertValue(payload.get("questions"), new TypeReference<List<InterviewQuestion>>() {});
            List<String> answers = objectMapper.convertValue(payload.get("answers"), new TypeReference<List<String>>() {});

            String json = aiService.evaluateInterviewAnswers(cv, jd, questions, answers); 
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Evaluation failed\"}");
        }
    }
}