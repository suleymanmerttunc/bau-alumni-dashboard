import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AlumniService from './services/AlumniService';
import PostService from './services/PostService';
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
import PendingApprovalsModal from './components/PendingApprovalsModal';
import botData from './ai';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();

  // SCREEN & AUTH
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userRole, setUserRole] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Backend'den gelen kullanıcı verisi
  const [view, setView] = useState('login'); // 'login' veya 'register'

  // ALUMNI DATA
  const [showModal, setShowModal] = useState(false);
  const [alumniList, setAlumniList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);

  // ANALYTICS
  const [yearData, setYearData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [sectorCount, setSectorCount] = useState(0);
  const [yearPageIndex, setYearPageIndex] = useState(0);
  const YEARS_PER_PAGE = 5;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5733', '#C70039'];

  // FEED
  const [activeTab, setActiveTab] = useState('analysis');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', authorName: '', type: 'JOB' });

  // ADMIN ONAY/RED İŞLEMLERİ
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]); // Bu liste Backend'den gelecek

  // CHATBOT
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('start');

  // TEMA
  const [darkMode, setDarkMode] = useState(false);

  // DATA FETCHING İŞLEMLERİ
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
        console.error('Veri çekme hatası:', error);
        setLoading(false);
      });
  };

  const fetchPosts = () => {
    PostService.getAllPosts()
      .then(data => setPosts(data))
      .catch(error => console.error('Post çekme hatası:', error));
  };

  // BEKLEYEN KULLANICILARI BACKEND'DEN ÇEK
  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/pending-users');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Bekleyen kullanıcılar çekilemedi:', error);
    }
  };

  useEffect(() => {
    if (userRole === 'ROLE_ADMIN') {
      fetchPendingUsers();
    }
  }, [userRole]);

  // ===== HANDLERS =====
  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setUserRole(user.role); // 'ROLE_ADMIN' veya 'ROLE_USER' gelir burda
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
    setFilteredList([]);
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

  const handleDeletePost = async (id) => {
    if (window.confirm(t('delete_confirm'))) {
      try {
        await PostService.deletePost(id);
        fetchPosts();
      } catch (error) {
        console.error('Post silme hatası:', error);
      }
    }
  };

  // ADMIN ONAY/RED İŞLEMLERİ
  const handleApprove = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/approve/${userId}`);

      // Listeyi günceleme (onaylınanı listeden çıkar)
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));

      Swal.fire({
        title: 'Onaylandı!',
        text: 'Kullanıcı artık sisteme giriş yapabilir.',
        icon: 'success',
        confirmButtonColor: '#0d6efd'
      });
    } catch (error) {
      console.error('Onaylama hatası:', error);
      Swal.fire('Hata!', 'İşlem tamamlanamadı.', 'error');
    }
  };

  const handleReject = async (userId) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu başvuruyu reddetmek üzerine siniz!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Evet, Reddet!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:8080/api/admin/reject/${userId}`);
        setPendingUsers(pendingUsers.filter(u => u.id !== userId));

        Swal.fire('Reddedildi', 'Başvuru başarıyla reddedildi.', 'success');
      } catch (error) {
        console.error('Reddetme hatası:', error);
        Swal.fire('Hata!', 'İşlem sırasında bir sorun oluştu.', 'error');
      }
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

  const toggleChat = () => {
    if (!isChatOpen) setCurrentStep('start');
    setIsChatOpen(!isChatOpen);
  };

  // ===== ANALYSIS =====
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
      const sectorName = student.sectorName || t('unspecified');
      sectorCounts[sectorName] = (sectorCounts[sectorName] || 0) + 1;
      if (student.sectorName) uniqueSectors.add(sectorName);
    });

    setSectorData(Object.keys(sectorCounts).map(key => ({ name: key, value: sectorCounts[key] })));
    setSectorCount(uniqueSectors.size);
  };

  // ===== EFFECTS =====
  useEffect(() => {
    if (darkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
  }, [darkMode]);

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
  }, [searchTerm, selectedYear, alumniList, t]);

  // ===== PAGINATION =====
  const handlePrevYears = () => setYearPageIndex(prev => Math.max(prev - 1, 0));
  const handleNextYears = () => {
    const maxPages = Math.ceil(yearData.length / YEARS_PER_PAGE);
    setYearPageIndex(prev => Math.min(prev + 1, maxPages - 1));
  };

  const paginatedYears = yearData.slice(yearPageIndex * YEARS_PER_PAGE, (yearPageIndex + 1) * YEARS_PER_PAGE);
  const uniqueYears = [...new Set(alumniList.map(a => a.graduationYear))].sort((a, b) => b - a);

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
                {/* ONAY BEKLEYENLER BİLDİRİM ÇANI */}
                {userRole === 'ROLE_ADMIN' && (
                  <div
                    className="admin-notification-bell"
                    onClick={() => setShowPendingModal(true)}
                    style={{ cursor: 'pointer', position: 'relative', fontSize: '20px' }}
                    title="Onay Bekleyen Başvurular"
                  >
                    🔔
                    {pendingUsers.length > 0 && (
                      <span
                        className="badge bg-danger rounded-pill"
                        style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '10px' }}
                      >
                        {pendingUsers.length}
                      </span>
                    )}
                  </div>
                )}

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
                        <div className="row g-3 align-items-center">
                          <div className="col-md-1 text-center"><span className="fs-4">🔍</span></div>
                          <div className="col-md-7">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t('search_placeholder')}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <select
                              className="form-select"
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
                    </div>

                    {/* STATS CARDS */}
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
                          <div className="card-body" style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
                                  {sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MAP */}
                    <div className="mb-5 shadow-sm rounded-4 overflow-hidden">
                      <InteractiveMap
                        alumniList={filteredList}
                        isAdmin={userRole === 'ROLE_ADMIN'}
                        pendingCount={pendingUsers.length}
                        onNotificationClick={() => setShowPendingModal(true)}
                      />
                    </div>

                    {/* ALUMNI CARDS */}
                    <h4 className="mb-3 border-bottom pb-2 d-flex justify-content-between align-items-end">
                      <span>{t('recent_alumni')}</span>
                      <span className="text-muted small">
                        {filteredList.length > 6
                          ? t('showing_last_x_of_y', { last: 6, total: filteredList.length })
                          : t('total_x_records', { count: filteredList.length })}
                      </span>
                    </h4>

                    <div className="row g-4">
                      {filteredList.length > 0 ? (
                        filteredList.slice(0, 6).map((alumni) => (
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
              </>
            )}
          </div>

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

          {/* PENDING APPROVALS MODAL */}
          <PendingApprovalsModal
            show={showPendingModal}
            onHide={() => setShowPendingModal(false)}
            pendingUsers={pendingUsers}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </>
      )}
    </div>
  );
}

export default App;
