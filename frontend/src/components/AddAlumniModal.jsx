import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AlumniService from '../services/AlumniService';
import CompanyService from '../services/CompanyService';
import { useTranslation } from 'react-i18next';

const AddAlumniModal = ({ show, handleClose, onAlumniAdded }) => {
    const { t } = useTranslation(); 
    
    // Yeni alanlar eklendi: studentId, email, password
    const initialState = {
        studentId: '', email: '', password: '',
        firstName: '', lastName: '', department: '', graduationYear: '',
        jobTitle: '', country: '', city: '', companyId: '', linkedinUrl: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        if (show) {
            CompanyService.getAllCompanies().then(data => setCompanies(data));
        }
    }, [show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newAlumni = {
            ...formData,
            graduationYear: parseInt(formData.graduationYear),
            companyId: parseInt(formData.companyId)
        };

        try {
            await AlumniService.addAlumni(newAlumni);
            onAlumniAdded();
            handleClose();
            // Formu başlangıç durumuna döndür
            setFormData(initialState);
        } catch (error) {
            alert(t('error_save_alumni') || "Hata oluştu! Lütfen tüm alanları doldurun."); 
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>➕ {t('add_new_alumni_title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
                <Form onSubmit={handleSubmit}>
                    
                    {/* --- KRİTİK HESAP BİLGİLERİ (Yeni Satır) --- */}
                    <h6 className="text-primary mb-3 fw-bold border-bottom pb-2">🔑 Hesap ve Kimlik Bilgileri</h6>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Form.Label className="fw-bold">Öğrenci No</Form.Label>
                            <Form.Control 
                                name="studentId" 
                                placeholder="Örn: 2019364" 
                                onChange={handleChange} 
                                value={formData.studentId}
                                required 
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Label className="fw-bold">E-mail</Form.Label>
                            <Form.Control 
                                type="email"
                                name="email" 
                                placeholder="ad.soyad@example.com" 
                                onChange={handleChange} 
                                value={formData.email}
                                required 
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Label className="fw-bold">Şifre</Form.Label>
                            <Form.Control 
                                type="password"
                                name="password" 
                                placeholder="Giriş şifresi belirleyin" 
                                onChange={handleChange} 
                                value={formData.password}
                                required 
                            />
                        </Col>
                    </Row>

                    {/* --- KİŞİSEL BİLGİLER --- */}
                    <h6 className="text-primary mb-3 fw-bold border-bottom pb-2">👤 Kişisel Bilgiler</h6>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>{t('first_name')}</Form.Label>
                            <Form.Control name="firstName" onChange={handleChange} value={formData.firstName} required />
                        </Col>
                        <Col md={6}>
                            <Form.Label>{t('last_name')}</Form.Label>
                            <Form.Control name="lastName" onChange={handleChange} value={formData.lastName} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>{t('department')}</Form.Label>
                            <Form.Control name="department" placeholder="Örn: Software Engineering" onChange={handleChange} value={formData.department} required />
                        </Col>
                        <Col md={6}>
                            <Form.Label>{t('graduation_year')}</Form.Label>
                            <Form.Control type="number" name="graduationYear" placeholder="2024" onChange={handleChange} value={formData.graduationYear} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>{t('country')}</Form.Label>
                            <Form.Control name="country" placeholder="Örn: Turkey" onChange={handleChange} value={formData.country} required />
                        </Col>
                        <Col md={6}>
                            <Form.Label>{t('city')}</Form.Label>
                            <Form.Control name="city" placeholder="Örn: Istanbul" onChange={handleChange} value={formData.city} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>{t('job_title')}</Form.Label>
                            <Form.Control name="jobTitle" placeholder="Örn: Backend Developer" onChange={handleChange} value={formData.jobTitle} required />
                        </Col>
                        <Col md={6}>
                            <Form.Label>{t('company')}</Form.Label>
                            <Form.Select name="companyId" onChange={handleChange} value={formData.companyId} required>
                                <option value="">{t('select_company')}</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name} ({company.city})
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>{t('linkedin_url')}</Form.Label>
                            <Form.Control name="linkedinUrl" placeholder="https://www.linkedin.com/..." onChange={handleChange} value={formData.linkedinUrl} />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={() => { handleClose(); setFormData(initialState); }}>{t('cancel')}</Button>
                        <Button variant="success" type="submit" className="px-4 fw-bold">{t('save')}</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAlumniModal;