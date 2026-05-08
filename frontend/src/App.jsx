import { useEffect, useState } from 'react';
import AlumniService from './services/AlumniService';
import PostService from './services/PostService';
import api from './services/api';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import Register from './components/Register';
import InteractiveMap from './components/InteractiveMap';
import AddAlumniModal from './components/AddAlumniModal';
import AlumniManagementModal from './components/AlumniManagementModal';
import SectorDetailModal from './components/SectorDetailModal';
import TitleWordCloud from './components/TitleWordCloud';
import CareerOracleModal from './components/CareerOracleModal';
import InterviewCoachModule from './components/InterviewCoachModule';
import botData from './ai';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();

  // SCREEN & AUTH
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userRole, setUserRole] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Backend'den gelen kullanıcı verisi
  const [view, setView] = useState('login');

  // ALUMNI DATA
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [alumniList, setAlumniList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);

  // ANALYTICS
  const [yearData, setYearData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [titleCloudData, setTitleCloudData] = useState([]);
  const [sectorCount, setSectorCount] = useState(0);
  const [entrepreneurCount, setEntrepreneurCount] = useState(0);
  const [globalAlumniRate, setGlobalAlumniRate] = useState(0);
  const [selectedDept, setSelectedDept] = useState('All');
  const [topEmployers, setTopEmployers] = useState([]);
  const [yearPageIndex, setYearPageIndex] = useState(0);
  const YEARS_PER_PAGE = 5;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5733', '#C70039'];

  // FEED
  const [activeTab, setActiveTab] = useState('analysis');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', authorName: '', type: 'JOB' });

  // CHATBOT
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('start');

  // TEMA
  const [darkMode, setDarkMode] = useState(false);

  // DATA FETCHING İŞLEMLERİ
  const fetchAlumniData = async () => {
    try {
      setLoading(true);
      const response = await AlumniService.getAllAlumni();

      const alumniArray = response.content || response.data?.content || response;

      if (Array.isArray(alumniArray)) {
        const sortedData = alumniArray.sort((a, b) => b.id - a.id);
        setAlumniList(sortedData);
        analyzeData(sortedData); // Sektör ve yıl analizini tetikler
      } else {
        console.error("Beklenen liste formatı gelmedi:", response);
        setAlumniList([]);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setAlumniList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = () => {
    PostService.getAllPosts()
      .then(data => setPosts(data))
      .catch(error => console.error('Post çekme hatası:', error));
  };

  // ===== HANDLERS =====
  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setUserRole(user.role);
    setCurrentScreen('app');
    fetchAlumniData();
    fetchPosts();
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentScreen('app');
    fetchAlumniData();
    fetchPosts();
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserRole(null);
    setCurrentScreen('welcome');
    setAlumniList([]);
    setFilteredAlumni([]);
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.authorName) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    try {
      await PostService.createPost(newPost);
      setNewPost({ title: '', content: '', authorName: '', type: 'JOB' });
      fetchPosts();
    } catch (error) {
      console.error('Post oluşturma hatası:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('delete_confirm'))) {
      try {
        await AlumniService.deleteAlumni(id);
        fetchAlumniData();
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  };

  const handleDeleteAlumni = async (id) => {
    if (window.confirm(t('delete_confirm'))) {
      try {
        await AlumniService.deleteAlumni(id);
        fetchAlumniData(); // Listeyi yenile
      } catch (err) { console.error(err); }
    }
  };

  const toggleChat = () => {
    if (!isChatOpen) setCurrentStep('start');
    setIsChatOpen(!isChatOpen);
  };

  // ===== ANALYSIS =====
  const analyzeTitleCloud = (data) => {
    const counts = {};
    data.forEach(alumni => {
      // currentTitle yoksa jobTitle'ı kullan
      const title = alumni.currentTitle || alumni.jobTitle;
      if (title && title !== "Unspecified") {
        counts[title] = (counts[title] || 0) + 1;
      }
    });

    // WordCloud kütüphanesinin beklediği format { text: '...', value: 10 }
    const cloudData = Object.keys(counts).map(key => ({
      text: key,
      value: counts[key]
    })).sort((a, b) => b.value - a.value).slice(0, 30); // En popüler 30 unvan

    setTitleCloudData(cloudData);
  };

  const analyzeData = (data) => {
    const yearCounts = {};
    data.forEach(student => {
      const year = student.graduationYear;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    const sortedYears = Object.keys(yearCounts).sort();
    setYearData(sortedYears.map(year => ({ name: year, mezunSayisi: yearCounts[year] })));

    const sectorCounts = {};
    const uniqueSectors = new Set();

    data.forEach(student => {
      // SEKTÖR ANALİZİ DÜZELTMESİ:
      // Eğer sectorName null ise, jobTitle üzerinden bir tahmin yürütelim
      let sector = student.sectorName;

      if (!sector && student.jobTitle) {
        // Basit bir eşleme: Eğer unvanda "Engineer" veya "Developer" geçiyorsa IT yap
        const title = student.jobTitle.toLowerCase();
        if (title.includes('engineer') || title.includes('developer') || title.includes('software')) {
          sector = 'Information Technology';
        }
      }

      const finalSector = sector || t('unspecified');
      sectorCounts[finalSector] = (sectorCounts[finalSector] || 0) + 1;

      if (sector) {
        uniqueSectors.add(sector);
      }
    });

    setSectorData(Object.keys(sectorCounts).map(key => ({ name: key, value: sectorCounts[key] })));
    setSectorCount(uniqueSectors.size);
    analyzeTitleCloud(data);
    analyzeEcosystem(data);
  };

  const analyzeEcosystem = (data) => {
    const keywords = ['founder', 'co-founder', 'ceo', 'owner', 'entrepreneur', 'kurucu'];
    const founders = data.filter(alumni => {
      const title = (alumni.currentTitle || alumni.jobTitle || '').toLowerCase();
      return keywords.some(keyword => title.includes(keyword));
    });

    setEntrepreneurCount(founders.length);

    const international = data.filter(alumni =>
      alumni.country &&
      alumni.country.toLowerCase() !== 'turkey' &&
      alumni.country.toLowerCase() !== 'türkiye'
    );

    const rate = data.length > 0 ? ((international.length / data.length) * 100).toFixed(1) : '0.0';
    setGlobalAlumniRate(rate);
  };

  const analyzeTopEmployers = (data) => {
    const companyCounts = {};
    data.forEach(a => {
      const company = a.companyName || a.currentCompany;
      if (company && company !== 'Unspecified') {
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      }
    });

    const top5 = Object.keys(companyCounts)
      .map(name => ({ name, count: companyCounts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopEmployers(top5);
  };

  // ===== EFFECTS =====
  useEffect(() => {
    if (darkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
  }, [darkMode]);

  useEffect(() => {
    let result = alumniList;

    // 1. Departman Filtresi
    if (selectedDept !== 'All') {
      result = result.filter(a => a.department === selectedDept);
    }

    // 2. Yıl Filtresi
    if (selectedYear) {
      result = result.filter(a => a.graduationYear === parseInt(selectedYear));
    }

    // 3. Arama
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(alumni => {
        const firstName = alumni.firstName?.toLowerCase() || '';
        const lastName = alumni.lastName?.toLowerCase() || '';
        const companyName = alumni.companyName?.toLowerCase() || '';
        const jobTitle = alumni.jobTitle?.toLowerCase() || '';

        return (
          firstName.includes(lowerTerm) ||
          lastName.includes(lowerTerm) ||
          companyName.includes(lowerTerm) ||
          jobTitle.includes(lowerTerm)
        );
      });
    }

    setFilteredAlumni(result);

    // Filtrelenmiş liste değiştikçe tüm analizleri yeniden çalıştır
    analyzeData(result);
    analyzeTopEmployers(result);
  }, [selectedDept, selectedYear, searchTerm, alumniList]);

  // ===== PAGINATION =====
  const handlePrevYears = () => setYearPageIndex(prev => Math.max(prev - 1, 0));
  const handleNextYears = () => {
    const maxPages = Math.ceil(yearData.length / YEARS_PER_PAGE);
    setYearPageIndex(prev => Math.min(prev + 1, maxPages - 1));
  };

  const paginatedYears = yearData.slice(yearPageIndex * YEARS_PER_PAGE, (yearPageIndex + 1) * YEARS_PER_PAGE);
  const uniqueYears = [...new Set(alumniList.map(a => a.graduationYear))].sort((a, b) => b - a);
  const departments = ['All', ...new Set(alumniList.map(a => a.department))].filter(Boolean);
  const allDepartments = [...new Set(alumniList.map(a => a.department))].filter(Boolean);

  // ===== RENDER =====
  return (
    <div>
      {/* WELCOME SCREEN */}
      {currentScreen === 'welcome' && (
        <WelcomePage onNavigateToLogin={() => setCurrentScreen('login')} />
      )}

      {/* LOGIN & REGISTER SCREEN */}
      {currentScreen === 'login' && (
        <>
          {view === 'login' && (
            <LoginPage
              onLogin={handleLoginSuccess}
              onNavigateToRegister={() => setView('register')}
            />
          )}

          {view === 'register' && (
            <Register
              onNavigateToLogin={() => setView('login')}
            />
          )}
        </>
      )}

      {/* DASHBOARD SCREEN */}
      {currentScreen === 'app' && (
        <>
          {/* NAVBAR */}
          <nav className="navbar navbar-dark bg-dark shadow-sm px-4">
            <div className="container-fluid d-flex justify-content-between align-items-center">
              <span className="navbar-brand mb-0 h1 d-flex align-items-center">
                🎓 BAU Alumni Dashboard
                <span className="badge bg-light text-dark ms-3" style={{ fontSize: '12px' }}>
                  {userRole === 'ROLE_ADMIN' ? t('admin_mode') : t('student_mode')}
                </span>
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                  className="btn btn-dark btn-sm fw-bold border-secondary shadow-sm"
                  style={{ fontSize: '12px', height: '38px', minWidth: '45px', backgroundColor: '#2d3436' }}
                >
                  {i18n.language === 'tr' ? 'EN' : 'TR'}
                </button>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="btn btn-outline-light btn-sm me-2"
                  style={{ height: '38px' }}
                  title={t('toggle_theme')}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>

                {userRole === 'ROLE_ADMIN' && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-success btn-sm fw-bold px-3 shadow-sm"
                    style={{ height: '38px', backgroundColor: '#27ae60', border: 'none' }}
                  >
                    <span className="me-1">＋</span> {t('add_alumni')}
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm fw-bold px-3"
                  style={{ height: '38px', border: '1.5px solid #ff7675', color: '#ff7675' }}
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          </nav>

          {/* QUICK STATS */}
          <div className="bg-light border-bottom py-3 shadow-sm mb-4">
            <div className="container">
              <div className="row text-center g-3">
                <div className="col-md-4 border-end border-md-2">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">{t('global_reach')}</span>
                  <div className="fw-bold text-primary h5 mb-0">
                    🌍 {new Set(alumniList.map(a => a.country)).size} {t('countries')}
                  </div>
                </div>
                <div className="col-md-4 border-end border-md-2">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">{t('active_opportunities')}</span>
                  <div className="fw-bold text-primary h5 mb-0">
                    💼 {posts.filter(p => p.type === 'JOB').length} {t('job_openings')}
                  </div>
                </div>
                <div className="col-md-4">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">{t('alumni_network')}</span>
                  <div className="fw-bold text-primary h5 mb-0">
                    👥 {alumniList.length} {t('active_members')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="container mb-4">
            <div className="d-flex justify-content-center border-bottom">
              <button
                className={`btn btn-lg px-5 fw-bold ${activeTab === 'analysis' ? 'border-primary border-bottom border-4 text-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('analysis')}
                style={{ borderRadius: 0 }}
              >
                📊 {t('analysis_panel')}
              </button>
              <button
                className={`btn btn-lg px-5 fw-bold ${activeTab === 'feed' ? 'border-primary border-bottom border-4 text-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('feed')}
                style={{ borderRadius: 0 }}
              >
                📱 {t('alumni_feed')}
              </button>
              <button
                className={`btn btn-lg px-5 fw-bold ${activeTab === 'interview' ? 'border-warning border-bottom border-4 text-warning' : 'text-muted'}`}
                onClick={() => setActiveTab('interview')}
                style={{ borderRadius: 0 }}
              >
                🤖 {t('interview_tab')}
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="container pb-5">
            {loading ? (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <>
                {/* ANALYSIS TAB */}
                {activeTab === 'analysis' && (
                  <div>
                    {/* SEARCH & FILTER */}
                    <div className="card shadow-sm mb-4 border-0">
                      <div className="card-body py-3">
                        <div className="filter-section d-flex gap-3 mb-4">
                          <div className="search-box flex-grow-1">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t('search_placeholder')}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>

                          <select
                            className="form-select w-auto"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                          >
                            <option value="All">{t('all_departments')}</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>

                          <select
                            className="form-select w-auto"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                          >
                            <option value="">{t('all_years')}</option>
                            {uniqueYears.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* STATS CARDS */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="card text-white bg-primary mb-3 shadow border-0">
                          <div className="card-body text-center">
                            <h5 className="card-title">{t('total_alumni')}</h5>
                            <p className="card-text display-4 fw-bold">{filteredAlumni.length}</p>
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

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="card shadow-sm border-0 rounded-4 bg-gradient-primary text-white p-4 h-100"
                          style={{ background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="opacity-75 fw-bold">{t('entrepreneurship_ecosystem')}</h6>
                              <h3 className="fw-bold mb-0">{entrepreneurCount} {t('founder_label')}</h3>
                              <small className="opacity-75">{t('entrepreneur_description')}</small>
                            </div>
                            <div className="fs-1 opacity-25">🏢</div>
                          </div>
                          <div className="mt-3 progress" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <div className="progress-bar bg-white" style={{ width: `${filteredAlumni.length > 0 ? (entrepreneurCount / filteredAlumni.length) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card shadow-sm border-0 rounded-4 p-4 h-100"
                          style={{ background: 'linear-gradient(135deg, #00cec9 0%, #81ecec 100%)', color: '#2d3436' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="opacity-75 fw-bold text-dark">{t('global_mobility')}</h6>
                              <h3 className="fw-bold mb-0">%{globalAlumniRate}</h3>
                              <small className="text-muted">{t('global_mobility_desc')}</small>
                            </div>
                            <div className="fs-1 opacity-25">✈️</div>
                          </div>
                          <div className="mt-3 progress" style={{ height: '4px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                            <div className="progress-bar bg-dark" style={{ width: `${globalAlumniRate}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Simülatör Tetikleyici Alanı */}
                    <div className="row mb-4 justify-content-center">
                      <div className="col-12 px-6"> {/* col-12 tam genişlik sağlar */}
                        <div
                          className="ai-simulator-card d-flex align-items-center justify-content-between p-4 rounded-4 shadow-sm"
                          onClick={() => setShowCareerModal(true)}
                          style={{ cursor: 'pointer', background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #38bdf8' }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="ai-icon-circle me-3">🔮</div>
                            <div>
                              <h5 className="text-white fw-bold mb-1">{t('career_simulator_title')}</h5>
                              <p className="text-info small mb-0 opacity-75">{t('career_simulator_desc', { count: alumniList.length })}</p>
                            </div>
                          </div>
                          <button className="btn btn-info rounded-pill px-4 fw-bold">
                            {t('career_simulator_button')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CHARTS */}
                    <div className="row mb-5">
                      <div className="col-md-8 mb-4 mb-md-0">
                        <div className="card shadow-sm h-100 border-0">
                          <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">📅 {t('grad_year_chart')}</h5>
                            <div>
                              <button className="btn btn-sm btn-outline-secondary me-1" onClick={handlePrevYears} disabled={yearPageIndex === 0}>◀</button>
                              <button className="btn btn-sm btn-outline-secondary" onClick={handleNextYears} disabled={(yearPageIndex + 1) * YEARS_PER_PAGE >= yearData.length}>▶</button>
                            </div>
                          </div>
                          <div className="card-body" style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={paginatedYears}>
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
                          <div className="card-body" style={{ height: 'auto', paddingBottom: '0' }}>
                            <div className="sector-chart-wrapper text-center">
                              <ResponsiveContainer width="100%" height={250}>
                                <PieChart onClick={() => setShowSectorModal(true)} style={{ cursor: 'pointer' }}>
                                  <Pie data={sectorData} innerRadius={60} outerRadius={80} dataKey="value">
                                    {sectorData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>

                              {/* EN ÇOK 3 SEKTÖR ÖZETİ */}
                              <div className="mt-3 px-3">
                                {sectorData.length > 0 && sectorData.sort((a, b) => b.value - a.value).slice(0, 3).map((s, i) => (
                                  <div key={i} className="d-flex justify-content-between small mb-2 border-bottom pb-1">
                                    <span className="fw-bold text-secondary">
                                      <span style={{ color: COLORS[i % COLORS.length], marginRight: '5px' }}>●</span> {s.name}
                                    </span>
                                    <span className="badge bg-light text-dark border">{s.value} {t('alumni_count')}</span>
                                  </div>
                                ))}
                                <button
                                  className="btn btn-link btn-sm text-primary fw-bold mt-2 p-0"
                                  onClick={() => setShowSectorModal(true)}
                                >
                                  {t('view_all_details')} →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* UNVAN BULUTU */}
                    <div className="mb-5">
                      <TitleWordCloud data={titleCloudData} />
                    </div>

                    {/* MAP */}
                    <div className="mb-5 shadow-sm rounded-4 overflow-hidden">
                      <InteractiveMap
                        alumniList={filteredAlumni}
                        isAdmin={userRole === 'ROLE_ADMIN'}
                      />
                    </div>

                    {/* EMPLOYER INSIGHTS */}
                    <div className="mb-5">
                      <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
                        <div className="card-body p-4 text-start">
                          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                            <div>
                              <h5 className="fw-bold mb-1">{t('top_employers_title')}</h5>
                              <p className="text-muted small">{t('top_employers_desc')}</p>
                            </div>
                          </div>

                          <div className="employer-list">
                            {topEmployers.length > 0 ? topEmployers.map((emp, index) => (
                              <div key={index} className="d-flex align-items-center mb-3 p-2 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="me-3 d-flex align-items-center justify-content-center fw-bold"
                                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: index === 0 ? '#ffd70033' : '#ffffff', color: index === 0 ? '#b8860b' : '#6c757d', fontSize: '14px' }}>
                                  #{index + 1}
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-1 fw-bold" style={{ fontSize: '0.95rem' }}>{emp.name}</h6>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div
                                      className="progress-bar bg-primary opacity-75"
                                      style={{ width: `${((emp.count) / (topEmployers[0]?.count || 1)) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="ms-3 text-end">
                                  <span className="badge bg-primary rounded-pill">{emp.count} Mezun</span>
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-4">
                                <span className="text-muted small">{t('top_employers_no_data')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ALUMNI CARDS */}
                    <h4 className="mb-3 border-bottom pb-2 d-flex justify-content-between align-items-end">
                      <span>{t('recent_alumni')}</span>
                      <span className="text-muted small">
                        {filteredAlumni.length > 6
                          ? t('showing_last_x_of_y', { last: 6, total: filteredAlumni.length })
                          : t('total_x_records', { count: filteredAlumni.length })}
                      </span>
                    </h4>

                    <div className="row g-4">
                      {filteredAlumni.length > 0 ? (
                        filteredAlumni.slice(0, 6).map((alumni) => (
                          <div key={alumni.id} className="col-lg-4 col-md-6">
                            <div className="card h-100 shadow-sm border-0 position-relative hover-card">
                              {userRole === 'ROLE_ADMIN' && (
                                <button
                                  onClick={() => handleDelete(alumni.id)}
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 shadow-sm"
                                  style={{ zIndex: 10, borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                                >
                                  🗑️
                                </button>
                              )}
                              <div className="card-body text-start">
                                <div className="d-flex align-items-center mb-3">
                                  <div
                                    className="bg-light rounded-circle p-2 me-3 display-6 d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}
                                  >
                                    👨‍🎓
                                  </div>
                                  <div>
                                    <h5 className="card-title fw-bold mb-0">
                                      {alumni.firstName} {alumni.lastName}
                                    </h5>
                                    <p className="text-muted small mb-0">{alumni.jobTitle}</p>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <span className="badge bg-secondary opacity-75">{alumni.department}</span>
                                </div>
                                <div className="bg-light p-3 rounded-3">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="text-muted">{t('company')}:</small>
                                    <span className="fw-bold text-primary">{alumni.companyName || '-'}</span>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">{t('graduation')}:</small>
                                    <span className="fw-bold">{alumni.graduationYear}</span>
                                  </div>
                                </div>
                                {alumni.linkedinUrl && (
                                  <div className="mt-3">
                                    <a
                                      href={alumni.linkedinUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-primary btn-sm w-100 shadow-sm"
                                    >
                                      {t('linkedin_profile')}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h4 className="text-muted">{t('no_results')} 😔</h4>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* FEED TAB */}
                {activeTab === 'feed' && (
                  <div>
                    <div className="row justify-content-center g-0">
                      <div className="col-lg-8 col-md-10 col-12 px-2 text-start">
                        {/* ADMIN POST FORM */}
                        {userRole === 'ROLE_ADMIN' && (
                          <div className="card shadow-sm border-0 rounded-4 mb-5 p-4 bg-white border-bottom border-primary border-5">
                            <h5 className="fw-bold mb-3 text-primary">📢 {t('create_new_post')}</h5>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label small fw-bold">{t('post_title')}</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={newPost.title}
                                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label small fw-bold">{t('post_type')}</label>
                                <select
                                  className="form-select"
                                  value={newPost.type}
                                  onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                                >
                                  <option value="JOB">💼 {t('post_type_job')}</option>
                                  <option value="EVENT">📅 {t('post_type_event')}</option>
                                  <option value="SUCCESS">🏆 {t('post_type_success')}</option>
                                </select>
                              </div>
                              <div className="col-md-3">
                                <label className="form-label small fw-bold">{t('author_name')}</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={newPost.authorName}
                                  onChange={(e) => setNewPost({ ...newPost, authorName: e.target.value })}
                                />
                              </div>
                              <div className="col-12">
                                <label className="form-label small fw-bold">{t('post_content')}</label>
                                <textarea
                                  className="form-control"
                                  rows="3"
                                  value={newPost.content}
                                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                />
                              </div>
                              <div className="col-12 text-end">
                                <button
                                  className="btn btn-primary fw-bold px-5 py-2 shadow-sm"
                                  onClick={handleCreatePost}
                                >
                                  🚀 {t('publish')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* POSTS LIST */}
                        {posts.length > 0 ? (
                          posts.map(post => (
                            <div
                              key={post.id}
                              className="card shadow-sm mb-4 border-0 rounded-4 overflow-hidden border-start border-5"
                              style={{
                                borderLeftColor: post.type === 'JOB' ? '#0dcaf0' : (post.type === 'EVENT' ? '#12e94f' : '#FFD700'),
                                backgroundColor: post.type === 'SUCCESS' ? '#fffdf2' : '#fff'
                              }}
                            >
                              <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                                      style={{
                                        width: '50px',
                                        height: '50px',
                                        fontSize: '22px',
                                        backgroundColor: post.type === 'JOB' ? '#0dcaf0' : (post.type === 'EVENT' ? '#12e94f' : '#FFD700')
                                      }}
                                    >
                                      {post.type === 'JOB' ? '💼' : (post.type === 'EVENT' ? '📅' : '🏆')}
                                    </div>
                                    <div>
                                      <h6 className="mb-0 fw-bold text-dark">{post.authorName}</h6>
                                      <small className="text-muted" style={{ fontSize: '11px' }}>
                                        {new Date(post.createdAt).toLocaleString(i18n.language)}
                                      </small>
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center gap-2">
                                    <span
                                      className={`badge px-3 py-2 rounded-pill fw-bold ${post.type === 'JOB' ? 'bg-info text-white' : 'text-dark'}`}
                                      style={
                                        post.type === 'EVENT' ? { backgroundColor: '#12e94f' } :
                                          post.type === 'SUCCESS' ? { backgroundColor: '#FFD700' } :
                                            {}
                                      }
                                    >
                                      {post.type === 'JOB' ? t('post_type_job') :
                                        (post.type === 'EVENT' ? t('post_type_event') : t('post_type_success'))}
                                    </span>

                                    {userRole === 'ROLE_ADMIN' && (
                                      <button
                                        className="btn btn-outline-danger btn-sm rounded-circle border-0 shadow-sm d-flex align-items-center justify-content-center"
                                        onClick={() => handleDeletePost(post.id)}
                                        style={{ width: '32px', height: '32px' }}
                                      >
                                        🗑️
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="ps-1">
                                  <h5 className="fw-bold mb-2 text-dark">{post.title}</h5>
                                  <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                    {post.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
                            <h5 className="text-muted">{t('no_posts_yet')}</h5>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERVIEW COACH TAB */}
                {activeTab === 'interview' && (
                  <div className="content-body animate__animated animate__fadeIn">
                    <div className="interview-card-container">
                      <InterviewCoachModule />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SECTOR DETAIL MODAL */}
          <SectorDetailModal
            show={showSectorModal}
            onHide={() => setShowSectorModal(false)}
            data={sectorData}
            colors={COLORS}
          />

          {/* CHATBOT */}
          <div className="chatbot-wrapper" style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 2000 }}>
            <button
              onClick={toggleChat}
              className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center border-0"
              style={{ width: '65px', height: '65px', fontSize: '28px' }}
            >
              {isChatOpen ? '✖' : '🤖'}
            </button>

            {isChatOpen && (
              <div
                className="card shadow-lg border-0 rounded-4 animate-bottom"
                style={{
                  position: 'absolute',
                  bottom: '85px',
                  right: '0',
                  width: '330px',
                  maxHeight: '500px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="card-header bg-primary text-white fw-bold p-3 rounded-top-4 d-flex justify-content-between">
                  <span>{t('bot_title')}</span>
                  <small className="opacity-75">v1.0</small>
                </div>

                <div className="card-body p-3 overflow-auto text-start" style={{ backgroundColor: '#f9f9f9', minHeight: '300px' }}>
                  <div className="bot-bubble bg-white p-3 rounded-3 shadow-sm mb-4 border-start border-primary border-4">
                    <p className="small mb-0 fw-medium" style={{ whiteSpace: 'pre-wrap' }}>
                      {(botData[i18n.language]?.[currentStep]?.message) || (botData['tr']?.[currentStep]?.message)}
                    </p>
                  </div>

                  <div className="d-grid gap-2">
                    {((botData[i18n.language]?.[currentStep]?.options) || (botData['tr']?.[currentStep]?.options)).map((opt, index) => (
                      <button
                        key={index}
                        className="btn btn-sm text-start fw-bold py-2 px-3 shadow-sm"
                        style={{
                          backgroundColor: '#fff',
                          border: '1px solid #0088FE',
                          color: '#0088FE',
                          borderRadius: '8px'
                        }}
                        onClick={() => setCurrentStep(opt.nextStep)}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card-footer bg-white py-2 text-center">
                  <small className="text-muted" style={{ fontSize: '10px' }}>
                    {t('bot_footer')}
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* MODAL */}
          <AddAlumniModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            onAlumniAdded={fetchAlumniData}
          />

          <AlumniManagementModal
            show={showAdminModal}
            onHide={() => setShowAdminModal(false)}
            alumniList={alumniList}
            onDelete={handleDeleteAlumni}
          />

          <CareerOracleModal
            show={showCareerModal}
            onHide={() => setShowCareerModal(false)}
            departments={allDepartments}
            topEmployers={topEmployers}
            titleCloudData={titleCloudData}
          />

        </>
      )}
    </div>
  );
}
export default App;
