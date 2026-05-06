import { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import InterviewSession from './InterviewSession';
import InterviewResult from './InterviewResult';
import api from '../services/api';
import interviewService from '../services/InterviewService';

// PDF worker ayarı
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const InterviewCoachModule = ({ userRole }) => {
  const [cvText, setCvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya adını kaydet
    setFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(event.target.result);
          const pdf = await pdfjs.getDocument(typedarray).promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }

          console.log('📄 PDF Metni Çıkartıldı:', fullText.substring(0, 100) + '...');
          
          // Çıkartılan metni CV state'ine set et
          setCvText(fullText);
          setError(''); // Başarıyla yüklendikten sonra hatayı temizle
        } catch (pdfErr) {
          console.error('PDF Parse Hatası:', pdfErr);
          setError('PDF dosyası işlenirken hata oluştu. Lütfen başka bir PDF deneyin.');
          setFileName('');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('PDF yükleme hatası:', err);
      setError('PDF dosyası yüklenirken hata oluştu. Lütfen geçerli bir PDF dosyası seçiniz.');
      setFileName('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        // Sahte bir input event oluştur
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        handleFileUpload({ target: { files: dataTransfer.files } });
      } else {
        setError('Lütfen PDF dosyası yükleyiniz');
      }
    }
  };

  const handleStartInterview = async () => {
    // Detaylı validasyon
    console.log('🔍 Validasyon Kontrolleri:');
    console.log('cvText:', cvText ? `${cvText.length} karakter` : 'BOŞ ❌');
    console.log('jobDescription:', jobDescription ? `${jobDescription.length} karakter` : 'BOŞ ❌');
    
    if (!cvText.trim()) {
      setError('❌ Lütfen önce CV"nizi PDF olarak yükleyiniz');
      return;
    }
    if (!jobDescription.trim()) {
      setError('❌ Lütfen iş tanımını yapıştırınız');
      return;
    }

    setError('');
    setIsLoadingQuestions(true);

    try {
      // Mock service kullanarak sorular al (Backend entegrasyonuna hazır)
      const response = await interviewService.generateQuestions(cvText, jobDescription);

      if (response && response.questions) {
        setCurrentQuestions(response.questions);
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
        setInterviewStarted(true);
        setInterviewComplete(false);
      } else {
        setError('Sorular yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Soru yükleme hatası:', err);
      setError('Sorular yüklenirken hata oluştu');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleAnswerSubmit = (answer) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Tüm soruların cevabı alındı, sonuçları getir
      evaluateAnswers(newAnswers);
    }
  };

  const evaluateAnswers = async () => {
    setIsLoadingQuestions(true);
    try {
      // Mock service kullanarak değerlendirme al (Backend entegrasyonuna hazır)
      const response = await interviewService.evaluateAnswers(
        cvText,
        jobDescription,
        currentQuestions,
        userAnswers
      );

      if (response && response.results) {
        setResults(response.results);
        setInterviewComplete(true);
      } else {
        setError('Sonuçlar yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Sonuç yükleme hatası:', err);
      setError('Sonuçlar yüklenirken hata oluştu');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleResetInterview = () => {
    setCvText('');
    setFileName('');
    setJobDescription('');
    setInterviewStarted(false);
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setInterviewComplete(false);
    setResults(null);
    setError('');
  };

  // Sonuç Ekranı
  if (interviewComplete && results) {
    return (
      <InterviewResult
        results={results}
        questions={currentQuestions}
        answers={userAnswers}
        onReset={handleResetInterview}
      />
    );
  }

  // Mülakat Sürüyor
  if (interviewStarted && currentQuestions.length > 0) {
    return (
      <InterviewSession
        questions={currentQuestions}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentQuestions.length}
        onAnswerSubmit={handleAnswerSubmit}
        isLoading={isLoadingQuestions}
      />
    );
  }

  // Başlangıç Formu
  return (
    <div className="card shadow-lg border-0 rounded-4 p-5 bg-dark text-white">
      <div className="row">
        {/* SOL TARAF - FORM */}
        <div className="col-lg-6 border-end border-secondary pe-4">
          <h4 className="text-warning mb-4">🤖 Mülakat Hazırlık Formu</h4>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {/* DEMO BUTONU */}
          <div className="mb-3">
            <button
              className="btn btn-outline-info btn-sm w-100"
              onClick={() => {
                setCvText('John Doe\nSoftware Engineer\n5 yıl deneyim\nJava, Spring Boot, React, Python\nDevOps ve CI/CD\nMicroservices\nDomain Driven Design');
                setJobDescription('Software Engineer, herhangi bir seniorlik seviyesinde talep edilir. Tasarım ve geliştirme, müşteri gereksinimleriyle uyumlu iş uygulamaları. Sorumluluklar: Yeni uygulamalar tasarla, kod yaz, test et. Düzenlemeler: Kurumsal ve endüstri düzenlemeleri. Teknik beceriler: Java, React, Spring Boot, Python, SQL. DevOps ve CI/CD araçları. Microservices ve Domain Driven Design deneyimi.');
                setFileName('demo-cv.pdf');
                setError('');
              }}
            >
              🎯 Demo Verilerini Yükle (Test için)
            </button>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-light">
              📄 Özgeçmişinizi Yükleyin (PDF)
            </label>
            <div
              className="upload-container p-4 rounded-4 text-center bg-dark bg-opacity-25 border-2 border-dashed"
              style={{
                borderColor: isDragging ? '#ffc107' : fileName ? '#27ae60' : '#636e72',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: isDragging ? 'rgba(255, 193, 7, 0.1)' : 'rgba(0, 0, 0, 0.25)'
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                id="cvUpload"
                hidden
              />
              <label htmlFor="cvUpload" style={{ cursor: 'pointer', marginBottom: 0 }}>
                {fileName ? (
                  <>
                    <i className="bi bi-check-circle display-6 text-success d-block mb-2">✅</i>
                    <span className="text-success fw-bold">{fileName}</span>
                    <div className="text-muted small mt-2">Başarıyla yüklendi!</div>
                  </>
                ) : isDragging ? (
                  <>
                    <i className="bi bi-cloud-check display-6 text-warning d-block mb-2" style={{ fontSize: '3rem' }}>📥</i>
                    <span className="text-warning fw-bold d-block">Dosyayı buraya bırakınız!</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up display-6 text-warning d-block mb-2">☁️</i>
                    <span className="text-muted d-block">Dosyayı buraya sürükleyin</span>
                    <span className="text-muted small">veya tıklayarak seçiniz</span>
                  </>
                )}
              </label>
            </div>
            <small className="text-muted d-block mt-2">
              💡 PDF formatında özgeçmişinizi yükleyin
            </small>

            {/* FALLBACK: Manuel CV Giriş */}
            <details className="mt-3 p-3 rounded-3 bg-secondary bg-opacity-25 border border-secondary">
              <summary className="cursor-pointer text-muted small fw-bold" style={{ cursor: 'pointer' }}>
                📝 PDF yüklenmediyse, CV'nizi buraya yapıştırın
              </summary>
              <textarea
                className="form-control form-control-sm mt-3"
                rows="6"
                placeholder="CV bilgilerinizi buraya yapıştırabilirsiniz..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                style={{ backgroundColor: '#2d3436', color: '#fff', border: '1px solid #636e72', fontSize: '12px' }}
              ></textarea>
            </details>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-light">
              💼 Başvuracağınız İşin Tanımını Yapıştırınız
            </label>
            <textarea
              className="form-control form-control-lg"
              rows="8"
              placeholder="İş tanımını buraya yapıştırınız... (Sorumluluklar, Gereklilikler vb.)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ backgroundColor: '#2d3436', color: '#fff', border: '2px solid #636e72' }}
            ></textarea>
            <small className="text-muted">
              💡 LinkedIn iş ilanından kopyala-yapıştır yap
            </small>
          </div>

          <button
            className="btn btn-warning btn-lg w-100 py-3 fw-bold"
            onClick={handleStartInterview}
            disabled={isLoadingQuestions}
            style={{ cursor: isLoadingQuestions ? 'wait' : 'pointer', opacity: isLoadingQuestions ? 0.7 : 1 }}
          >
            {isLoadingQuestions ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sorular Hazırlanıyor...
              </>
            ) : (
              <>🚀 Mülakatı Başlat (7 Soru)</>
            )}
          </button>

          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#636e72' }}>
            <small className="text-light">
              <strong>❓ Soru Yapısı:</strong> 2 HR Sorusu + 5 Teknik Soru = Toplam 7 Soru
            </small>
          </div>
        </div>

        {/* SAĞ TARAF - BİLGİLENDİRME */}
        <div className="col-lg-6 ps-4 d-flex flex-column justify-content-center text-center">
          <div className="opacity-50 mb-4">
            <i className="bi bi-robot display-1 d-block mb-3" style={{ fontSize: '4rem' }}>🤖</i>
          </div>

          <div className="mb-4">
            <h5 className="text-info fw-bold mb-3">Bu Nedir?</h5>
            <p className="text-muted lh-lg">
              CV'nizi ve iş tanımını yapıştırdıktan sonra, yapay zeka tarafından özel olarak hazırlanan
              7 soruluk bir mülakat simülasyonundan geçeceksiniz.
            </p>
          </div>

          <div className="mb-4">
            <h5 className="text-success fw-bold mb-3">Ne Alacaksınız?</h5>
            <ul className="text-muted text-start" style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li className="mb-2">
                <span className="text-success me-2">✅</span>
                Her soru için /100 puan
              </li>
              <li className="mb-2">
                <span className="text-success me-2">✅</span>
                Geliştirim önerileri
              </li>
              <li className="mb-2">
                <span className="text-success me-2">✅</span>
                Detaylı geri bildirim
              </li>
              <li className="mb-2">
                <span className="text-success me-2">✅</span>
                Genel başarı puanı
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-3 bg-info bg-opacity-10 border border-info">
            <small className="text-info">
              <strong>⏱️</strong> Mülakatı bitirmek yaklaşık 10-15 dakika sürer.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCoachModule;
