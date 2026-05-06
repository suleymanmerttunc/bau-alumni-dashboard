import React, { useState } from 'react';
import { Modal, Button, Table, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaEye, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

const AlumniManagementModal = ({ show, onHide, alumniList, onDelete }) => {
  const [selectedAlumni, setSelectedAlumni] = useState(null); // Detay gösterilecek mezun

  const handleBack = () => setSelectedAlumni(null);

  const handleDeleteAndBack = (id) => {
    if (window.confirm("Bu mezun kaydını silmek istediğinize emin misiniz?")) {
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
              <Button variant="link" className="text-white me-2 p-0" onClick={handleBack} title="Geri">
                <FaArrowLeft />
              </Button>
              Mezun Detayı: {selectedAlumni.firstName} {selectedAlumni.lastName}
            </div>
          ) : (
            "👥 Sistemdeki Tüm Mezunlar"
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ minHeight: '300px' }}>
        {!selectedAlumni ? (
          // --- TABLO GÖRÜNÜMÜ ---
          (!alumniList || alumniList.length === 0) ? (
            <div className="text-center py-4">
              <p className="text-muted">Sistemde kayıtlı mezun bulunmuyor.</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Ad Soyad</th>
                  <th>Öğrenci No</th>
                  <th>Bölüm</th>
                  <th className="text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {alumniList.map((alumni) => (
                  <tr key={alumni.id}>
                    <td className="fw-bold">{alumni.firstName} {alumni.lastName}</td>
                    <td><span className="badge bg-secondary">{alumni.studentId}</span></td>
                    <td>{alumni.department}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => setSelectedAlumni(alumni)}
                        >
                          <FaEye /> İncele
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
          // --- DETAY GÖRÜNÜMÜ ---
          <div className="user-details">
            <Row className="mb-4 shadow-sm p-3 rounded bg-light border-start border-primary border-4">
              <Col md={6}>
                <p><strong>📝 Ad Soyad:</strong> {selectedAlumni.firstName} {selectedAlumni.lastName}</p>
                <p><strong>🎓 Öğrenci No:</strong> {selectedAlumni.studentId}</p>
                <p><strong>📚 Bölüm:</strong> {selectedAlumni.department}</p>
                <p><strong>📅 Mezuniyet Yılı:</strong> {selectedAlumni.graduationYear}</p>
              </Col>
              <Col md={6}>
                <p><strong>📍 Konum:</strong> {selectedAlumni.city}, {selectedAlumni.country}</p>
                <p><strong>💼 Şirket (AI):</strong> {selectedAlumni.companyName || 'Analiz Ediliyor...'}</p>
                <p><strong>📧 Ünvan (AI):</strong> {selectedAlumni.currentTitle || selectedAlumni.jobTitle}</p>
                <p>
                  <strong>🔗 LinkedIn:</strong>{' '}
                  <a href={selectedAlumni.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info">
                    Profili Gör <FaExternalLinkAlt size={10} />
                  </a>
                </p>
              </Col>
            </Row>

            <div className="alert alert-warning" role="alert">
              <strong>⚠️ Dikkat:</strong> Bu mezun kaydını silerseniz harita ve istatistiklerden kaldırılacaktır.
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
                <Button variant="secondary" onClick={handleBack}>Geri Dön</Button>
                <Button variant="danger" onClick={() => handleDeleteAndBack(selectedAlumni.id)}>
                  <FaTrash /> Kaydı Sil
                </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AlumniManagementModal;