package com.bau.alumni.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.bau.alumni.dto.InterviewQuestion;
import java.util.*;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    // --- MEVCUT KARİYER SİMÜLASYONU METODLARI ---
    public String generateSimulation(String dept, String grade, String interest, Map<String, Object> stats) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            String systemPrompt = "Sen BAU Mezun Sistemi kariyer koçusun. Mezun verilerine dayanarak 2-3 kısa cümlede tavsiye ver. 1. sınıfa temel çalışma, 4. sınıfa iş başvurusu odaklı dürüst tavsiyeler ver.";
            String userPrompt = String.format("Öğrenci: %s bölümü, %s. sınıf. Hedef: %s. Mezun Verileri: Şirketler: [%s], Unvanlar: [%s].",
                    dept, grade, interest, stats.get("topCompanies"), stats.get("topTitles"));

            return callGroq(systemPrompt, userPrompt, false);
        } catch (Exception e) {
            return "Şu an analiz yapılamıyor.";
        }
    }

    public String generateSkillRoadmap(String interest) {
        String systemPrompt = "Sen profesyonel bir teknik danışmansın. Sadece JSON formatında cevap ver. Şu yapıyı kullan: {\"skills\": [{\"name\": \"Yetenek Adı\", \"desc\": \"Kısa açıklama\"}]}";
        String userPrompt = interest + " alanı için en önemli 5 teknik yeteneği açıkla.";
        return callGroq(systemPrompt, userPrompt, true);
    }

    // --- YENİ MÜLAKAT (INTERVIEW) METODLARI ---

    public String generateInterviewQuestions(String cv, String jd) {
        String systemPrompt = """
            Sen kıdemli bir teknik mülakatçısın. CV ve İş Tanımını (JD) analiz ederek adaya özel 7 soru hazırla.
            1. İlk 2 soru HR, sonraki 5 soru TECHNICAL olsun.
            2. Cevabı SADECE JSON formatında şu yapıda ver:
            {"questions": [{ "id": 1, "type": "HR", "question": "...", "hints": ["...", "..."] }]}
            """;
        String userPrompt = "CV İÇERİĞİ:\n" + cv + "\n\nİŞ TANIMI:\n" + jd;
        return callGroq(systemPrompt, userPrompt, true);
    }

    public String evaluateInterviewAnswers(String cv, String jd, List<InterviewQuestion> questions, List<String> answers) {
        StringBuilder qaHistory = new StringBuilder();
        for (int i = 0; i < questions.size(); i++) {
            qaHistory.append("SORU ").append(i + 1).append(": ").append(questions.get(i).question()).append("\n");
            qaHistory.append("ADAYIN CEVABI: ").append(answers.get(i)).append("\n\n");
        }

        String systemPrompt = """
            Sen bir teknik mülakatçısın. Cevapları 100 üzerinden puanla ve analiz et. SADECE JSON formatında şu yapıda cevap ver:
            {
              "questionResults": [{ "score": 85, "evaluation": "...", "suggestions": ["..."] }],
              "overallAnalysis": { "strengths": ["..."], "improvements": ["..."], "nextSteps": ["..."] }
            }
            """;
        String userPrompt = "MÜLAKAT GEÇMİŞİ:\n" + qaHistory.toString();
        return callGroq(systemPrompt, userPrompt, true);
    }

    // --- YARDIMCI GROQ ÇAĞRI METODU ---
    private String callGroq(String systemPrompt, String userPrompt, boolean isJson) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.1-8b-instant");
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
            ));
            if (isJson) requestBody.put("response_format", Map.of("type", "json_object"));
            requestBody.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, new HttpEntity<>(requestBody, headers), Map.class);
            List choices = (List) response.getBody().get("choices");
            return (String) ((Map) ((Map) choices.get(0)).get("message")).get("content");
        } catch (Exception e) {
            return isJson ? "{\"error\": \"API Error\"}" : "Bir hata oluştu.";
        }
    }
}