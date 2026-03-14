import { useEffect, useState } from 'react';
import AlumniService from './services/AlumniService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import InteractiveMap from './components/InteractiveMap';
import LoginPage from './components/LoginPage';
import AddAlumniModal from './components/AddAlumniModal';
import { useTranslation } from 'react-i18next'; // Dil desteği için eklendi
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './App.css';

function App() {
  const { t, i18n } = useTranslation(); // Çeviri fonksiyonu
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [alumniList, setAlumniList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [yearData, setYearData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [sectorCount, setSectorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Grafik Sayfalama
  const [yearPageIndex, setYearPageIndex] = useState(0);
  const YEARS_PER_PAGE = 5;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5733', '#C70039'];

  /**
   * Backend'den tüm mezun verilerini çeker ve state'e kaydeder.
   * Gelen verinin 'content' kısmını alarak ID'ye göre tersten sıralar.
   */
  const fetchAlumniData = () => {
    setLoading(true);
    AlumniService.getAllAlumni()
      .then(data => {
        const alumniArray = data.content || [];
        const sortedData = alumniArray.sort((a, b) => b.id - a.id);
        setAlumniList(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Veri çekme hatası:", error);
        setLoading(false);
      });
  };

  /**
   * Filtreleme mantığı: İsim, Şirket veya Yıla göre listeyi günceller.
   * Her filtrelemede grafik analizini (analyzeData) tetikler.
   */
  useEffect(() => {
    let result = alumniList;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(alumni =>
        alumni.firstName.toLowerCase().includes(lowerTerm) ||
        alumni.lastName.toLowerCase().includes(lowerTerm) ||
        (alumni.companyName && alumni.companyName.toLowerCase().includes(lowerTerm)) ||
        alumni.jobTitle.toLowerCase().includes(lowerTerm)
      );
    }

    if (selectedYear) {
      result = result.filter(alumni => alumni.graduationYear === parseInt(selectedYear));
    }

    setFilteredList(result);
    analyzeData(result);
  }, [searchTerm, selectedYear, alumniList]);

  /**
   * Giriş işlemi başarılı olduğunda rolü atar ve verileri çeker.
   */
  const handleLogin = (role) => {
    setUserRole(role);
    fetchAlumniData();
  };

  /**
   * Çıkış yapar ve tüm kişisel verileri temizler.
   */
  const handleLogout = () => {
    setUserRole(null);
    setAlumniList([]);
    setFilteredList([]);
  };

  /**
   * Mezunu ID üzerinden siler ve listeyi yeniler.
   */
  const handleDelete = async (id) => {
    if (window.confirm(t('delete_confirm'))) {
      try {
        await AlumniService.deleteAlumni(id);
        fetchAlumniData();
      } catch (error) {
        console.error("Silme hatası:", error);
      }
    }
  };

  /**
   * Mevcut listeyi analiz ederek Bar ve Pie grafik verilerini oluşturur.
   */
  const analyzeData = (data) => {
    // Yıl Analizi
    const yearCounts = {};
    data.forEach(student => {
      const year = student.graduationYear;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    const sortedYears = Object.keys(yearCounts).sort();
    setYearData(sortedYears.map(year => ({ name: year, mezunSayisi: yearCounts[year] })));

    // Sektör Analizi (Backend'den gelen sectorName'i kullanır)
    const sectorCounts = {};
    const uniqueSectors = new Set();

    data.forEach(student => {
      const sectorName = student.sectorName || t('unspecified');
      sectorCounts[sectorName] = (sectorCounts[sectorName] || 0) + 1;
      if (student.sectorName) uniqueSectors.add(sectorName);
    });

    setSectorData(Object.keys(sectorCounts).map(key => ({ name: key, value: sectorCounts[key] })));
    setSectorCount(uniqueSectors.size);
  };

  // Tema Kontrolü (Dark/Light Mode)
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
  }, [darkMode]);

  // Grafik Sayfalama Fonksiyonları
  const handlePrevYears = () => setYearPageIndex(prev => Math.max(prev - 1, 0));
  const handleNextYears = () => {
    if ((yearPageIndex + 1) * YEARS_PER_PAGE < yearData.length) {
      setYearPageIndex(prev => prev + 1);
    }
  };

  const currentYearData = yearData.slice(
    yearPageIndex * YEARS_PER_PAGE,
    (yearPageIndex + 1) * YEARS_PER_PAGE
  );

  if (!userRole) return <LoginPage onLogin={handleLogin} />;

  const uniqueYears = [...new Set(alumniList.map(a => a.graduationYear))].sort((a, b) => b - a);

  return (
    <div>
      {/* --- ÜST MENÜ (NAVBAR) --- */}
      <nav className="navbar navbar-dark bg-dark mb-4 shadow-sm px-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center">
            🎓 BAU Alumni Dashboard
            <span className="badge bg-light text-dark ms-3" style={{ fontSize: "12px" }}>
              {userRole === 'admin' ? t('admin_mode') : t('student_mode')}
            </span>
          </span>
          <div className="d-flex align-items-center gap-2">
            {/* --- DİL BUTONU--- */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
              className="btn btn-dark btn-sm fw-bold border-secondary shadow-sm"
              style={{ fontSize: '12px', minWidth: '45px', backgroundColor: '#2d3436' }}
            >
              {i18n.language === 'tr' ? 'EN' : 'TR'}
            </button>

            {/* --- DARK MODE BUTONU --- */}
            <button onClick={() => setDarkMode(!darkMode)} className="btn btn-outline-light btn-sm me-2" title={t('toggle_theme')}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* --- MEZUN EKLE --- */}
            {userRole === 'admin' && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-success btn-sm fw-bold px-3 shadow-sm"
                style={{ backgroundColor: '#27ae60', border: 'none' }}
              >
                <span className="me-1">＋</span> {t('add_alumni')}
              </button>
            )}

            {/* --- ÇIKIŞ YAP --- */}
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm fw-bold px-3"
              style={{ border: '1.5px solid #ff7675', color: '#ff7675' }}
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {loading ? (
          <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            {/* --- FİLTRELEME BÖLÜMÜ --- */}
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-body py-3">
                <div className="row g-3 align-items-center">
                  <div className="col-md-1 text-center"><span className="fs-4">🔍</span></div>
                  <div className="col-md-7">
                    <input type="text" className="form-control form-control-lg" placeholder={t('search_placeholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <select className="form-select form-select-lg" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                      <option value="">{t('all_years')}</option>
                      {uniqueYears.map(year => (<option key={year} value={year}>{year}</option>))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* --- İSTATİSTİK KARTLARI --- */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card text-white bg-primary mb-3 shadow border-0">
                  <div className="card-body text-center">
                    <h5 className="card-title">{t('total_alumni')}</h5>
                    <p className="card-text display-4 fw-bold">{filteredList.length}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card text-white bg-success mb-3 shadow border-0">
                  <div className="card-body text-center">
                    <h5 className="card-title">{t('different_sectors')}</h5>
                    <p className="card-text display-4 fw-bold">{sectorCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- GRAFİKLER --- */}
            <div className="row mb-5">
              <div className="col-md-8">
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">📅 {t('grad_year_chart')}</h5>
                    <div>
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={handlePrevYears} disabled={yearPageIndex === 0}>◀</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={handleNextYears} disabled={(yearPageIndex + 1) * YEARS_PER_PAGE >= yearData.length}>▶</button>
                    </div>
                  </div>
                  <div className="card-body" style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentYearData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="mezunSayisi" name={t('alumni_count')} fill="#8884d8" barSize={50} radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-header bg-white"><h5 className="mb-0">🏢 {t('sector_chart')}</h5></div>
                  <div className="card-body" style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
                          {sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* --- HARİTA --- */}
            <div className="mb-5"><InteractiveMap alumniList={filteredList} /></div>

            {/* --- MEZUN KARTLARI (LİSTE) --- */}
            <h4 className="mb-3 border-bottom pb-2 d-flex justify-content-between align-items-end">
              <span>{t('recent_alumni')}</span>
              <span className="text-muted small">
                {filteredList.length > 6
                  ? t('showing_last_x_of_y', { last: 6, total: filteredList.length })
                  : t('total_x_records', { count: filteredList.length })}
              </span>
            </h4>

            <div className="row justify-content-center">
              {filteredList.length > 0 ? (
                filteredList.slice(0, 6).map((alumni) => (
                  <div key={alumni.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm border-0 position-relative hover-card">
                      {userRole === 'admin' && (
                        <button onClick={() => handleDelete(alumni.id)} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 shadow-sm" style={{ zIndex: 10, borderRadius: "50%", width: "32px", height: "32px", padding: 0 }}>🗑️</button>
                      )}
                      <div className="card-body text-start">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-light rounded-circle p-2 me-3 display-6 m-0 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', margin: '0 !important' }}>👨‍🎓</div>
                          <div>
                            <h5 className="card-title fw-bold mb-0">{alumni.firstName} {alumni.lastName}</h5>
                            <p className="text-muted small mb-0">{alumni.jobTitle}</p>
                          </div>
                        </div>
                        <div className="mb-3"><span className="badge bg-secondary opacity-75">{alumni.department}</span></div>
                        <div className="bg-light p-3 rounded-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">{t('company')}:</small>
                            <span className="fw-bold text-primary">{alumni.companyName || "-"}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{t('graduation')}:</small>
                            <span className="fw-bold">{alumni.graduationYear}</span>
                          </div>
                        </div>
                        {alumni.linkedinUrl && (
                          <div className="mt-3">
                            <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm w-100 shadow-sm">{t('linkedin_profile')}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5"><h4 className="text-muted">{t('no_results')} 😔</h4></div>
              )}
            </div>

            <AddAlumniModal show={showModal} handleClose={() => setShowModal(false)} onAlumniAdded={fetchAlumniData} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;