import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AlumniService from '../services/AlumniService';
import CompanyService from '../services/CompanyService';
import { useTranslation } from 'react-i18next';

const AddAlumniModal = ({ show, handleClose, onAlumniAdded }) => {
    const { t } = useTranslation(); 
    
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', department: '', graduationYear: '',
        jobTitle: '', country: '', city: '', companyId: '', linkedinUrl: ''
    });

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
            setFormData({ firstName: '', lastName: '', department: '', graduationYear: '', jobTitle: '', country: '', city: '', companyId: '', linkedinUrl: '' });
        } catch (error) {
            alert(t('error_save_alumni')); 
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>➕ {t('add_new_alumni_title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>{t('first_name')}</Form.Label>
                            <Form.Control name="firstName" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>{t('last_name')}</Form.Label>
                            <Form.Control name="lastName" onChange={handleChange} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>{t('department')}</Form.Label>
                            <Form.Control name="department" placeholder="Örn: Software Engineering" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>{t('graduation_year')}</Form.Label>
                            <Form.Control type="number" name="graduationYear" placeholder="2024" onChange={handleChange} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>{t('country')}</Form.Label>
                            <Form.Control name="country" placeholder="Örn: Turkey" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>{t('city')}</Form.Label>
                            <Form.Control name="city" placeholder="Örn: Istanbul" onChange={handleChange} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>{t('job_title')}</Form.Label>
                            <Form.Control name="jobTitle" placeholder="Örn: Backend Developer" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>{t('company')}</Form.Label>
                            <Form.Select name="companyId" onChange={handleChange} required>
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
                            <Form.Control name="linkedinUrl" placeholder="https://www.linkedin.com/..." onChange={handleChange} />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={handleClose}>{t('cancel')}</Button>
                        <Button variant="success" type="submit" className="px-4 fw-bold">{t('save')}</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAlumniModal;