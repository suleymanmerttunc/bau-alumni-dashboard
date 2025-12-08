import { useEffect, useState } from 'react';
import AlumniService from './services/AlumniService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'; 
import InteractiveMap from './components/InteractiveMap';
import LoginPage from './components/LoginPage'; 
import AddAlumniModal from './components/AddAlumniModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  
  const [alumniList, setAlumniList] = useState([]); // Tüm liste (Backend'den gelen ham veri)
  const [filteredList, setFilteredList] = useState([]); // Ekranda gösterilen filtrelenmiş liste
  
  // --- FİLTRE STATE'LERİ ---
  const [searchTerm, setSearchTerm] = useState(""); // Arama kelimesi
  const [selectedYear, setSelectedYear] = useState(""); // Seçilen yıl

  const [yearData, setYearData] = useState([]);
  const [sectorData, setSectorData] = useState([]); 
  const [sectorCount, setSectorCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  // Verileri Çek
  const fetchAlumniData = () => {
    setLoading(true);
    AlumniService.getAllAlumni()
      .then(data => {
        setAlumniList(data);
        setFilteredList(data); // Başlangıçta hepsi görünsün
        analyzeData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Hata:", error);
        setLoading(false);
      });
  };

  // --- FİLTRELEME MANTIĞI (Her tuşa basışta çalışır) ---
  useEffect(() => {
    let result = alumniList;

    // 1. İsim/Şirket Araması
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(alumni => 
        alumni.firstName.toLowerCase().includes(lowerTerm) ||
        alumni.lastName.toLowerCase().includes(lowerTerm) ||
        (alumni.company?.name && alumni.company.name.toLowerCase().includes(lowerTerm)) ||
        alumni.jobTitle.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Yıl Filtresi
    if (selectedYear) {
      result = result.filter(alumni => alumni.graduationYear === parseInt(selectedYear));
    }

    setFilteredList(result);
  }, [searchTerm, selectedYear, alumniList]);

  const handleLogin = (role) => {
      setUserRole(role);
      fetchAlumniData(); 
  };

  const handleLogout = () => {
      setUserRole(null);
      setAlumniList([]);
      setFilteredList([]);
  };

  const handleDelete = async (id) => {
      if (window.confirm("Bu mezunu silmek istediğine emin misin?")) {
          try {
              await AlumniService.deleteAlumni(id); 
              fetchAlumniData(); 
          } catch (error) {
              console.error("Silme hatası:", error);
              alert("Silinirken bir hata oluştu.");
          }
      }
  };

  const analyzeData = (data) => {
    // 1. Yıl Analizi
    const yearCounts = {};
    data.forEach(student => {
      const year = student.graduationYear;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    setYearData(Object.keys(yearCounts).map(year => ({ name: year, mezunSayisi: yearCounts[year] })));

    // 2. Sektör Analizi
    const sectorCounts = {};
    const uniqueSectors = new Set(); 
    data.forEach(student => {
      const sectorName = student.company?.sector?.name || 'Diğer';
      sectorCounts[sectorName] = (sectorCounts[sectorName] || 0) + 1;
      if(student.company?.sector?.name) uniqueSectors.add(student.company.sector.name);
    });
    setSectorData(Object.keys(sectorCounts).map(key => ({ name: key, value: sectorCounts[key] })));
    setSectorCount(uniqueSectors.size);
  };

  if (!userRole) {
      return <LoginPage onLogin={handleLogin} />;
  }

  // Benzersiz Yılları Bul (Dropdown için)
  const uniqueYears = [...new Set(alumniList.map(a => a.graduationYear))].sort((a,b) => b-a);

  return (
    <div>
      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-dark bg-dark mb-4 shadow-sm px-4">
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center">
            🎓 BAU Alumni Dashboard 
            <span className="badge bg-light text-dark ms-3" style={{fontSize: "12px"}}>
                {userRole === 'admin' ? 'Yönetici Modu' : 'Öğrenci Modu'}
            </span>
          </span>
          
          <div className="d-flex gap-2">
            {userRole === 'admin' && (
                <button onClick={() => setShowModal(true)} className="btn btn-success btn-sm fw-bold">
                      ➕ Mezun Ekle
                </button>
            )}
            
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {loading ? (
          <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            {/* --- FİLTRELEME ÇUBUĞU (YENİ EKLENDİ) --- */}
            <div className="card shadow-sm mb-4 border-0 bg-light">
                <div className="card-body py-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-1 text-center">
                            <span className="fs-4">🔍</span>
                        </div>
                        <div className="col-md-7">
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                placeholder="İsim, Şirket veya Unvan ara..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select 
                                className="form-select form-select-lg" 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Tüm Yıllar</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- İSTATİSTİKLER --- */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card text-white bg-primary mb-3 shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Toplam Mezun</h5>
                    <p className="card-text display-4 fw-bold">{filteredList.length}</p> {/* Filtreli sayı */}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card text-white bg-success mb-3 shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Farklı Sektörler</h5>
                    <p className="card-text display-4 fw-bold">{sectorCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- GRAFİKLER --- */}
            <div className="row mb-5">
              <div className="col-md-8">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white"><h5 className="mb-0">📅 Mezuniyet Yılı</h5></div>
                  <div className="card-body" style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="mezunSayisi" name="Mezun Sayısı" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white"><h5 className="mb-0">🏢 Sektör Dağılımı</h5></div>
                  <div className="card-body" style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sectorData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* --- HARİTA --- */}
            <div className="mb-5">
               {/* Haritaya filtrelenmiş listeyi gönderiyoruz ki arama yapınca harita da güncellensin */}
               <InteractiveMap alumniList={filteredList} />
            </div>

            {/* --- MEZUN LİSTESİ --- */}
            <h4 className="mb-3 border-bottom pb-2 d-flex justify-content-between">
                <span>Son Eklenen Mezunlar</span>
                <span className="text-muted small">{filteredList.length} sonuç bulundu</span>
            </h4>
            
            <div className="row">
              {filteredList.length > 0 ? (
                  filteredList.map((alumni) => (
                    <div key={alumni.id} className="col-md-4 mb-4">
                      <div className="card h-100 shadow-sm border-0 hover-card position-relative"> 
                        
                        {userRole === 'admin' && (
                            <button 
                                onClick={() => handleDelete(alumni.id)}
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                style={{ zIndex: 10, borderRadius: "50%", width: "30px", height: "30px", padding: 0, display:'flex', alignItems:'center', justifyContent:'center' }}
                                title="Mezunu Sil"
                            >
                                🗑️
                            </button>
                        )}

                        <div className="card-body text-center">
                          <div className="mb-3"><span className="display-6 p-3 bg-light rounded-circle">👨‍🎓</span></div>
                          <h5 className="card-title fw-bold">{alumni.firstName} {alumni.lastName}</h5>
                          <p className="text-muted mb-1">{alumni.jobTitle}</p>
                          <span className="badge bg-secondary mb-3">{alumni.department}</span>
                          <div className="bg-light p-2 rounded">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className="text-muted">Şirket:</small>
                              <span className="fw-bold text-primary">{alumni.company?.name || "-"}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">Mezuniyet:</small>
                              <span className="fw-bold">{alumni.graduationYear}</span>
                            </div>
                          </div>
                          
                          {/* --- LINKEDIN BUTONU --- */}
                          {alumni.linkedinUrl && (
                              <div className="mt-3">
                                  <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm w-100">
                                      LinkedIn Profili
                                  </a>
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                  <div className="col-12 text-center py-5">
                      <h4 className="text-muted">Aradığınız kriterlere uygun mezun bulunamadı. 😔</h4>
                  </div>
              )}
            </div>

            {/* --- MEZUN EKLEME MODALI --- */}
            <AddAlumniModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                onAlumniAdded={fetchAlumniData} 
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;