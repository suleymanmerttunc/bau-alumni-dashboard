import React from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/WelcomePage.css';

const WelcomePage = ({ onNavigateToLogin }) => {
    const { t, i18n } = useTranslation();

    // Dil değiştirme fonksiyonu
    const toggleLanguage = () => {
        const nextLanguage = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(nextLanguage);
    };

    return (
        <div className="welcome-page-main">
            {/* 1. ÜST İNCE UTILITY BAR (image_efed07.jpg'deki yapı) */}
            <div className="utility-bar">
                <div className="container-fluid d-flex justify-content-end align-items-center gap-4 px-lg-5">
                    <a href="#directory" className="utility-link">
                        {t('welcome_alumni_directory')}
                    </a>
                    <a href="#email" className="utility-link">{t('welcome_email')} ↗</a>
                    <button onClick={onNavigateToLogin} className="utility-login-btn">
                        {t('btn_login')}
                    </button>
                    <button className="utility-search">{t('welcome_search')} 🔍</button>
                    <button className="utility-lang" onClick={toggleLanguage}>
                        {i18n.language === 'tr' ? 'ENGLISH' : 'TÜRKÇE'}
                    </button>
                </div>
            </div>

            {/* 2. ANA LOGO VE NAVİGASYON ŞERİDİ */}
            <nav className="main-navbar">
                <div className="container-fluid d-flex justify-content-between align-items-center px-lg-5">
                    <div className="brand-logo">
                        <span className="brand-bau">BAU</span>
                        <span className="brand-alumni">alumni</span>
                    </div>

                    <div className="nav-menu d-none d-xl-flex gap-4">
                        <a href="#events" className="nav-item">{t('welcome_nav_events')} ⌵</a>
                        <a href="#resources" className="nav-item">{t('welcome_nav_resources')} ⌵</a>
                        <a href="#programs" className="nav-item">{t('welcome_nav_perks')} ⌵</a>
                        <a href="#communities" className="nav-item">{t('welcome_nav_communities')} ⌵</a>
                        <a href="#volunteer" className="nav-item">{t('welcome_nav_volunteer')} ⌵</a>
                        <a href="#about" className="nav-item">{t('welcome_nav_about')} ⌵</a>
                    </div>
                </div>
            </nav>

            {/* 3. HERO SECTION (Arka plan: bau_ogrenciler_giris.jpg) */}
            <header className="hero-section-modern">
                <div className="hero-dark-overlay">
                    <div className="hero-content-box">
                        <h1 className="hero-serif-title">{t('welcome_hero_title')}</h1>
                        <p className="hero-subtitle">{t('welcome_hero_subtitle')}</p>
                        <button className="btn-hero-explore" onClick={onNavigateToLogin}>
                            {t('welcome_hero_btn')}
                        </button>
                    </div>
                </div>
            </header>

            {/* 4. STORIES SECTION (3'LÜ KART YÜZEYİ - image_f1a7be.jpg) */}
            <section className="stories-grid-section container py-5">
                <div className="text-center mb-5">
                    <h2 className="stories-section-title">{t('welcome_stories_title')}</h2>
                    <p className="stories-section-subtitle">
                        {t('welcome_stories_desc')}
                    </p>
                </div>

                <div className="row g-5">
                    {/* Kart 1 - Araştırma */}
                    <div className="col-lg-4">
                        <div className="alumni-modern-card">
                            <div className="card-image-box">
                                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600" alt="AI Research" />
                            </div>
                            <div className="card-text-content">
                                <span className="card-category-tag">{t('welcome_cat_research')}</span>
                                <h3 className="card-main-heading">{t('welcome_story1_title')}</h3>
                                <p className="card-short-desc">{t('welcome_story1_desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Kart 2 - Magazin */}
                    <div className="col-lg-4">
                        <div className="alumni-modern-card">
                            <div className="card-image-box">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600" alt="Alumni Pause" />
                            </div>
                            <div className="card-text-content">
                                <span className="card-category-tag">{t('welcome_cat_magazine')}</span>
                                <h3 className="card-main-heading">{t('welcome_story2_title')}</h3>
                                <p className="card-short-desc">{t('welcome_story2_desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Kart 3 - Kırmızı Vurgu Kartı */}
                    <div className="col-lg-4">
                        <div className="alumni-modern-card signature-red-card d-flex flex-column justify-content-end">
                            <h3 className="signature-title">{t('welcome_mag_title')}</h3>
                            <p className="signature-subtitle">{t('welcome_mag_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TRAVEL SECTION (SİYAH BANNER - image_f1a49c.jpg) */}
            <section className="travel-dark-banner">
                <div className="container text-center py-5">
                    <span className="travel-label">{t('welcome_travel_label')}</span>
                    <h2 className="travel-title">{t('welcome_travel_title')}</h2>
                    <p className="travel-text">{t('welcome_travel_desc')}</p>
                    <button className="travel-btn-outline">{t('welcome_travel_btn')}</button>
                </div>
            </section>

            {/* =========================================
         6. INSTAGRAM FEED SECTION (Stanford Big & Bold Style)
         ========================================= */}
            <section className="insta-feed-section py-5 bg-white">
                <div className="container-fluid px-lg-5">
                    <div className="text-center mb-5">
                        <h4 className="insta-feed-title">
                            {t('welcome_insta_title') || 'Follow @baunetworkclub on Instagram'}
                        </h4>
                    </div>

                    {/* Instagram Profil Özeti (Center & Bold) */}
                    <div className="insta-profile-header d-flex flex-column flex-md-row justify-content-center align-items-center mb-5 gap-4">
                        <div className="insta-logo-wrap">
                            <img src="/photos/bau_logo.jpg" alt="Logo" className="rounded-circle shadow-sm" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        </div>
                        <div className="insta-stats d-flex gap-4 small fw-bold text-muted">
                            <span><strong>80</strong> posts</span>
                            <span><strong>623</strong> followers</span>
                            <span><strong>41</strong> following</span>
                        </div>
                        <a href="https://www.instagram.com/baunetworkclub/" target="_blank" rel="noreferrer" className="btn btn-danger btn-sm px-4 fw-bold shadow-sm">Follow</a>
                    </div>

                    {/* Görsel Şeridi - image_f1a45c.jpg'deki gibi 5'li Dikeyleştirilmiş & Büyütülmüş */}
                    <div className="row g-4 justify-content-center"> {/* g-3 yerine g-4 ile boşlukları artırdık */}
                        {/* Post 1 */}
                        <div className="col-lg-2-4 col-md-4 col-12 mb-4">
                            <a href="https://www.instagram.com/p/C4p..." target="_blank" rel="noreferrer" className="insta-post-link">
                                <div className="insta-post-wrapper">
                                    <div className="insta-img-card shadow"><img src="/photos/insta_1.jpg" alt="Post 1" /></div>
                                    <div className="insta-caption mt-3">
                                        <p>BAU Global networking events started in Berlin! 🌍 #baualumni</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Post 2 */}
                        <div className="col-lg-2-4 col-md-4 col-12 mb-4">
                            <a href="https://www.instagram.com/p/C4q..." target="_blank" rel="noreferrer" className="insta-post-link">
                                <div className="insta-post-wrapper">
                                    <div className="insta-img-card shadow"><img src="/photos/insta_2.jpg" alt="Post 2" /></div>
                                    <div className="insta-caption mt-3">
                                        <p>Our graduates sharing their journey at the Tech Summit. 🚀</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Post 3 */}
                        <div className="col-lg-2-4 col-md-4 col-12 mb-4">
                            <a href="https://www.instagram.com/p/C4r..." target="_blank" rel="noreferrer" className="insta-post-link">
                                <div className="insta-post-wrapper">
                                    <div className="insta-img-card shadow"><img src="/photos/insta_3.jpg" alt="Post 3" /></div>
                                    <div className="insta-caption mt-3">
                                        <p>Throwback to last week's amazing alumni dinner. 🍽️</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Post 4 */}
                        <div className="col-lg-2-4 col-md-4 col-12 mb-4">
                            <a href="https://www.instagram.com/p/C4s..." target="_blank" rel="noreferrer" className="insta-post-link">
                                <div className="insta-post-wrapper">
                                    <div className="insta-img-card shadow"><img src="/photos/insta_4.jpg" alt="Post 4" /></div>
                                    <div className="insta-caption mt-3">
                                        <p>Volunteer projects are making a real impact in local communities. ❤️</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Post 5 */}
                        <div className="col-lg-2-4 col-md-4 col-12 mb-4">
                            <a href="https://www.instagram.com/p/C4t..." target="_blank" rel="noreferrer" className="insta-post-link">
                                <div className="insta-post-wrapper">
                                    <div className="insta-img-card shadow"><img src="/photos/insta_5.jpg" alt="Post 5" /></div>
                                    <div className="insta-caption mt-3">
                                        <p>New digital card benefits for BAUAA members are live! 💳</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
         PROFESYONEL ALUMNI FOOTER (Stanford Klonu)
         ========================================= */}
            <footer className="alumni-footer">
                <div className="footer-content-wrapper">
                    <div className="container-fluid px-lg-5">

                        {/* Logo Alanı - Birebir Stanford Font Hiyerarşisi */}
                        <div className="footer-logo-section">
                            <span className="footer-bau">BAU</span>
                            <span className="footer-alumni">|alumni</span>
                        </div>

                        <div className="row mt-5">
                            {/* Sütun 1: İletişim */}
                            <div className="col-lg-3 col-md-6 mb-4 footer-col">
                                <h6 className="footer-col-title">BAU Alumni Association</h6>
                                <p className="footer-contact-text">
                                    Yıldız, Çırağan Cd.<br />
                                    34349 Beşiktaş/İstanbul<br />
                                    <a href="https://www.google.com/maps/place/Bah%C3%A7e%C5%9Fehir+%C3%9Cniversitesi/@41.0758721,28.8870269,13z/data=!4m10!1m2!2m1!1zYmFow6dlxZ9laGlyIMO8bml2ZXJzaXRlc2k!3m6!1s0x14cab7a2a2c3b963:0x7671d1b9817b8519!8m2!3d41.042165!4d29.0092591!15sChpiYWjDp2XFn2VoaXIgw7xuaXZlcnNpdGVzaSIDiAEBkgEKdW5pdmVyc2l0eeABAA!16zL20vMGJxMWt0?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="footer-map-link">Map ↗</a>
                                </p>
                                <div className="footer-social-icons">
                                    <a href="https://www.facebook.com/BAUAlumniCenter/" target="_blank" rel="noreferrer" title="Facebook">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.linkedin.com/showcase/baualumnirelationscenter/about/" target="_blank" rel="noreferrer" title="LinkedIn">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.instagram.com/baunetworkclub/" target="_blank" rel="noreferrer" title="Instagram">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.626c-.794.297-1.473.702-2.146 1.371-.67.672-1.075 1.35-1.371 2.146-.297.77-.501 1.642-.56 2.925C.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.283.264 2.149.56 2.925.295.796.701 1.474 1.371 2.146.672.67 1.35 1.075 2.146 1.371.766.297 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.283-.059 2.149-.261 2.925-.56.796-.295 1.474-.701 2.146-1.371.67-.672 1.075-1.35 1.371-2.146.297-.766.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.059-1.283-.261-2.149-.56-2.925-.295-.796-.701-1.474-1.371-2.146-.672-.67-1.35-1.075-2.146-1.371-.766-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.070 1.171.054 1.805.244 2.227.408.56.217.96.477 1.382.896.419.42.679.822.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.645.07 4.849 0 3.203-.009 3.585-.07 4.849-.054 1.171-.244 1.805-.408 2.227-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.645.07-4.849.07-3.203 0-3.585-.009-4.849-.07-1.171-.054-1.805-.244-2.227-.408-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.645-.07-4.849 0-3.203.009-3.585.07-4.849.054-1.171.244-1.805.408-2.227.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.645-.07 4.849-.07zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.youtube.com/@baualumnicenter1762" target="_blank" rel="noreferrer" title="YouTube">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Sütun 2: Linkler */}
                            <div className="col-lg-3 col-md-6 mb-4 footer-col">
                                <ul className="footer-link-list">
                                    <li><a href="#">Get to Know BAUAA</a></li>
                                    <li><a href="#">STANFORD Magazine</a></li>
                                    <li><a href="#">Contact BAUAA</a></li>
                                    <li><a href="#">Help</a></li>
                                </ul>
                            </div>

                            {/* Sütun 3: Linkler */}
                            <div className="col-lg-3 col-md-6 mb-4 footer-col">
                                <ul className="footer-link-list">
                                    <li><a href="#">Access SAA Member Card</a></li>
                                    <li><a href="#">Check your alumni email</a></li>
                                    <li><a href="#">My Alumni Account</a></li>
                                    <li><a href="#">Give to BAU</a></li>
                                </ul>
                            </div>

                            {/* Sütun 4: Linkler */}
                            <div className="col-lg-3 col-md-6 mb-4 footer-col">
                                <ul className="footer-link-list">
                                    <li><a href="#">Accessibility</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                    <li><a href="#">Terms of Use</a></li>
                                    <li><a href="#">Code of Conduct</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Kırmızı Bar */}
                <div className="footer-red-strip">
                    <div className="container-fluid px-lg-5 d-flex justify-content-between align-items-center">
                        <div className="footer-red-brand">
                            <strong>Bahçeşehir</strong> University
                        </div>
                        <div className="footer-red-links">
                            <a href="#">BAU Home</a>
                            <a href="#">Maps & Directions</a>
                            <a href="#">Search BAU</a>
                            <a href="#">Emergency Info</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WelcomePage;