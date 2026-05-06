import { Modal, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const SectorDetailModal = ({ show, onHide, data, colors }) => {
  // Veriyi yüksekten düşüğe sıralayalım
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const totalAlumni = sortedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="sector-modal-xl">
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title className="fw-bold">🏢 Detaylı Sektör Analizi</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row className="align-items-center">
          {/* SOL: BÜYÜK PASTA GRAFİĞİ */}
          <Col md={5} className="text-center border-end">
            <h6 className="text-muted mb-3">Genel Dağılım</h6>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sortedData} innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={2}>
                  {sortedData.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3">
              <div className="h4 fw-bold text-primary mb-0">
                {totalAlumni}
              </div>
              <small className="text-muted">Toplam Mezun</small>
            </div>
          </Col>

          {/* SAĞ: SIRALI LİSTE */}
          <Col md={7} className="ps-4">
            <h6 className="text-muted mb-3">Sektörel Kişi Sayıları</h6>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="pe-2">
              <ListGroup variant="flush">
                {sortedData.map((s, i) => (
                  <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center border-0 px-0 mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: colors[i % colors.length], 
                          marginRight: '12px' 
                        }}>
                      </div>
                      <span className="fw-medium text-truncate">{s.name}</span>
                    </div>
                    <Badge bg="primary" pill style={{ minWidth: '45px' }}>{s.value}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            
            {/* YÜZDELİK GÖSTERGE */}
            <div className="mt-4 pt-3 border-top">
              <h6 className="text-muted mb-3">Yüzdelik Dağılım</h6>
              {sortedData.slice(0, 5).map((s, i) => (
                <div key={i} className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="fw-medium">{s.name}</small>
                    <small className="text-muted">%{((s.value / totalAlumni) * 100).toFixed(1)}</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(s.value / totalAlumni) * 100}%`,
                        backgroundColor: colors[i % colors.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SectorDetailModal;
