import { useState } from 'react';

const InterviewResult = ({ results, questions, answers, onReset }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  // Ortalama puanı hesapla
  const averageScore = results && results.questionResults
    ? Math.round(results.questionResults.reduce((sum, r) => sum + r.score, 0) / results.questionResults.length)
    : 0;

  // Başarı seviyesi belirle
  const getScoreLevel = (score) => {
    if (score >= 85) return { label: '⭐⭐⭐ Mükemmel', color: 'success', class: 'bg-success' };
    if (score >= 70) return { label: '⭐⭐ İyi', color: 'info', class: 'bg-info' };
    if (score >= 50) return { label: '⭐ Orta', color: 'warning', class: 'bg-warning' };
    return { label: '❌ Zayıf', color: 'danger', class: 'bg-danger' };
  };

  const scoreLevel = getScoreLevel(averageScore);

  return (
    <div className="interview-results">
      {/* BAŞLIK */}
      <div className="card shadow-lg border-0 rounded-4 p-5 mb-4 bg-gradient-dark text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        
        <h1 className="display-4 fw-bold mb-2">🎉 Mülakat Tamamlandı!</h1>
        <p className="text-muted fs-5 mb-4">
          7 soruluk mülakattan başarıyla geçtiniz. İşte detaylı sonuçlarınız:
        </p>

        {/* ORTALAMA PUAN KUTUSU */}
        <div className="row g-3 justify-content-center mb-4">
          <div className="col-md-4">
            <div className={`card border-0 rounded-4 p-4 text-white ${scoreLevel.class}`}>
              <h6 className="text-uppercase fw-bold opacity-75 mb-2">Genel Başarı</h6>
              <div className="display-3 fw-bold mb-0">{averageScore}/100</div>
              <div className="text-white opacity-75 mt-2">{scoreLevel.label}</div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 rounded-4 p-4 bg-secondary text-white">
              <h6 className="text-uppercase fw-bold opacity-75 mb-2">Tamamlanan Sorular</h6>
              <div className="display-3 fw-bold mb-0">{results?.questionResults?.length || 0}</div>
              <div className="text-white opacity-75 mt-2">Toplam 7 Soru</div>
            </div>
          </div>
        </div>

        {/* BİLGİ */}
        <div className="p-3 rounded-3 bg-info bg-opacity-10 text-info">
          <strong>💡 İpucu:</strong> Başarı puanınızı artırmak için olumsuz puanları inceleyiniz ve önerileri uygulayınız.
        </div>
      </div>

      {/* SORU-CEVAP-SONUÇ KARTLARI */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {results?.questionResults?.map((result, index) => {
            const question = questions[index];
            const answer = answers[index];
            const questionScoreLevel = getScoreLevel(result.score);

            return (
              <div key={index} className="card shadow-sm border-0 rounded-4 mb-3 overflow-hidden">
                {/* BAŞLIK */}
                <div
                  className="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedQuestion(expandedQuestion === index ? -1 : index)}
                >
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <div className="badge bg-light text-dark fw-bold" style={{ fontSize: '14px', padding: '8px 12px' }}>
                      Soru {index + 1}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold text-start">{question.question.substring(0, 60)}...</h6>
                      <small className="text-muted">
                        {question.type === 'HR' ? '👥 HR Sorusu' : '💼 Teknik Soru'}
                      </small>
                    </div>
                  </div>

                  <div className="text-end ms-3">
                    <div className={`badge ${questionScoreLevel.class} fw-bold`} style={{ fontSize: '16px', padding: '8px 16px' }}>
                      {result.score}/100
                    </div>
                    <div className="text-muted small mt-2">
                      {expandedQuestion === index ? '▲ Gizle' : '▼ Detayları Gör'}
                    </div>
                  </div>
                </div>

                {/* DETAYLARI GÖSTER */}
                {expandedQuestion === index && (
                  <div className="card-body bg-light p-4">
                    {/* SORU */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 text-dark">📋 Soru</h6>
                      <div className="bg-white p-3 rounded-3 border border-secondary">
                        <p className="mb-0 text-dark">{question.question}</p>
                      </div>
                    </div>

                    {/* VERİLEN CEVAP */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 text-dark">💬 Verilen Cevap</h6>
                      <div className="bg-white p-3 rounded-3 border border-secondary">
                        <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                          {answer}
                        </p>
                      </div>
                    </div>

                    {/* DEĞERLENDİRME */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 text-dark">⚖️ Değerlendirme</h6>
                      <div className="bg-white p-3 rounded-3 border border-secondary">
                        <p className="text-dark mb-3">{result.evaluation}</p>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar ${questionScoreLevel.class}`}
                            style={{ width: `${result.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* ÖNERİLER */}
                    <div className="mb-0">
                      <h6 className="fw-bold mb-3 text-dark">💡 İyileştirme Önerileri</h6>
                      <div className="bg-info bg-opacity-10 p-3 rounded-3 border border-info">
                        <ul className="mb-0 text-dark">
                          {result.suggestions && result.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="mb-2">
                              <strong>→</strong> {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* GENEL İSTATİSTİKLER */}
      {results?.overallAnalysis && (
        <div className="row justify-content-center mt-5 mb-5">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-dark text-white">
              <h5 className="fw-bold mb-4 text-warning">📊 Genel Analiz</h5>

              <div className="mb-4">
                <h6 className="fw-bold text-light mb-3">Güçlü Yönler</h6>
                <div className="alert alert-success bg-success bg-opacity-10 border border-success text-success mb-0">
                  <ul className="mb-0">
                    {results.overallAnalysis.strengths && results.overallAnalysis.strengths.map((strength, idx) => (
                      <li key={idx} className="mb-1">✅ {strength}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-light mb-3">İyileştirilmesi Gereken Alanlar</h6>
                <div className="alert alert-warning bg-warning bg-opacity-10 border border-warning text-warning mb-0">
                  <ul className="mb-0">
                    {results.overallAnalysis.improvements && results.overallAnalysis.improvements.map((improvement, idx) => (
                      <li key={idx} className="mb-1">⚠️ {improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-0">
                <h6 className="fw-bold text-light mb-3">Sonraki Adımlar</h6>
                <div className="alert alert-info bg-info bg-opacity-10 border border-info text-info mb-0">
                  <ul className="mb-0">
                    {results.overallAnalysis.nextSteps && results.overallAnalysis.nextSteps.map((step, idx) => (
                      <li key={idx} className="mb-1">📌 {step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUTONLAR */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-10">
          <div className="d-flex gap-3 justify-content-center">
            <button
              className="btn btn-outline-light btn-lg fw-bold px-5"
              onClick={() => window.print()}
            >
              🖨️ Sonuçları Yazdır
            </button>
            <button
              className="btn btn-warning btn-lg fw-bold px-5"
              onClick={onReset}
            >
              🔄 Yeni Mülakat Başlat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
