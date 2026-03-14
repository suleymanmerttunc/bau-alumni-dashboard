import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Login Sayfası
            "login_title": "BAU Alumni Network",
            "login_subtitle": "Please enter your login details.",
            "label_user": "USERNAME",
            "label_pass": "PASSWORD",
            "btn_login": "LOGIN",
            "forgot_pass": "FORGOT PASSWORD",
            "lang_switch": "TÜRKÇE",
            "error_msg": "Invalid username or password!",
            "admin_or_student": "admin or student",

            // Dashboard - Navbar ve Genel
            "admin_mode": "Admin Mode",
            "student_mode": "Student Mode",
            "logout": "Logout",
            "add_alumni": "Add Alumni",
            "search_placeholder": "Search name, company or title...",
            "all_years": "All Years",

            // İstatistik Kartları
            "total_alumni": "Total Alumni",
            "different_sectors": "Different Sectors",

            // Grafikler
            "grad_year_chart": "Graduation Year",
            "sector_chart": "Sector Distribution",
            "alumni_count": "Alumni Count",

            // Mezun Kartları ve Liste
            "recent_alumni": "Recently Added Alumni",
            "company": "Company",
            "graduation": "Graduation",
            "linkedin_profile": "LinkedIn Profile",
            "no_results": "No alumni found matching your criteria",
            "unspecified": "Unspecified",
            "delete_confirm": "Are you sure you want to delete this alumni?",

            // Dinamik Metinler (App.jsx içindeki değişkenli kısımlar)
            "showing_last_x_of_y": "Showing last {{last}} of {{total}} records",
            "total_x_records": "Total {{count}} records",

            // Mezun ekleme formu
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
            "error_save_alumni": "Error occurred! Please fill all fields."
        }
    },
    tr: {
        translation: {
            // Login Sayfası
            "login_title": "BAU Mezun Ağı",
            "login_subtitle": "Lütfen giriş bilgilerinizi yazın.",
            "label_user": "KULLANICI ADI",
            "label_pass": "ŞİFRE",
            "btn_login": "GİRİŞ YAP",
            "forgot_pass": "ŞİFREMİ UNUTTUM",
            "lang_switch": "ENGLISH",
            "error_msg": "Hatalı kullanıcı adı veya şifre!",
            "admin_or_student": "admin veya ogrenci"

            // Dashboard - Navbar ve Genel
            , "admin_mode": "Yönetici Modu",
            "student_mode": "Öğrenci Modu",
            "logout": "Çıkış Yap",
            "add_alumni": "Mezun Ekle",
            "search_placeholder": "İsim, Şirket veya Unvan ara...",
            "all_years": "Tüm Yıllar",

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
            "delete_confirm": "Bu mezunu silmek istediğine emin misin?",

            // Dinamik Metinler
            "showing_last_x_of_y": "Toplam {{total}} kayıttan son {{last}} tanesi gösteriliyor",
            "total_x_records": "Toplam {{count}} kayıt gösteriliyor",

            // Mezun ekleme formu
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
            "error_save_alumni": "Hata oluştu! Lütfen tüm alanları doldurun."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "tr",
        interpolation: {
            escapeValue: false // React XSS'e karşı koruduğu için gerek yok
        }
    });

export default i18n;