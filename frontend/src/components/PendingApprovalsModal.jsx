import React, { useState } from 'react';
import { Modal, Button, Table, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaEye, FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const PendingApprovalsModal = ({ show, onHide, pendingUsers, onApprove, onReject }) => {
  const [selectedUser, setSelectedUser] = useState(null); // Detay gösterilecek kullanıcı

  const handleBack = () => setSelectedUser(null);

  const handleApproveAndBack = (userId) => {
    onApprove(userId);
    handleBack();
  };

  const handleRejectAndBack = (userId) => {
    onReject(userId);
    handleBack();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {selectedUser ? (
            <div className="d-flex align-items-center">
              <Button variant="link" className="text-white me-2 p-0" onClick={handleBack} title="Geri">
                <FaArrowLeft />
              </Button>
              Başvuru Detayı: {selectedUser.username}
            </div>
          ) : (
            "🔔 Onay Bekleyen Mezun Başvuruları"
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ minHeight: '300px' }}>
        {!selectedUser ? (
          // --- TABLO GÖRÜNÜMÜ ---
          pendingUsers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Onay bekleyen başvuru bulunmuyor.</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Kullanıcı Adı</th>
                  <th>Öğrenci No</th>
                  <th>BAU Mail</th>
                  <th>Bilgiler</th>
                  <th className="text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-bold">{user.username}</td>
                    <td><span className="badge bg-info">{user.studentId}</span></td>
                    <td>{user.email}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => setSelectedUser(user)}
                        className="w-100"
                      >
                        <FaEye /> Detaylar
                      </Button>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleApproveAndBack(user.id)}
                          title="Onayla"
                        >
                          <FaCheck />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleRejectAndBack(user.id)}
                          title="Reddet"
                        >
                          <FaTimes />
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
            <Row className="mb-4 shadow-sm p-3 rounded bg-light">
              <Col md={6}>
                <p><strong>📝 Ad Soyad:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>🎓 Öğrenci No:</strong> {selectedUser.studentId}</p>
                <p><strong>📚 Bölüm:</strong> {selectedUser.department || 'Belirtilmemiş'}</p>
                <p><strong>📅 Mezuniyet Yılı:</strong> {selectedUser.graduationYear || 'Belirtilmemiş'}</p>
              </Col>
              <Col md={6}>
                <p><strong>📍 Konum:</strong> {selectedUser.city}, {selectedUser.country}</p>
                <p><strong>💼 Mevcut Ünvan:</strong> {selectedUser.jobTitle || 'Belirtilmemiş'}</p>
                <p><strong>📧 BAU Email:</strong> {selectedUser.email}</p>
                <p>
                  <strong>🔗 LinkedIn:</strong>{' '}
                  <a href={selectedUser.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info">
                    Profili Ziyaret Et <FaExternalLinkAlt size={10} />
                  </a>
                </p>
              </Col>
            </Row>

            <div className="alert alert-info" role="alert">
              <strong>ℹ️ Not:</strong> Bilgileri doğruladıktan sonra onay veya reddetme işlemini gerçekleştiriniz.
            </div>

            <Row className="mt-4">
              <Col className="d-flex gap-2 justify-content-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleBack}
                >
                  Geri Dön
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleRejectAndBack(selectedUser.id)}
                  className="px-4"
                >
                  <FaTimes /> Bu Başvuruyu Reddet
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => handleApproveAndBack(selectedUser.id)}
                  className="px-4"
                >
                  <FaCheck /> Bilgileri Doğrula ve Onayla
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>
      
      {!selectedUser && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Kapat</Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default PendingApprovalsModal;