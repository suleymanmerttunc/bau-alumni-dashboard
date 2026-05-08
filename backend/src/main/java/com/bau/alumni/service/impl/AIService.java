package com.bau.alumni.service.impl;

import com.bau.alumni.dto.InterviewQuestion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    // --- MEVCUT KARİYER SİMÜLASYONU METODLARI ---
    public String generateSimulation(String dept, String grade, String interest, Map<String, Object> stats) {
        String systemPrompt = "Sen BAU Mezun Sistemi kariyer koçusun. Mezun verilerine dayanarak 2-3 kısa cümlede tavsiye ver.";
        String userPrompt = String.format("Öğrenci: %s bölümü, %s. sınıf. Hedef: %s. Mezun Verileri: [%s].",
                dept, grade, interest, stats.get("topCompanies"));

        return callGroq(systemPrompt, userPrompt, false);
    }

    public String generateSkillRoadmap(String interest) {
        String systemPrompt = "Sen profesyonel bir teknik danışmansın. Sadece JSON formatında cevap ver.";
        String userPrompt = interest + " alanı için en önemli 5 teknik yeteneği açıkla.";
        return callGroq(systemPrompt, userPrompt, true);
    }

    // --- 🚀 MÜLAKAT (INTERVIEW) METODLARI (SON HALİ) ---

    public String generateInterviewQuestions(String cv, String jd) {
        String systemPrompt = """
            Sen kıdemli bir teknik mülakatçısın. CV ve İş Tanımını analiz et.
            Toplam 7 soru oluştur (2 HR, 5 TECHNICAL). Sorular zorlayıcı ve CV'deki tecrübelerle örtüşen cinste olsun.
            SADECE JSON dön: {"questions": [{"id": 1, "type": "TECHNICAL", "question": "...", "hints": ["..."]}]}
            """;
        String userPrompt = "ADAY CV'Sİ:\n" + cv + "\n\nİŞ TANIMI:\n" + jd;
        return callGroq(systemPrompt, userPrompt, true);
    }

    /**
     * Mülakat geçmişini granüler (tane tane) analiz eden ve "tembellik" yapmayan metot.
     */
    public String evaluateInterview(List<InterviewQuestion> questions, List<String> answers) {
        // AI'nın kafasının karışmaması için Soru-Cevap ikililerini temiz bir metne döküyoruz
        StringBuilder interviewLog = new StringBuilder();
        for (int i = 0; i < questions.size(); i++) {
            interviewLog.append("### SORU ").append(i + 1).append(": ").append(questions.get(i).question()).append("\n");
            interviewLog.append("### ADAYIN CEVABI: ").append(answers.get(i)).append("\n");
            interviewLog.append("-------------------\n");
        }

        String systemPrompt = """
            Sen son derece titiz, dürüst ve her cevabı birbirinden bağımsız değerlendiren profesyonel bir mülakatçısın.
            
            KRİTİK KURALLAR:
            1. BAĞIMSIZ ANALİZ: Her soru için verdiğin "evaluation" ve "suggestions" o soruya ÖZEL olmalıdır. Bir önceki sorunun metinlerini asla kopyalama.
            2. ALAKASIZ CEVAP CEZASI: Eğer cevap soruyla ilgili değilse (Örn: "Altan", "bilmiyorum", "sad", "ok", "asdf"), PUAN 0-10 ARASINDA OLMAK ZORUNDADIR.
            3. TEKNİK DOĞRULUK: Cevap teknik olarak doğruysa ama kısaysa puan verme, içeriğe bak. Saçma sapan uzun cevaplara yüksek puan verme.
            4. DİL: Analizi profesyonel bir Türkçe ile yap.
            
            PUANLAMA REHBERİ:
            - 0-20: Alakasız, lakayıt veya tamamen boş.
            - 21-50: Çok yüzeysel, "hatırlamıyorum" diyen veya kaçamak cevaplar.
            - 51-85: Doğru mantık ama eksik detay.
            - 86-100: Eksiksiz, teknik derinliği olan ve örnekli cevaplar.
            
            SADECE JSON dön:
            {
              "questionResults": [{"score": 0, "evaluation": "Bu soruya özel analiz...", "suggestions": ["Bu soruya özel öneri..."]}],
              "overallAnalysis": {"strengths": [], "improvements": [], "nextSteps": []}
            }
            """;

        return callGroq(systemPrompt, interviewLog.toString(), true);
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
            
            if (isJson) {
                requestBody.put("response_format", Map.of("type", "json_object"));
            }
            
            requestBody.put("temperature", 0.5); // 0.7'den 0.5'e indirdik; AI daha az "yaratıcı" (uydurma) daha fazla "mantıklı" olsun.

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, new HttpEntity<>(requestBody, headers), Map.class);
            
            if (response.getBody() != null) {
                List choices = (List) response.getBody().get("choices");
                Map message = (Map) ((Map) choices.get(0)).get("message");
                return (String) message.get("content");
            }
            return isJson ? "{}" : "Cevap alınamadı.";
        } catch (Exception e) {
            return isJson ? "{\"error\": \"API Error\"}" : "Bir hata oluştu.";
        }
    }
}