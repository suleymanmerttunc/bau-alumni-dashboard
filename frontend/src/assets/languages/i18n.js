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
      "total_x_records": "Total {{count}} records",

      // Welcome Page
      welcome_alumni_directory: "Alumni Directory",
      welcome_email: "Email",
      btn_login: "Log in",
      welcome_search: "Search",
      welcome_nav_events: "Events",
      welcome_nav_resources: "Reading & Resources",
      welcome_nav_perks: "Programs & Perks",
      welcome_nav_communities: "Communities",
      welcome_nav_volunteer: "Volunteer",
      welcome_nav_about: "About",
      welcome_hero_title: "Welcome Home",
      welcome_hero_subtitle: "Step into the virtual home of BAU’s global community—a place where the Cardinal spirit thrives beyond the palm-lined campus.",
      welcome_hero_btn: "Explore Stories",
      welcome_stories_title: "Stories",
      welcome_stories_desc: "News, views, and perspectives from the BAU community.",
      welcome_cat_research: "RESEARCH",
      welcome_cat_magazine: "MAGAZINE",
      welcome_story1_title: "BAU AI experts predict what will happen in 2026 ↗",
      welcome_story1_desc: "The era of AI evangelism is giving way to evaluation. BAU faculty focus on actual utility.",
      welcome_story2_title: "Pressing Pause ↗",
      welcome_story2_desc: "Six alums tell us why they stopped out and what they gained in return.",
      welcome_mag_title: "Alumni Magazine— Winter 2026",
      welcome_mag_desc: "Dig into the current issue of BAU magazine. ↗",
      welcome_travel_label: "TRAVEL/STUDY",
      welcome_travel_title: "Skip the Screen Time. Bring on the Gelato.",
      welcome_travel_desc: "Next year’s Family Adventures are designed to delight every generation.",
      welcome_travel_btn: "Explore 2026 trips",      
      // Instagram Feed Section (NEW)
      welcome_insta_title: "Follow @baunetworkclub on Instagram",
      
      // Footer Section
      welcome_footer_title: "BAU Alumni Association",
      welcome_footer_address: "Frances C. Arrillaga Alumni Center, Beşiktaş Yerleşkesi, Çırağan Cd., İstanbul, TR 34353",
      welcome_footer_map: "Map",
      welcome_footer_get_to_know: "Get to Know BAUAA",
      welcome_footer_magazine: "BAU Magazine",
      welcome_footer_contact: "Contact BAUAA",
      welcome_footer_help: "Help",
      welcome_footer_member_card: "Access SAA Member Card",
      welcome_footer_alumni_email: "Check your alumni email",
      welcome_footer_alumni_account: "My Alumni Account",
      welcome_footer_give: "Give to BAU",
      welcome_footer_accessibility: "Accessibility",
      welcome_footer_privacy: "Privacy Policy",
      welcome_footer_terms: "Terms of Use",
      welcome_footer_code_of_conduct: "Code of Conduct",
      welcome_footer_bau_home: "BAU Home",
      welcome_footer_maps_directions: "Maps & Directions",
      welcome_footer_search: "Search BAU",
      welcome_footer_emergency: "Emergency Info",      
      welcome_copyright: "© 2026 Bahçeşehir University Alumni Association. All rights reserved.",
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
      "total_x_records": "Toplam {{count}} kayıt gösteriliyor",

      // Hoş Geldiniz Sayfası
      welcome_alumni_directory: "Mezun Rehberi",
      welcome_email: "E-posta",
      btn_login: "Giriş Yap",
      welcome_search: "Ara",
      welcome_nav_events: "Etkinlikler",
      welcome_nav_resources: "Kaynaklar",
      welcome_nav_perks: "Ayrıcalıklar",
      welcome_nav_communities: "Topluluklar",
      welcome_nav_volunteer: "Gönüllülük",
      welcome_nav_about: "Hakkımızda",
      welcome_hero_title: "Eve Hoş Geldin",
      welcome_hero_subtitle: "BAU'nun küresel topluluğunun sanal evine adım atın—Cardinal ruhunun kampüsün ötesinde geliştiği bir yer.",
      welcome_hero_btn: "Hikayeleri Keşfet",
      welcome_stories_title: "Hikayeler",
      welcome_stories_desc: "BAU topluluğundan haberler, görüşler ve perspektifler.",
      welcome_cat_research: "ARAŞTIRMA",
      welcome_cat_magazine: "DERGİ",
      welcome_story1_title: "BAU AI uzmanları 2026 öngörülerini paylaşıyor ↗",
      welcome_story1_desc: "Yapay zeka devrimi devam ederken, BAU fakültesi gerçek faydaya odaklanıyor.",
      welcome_story2_title: "Kısa Bir Mola ↗",
      welcome_story2_desc: "Mezunlarımız neden ara verdiklerini ve karşılığında ne kazandıklarını anlatıyor.",
      welcome_mag_title: "Mezun Dergisi— Kış 2026",
      welcome_mag_desc: "BAU dergisinin güncel sayısını inceleyin. ↗",
      welcome_travel_label: "GEZİ / EĞİTİM",
      welcome_travel_title: "Ekran Başından Ayrılın. Lezzetlerin Tadına Bakın.",
      welcome_travel_desc: "Gelecek yılın aile maceraları her nesli mutlu etmek için tasarlandı.",
      welcome_travel_btn: "2026 Gezilerini Keşfet",
      
      // Instagram Feed Bölümü (YENİ)
      welcome_insta_title: "@baunetworkclub'ı Instagram'da Takip Edin",
      
      // Footer Bölümü
      welcome_footer_title: "BAU Mezunlar Derneği",
      welcome_footer_address: "Frances C. Arrillaga Mezunlar Merkezi, Beşiktaş Yerleşkesi, Çırağan Cd., İstanbul, TR 34353",
      welcome_footer_map: "Harita",
      welcome_footer_get_to_know: "BAUAA Hakkında Bilgi",
      welcome_footer_magazine: "BAU Dergisi",
      welcome_footer_contact: "BAUAA ile İletişim",
      welcome_footer_help: "Yardım",
      welcome_footer_member_card: "SAA Üye Kartı Erişimi",
      welcome_footer_alumni_email: "Mezun E-postanızı Kontrol Edin",
      welcome_footer_alumni_account: "Mezun Hesabım",
      welcome_footer_give: "BAU'ya Bağış Yap",
      welcome_footer_accessibility: "Erişilebilirlik",
      welcome_footer_privacy: "Gizlilik Politikası",
      welcome_footer_terms: "Kullanım Koşulları",
      welcome_footer_code_of_conduct: "Davranış Kuralları",
      welcome_footer_bau_home: "BAU Ana Sayfa",
      welcome_footer_maps_directions: "Harita ve Yönler",
      welcome_footer_search: "BAU Ara",
      welcome_footer_emergency: "Acil Bilgilendirme",
      welcome_copyright: "© 2026 Bahçeşehir Üniversitesi Mezunlar Derneği. Tüm hakları saklıdır.",
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