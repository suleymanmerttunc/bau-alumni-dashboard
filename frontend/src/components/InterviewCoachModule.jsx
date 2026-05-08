import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api'; // Axios instance

const getScoreDetails = (score, t) => {
    if (score < 40) return { color: '#ff4d4d', label: t('score_weak'), class: 'bg-danger' };
    if (score >= 40 && score < 60) return { color: '#ffa502', label: t('score_develop'), class: 'text-dark', style: { backgroundColor: '#ffa502' } };
    if (score >= 60 && score < 75) return { color: '#fed330', label: t('score_average'), class: 'text-dark', style: { backgroundColor: '#fed330' } };
    if (score >= 75 && score < 90) return { color: '#26de81', label: t('score_good'), class: 'text-dark', style: { backgroundColor: '#26de81' } };
    if (score >= 90) return { color: '#218c74', label: t('score_excellent'), class: 'bg-success' };
    return { color: '#636e72', label: t('score_unknown'), class: 'bg-secondary' };
};

const InterviewCoachModule = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState('setup');
    const [pdfFile, setPdfFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [results, setResults] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            setFileName(file.name);
            setError('');
        } else {
            setError(t('interview_select_pdf_error'));
        }
    };

    const handleStartInterview = async () => {
        if (!pdfFile || !jd.trim()) {
            setError(t('interview_cv_and_jd_error'));
            return;
        }

        const formData = new FormData();
        formData.append('cvFile', pdfFile);
        formData.append('jd', jd);

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/ai/generate-with-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data && response.data.questions) {
                setQuestions(response.data.questions);
                setStep('session');
            } else {
                throw new Error(t('interview_questions_failed'));
            }
        } catch (err) {
            console.error('Hata:', err);
            setError(t('interview_start_failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (!currentAnswer.trim()) return;

        const updatedAnswers = [...userAnswers, currentAnswer];
        setUserAnswers(updatedAnswers);
        setCurrentAnswer('');

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            evaluateFinalInterview(updatedAnswers);
        }
    };

    const evaluateFinalInterview = async (allAnswers) => {
        setLoading(true);
        try {
            const response = await api.post('/ai/evaluate-answers', {
                questions: questions,
                answers: allAnswers
            });
            setResults(response.data);
            setStep('report');
        } catch (err) {
            console.error('Hata:', err);
            setError(t('interview_evaluation_error'));
        } finally {
            setLoading(false);
        }
    };

    if (step === 'setup') {
        return (
            <div className="card shadow-lg border-0 rounded-4 p-5 bg-dark text-white animate__animated animate__fadeIn">
                <div className="row">
                    <div className="col-lg-6 border-end border-secondary pe-lg-5">
                        <h4 className="text-warning mb-4">{t('interview_setup_title')}</h4>

                        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                        <div className="mb-4">
                            <label className="form-label fw-bold text-light">📄 {t('interview_upload_cv_label')}</label>
                            <div className="upload-box p-4 border-2 border-dashed rounded-4 text-center bg-black bg-opacity-25"
                                style={{ border: '2px dashed #636e72', cursor: 'pointer' }}>
                                <input type="file" accept=".pdf" id="cvInput" hidden onChange={handleFileChange} />
                                <label htmlFor="cvInput" className="m-0" style={{ cursor: 'pointer' }}>
                                    <i className="bi bi-cloud-arrow-up display-6 text-warning d-block mb-2"></i>
                                    {fileName ? (
                                        <span className="text-success fw-bold">{fileName} seçildi! ✅</span>
                                    ) : (
                                        <span className="text-muted">{t('interview_select_pdf_prompt')}</span>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold text-light">💼 {t('interview_job_description_label')}</label>
                            <textarea
                                className="form-control bg-dark text-white border-secondary shadow-none"
                                rows="6"
                                placeholder={t('interview_job_description_placeholder')}
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            className="btn btn-warning btn-lg w-100 py-3 fw-bold shadow"
                            onClick={handleStartInterview}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>{t('interview_questions_loading')}</>
                            ) : (
                                t('interview_start_button')
                            )}
                        </button>
                    </div>

                    <div className="col-lg-6 ps-lg-5 d-flex flex-column justify-content-center text-center">
                        <div className="opacity-75 mb-4">
                            <i className="bi bi-robot display-1 text-info"></i>
                        </div>
                        <h5 className="text-info fw-bold mb-3">{t('interview_how_it_works')}</h5>
                        <p className="text-muted lh-base px-4">
                            {t('interview_how_it_works')} {t('interview_real_time_feedback')}
                        </p>
                        <div className="p-4 bg-info bg-opacity-10 rounded-4 border border-info text-start mt-3 mx-4">
                            <ul className="list-unstyled mb-0 small">
                                <li className="mb-2">{t('interview_hr_questions')}</li>
                                <li className="mb-2">{t('interview_technical_questions')}</li>
                                <li>{t('interview_real_time_feedback')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'session') {
        const currentQ = questions[currentQuestionIndex];

        return (
            <div className="card bg-dark text-white p-5 border-0 rounded-4 shadow-lg animate__animated animate__fadeIn">
                <h4 className="text-warning mb-2">{t('interview_step_started')}</h4>
                <div className="progress mb-4" style={{ height: '10px' }}>
                    <div
                        className="progress-bar bg-warning"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                <h5 className="text-info">{t('interview_question_count', { current: currentQuestionIndex + 1, total: questions.length })}</h5>
                <p className="lead fw-bold mb-4">{currentQ.question}</p>

                <textarea
                    className="form-control bg-dark text-white border-secondary mb-4"
                    rows="6"
                    placeholder={t('interview_answer_placeholder')}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                ></textarea>

                <button
                    className="btn btn-success w-100 py-3 fw-bold"
                    onClick={handleNextQuestion}
                    disabled={!currentAnswer.trim()}
                >
                    {currentQuestionIndex === questions.length - 1 ? t('interview_finish_button') : t('interview_next_button')}
                </button>
            </div>
        );
    }

    if (step === 'report' && results) {
        const avgScore = results.questionResults
            ? Math.round(results.questionResults.reduce((acc, curr) => acc + curr.score, 0) / results.questionResults.length)
            : 0;

        return (
            <div className="card bg-dark text-white p-5 border-0 rounded-4 shadow-lg animate__animated animate__fadeIn">
                <div className="text-center mb-5">
                    <h2 className="text-warning fw-bold">{t('interview_analysis_complete')}</h2>
                    <div className="display-4 fw-bold text-info mt-3">{avgScore}/100</div>
                    <p className="text-muted">{t('interview_score_summary')}</p>
                </div>

                <div className="row g-3 mb-5">
                    <div className="col-md-4">
                        <div className="p-3 bg-success bg-opacity-10 border border-success rounded-3 h-100">
                            <h6 className="text-success fw-bold">✅ {t('interview_strengths')}</h6>
                            <ul className="small mb-0">
                                {results.overallAnalysis?.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-3 h-100">
                            <h6 className="text-warning fw-bold">⚠️ {t('interview_improvements')}</h6>
                            <ul className="small mb-0">
                                {results.overallAnalysis?.improvements?.map((im, i) => <li key={i}>{im}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-info bg-opacity-10 border border-info rounded-3 h-100">
                            <h6 className="text-info fw-bold">📌 {t('interview_next_steps')}</h6>
                            <ul className="small mb-0">
                                {results.overallAnalysis?.nextSteps?.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                <h5 className="mb-4 text-light border-bottom pb-2">{t('interview_feedback_title')}</h5>
                {results.questionResults?.map((res, index) => {
                    const scoreInfo = getScoreDetails(res.score, t);

                    return (
                        <div key={index} className="mb-4 p-4 bg-black bg-opacity-25 rounded-4 border border-secondary shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="badge bg-secondary p-2 px-3">{t('interview_question_label', { index: index + 1 })}</span>
                                <span
                                    className={`badge ${scoreInfo.class} fw-bold p-2 px-4 shadow-sm`}
                                    style={scoreInfo.style || { backgroundColor: scoreInfo.color }}
                                >
                                    {res.score} / 100 - {scoreInfo.label}
                                </span>
                            </div>

                            <p className="fw-bold text-light">{questions[index]?.question}</p>
                            <div className="progress mb-3" style={{ height: '6px', backgroundColor: '#2d3436' }}>
                                <div
                                    className="progress-bar rounded-pill"
                                    style={{
                                        width: `${res.score}%`,
                                        backgroundColor: scoreInfo.color
                                    }}
                                ></div>
                            </div>

                            <div className="p-3 bg-dark rounded-3 mb-3">
                                <small className="text-info d-block mb-1">{t('interview_your_answer')}</small>
                                <p className="small mb-0 fst-italic">"{userAnswers[index]}"</p>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <small className="text-warning fw-bold">💡 {t('interview_evaluation')}</small>
                                    <p className="small text-muted">{res.evaluation}</p>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-success fw-bold">🚀 {t('interview_suggestions')}</small>
                                    <ul className="small text-muted mb-0">
                                        {res.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <button className="btn btn-warning w-100 py-3 fw-bold mt-4" onClick={() => window.location.reload()}>
                    {t('interview_restart_button')}
                </button>
            </div>
        );
    }

    return null;
};

export default InterviewCoachModule;