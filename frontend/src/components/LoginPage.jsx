import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- GEÇİCİ LOGİN MANTIĞI ---
        // Gerçek projede burası Backend'e sorulur.
        // Şimdilik simülasyon yapıyoruz:
        
        if (username === 'admin' && password === '123') {
            onLogin('admin'); // Yönetici olarak giriş yap
        } else if (username === 'ogrenci' && password === '123') {
            onLogin('student'); // Öğrenci olarak giriş yap
        } else {
            setError('Hatalı kullanıcı adı veya şifre!');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4 border-0" style={{ width: '400px', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <span className="display-1">🎓</span>
                    <h3 className="fw-bold mt-2">BAU Alumni</h3>
                    <p className="text-muted">Giriş Yap</p>
                </div>

                {error && <div className="alert alert-danger text-center p-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">KULLANICI ADI</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="admin veya ogrenci"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold">ŞİFRE</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{ borderRadius: '10px' }}>
                        GİRİŞ YAP
                    </button>
                </form>
                
                <div className="text-center mt-3">
                    <small className="text-muted">
                        Yönetici: <b>admin / 123</b> <br/>
                        Öğrenci: <b>ogrenci / 123</b>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;