// Mock Interview Service
// Not: Gerçek backend integrate olduğunda bu mock'lar silinebilir

const generateMockQuestions = (cv, jobDescription) => {
  // CV ve JD'den temel info çıkart
  const cvLines = cv.split('\n').filter(l => l.trim());
  const jdLines = jobDescription.split('\n').filter(l => l.trim());

  const questions = [
    // HR Soruları (İlk 2)
    {
      id: 1,
      type: 'HR',
      question: 'Kendinizden kısaca bahsedebilir misiniz? Kariyer yolunuzda nasıl geldiniz?',
      hints: [
        'Eğitim geçmişinizden bahsedin',
        'Önemli kariyer dönüş noktalarınızı belirtin',
        'Neden bu pozisyona başvurdunuzu açıklayın'
      ]
    },
    {
      id: 2,
      type: 'HR',
      question: 'Ekip çalışmasında nasıl bir rol üstlenirsiniz? Zor bir ekip üyesiyle nasıl çalışırsınız?',
      hints: [
        'Özel bir ekip başarısından bahsedin',
        'Çatışma çözme yeteneğinizi gösterin',
        'İş birliğine verdiğiniz önemin açıklayın'
      ]
    },
    // Teknik Sorular (Sonraki 5)
    {
      id: 3,
      type: 'TECHNICAL',
      question: 'Bu pozisyonda talep edilen teknolojiler hakkında ne biliyorsunuz? Hangi projede kullandınız?',
      hints: [
        'Proje örnekleri verin',
        'Pratik deneyimler paylaşın',
        'Öğrenme yaklaşımınızı anlatın'
      ]
    },
    {
      id: 4,
      type: 'TECHNICAL',
      question: 'Kod kalitesi ve test yazma hakkında görüşleriniz nelerdir? Nasıl bir yaklaşım izlersiniz?',
      hints: [
        'Test stratejinizden bahsedin',
        'Code review deneyiminizi paylaşın',
        'Best practicesları açıklayın'
      ]
    },
    {
      id: 5,
      type: 'TECHNICAL',
      question: 'Mimari tasarım ve sistem tasarımında neleri dikkate alırsınız? Skalabilite nasıl sağlanır?',
      hints: [
        'Microservices, monolithic vb. yaklaşımlardan bahsedin',
        'Gerçek projelerdeki tasarımları anlatın',
        'Ölçeklenebilirlik stratejilerini açıklayın'
      ]
    },
    {
      id: 6,
      type: 'TECHNICAL',
      question: 'DevOps ve CI/CD pipeline\'ı hakkında ne biliyorsunuz? Hangi araçlarla çalıştınız?',
      hints: [
        'Jenkins, GitLab CI, GitHub Actions vb. örnekler verin',
        'Deployment workflow\'unuzu anlatın',
        'Monitoring ve logging yaklaşımınızı açıklayın'
      ]
    },
    {
      id: 7,
      type: 'TECHNICAL',
      question: 'Karşılaştığınız zorlukların başında gelen bir problemi çözmek için nasıl bir yöntem izlersiniz?',
      hints: [
        'Debugging süreci hakkında bilgi verin',
        'Root cause analysis yaklaşımınızı açıklayın',
        'Özel bir örnek kullanarak anlatın'
      ]
    }
  ];

  return questions;
};

const evaluateMockAnswers = (cv, jobDescription, questions, answers) => {
  // Mock evaluation - gerçekte Groq API değerlendirme yapacak
  const questionResults = questions.map((question, index) => {
    const answer = answers[index] || '';
    const answerLength = answer.trim().length;
    
    // Basit scoring logic
    let score = 40; // Base score
    
    // Uzunluk göre puan
    if (answerLength > 200) score += 20;
    else if (answerLength > 100) score += 10;
    
    // Anahtar kelimeleri kontrol et
    const keywords = {
      HR: ['deneyim', 'başarı', 'takım', 'öğrendim', 'başkalarıyla'],
      TECHNICAL: ['teknik', 'kodlama', 'proje', 'sistemi', 'çözdüm', 'kullanıldı']
    };
    
    const relevantKeywords = keywords[question.type] || [];
    const foundKeywords = relevantKeywords.filter(kw => 
      answer.toLowerCase().includes(kw)
    );
    
    score += Math.min(foundKeywords.length * 8, 40);
    score = Math.min(score, 100);

    return {
      questionId: question.id,
      score: score,
      evaluation: `Bu bir mock değerlendirmedir. Gerçek değerlendirme backend Groq API tarafından yapılacaktır. ${
        score >= 75 ? 'Cevap yeterince detaylı ve ilgili anahtar noktaları içeriyor.' :
        score >= 50 ? 'Cevap kabul edilebilir, ancak daha fazla detay verilebilirdi.' :
        'Cevap kısıtlı. Daha kapsamlı bir cevap vermeyi deneyin.'
      }`,
      suggestions: [
        score >= 75 ? '✅ Detaylı ve kapsayıcı cevap verdiniz.' : '📝 Daha spesifik örnekler ekleyin.',
        score < 50 ? '⏱️ Cevaplarınızı daha uzun tutmaya çalışın.' : '💡 Cevaplarınız yeterince ayrıntılı.',
        question.type === 'HR' ? '👥 Eğer mümkünse kişisel başarılardan bahsedin.' : '🔧 Teknik detayları daha derinlemesine açıklayın.'
      ]
    };
  });

  const overallScore = Math.round(
    questionResults.reduce((sum, r) => sum + r.score, 0) / questionResults.length
  );

  return {
    questionResults,
    overallScore,
    overallAnalysis: {
      strengths: [
        'Mülakatı tamamlamayı başardınız',
        'Detaylı cevaplar verdiniz',
        'Soruları anladığınız açık'
      ],
      improvements: [
        'Daha spesifik proje örnekleri verebilirsiniz',
        'Teknik detayları daha derinlemesine açıklayabilirsiniz',
        'Verdiğiniz cevapları somut başarı hikayeleriyle destekleyebilirsiniz'
      ],
      nextSteps: [
        '📚 İş ilanında belirtilen teknolojileri daha derinlemesine öğrenin',
        '💬 Mock mülakatlar yaparak pratik yapın',
        '🎯 LinkedIn\'da bu konudaki projeleri paylaşın',
        '👥 Sektör profesyonelleriyle bağlantı kurun'
      ]
    }
  };
};

// Export functions
export const interviewService = {
  generateQuestions: async (cv, jobDescription) => {
    // Simüle et - backend çalışmaya başladığında gerçek API çağrısı yapılacak
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          questions: generateMockQuestions(cv, jobDescription)
        });
      }, 1000);
    });
  },

  evaluateAnswers: async (cv, jobDescription, questions, answers) => {
    // Simüle et - backend çalışmaya başladığında gerçek API çağrısı yapılacak
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          results: evaluateMockAnswers(cv, jobDescription, questions, answers)
        });
      }, 2000);
    });
  }
};

export default interviewService;
