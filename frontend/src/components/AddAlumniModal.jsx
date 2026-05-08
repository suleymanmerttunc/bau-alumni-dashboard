import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AlumniService from '../services/AlumniService';
import { useTranslation } from 'react-i18next';

const AddAlumniModal = ({ show, handleClose, onAlumniAdded }) => {
    const { t } = useTranslation(); 
    
    const initialState = {
        studentId: '',
        firstName: '', lastName: '', department: '', graduationYear: '',
        jobTitle: '', country: '', city: '', linkedinUrl: ''
    };

    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Backend'deki AlumniCreateRequest DTO'su ile birebir eşleşen obje
        const newAlumni = {
            ...formData,
            graduationYear: parseInt(formData.graduationYear)
        };

        try {
            await AlumniService.addAlumni(newAlumni);
            onAlumniAdded();
            handleClose();
            setFormData(initialState);
        } catch (error) {
            alert(t('add_alumni_error')); 
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
                    
                    <h6 className="text-primary mb-3 fw-bold border-bottom pb-2">{t('add_alumni_academic_title')}</h6>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Label className="fw-bold">{t('add_alumni_student_id')}</Form.Label>
                            <Form.Control 
                                name="studentId" 
                                placeholder={t('add_alumni_student_id_placeholder')} 
                                onChange={handleChange} 
                                value={formData.studentId}
                                required 
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="fw-bold">{t('linkedin_url')}</Form.Label>
                            <Form.Control 
                                name="linkedinUrl" 
                                placeholder="https://www.linkedin.com/in/..." 
                                onChange={handleChange} 
                                value={formData.linkedinUrl}
                                required 
                            />
                            <Form.Text className="text-muted">{t('add_alumni_linkedin_required')}</Form.Text>
                        </Col>
                    </Row>

                    <h6 className="text-primary mb-3 fw-bold border-bottom pb-2">{t('add_alumni_personal_title')}</h6>
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
                            <Form.Control name="department" placeholder={t('add_alumni_department_placeholder')} onChange={handleChange} value={formData.department} required />
                        </Col>
                        <Col md={6}>
                            <Form.Label>{t('graduation_year')}</Form.Label>
                            <Form.Control type="number" name="graduationYear" placeholder="2024" onChange={handleChange} value={formData.graduationYear} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Label>{t('country')}</Form.Label>
                            <Form.Control name="country" placeholder={t('add_alumni_country_placeholder')} onChange={handleChange} value={formData.country} required />
                        </Col>
                        <Col md={4}>
                            <Form.Label>{t('city')}</Form.Label>
                            <Form.Control name="city" placeholder={t('add_alumni_city_placeholder')} onChange={handleChange} value={formData.city} required />
                        </Col>
                        <Col md={4}>
                            <Form.Label>{t('job_title')}</Form.Label>
                            <Form.Control name="jobTitle" placeholder={t('add_alumni_company_placeholder')} onChange={handleChange} value={formData.jobTitle} required />
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