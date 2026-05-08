import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import bauLogo from '../assets/bau-logo.jpg';
import bauBackground from '../assets/bau-background.png';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const LoginPage = ({ onLogin, onNavigateToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation();

    /**
     * Statik Giriş Mantığı: 
     * Backend'deki karmaşık auth yapısını bypass ederek projenin ana fonksiyonlarına (Map/AI) 
     * hızlı erişim sağlar.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // STATİK KONTROL: Proje sunumu için belirlenen admin ve öğrenci girişleri
        if (username === 'admin' && password === '123') {
            const loggedInUser = {
                username: 'admin',
                role: 'ROLE_ADMIN',
                firstName: 'Süleyman Mert',
                lastName: 'Tunç'
            };
            console.log("Giriş Başarılı (Statik):", loggedInUser);
            onLogin(loggedInUser);
        } else if (username === 'student' && password === '123') {
            const loggedInUser = {
                username: 'student',
                role: 'ROLE_STUDENT',
                firstName: 'Öğrenci',
                lastName: 'Kullanıcı'
            };
            console.log("Giriş Başarılı (Statik):", loggedInUser);
            onLogin(loggedInUser);
        } else {
            // İleride tekrar DB tabanlı login'e geçmek istersen axios bloğu burada hazır bekliyor
            /*
            try {
                const response = await axios.post('http://localhost:8080/api/auth/login', {
                    username: username,
                    password: password
                });
                onLogin(response.data);
            } catch (err) {
                setError(t('login_error_msg') || 'Giriş başarısız! Bilgilerinizi kontrol edin.');
            }
            */
            setError('Kullanıcı adı veya şifre hatalı! (admin / 123 veya student / 123)');
        }
    };

    const toggleLanguage = () => {
        const nextLanguage = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(nextLanguage);
    };

    return (
        <div className="container-fluid p-0 overflow-hidden vh-100">
            <div className="row g-0 h-100">
                
                {/* SOL TARAF: Login Formu */}
                <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center bg-white px-5 shadow-lg position-relative" style={{ zIndex: 2 }}>
                    
                    <div style={{ maxWidth: '380px', width: '100%' }}>
                        <div className="text-center mb-5">
                            <img src={bauLogo} alt="BAU Logo" className="mb-4" style={{ width: '100px' }} />
                            <h2 className="fw-bold text-dark mb-2">{t('login_title')}</h2>
                            <p className="text-muted small">{t('login_subtitle')}</p>
                        </div>

                        {error && <div className="alert alert-danger text-center p-2 small mb-4" style={{borderRadius:'8px'}}>{error}</div>}

                        <form onSubmit={handleLogin}>
                            <div className="mb-3 text-start">
                                <label className="form-label text-muted fw-bold mb-1" style={{ fontSize: '11px' }}>
                                    {t('label_user')}
                                </label>
                                <input
                                    type="text"
                                    className="form-control bg-light border-0 py-2 shadow-sm"
                                    placeholder={t('admin_or_student')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                    required
                                />
                            </div>

                            <div className="mb-4 text-start position-relative">
                                <label className="form-label text-muted fw-bold mb-1" style={{ fontSize: '11px' }}>
                                    {t('label_pass')}
                                </label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control bg-light border-0 py-2 shadow-sm"
                                        placeholder="••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderRadius: '8px', paddingRight: '45px' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent me-2 d-flex align-items-center"
                                        style={{ cursor: 'pointer', outline: 'none', color: '#6c757d' }}
                                    >
                                        {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn w-100 py-2 fw-bold text-white shadow-sm border-0 mt-2 d-flex justify-content-between align-items-center px-4"
                                style={{ backgroundColor: '#007bff', borderRadius: '8px' }}
                            >
                                <span>{t('btn_login')}</span>
                                <span>→</span>
                            </button>
                        </form>

                        <div className="form-footer d-flex justify-content-between align-items-center mt-4">
                            <button
                                className="btn btn-link text-decoration-none text-muted fw-bold p-0"
                                style={{ fontSize: '12px', letterSpacing: '1px' }}
                                onClick={() => alert("Admin paneli üzerinden şifre sıfırlama talebi oluşturabilirsiniz.")}
                            >
                                {t('forgot_pass')}
                            </button>

                            <button
                                className="btn btn-link text-decoration-none text-primary fw-bold p-0"
                                style={{ fontSize: '12px', letterSpacing: '1px' }}
                                onClick={onNavigateToRegister}
                            >
                                {t('btn_register')}
                            </button>
                        </div>
                    </div>

                    {/* DİL DEĞİŞTİRME */}
                    <div className="position-absolute" style={{ bottom: '30px' }}>
                        <span 
                            onClick={toggleLanguage} 
                            style={{ 
                                cursor: 'pointer', 
                                fontSize: '13px', 
                                letterSpacing: '2px', 
                                color: '#6c757d', 
                                fontWeight: '600' 
                            }}
                            className="text-uppercase"
                        >
                            {t('lang_switch')}
                        </span>
                    </div>
                </div>

                {/* SAĞ TARAF: Görsel Alanı */}
                <div
                    className="col-lg-6 d-none d-lg-block position-relative"
                    style={{
                        backgroundImage: `url(${bauBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center bottom',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '25%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;