/**
 * BACKEND INTEGRATION TEMPLATE - GROQ AI INTERVIEW ENDPOINTS
 * 
 * Bu dosya, Node.js/Express backend'inize eklemek için hazırlanmış Interview API endpoint'lerini içerir.
 * Groq API ile entegre olup:
 * 1. CV ve Job Description'dan 7 soruluk mülakat sorusu oluşturur (2 HR + 5 Teknik)
 * 2. Verilen cevapları değerlendirir ve puanlandırır
 * 
 * GEREKLI KÜTÜPHANELER:
 * npm install axios dotenv
 * 
 * .env dosyasına eklenecek:
 * GROQ_API_KEY=your_groq_api_key_here
 */

// === BACKEND IMPLEMENTATION EXAMPLE ===
// File: routes/interviewRoutes.js (Express.js)

/*
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// 1. SORULAR OLUŞTURMA ENDPOINT'İ
router.post('/interview/generate-questions', async (req, res) => {
  try {
    const { cv, jobDescription } = req.body;

    if (!cv || !jobDescription) {
      return res.status(400).json({ message: 'CV ve Job Description gereklidir' });
    }

    // Groq API'ye prompt gönder
    const prompt = `
      Aşağıdaki CV ve iş tanımına dayanarak, 7 soruluk bir teknik mülakat sorusu seti oluştur:
      
      CV:
      ${cv}
      
      İş Tanımı:
      ${jobDescription}
      
      Lütfen şu formatta JSON döndür:
      {
        "questions": [
          {
            "id": 1,
            "type": "HR",
            "question": "Soru metni",
            "hints": ["ipucu1", "ipucu2", "ipucu3"]
          },
          ...
        ]
      }
      
      Özellikleri:
      - 2 adet HR sorusu (type: "HR") - kişilik, ekip çalışması, müşteri hizmetleri vb.
      - 5 adet Teknik soru (type: "TECHNICAL") - işte talep edilen teknolojiler hakkında
      - Her soru için 3 ipucu (hints) ekle
      - Soruları spesifik ve CV + Job Description'dan ilgili olacak şekilde oluştur
    `;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const questionData = JSON.parse(response.data.choices[0].message.content);
    res.json(questionData);

  } catch (error) {
    console.error('Groq API Hatası:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Sorular oluşturulurken hata oluştu',
      error: error.message 
    });
  }
});

// 2. CEVAP DEĞERLENDİRME ENDPOINT'İ
router.post('/interview/evaluate-answers', async (req, res) => {
  try {
    const { cv, jobDescription, questions, answers } = req.body;

    if (!cv || !jobDescription || !questions || !answers) {
      return res.status(400).json({ message: 'Tüm veriler gereklidir' });
    }

    // Her cevap için değerlendirme yapıl
    const evaluationPrompt = `
      Adayın mülakatı değerlendir. CV ve iş tanımı dikkate alınarak her cevaba /100 puan ver.
      
      CV:
      ${cv}
      
      İş Tanımı:
      ${jobDescription}
      
      Sorular ve Cevaplar:
      ${questions.map((q, i) => `
        Q${i + 1} (${q.type}): ${q.question}
        Cevap: ${answers[i] || 'Cevap yok'}
      `).join('\n')}
      
      Lütfen şu formatta JSON döndür:
      {
        "questionResults": [
          {
            "questionId": 1,
            "score": 85,
            "evaluation": "Değerlendirme metni",
            "suggestions": ["öneri1", "öneri2", "öneri3"]
          },
          ...
        ],
        "overallAnalysis": {
          "strengths": ["güçlü yön 1", "güçlü yön 2"],
          "improvements": ["iyileştirilecek alan 1", "iyileştirilecek alan 2"],
          "nextSteps": ["adım 1", "adım 2", "adım 3"]
        }
      }
      
      Değerlendirme kriterleri:
      - Cevapların spesifikliği ve detaylılığı
      - İş tanımıyla uygunluğu
      - Teknik doğruluğu
      - Sunum ve açıklık
      - CV'deki deneyimle tutarlılığı
    `;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const evaluationData = JSON.parse(response.data.choices[0].message.content);
    res.json({ results: evaluationData });

  } catch (error) {
    console.error('Groq API Hatası:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Değerlendirme yapılırken hata oluştu',
      error: error.message 
    });
  }
});

module.exports = router;
*/

// === SPRING BOOT IMPLEMENTATION EXAMPLE ===
// File: InterviewController.java

/*
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewController {

  @Autowired
  private RestTemplate restTemplate;

  @Value("${groq.api.key}")
  private String groqApiKey;

  private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

  @PostMapping("/generate-questions")
  public ResponseEntity<?> generateQuestions(@RequestBody InterviewRequest request) {
    try {
      String prompt = String.format(
        "Aşağıdaki CV ve iş tanımına dayanarak, 7 soruluk bir teknik mülakat sorusu seti oluştur...\\n" +
        "CV: %s\\n" +
        "Job Description: %s",
        request.getCv(),
        request.getJobDescription()
      );

      Map<String, Object> groqRequest = new HashMap<>();
      groqRequest.put("model", "mixtral-8x7b-32768");
      groqRequest.put("temperature", 0.7);
      groqRequest.put("max_tokens", 2000);
      
      Map<String, String> message = new HashMap<>();
      message.put("role", "user");
      message.put("content", prompt);
      groqRequest.put("messages", Arrays.asList(message));

      // Groq API çağrısı
      HttpHeaders headers = new HttpHeaders();
      headers.setBearerAuth(groqApiKey);
      headers.setContentType(MediaType.APPLICATION_JSON);

      HttpEntity<Map<String, Object>> entity = new HttpEntity<>(groqRequest, headers);
      ResponseEntity<String> response = restTemplate.postForEntity(GROQ_API_URL, entity, String.class);

      // JSON parse ve return
      // ... parse logic
      
      return ResponseEntity.ok(parsedResponse);
    } catch (Exception e) {
      return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
  }

  @PostMapping("/evaluate-answers")
  public ResponseEntity<?> evaluateAnswers(@RequestBody EvaluationRequest request) {
    try {
      // Benzer şekilde Groq API'ye değerlendirme isteği gönder
      String prompt = String.format(
        "Adayın mülakatı değerlendir... CV: %s\\nJob Description: %s\\n" +
        "Questions and Answers: ...",
        request.getCv(),
        request.getJobDescription()
      );

      // ... Rest API call logic

      return ResponseEntity.ok(evaluationResults);
    } catch (Exception e) {
      return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
  }
}

// Request DTOs
public class InterviewRequest {
  private String cv;
  private String jobDescription;
  // getters/setters
}

public class EvaluationRequest {
  private String cv;
  private String jobDescription;
  private List<Question> questions;
  private List<String> answers;
  // getters/setters
}
*/

// GROQ API CREDENTIALS:
// 1. https://console.groq.com adresine git
// 2. API Key oluştur
// 3. .env dosyasına GROQ_API_KEY=xxx ekle

// TEST KOMUTLARI:
/*
curl -X POST http://localhost:8080/api/interview/generate-questions \
  -H "Content-Type: application/json" \
  -d '{
    "cv": "Adı: John Doe\nTecrübe: 5 yıl Software Engineer\nSkills: Java, Spring Boot, React",
    "jobDescription": "Software Engineer pozisyonu için aranıyor. Java, Spring Boot bilgisi şart. React tecrübesi artı."
  }'
*/

export const BACKEND_INTEGRATION_READY = true;
