import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = ({ onNavigateToLogin }) => {
  const { t } = useTranslation();
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: t('register_disabled_title'),
      text: t('register_disabled_message'),
      icon: 'warning',
      confirmButtonText: t('register_disabled_confirm')
    });
  };

  return (
    <div className="register-container p-4" style={{ maxWidth: '900px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-dark text-white p-4 rounded-top-4 text-center">
          <h2 className="mb-0 fw-bold">🎓 {t('register_title')}</h2>
          <small className="text-light-50">{t('register_subtitle')}</small>
        </div>
        <div className="card-body p-5">
          <form onSubmit={handleSubmit} className="row g-4">
            
            <div className="col-12">
               <h5 className="text-primary fw-bold border-bottom pb-2">👤 {t('register_personal_section')}</h5>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">{t('first_name')}</label>
              <input type="text" name="firstName" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder={t('first_name_placeholder')} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">{t('last_name')}</label>
              <input type="text" name="lastName" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder={t('last_name_placeholder')} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small">{t('add_alumni_student_id')}</label>
              <input type="text" name="studentId" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder={t('add_alumni_student_id_placeholder')} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">{t('linkedin_url')}</label>
              <input type="url" name="linkedinUrl" className="form-control border-0 bg-light py-2" onChange={handleChange} required placeholder={t('linkedin_url_placeholder')} />
            </div>

            <div className="col-12 mt-4">
               <h5 className="text-primary fw-bold border-bottom pb-2">📍 {t('register_career_location_section')}</h5>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold small">{t('city')}</label>
              <input type="text" name="city" placeholder={t('city_placeholder')} className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold small">{t('country')}</label>
              <input type="text" name="country" placeholder={t('country_placeholder')} className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold small">{t('graduation_year')}</label>
              <input type="number" name="graduationYear" className="form-control border-0 bg-light py-2" onChange={handleChange} placeholder={t('graduation_year_placeholder')} required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small">{t('department')}</label>
              <input type="text" name="department" placeholder={t('department_placeholder')} className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">{t('job_title')}</label>
              <input type="text" name="jobTitle" placeholder={t('job_title_placeholder')} className="form-control border-0 bg-light py-2" onChange={handleChange} required />
            </div>

            <div className="col-12 mt-5">
              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm">
                {t('register_submit_button')}
              </button>
              <button type="button" className="btn btn-link w-100 mt-2 text-decoration-none text-muted" onClick={onNavigateToLogin}>
                {t('register_back_button')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;