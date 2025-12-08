import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AlumniService from '../services/AlumniService';
import CompanyService from '../services/CompanyService';

const AddAlumniModal = ({ show, handleClose, onAlumniAdded }) => {
    // Form Verileri (linkedinUrl EKLENDİ)
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', department: '', graduationYear: '',
        jobTitle: '', country: '', city: '', companyId: '', linkedinUrl: ''
    });

    const [companies, setCompanies] = useState([]); // Şirket listesi (Dropdown için)

    // Modal açılınca şirketleri backend'den çek
    useEffect(() => {
        if (show) {
            CompanyService.getAllCompanies().then(data => setCompanies(data));
        }
    }, [show]);

    // Input değişince state'i güncelle
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Kaydet butonuna basınca
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Backend'in beklediği formatı hazırla
        const newAlumni = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            department: formData.department,
            graduationYear: parseInt(formData.graduationYear),
            jobTitle: formData.jobTitle,
            country: formData.country,
            city: formData.city,
            linkedinUrl: formData.linkedinUrl, // <-- YENİ ALAN
            company: { id: parseInt(formData.companyId) } // İlişki için ID lazım
        };

        try {
            await AlumniService.addAlumni(newAlumni); // Backend'e yolla
            onAlumniAdded(); // Ana sayfayı yenile
            handleClose();   // Pencereyi kapat
            // Formu temizle
            setFormData({ firstName: '', lastName: '', department: '', graduationYear: '', jobTitle: '', country: '', city: '', companyId: '', linkedinUrl: '' });
        } catch (error) {
            alert("Hata oluştu! Lütfen tüm alanları doldurun.");
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>➕ Yeni Mezun Ekle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Ad</Form.Label>
                            <Form.Control name="firstName" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>Soyad</Form.Label>
                            <Form.Control name="lastName" onChange={handleChange} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Bölüm</Form.Label>
                            <Form.Control name="department" placeholder="Örn: Software Engineering" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>Mezuniyet Yılı</Form.Label>
                            <Form.Control type="number" name="graduationYear" placeholder="2024" onChange={handleChange} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Ülke</Form.Label>
                            <Form.Control name="country" placeholder="Örn: Turkey" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>Şehir</Form.Label>
                            <Form.Control name="city" placeholder="Örn: Istanbul" onChange={handleChange} required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>İş Unvanı (Job Title)</Form.Label>
                            <Form.Control name="jobTitle" placeholder="Örn: Backend Developer" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Label>Şirket</Form.Label>
                            <Form.Select name="companyId" onChange={handleChange} required>
                                <option value="">Bir şirket seçin...</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name} ({company.city})
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                * Listede şirket yoksa önce veritabanına eklenmelidir.
                            </Form.Text>
                        </Col>
                    </Row>

                    {/* --- YENİ EKLENEN LINKEDIN SATIRI --- */}
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>LinkedIn Profil Linki</Form.Label>
                            <Form.Control name="linkedinUrl" placeholder="https://www.linkedin.com/in/..." onChange={handleChange} />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>İptal</Button>
                        <Button variant="success" type="submit">Kaydet</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAlumniModal;