import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CareerOracleModal = ({ show, onHide, departments, topEmployers, titleCloudData }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ dept: '', grade: '1', interest: '' });
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);

    React.useEffect(() => {
        setResult("");
        setSkills([]);
    }, [formData.dept, formData.grade]);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            // Veriyi temizleyerek gönderiyoruz (Tespit Edilemedi gibi kısımları ayıklayarak)
            const cleanCompanies = topEmployers
                .filter(e => e.name && e.name !== "Tespit Edilemedi")
                .slice(0, 5).map(e => e.name).join(", ");

            const res = await axios.post('http://localhost:8080/api/ai/simulate', {
                department: formData.dept,
                grade: formData.grade,
                interest: formData.interest,
                stats: {
                    topCompanies: cleanCompanies,
                    topTitles: titleCloudData.slice(0, 5).map(t => t.text).join(", ")
                }
            });
            setResult(res.data);
        } catch (error) {
            setResult(t('career_oracle_error'));
        } finally {
            setLoading(false);
        }
    };
    const fetchSkills = async () => {
        setSkillsLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/api/ai/skills', { interest: formData.interest });
            // Backend'den gelen JSON'ı parse et
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setSkills(data.skills);
        } catch (e) {
            console.error("Yetenekler alınamadı");
        } finally {
            setSkillsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered contentClassName="border-0 shadow-lg rounded-4 overflow-hidden">
            <Modal.Body className="p-0">
                <div className="d-flex flex-column flex-lg-row" style={{ minHeight: '500px' }}>
                    {/* SOL PANEL: GİRİŞLER */}
                    <div className="p-5 bg-white" style={{ flex: '1' }}>
                        <h3 className="fw-bold mb-4">{t('career_oracle_title')}</h3>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">{t('career_oracle_department')}</Form.Label>
                            <Form.Select value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })}>
                                <option value="">{t('career_oracle_select_dept')}</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">{t('career_oracle_grade')}</Form.Label>
                            <Form.Select value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })}>
                                <option value="1">{t('career_oracle_grade_1')}</option>
                                <option value="2">{t('career_oracle_grade_2')}</option>
                                <option value="3">{t('career_oracle_grade_3')}</option>
                                <option value="4">{t('career_oracle_grade_4')}</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted">{t('career_oracle_interest')}</Form.Label>
                            <Form.Control
                                placeholder={t('career_oracle_interest_placeholder')}
                                onChange={e => setFormData({ ...formData, interest: e.target.value })}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="w-100 py-3 fw-bold rounded-pill shadow-sm"
                            onClick={handleSimulate}
                            disabled={loading || !formData.dept || !formData.interest}
                        >
                            {loading ? <Spinner size="sm" className="me-2" /> : t('career_oracle_simulate_button')}
                        </Button>
                    </div>

                    {/* SAĞ PANEL: SONUÇLAR VE YETENEK HARİTASI */}
                    <div className="p-5 bg-dark text-white d-flex align-items-start justify-content-center overflow-auto" style={{ flex: '1.2', maxHeight: '600px' }}>
                        {loading ? (
                            <div className="text-center placeholder-glow w-100 mt-5">
                                <h4 className="placeholder col-6 bg-info mb-4"></h4>
                                <p className="placeholder col-12 bg-secondary"></p>
                                <p className="placeholder col-10 bg-secondary"></p>
                                <p className="text-info mt-4 small">{t('career_oracle_analyzing')}</p>
                            </div>
                        ) : result ? (
                            <div className="animate__animated animate__fadeIn w-100">
                                {/* 1. KISIM: GENEL TAVSİYE */}
                                <div className="mb-4">
                                    <h4 className="text-info mb-3">{t('career_oracle_result_title')}</h4>
                                    <p className="lead fs-6 lh-base italic opacity-90" style={{ borderLeft: '4px solid #0dcaf0', paddingLeft: '20px' }}>
                                        "{result}"
                                    </p>
                                </div>

                                <hr className="my-4 border-secondary opacity-25" />

                                {/* 2. KISIM: YETENEK ANALİZ BUTONU VE LİSTESİ */}
                                <div className="skill-section">
                                    {skills.length === 0 ? (
                                        <div className="text-center py-3">
                                            <button
                                                className="btn btn-outline-info rounded-pill px-4 shadow-sm fw-bold"
                                                onClick={fetchSkills}
                                                disabled={skillsLoading}
                                            >
                                                {skillsLoading ? (
                                                    <><Spinner size="sm" className="me-2" /> {t('career_oracle_skills_loading')}</>
                                                ) : (
                                                    t('career_oracle_skills_button')
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate__animated animate__slideInUp">
                                            <h6 className="text-warning fw-bold mb-3 text-uppercase small letter-spacing-1">
                                                {t('career_oracle_roadmap_title')}
                                            </h6>
                                            <div className="d-flex flex-column gap-3">
                                                {skills.map((skill, index) => (
                                                    <div key={index} className="p-3 bg-secondary bg-opacity-10 rounded-3 border-start border-info border-3 transition-hover">
                                                        <div className="fw-bold text-info mb-1">{skill.name}</div>
                                                        <div className="small text-light opacity-75">{skill.desc}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-25 mt-5">
                                <i className="bi bi-cpu display-1 mb-3"></i>
                                <p>{t('career_oracle_empty')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CareerOracleModal;