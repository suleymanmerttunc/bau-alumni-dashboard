import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    department: '',
    city: '',
    country: '',
    jobTitle: '',
    graduationYear: '',
    linkedinUrl: ''
    // NOT: Kullanıcı adı, şifre ve email'i Alumni nesnesi için sildik.
    // Çünkü artık statik login (admin/123) kullanıyoruz.
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // DİKKAT: Artık /api/auth/register yerine /api/alumni endpoint'ine kayıt atıyoruz.
      // Bu sayede mezun direkt haritaya düşer ve AI süreci başlar.
      const response = await axios.post('http://localhost:8080/api/alumni', formData);
      
      Swal.fire({
        title: 'Başarılı!',
        text: 'Mezun ağımıza katıldınız! Bilgileriniz AI tarafından zenginleştirilip haritaya eklendi.',
        icon: 'success',
        confirmButtonText: 'Haritaya Git'
      });
      onNavigateToLogin();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      Swal.fire('Hata!', 'Kayıt sırasında bir sorun oluştu. Lütfen bilgileri kontrol edin.', 'error');
    }
  };

  return (
    <div className="register-container p-4" style={{ maxWidth: '900px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-dark text-white p-4 rounded-top-4 text-center">
          <h2 className="mb-0 fw-bold">🎓 BAU Mezun Ağına Katıl</h2>
          <small className="text-light-50">Bilgileriniz AI tarafından LinkedIn üzerinden doğrulanacaktır.</small>
        </div>
        <div className="card-body p-5">
          <form onSubmit={handleSubmit} className="row g-4">
            
            <div className="col-12">
               <h5 className="text-primary fw-bold border-bottom pb-2">👤 Kişisel Bilgiler</h5>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">AD</label>
              <input type="text" name="firstName" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder="Mert" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">SOYAD</label>
              <input type="text" name="lastName" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder="Tunç" />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small">ÖĞRENCİ NUMARASI</label>
              <input type="text" name="studentId" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder="2019xxxx" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">LINKEDIN PROFİL URL</label>
              <input type="url" name="linkedinUrl" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder="https://linkedin.com/in/..." />
            </div>

            <div className="col-12 mt-4">
               <h5 className="text-primary fw-bold border-bottom pb-2">📍 Kariyer ve Lokasyon</h5>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold small">ŞEHİR</label>
              <input type="text" name="city" placeholder="Istanbul" className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold small">ÜLKE</label>
              <input type="text" name="country" placeholder="Turkey" className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold small">MEZUNİYET YILI</label>
              <input type="number" name="graduationYear" className="form-control border-0 bg-light py-2" onChange={handleChange} placeholder="2024" required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small">BÖLÜM</label>
              <input type="text" name="department" placeholder="Software Engineering" className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">ŞU ANKİ ÜNVAN</label>
              <input type="text" name="jobTitle" placeholder="Software Engineer" className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>

            <div className="col-12 mt-5">
              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm">
                Ağa Katıl ve Haritada Görün
              </button>
              <button type="button" className="btn btn-link w-100 mt-2 text-decoration-none text-muted" onClick={onNavigateToLogin}>
                Geri Dön
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;