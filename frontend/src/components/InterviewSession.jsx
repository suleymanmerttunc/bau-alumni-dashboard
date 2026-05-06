import { useState } from 'react';

const InterviewSession = ({
  questions,
  currentQuestionIndex,
  totalQuestions,
  onAnswerSubmit,
  isLoading
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Lütfen bir cevap yazınız');
      return;
    }

    setIsSubmitting(true);
    // Simüle et - gerçekte Groq AI değerlendirme burada yapılacak
    setTimeout(() => {
      onAnswerSubmit(currentAnswer);
      setCurrentAnswer('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !isSubmitting) {
      handleSubmitAnswer();
    }
  };

  return (
    <div className="card shadow-lg border-0 rounded-4 p-5 bg-dark text-white">
      {/* İLERLEME ÇUBUGU */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0 fw-bold">Soru {currentQuestionIndex + 1} / {totalQuestions}</h5>
          <span className="badge bg-warning text-dark fw-bold">
            {Math.round(progressPercentage)}% Tamamlandı
          </span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-warning"
            role="progressbar"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <hr className="border-secondary" />

      {/* SORU TÜRÜ */}
      <div className="mb-3">
        <span className="badge bg-info me-2">
          {currentQuestion.type === 'HR' ? '👥 HR Sorusu' : '💼 Teknik Soru'}
        </span>
        <span className="text-muted small">
          {currentQuestion.type === 'HR'
            ? 'İnsan Kaynakları ve Soft Skills sorusu'
            : 'Teknik beceri ve bilgi sorusu'}
        </span>
      </div>

      {/* SORU */}
      <div className="mb-5">
        <h4 className="text-light fw-bold lh-lg mb-4">
          {currentQuestion.question}
        </h4>

        {currentQuestion.hints && currentQuestion.hints.length > 0 && (
          <div className="alert alert-info bg-info bg-opacity-10 border border-info text-info">
            <strong>💡 İpuçları:</strong>
            <ul className="mt-2 mb-0">
              {currentQuestion.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CEVAP ALANI */}
      <div className="mb-4">
        <label className="form-label fw-bold text-light mb-3">
          Cevabınız (Ctrl+Enter ile gönder)
        </label>
        <textarea
          className="form-control form-control-lg"
          rows="6"
          placeholder="Soruya cevabınızı yazınız... Detaylı bir cevap vermeye özen gösteriniz."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
          style={{
            backgroundColor: '#2d3436',
            color: '#fff',
            border: '2px solid #636e72',
            minHeight: '150px'
          }}
        ></textarea>
        <small className="text-muted d-block mt-2">
          {currentAnswer.length} karakter
        </small>
      </div>

      {/* BUTONLAR */}
      <div className="d-flex gap-3 justify-content-end">
        <button
          className="btn btn-outline-secondary btn-lg fw-bold px-5"
          onClick={() => setCurrentAnswer('')}
          disabled={isSubmitting || !currentAnswer.trim()}
        >
          ✏️ Temizle
        </button>
        <button
          className="btn btn-warning btn-lg fw-bold px-5"
          onClick={handleSubmitAnswer}
          disabled={isSubmitting || !currentAnswer.trim()}
          style={{ cursor: isSubmitting ? 'wait' : 'pointer' }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              İşleniyor...
            </>
          ) : currentQuestionIndex === totalQuestions - 1 ? (
            <>✅ Bitir ve Sonuçları Gör</>
          ) : (
            <>➡️ Sonraki Soru</>
          )}
        </button>
      </div>

      {/* DURUM GÖSTERGESI */}
      <div className="mt-4 p-3 rounded-3 bg-secondary bg-opacity-25 text-center text-muted small">
        <i className="bi bi-info-circle me-2"></i>
        Cevaplarınız kaydediliyor. Lütfen sayfayı yenilemeyin.
      </div>
    </div>
  );
};

export default InterviewSession;
