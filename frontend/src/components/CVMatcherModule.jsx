import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../styles/CVMatcher.css';

const CVMatcherModule = () => {
    const { t } = useTranslation();
    const [jdText, setJdText] = useState("");
    const [file, setFile] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        // PDF viewer parametreleri: toolbar ve sidebar gizle, zoom fit
        const url = URL.createObjectURL(selected);
        setPdfPreview(url + '#toolbar=0&navpanes=0&view=Fit');
    };

    const handleAnalyze = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("cvFile", file);
        formData.append("jdText", jdText);

        // Psikolojik bekleme süresi (Lazer efektini görsünler diye)
        const delay = new Promise(res => setTimeout(res, 4000));
        
        try {
            const [response] = await Promise.all([
                axios.post("http://localhost:8080/api/ai/match-cv", formData),
                delay
            ]);
            setResult(response.data);
        } catch (error) {
            console.error("Analiz hatası!", error);
            alert("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row g-4">
                {/* SOL: GİRİŞ ALANI */}
                <div className="col-md-5">
                    <div className="card bg-dark text-white p-4 border-0 shadow-lg">
                        <h5 className="text-warning mb-3">{t('cv_matcher_target_title')}</h5>
                        <textarea 
                            className="form-control bg-black text-white border-secondary mb-3"
                            rows="10"
                            placeholder={t('cv_matcher_jd_placeholder')}
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                        <div className="custom-file-selector mb-3 d-flex gap-2 align-items-center">
                            <label htmlFor="cv-file-input" className="btn btn-secondary flex-shrink-0" style={{ minWidth: '140px' }}>
                                {t('cv_matcher_file_button')}
                            </label>
                            <span className="file-status text-white">{file ? file.name : t('cv_matcher_file_no_selected')}</span>
                        </div>
                        <input 
                            id="cv-file-input"
                            type="file" 
                            className="d-none" 
                            onChange={handleFileChange} 
                            accept=".pdf"
                        />
                        <button 
                            className="btn btn-warning w-100 fw-bold py-2"
                            disabled={loading || !file || !jdText}
                            onClick={handleAnalyze}
                        >
                            {loading ? t('cv_matcher_button_loading') : t('cv_matcher_button_match')}
                        </button>
                    </div>
                </div>

                {/* SAĞ: ÖNİZLEME VE TARAMA */}
                <div className="col-md-7">
                    <div className="cv-preview-wrapper">
                        <div className="cv-preview-header">
                            <span className="preview-title">📋 {t('cv_matcher_preview_title')}</span>
                            {file && <span className="file-name">{file.name}</span>}
                        </div>
                        <div className="cv-preview-container">
                            {loading && <div className="scanner-line"></div>}
                            {pdfPreview ? (
                                <div className="pdf-iframe-wrapper">
                                    <iframe src={pdfPreview} width="100%" height="100%" title={t('cv_matcher_preview_title')} />
                                </div>
                            ) : (
                                <div className="h-100 d-flex align-items-center justify-content-center text-secondary">
                                    <div className="text-center">
                                        <div className="empty-state-icon">📄</div>
                                        <p className="empty-state-text">{t('cv_matcher_empty_message')}</p>
                                        <small className="text-muted d-block mt-2">{t('cv_matcher_empty_subtext')}</small>
                                    </div>
                                </div>
                            )}
                        </div>
                        {loading && (
                            <div className="cv-preview-footer">
                                <div className="spinner-border spinner-border-sm text-warning me-2" role="status">
                                    <span className="visually-hidden">{t('cv_matcher_loading_aria')}</span>
                                </div>
                                <span>{t('cv_matcher_scanning_text')} {Math.round((Date.now() % 4000) / 40)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SONUÇ ALANI */}
            {result && !loading && (
                <div className="card mt-4 bg-dark text-white p-4 border-0 shadow animate__animated animate__fadeInUp">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="match-score-circle d-flex flex-column align-items-center justify-content-center" style={{ 
                                width: '150px', 
                                height: '150px', 
                                backgroundColor: '#1a1a1a', 
                                borderRadius: '50%', 
                                border: '3px solid #ffc107',
                                margin: '0 auto'
                            }}>
                                <h2 className="text-warning mb-0">%{result.matchScore || 0}</h2>
                                <small className="text-muted">{t('cv_matcher_score_label')}</small>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <h4 className="mb-3">✅ {t('cv_matcher_result_title')}</h4>
                            <p className="text-muted">{result.summary || t('cv_matcher_analysis_complete')}</p>
                            
                            {/* Matched Skills */}
                            {result.matchedSkills && result.matchedSkills.length > 0 && (
                                <div className="mt-3">
                                    <h6 className="text-success mb-2">✨ {t('cv_matcher_matched_skills')}</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {result.matchedSkills.map((skill, idx) => (
                                            <span key={idx} className="badge bg-success">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Missing Skills */}
                            {result.missingSkills && result.missingSkills.length > 0 && (
                                <div className="mt-3">
                                    <h6 className="text-warning mb-2">⚠️ {t('cv_matcher_missing_skills')}</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {result.missingSkills.map((skill, idx) => (
                                            <span key={idx} className="badge bg-warning text-dark">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CVMatcherModule;
