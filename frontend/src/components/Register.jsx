import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    studentId: '',
    firstName: '',
    lastName: '',
    department: '',
    city: '',
    country: '',
    jobTitle: '',
    graduationYear: '',
    linkedinUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', formData);
      Swal.fire('Başarılı!', response.data || 'Kayıt başarıyla tamamlandı. Onay süreciniz başlamıştır.', 'success');
      onNavigateToLogin();
    } catch (error) {
      Swal.fire('Hata!', error.response?.data || 'Kayıt başarısız', 'error');
    }
  };

  return (
    <div className="register-container p-4" style={{ maxWidth: '900px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white p-4 rounded-top-4">
          <h2 className="mb-0 fw-bold">🎓 Mezun Ağına Katıl</h2>
          <small className="text-light">Tüm alanları doldurunuz. Admin tarafından incelenecektir.</small>
        </div>
        <div className="card-body p-5">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* KİŞİSEL BİLGİLER */}
            <div className="col-12 mb-3">
              <h5 className="text-primary fw-bold border-bottom pb-2">👤 Kişisel Bilgiler</h5>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Ad</label>
              <input type="text" name="firstName" className="form-control" onChange={handleChange} required placeholder="Örn: Mert" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Soyad</label>
              <input type="text" name="lastName" className="form-control" onChange={handleChange} required placeholder="Örn: Tunç" />
            </div>

            {/* AKADEMİK VE GİRİŞ BİLGİLERİ */}
            <div className="col-12 mb-3 mt-4">
              <h5 className="text-primary fw-bold border-bottom pb-2">🎯 Akademik & Giriş Bilgileri</h5>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Öğrenci No</label>
              <input type="text" name="studentId" className="form-control" onChange={handleChange} required placeholder="Örn: 20190105" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Kullanıcı Adı</label>
              <input type="text" name="username" className="form-control" onChange={handleChange} required placeholder="Örn: merttunc" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Şifre</label>
              <input type="password" name="password" className="form-control" onChange={handleChange} required placeholder="••••••" />
            </div>

            {/* MAİL */}
            <div className="col-12">
              <label className="form-label fw-bold">Üniversite Mail</label>
              <input type="email" name="email" className="form-control" onChange={handleChange} required placeholder="ad.soyad@bahcesehir.edu.tr" />
            </div>

            {/* LOKASYON VE İŞ */}
            <div className="col-12 mb-3 mt-4">
              <h5 className="text-primary fw-bold border-bottom pb-2">📍 Lokasyon & İş Bilgileri</h5>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Şehir</label>
              <input type="text" name="city" placeholder="Örn: Istanbul" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Ülke</label>
              <input type="text" name="country" placeholder="Örn: Turkey" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Bölüm</label>
              <input type="text" name="department" placeholder="Örn: Bilgisayar Mühendisliği" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Mezuniyet Yılı</label>
              <input type="number" name="graduationYear" className="form-control" onChange={handleChange} placeholder="Örn: 2022" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Ünvan</label>
              <input type="text" name="jobTitle" placeholder="Örn: Yazılım Mühendisi" className="form-control" onChange={handleChange} />
            </div>

            {/* SOSYAL MEDYA */}
            <div className="col-12 mb-3 mt-4">
              <h5 className="text-primary fw-bold border-bottom pb-2">🔗 Sosyal Medya</h5>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">LinkedIn Profili</label>
              <input type="url" name="linkedinUrl" placeholder="https://linkedin.com/in/profiliniz" className="form-control" onChange={handleChange} required />
            </div>

            {/* BUTONLAR */}
            <div className="col-12 mt-5">
              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3">
                ✅ Kayıt Ol
              </button>
              <button type="button" className="btn btn-link w-100 mt-3 text-decoration-none" onClick={onNavigateToLogin}>
                Zaten hesabım var → Giriş Yap
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;