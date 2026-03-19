import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Login Page
      "login_title": "BAU Alumni Network",
      "login_subtitle": "Please enter your login details.",
      "label_user": "USERNAME",
      "label_pass": "PASSWORD",
      "btn_login": "LOGIN",
      "forgot_pass": "FORGOT PASSWORD",
      "lang_switch": "TÜRKÇE",
      "error_msg": "Invalid username or password!",
      "admin_or_student": "admin or student",

      // Tabs (NEW)
      "analysis_panel": "Analysis Dashboard",
      "alumni_feed": "Alumni Feed",

      // Quick Stats Strip (NEW)
      "global_reach": "GLOBAL REACH",
      "countries": "Countries",
      "active_opportunities": "ACTIVE OPPORTUNITIES",
      "job_openings": "Job Openings",
      "alumni_network": "ALUMNI NETWORK",
      "active_members": "Active Members",

      // Chatbot (NEW)
      "bot_title": "BAU System Assistant",
      "bot_footer": "BAU Alumni Network Info System",

      // Dashboard - Navbar & General
      "admin_mode": "Admin Mode",
      "student_mode": "Student Mode",
      "logout": "Logout",
      "add_alumni": "Add Alumni",
      "search_placeholder": "Search name, company or title...",
      "all_years": "All Years",
      "toggle_theme": "Toggle Dark/Light Mode",

      // Stats Cards
      "total_alumni": "Total Alumni",
      "different_sectors": "Different Sectors",

      // Charts
      "grad_year_chart": "Graduation Year",
      "sector_chart": "Sector Distribution",
      "alumni_count": "Alumni Count",

      // Alumni Cards & List
      "recent_alumni": "Recently Added Alumni",
      "company": "Company",
      "graduation": "Graduation",
      "linkedin_profile": "LinkedIn Profile",
      "no_results": "No alumni found matching your criteria",
      "unspecified": "Unspecified",
      "delete_confirm": "Are you sure you want to delete this?",

      // Feed Section (NEW)
      "no_posts_yet": "No posts shared yet...",
      "post_type_job": "JOB",
      "post_type_event": "EVENT",
      "create_new_post": "Publish New Announcement",
      "post_title": "Title",
      "post_content": "Announcement Content",
      "author_name": "Publishing Department",
      "post_type": "Post Type",
      "publish": "Publish",
      "post_type_success": "SUCCESS STORY",

      // Add Alumni Modal
      "add_new_alumni_title": "Add New Alumni",
      "first_name": "First Name",
      "last_name": "Last Name",
      "department": "Department",
      "graduation_year": "Graduation Year",
      "country": "Country",
      "city": "City",
      "job_title": "Job Title",
      "select_company": "Select a company...",
      "linkedin_url": "LinkedIn Profile URL",
      "cancel": "Cancel",
      "save": "Save",
      "error_save_alumni": "Error occurred! Please fill all fields.",

      // Dynamic Texts
      "showing_last_x_of_y": "Showing last {{last}} of {{total}} records",
      "total_x_records": "Total {{count}} records"
    }
  },
  tr: {
    translation: {
      // Login Page
      "login_title": "BAU Mezun Ağı",
      "login_subtitle": "Lütfen giriş bilgilerinizi yazın.",
      "label_user": "KULLANICI ADI",
      "label_pass": "ŞİFRE",
      "btn_login": "GİRİŞ YAP",
      "forgot_pass": "ŞİFREMİ UNUTTUM",
      "lang_switch": "ENGLISH",
      "error_msg": "Hatalı kullanıcı adı veya şifre!",
      "admin_or_student": "admin veya ogrenci",

      // Sekmeler (YENİ)
      "analysis_panel": "Analiz Paneli",
      "alumni_feed": "Mezun Akışı",

      // Hızlı İstatistik Şeridi (YENİ)
      "global_reach": "KÜRESEL ERİŞİM",
      "countries": "Ülkede Mezun",
      "active_opportunities": "AKTİF FIRSATLAR",
      "job_openings": "İş İlanı",
      "alumni_network": "MEZUN AĞI",
      "active_members": "Kayıtlı Mezun",

      // Chatbot (YENİ)
      "bot_title": "BAU Sistem Asistanı",
      "bot_footer": "BAU Mezun Ağı Bilgilendirme Sistemi",

      // Dashboard - Navbar & Genel
      "admin_mode": "Yönetici Modu",
      "student_mode": "Öğrenci Modu",
      "logout": "Çıkış Yap",
      "add_alumni": "Mezun Ekle",
      "search_placeholder": "İsim, Şirket veya Unvan ara...",
      "all_years": "Tüm Yıllar",
      "toggle_theme": "Koyu/Açık Tema Değiştir",

      // İstatistik Kartları
      "total_alumni": "Toplam Mezun",
      "different_sectors": "Farklı Sektörler",

      // Grafikler
      "grad_year_chart": "Mezuniyet Yılı",
      "sector_chart": "Sektör Dağılımı",
      "alumni_count": "Mezun Sayısı",

      // Mezun Kartları ve Liste
      "recent_alumni": "Son Eklenen Mezunlar",
      "company": "Şirket",
      "graduation": "Mezuniyet",
      "linkedin_profile": "LinkedIn Profili",
      "no_results": "Aradığınız kriterlere uygun mezun bulunamadı",
      "unspecified": "Belirtilmemiş",
      "delete_confirm": "Bunu silmek istediğine emin misin?",

      // Akış Bölümü (YENİ)
      "no_posts_yet": "Henüz bir paylaşım yapılmadı...",
      "post_type_job": "İŞ İLANI",
      "post_type_event": "ETKİNLİK",
      "create_new_post": "Yeni Duyuru Yayınla",
      "post_title": "Başlık",
      "post_content": "Duyuru İçeriği",
      "author_name": "Yayınlayan Birim",
      "post_type": "Duyuru Tipi",
      "publish": "Yayınla",
      "post_type_success": "BAŞARI HİKAYESİ",

      // Mezun Ekle Modal
      "add_new_alumni_title": "Yeni Mezun Ekle",
      "first_name": "Ad",
      "last_name": "Soyad",
      "department": "Bölüm",
      "graduation_year": "Mezuniyet Yılı",
      "country": "Ülke",
      "city": "Şehir",
      "job_title": "İş Unvanı",
      "select_company": "Bir şirket seçin...",
      "linkedin_url": "LinkedIn Profil Linki",
      "cancel": "İptal",
      "save": "Kaydet",
      "error_save_alumni": "Hata oluştu! Lütfen tüm alanları doldurun.",

      // Dinamik Metinler
      "showing_last_x_of_y": "Toplam {{total}} kayıttan son {{last}} tanesi gösteriliyor",
      "total_x_records": "Toplam {{count}} kayıt gösteriliyor"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "tr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;