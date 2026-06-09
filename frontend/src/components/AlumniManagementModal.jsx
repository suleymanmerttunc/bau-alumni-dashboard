import React, { useState } from 'react';
import { Modal, Button, Table, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaEye, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const AlumniManagementModal = ({ show, onHide, alumniList, onDelete, maskName }) => {
  const { t } = useTranslation();
  const [selectedAlumni, setSelectedAlumni] = useState(null); // Detay gösterilecek mezun

  const handleBack = () => setSelectedAlumni(null);

  const handleDeleteAndBack = (id) => {
    if (window.confirm(t('delete_confirm'))) {
      onDelete(id);
      handleBack();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {selectedAlumni ? (
            <div className="d-flex align-items-center">
              <Button variant="link" className="text-white me-2 p-0" onClick={handleBack} title={t('back')}>
                <FaArrowLeft />
              </Button>
              {t('alumni_detail_title')} {maskName(selectedAlumni.firstName, selectedAlumni.lastName)}
            </div>
          ) : (
            t('alumni_list_title')
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ minHeight: '300px' }}>
        {!selectedAlumni ? (
          // --- TABLE VIEW ---
          (!alumniList || alumniList.length === 0) ? (
            <div className="text-center py-4">
              <p className="text-muted">{t('alumni_list_empty')}</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>{t('alumni_table_name')}</th>
                  <th>{t('alumni_table_student_id')}</th>
                  <th>{t('alumni_table_department')}</th>
                  <th className="text-center">{t('alumni_table_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {alumniList.map((alumni) => (
                  <tr key={alumni.id}>
                    <td className="fw-bold">{maskName(alumni.firstName, alumni.lastName)}</td>
                    <td><span className="badge bg-secondary">{alumni.studentId}</span></td>
                    <td>{alumni.department}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => setSelectedAlumni(alumni)}
                        >
                          <FaEye /> {t('view')}
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteAndBack(alumni.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        ) : (
          // --- DETAIL VIEW ---
          <div className="user-details">
            <Row className="mb-4 shadow-sm p-3 rounded bg-light border-start border-primary border-4">
              <Col md={6}>
                <p><strong>{t('label_name')}:</strong> {maskName(selectedAlumni.firstName, selectedAlumni.lastName)}</p>
                <p><strong>{t('label_student_id')}:</strong> {selectedAlumni.studentId}</p>
                <p><strong>{t('label_department')}:</strong> {selectedAlumni.department}</p>
                <p><strong>{t('label_graduation_year')}:</strong> {selectedAlumni.graduationYear}</p>
              </Col>
              <Col md={6}>
                <p><strong>{t('label_location')}:</strong> {selectedAlumni.city}, {selectedAlumni.country}</p>
                <p><strong>{t('label_company_ai')}:</strong> {selectedAlumni.companyName || t('analysis_pending')}</p>
                <p><strong>{t('label_title_ai')}:</strong> {selectedAlumni.currentTitle || selectedAlumni.jobTitle}</p>
                <p>
                  <strong>{t('label_linkedin')}:</strong>{' '}
                  <a href={selectedAlumni.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info">
                    {t('view_profile')} <FaExternalLinkAlt size={10} />
                  </a>
                </p>
              </Col>
            </Row>

            <div className="alert alert-warning" role="alert">
              <strong>⚠️ {t('attention')}:</strong> {t('alumni_delete_warning')}
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
                <Button variant="secondary" onClick={handleBack}>{t('back')}</Button>
                <Button variant="danger" onClick={() => handleDeleteAndBack(selectedAlumni.id)}>
                  <FaTrash /> {t('delete_record')}
                </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AlumniManagementModal;