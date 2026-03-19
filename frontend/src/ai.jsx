const botData = {
  tr: {
    start: {
      message: "Merhaba Bau'lu! BAU Mezun Sistemi ve Kampüs Yaşamı asistanına hoş geldin. Sana nasıl yardımcı olabilirim? 🎓",
      options: [
        { text: "📅 2025-2026 Akademik Takvim", nextStep: "academic" },
        { text: "💡 Sıkça Sorulan Sorular (SSS)", nextStep: "sss_main" },
        { text: "🏥 Öğrenci Dekanlığı ve Hizmetler", nextStep: "dekanlik_services" },
        { text: "🛡️ Sistem Kullanım Rehberi (Admin)", nextStep: "admin_help" }
      ]
    },
    // --- AKADEMİK TAKVİM ---
    academic: {
      message: "Hangi dönemin akademik takvim detaylarını öğrenmek istersin?",
      options: [
        { text: "🍂 Güz Dönemi (Fall)", nextStep: "fall_details" },
        { text: "🌸 Bahar Dönemi (Spring)", nextStep: "spring_details" },
        { text: "☀️ Yaz Okulu (Summer)", nextStep: "summer_details" },
        { text: "🏠 Ana Menü", nextStep: "start" }
      ]
    },
    fall_details: {
      message: "🍂 2025-2026 Güz Dönemi:\n- Kayıtlar: 24-31 Temmuz 2025\n- Ders Başlangıcı: 6 Ekim 2025\n- Ekle-Sil: 13-17 Ekim 2025\n- Ara Sınavlar: 22-30 Kasım 2025\n- Finaller: 19 Ocak - 1 Şubat 2026",
      options: [{ text: "⬅ Geri", nextStep: "academic" }, { text: "🏠 Ana Menü", nextStep: "start" }]
    },
    spring_details: {
      message: "🌸 2025-2026 Bahar Dönemi:\n- Kayıtlar: 17-24 Aralık 2025\n- Ders Başlangıcı: 2 Mart 2026\n- Ekle-Sil: 9-13 Mart 2026\n- Ara Sınavlar: 18-26 Nisan 2026\n- Finaller: 22 Haziran - 5 Temmuz 2026",
      options: [{ text: "⬅ Geri", nextStep: "academic" }, { text: "🏠 Ana Menü", nextStep: "start" }]
    },
    summer_details: {
      message: "☀️ 2025-2026 Yaz Okulu:\n- Kayıtlar: 21-24 Temmuz 2026\n- Ders Başlangıcı: 27 Temmuz 2026\n- Ders Sonu: 11 Eylül 2026",
      options: [{ text: "⬅ Geri", nextStep: "academic" }, { text: "🏠 Ana Menü", nextStep: "start" }]
    },
    // --- SSS ---
    sss_main: {
      message: "Sıkça Sorulan Sorular:",
      options: [
        { text: "❓ Sorunlarımı Nasıl Çözerim?", nextStep: "help_center" },
        { text: "🏆 Burs Olanakları", nextStep: "burs_options" },
        { text: "🏢 Dekanlık Nerede?", nextStep: "dekanlik_loc" },
        { text: "🏠 Ana Menü", nextStep: "start" }
      ]
    },
    help_center: {
      message: "Merak ettiğiniz her konu için BAU Öğrenci Çözüm Merkezi (help.bau.edu.tr) üzerinden talep oluşturabilir veya 444 28 64'ü arayabilirsiniz.",
      options: [{ text: "⬅ Geri", nextStep: "sss_main" }]
    },
    burs_options: {
      message: "Takım sporlarında okulu temsil edenlere %100 burs verilir. Maddi sıkıntılar için sule.fidan@dso.bau.edu.tr adresine ulaşabilirsin.",
      options: [{ text: "⬅ Geri", nextStep: "sss_main" }]
    },
    dekanlik_loc: {
      message: "Beşiktaş Güney Kampüs D Blok 1. Kattadır. Ayrıca Kemerburgaz Future Kampüs'te de ofis bulunmaktadır.",
      options: [{ text: "⬅ Geri", nextStep: "sss_main" }]
    },
    // --- DEKANLIK HİZMETLERİ ---
    dekanlik_services: {
      message: "Öğrenci Dekanlığı Hizmetleri:",
      options: [
        { text: "🧠 Psikolojik Danışmanlık (PDRM)", nextStep: "pdrm_info" },
        { text: "🎭 Öğrenci Kulüpleri", nextStep: "clubs_info" },
        { text: "🏠 Ana Menü", nextStep: "start" }
      ]
    },
    pdrm_info: {
      message: "PDRM tüm BAU öğrencileri için ücretsizdir. Başvuru: pdrm@dso.bau.edu.tr. Görüşmeler tamamen gizlidir.",
      options: [{ text: "⬅ Geri", nextStep: "dekanlik_services" }]
    },
    clubs_info: {
      message: "BAU'da 92 aktif kulüp var. Başvurular her yılın ilk 5 haftasında açılır. Güney Kampüs D Blok 1. kattan bilgi alabilirsin.",
      options: [{ text: "⬅ Geri", nextStep: "dekanlik_services" }]
    },
    // --- SİSTEM REHBERİ ---
    admin_help: {
      message: "Dashboard Kullanım Rehberi:",
      options: [
        { text: "📊 Analiz Paneli", nextStep: "analysis_info" },
        { text: "➕ Mezun Kaydı", nextStep: "add_alumni_info" },
        { text: "📢 Duyuru Paylaşımı", nextStep: "post_info" },
        { text: "🏠 Ana Menü", nextStep: "start" }
      ]
    },
    analysis_info: {
      message: "Grafiklerde sayfalama (◀ ▶) yaparak yılları görebilir, filtreleme ile şirket/unvan bazlı arama yapabilirsin.",
      options: [{ text: "⬅ Geri", nextStep: "admin_help" }]
    },
    add_alumni_info: {
      message: "Sağ üstteki '+' butonu ile yeni mezun ekleyebilirsin. Mezuniyet yılı ve Şirket bilgisi harita için kritiktir.",
      options: [{ text: "⬅ Geri", nextStep: "admin_help" }]
    },
    post_info: {
      message: "Akış sekmesinden İş İlanı, Etkinlik veya Başarı Hikayesi paylaşabilirsin. Başarı hikayeleri Altın 🌟 rengindedir.",
      options: [{ text: "⬅ Geri", nextStep: "admin_help" }]
    }
  },
  // --- İNGİLİZCE KISMI ---
  en: {
    start: {
      message: "Hello Mert! Welcome to BAU Alumni & Campus Life Assistant. How can I help you? 🎓",
      options: [
        { text: "📅 Academic Calendar 25-26", nextStep: "academic" },
        { text: "💡 FAQ", nextStep: "sss_main" },
        { text: "🏥 Student Deanery Services", nextStep: "dekanlik_services" },
        { text: "🛡️ System Admin Guide", nextStep: "admin_help" }
      ]
    },
    academic: {
      message: "Which term calendar would you like to see?",
      options: [
        { text: "🍂 Fall Semester", nextStep: "fall_details" },
        { text: "🌸 Spring Semester", nextStep: "spring_details" },
        { text: "☀️ Summer School", nextStep: "summer_details" },
        { text: "🏠 Main Menu", nextStep: "start" }
      ]
    },
    fall_details: {
      message: "🍂 Fall 2025-2026:\n- Registration: July 24-31, 2025\n- Classes Start: Oct 6, 2025\n- Finals: Jan 19 - Feb 1, 2026",
      options: [{ text: "⬅ Back", nextStep: "academic" }, { text: "🏠 Main Menu", nextStep: "start" }]
    },
    spring_details: {
      message: "🌸 Spring 2025-2026:\n- Registration: Dec 17-24, 2025\n- Classes Start: Mar 2, 2026\n- Finals: June 22 - July 5, 2026",
      options: [{ text: "⬅ Back", nextStep: "academic" }, { text: "🏠 Main Menu", nextStep: "start" }]
    },
    summer_details: {
      message: "☀️ Summer School 2025-2026:\n- Registration: July 21-24, 2026\n- Classes Start: July 27, 2026\n- Term Ends: Sept 11, 2026",
      options: [{ text: "⬅ Back", nextStep: "academic" }, { text: "🏠 Main Menu", nextStep: "start" }]
    },
    sss_main: {
      message: "Frequently Asked Questions:",
      options: [
        { text: "❓ How to Solve Problems?", nextStep: "help_center" },
        { text: "🏆 Scholarships", nextStep: "burs_options" },
        { text: "🏢 Where is the Deanery?", nextStep: "dekanlik_loc" },
        { text: "🏠 Main Menu", nextStep: "start" }
      ]
    },
    help_center: {
      message: "You can create a request at help.bau.edu.tr or call 444 28 64 for any university-related issues.",
      options: [{ text: "⬅ Back", nextStep: "sss_main" }]
    },
    burs_options: {
      message: "Athletes get up to 100% scholarship. For financial aid, contact sule.fidan@dso.bau.edu.tr.",
      options: [{ text: "⬅ Back", nextStep: "sss_main" }]
    },
    dekanlik_loc: {
      message: "Located at Besiktas South Campus, Block D, 1st Floor. Also an office is available at Kemerburgaz Future Campus.",
      options: [{ text: "⬅ Back", nextStep: "sss_main" }]
    },
    dekanlik_services: {
      message: "Student Deanery Services:",
      options: [
        { text: "🧠 Psychological Counseling (PDRM)", nextStep: "pdrm_info" },
        { text: "🎭 Student Clubs", nextStep: "clubs_info" },
        { text: "🏠 Main Menu", nextStep: "start" }
      ]
    },
    pdrm_info: {
      message: "PDRM is free for all BAU students. Contact: pdrm@dso.bau.edu.tr. All sessions are confidential.",
      options: [{ text: "⬅ Back", nextStep: "dekanlik_services" }]
    },
    clubs_info: {
      message: "There are 92 active clubs. Applications open during the first 5 weeks of each year. Visit Block D, 1st Floor at South Campus.",
      options: [{ text: "⬅ Back", nextStep: "dekanlik_services" }]
    },
    admin_help: {
      message: "System Management Guide:",
      options: [
        { text: "📊 Analysis Dashboard", nextStep: "analysis_info" },
        { text: "➕ Adding Alumni", nextStep: "add_alumni_info" },
        { text: "📢 Posting Announcements", nextStep: "post_info" },
        { text: "🏠 Main Menu", nextStep: "start" }
      ]
    },
    analysis_info: {
      message: "Use pagination arrows (◀ ▶) on charts to navigate years. Use filters to search for specific companies.",
      options: [{ text: "⬅ Back", nextStep: "admin_help" }]
    },
    add_alumni_info: {
      message: "Click the green '+' button on the top right. Year and Company info are critical for map data.",
      options: [{ text: "⬅ Back", nextStep: "admin_help" }]
    },
    post_info: {
      message: "Share Jobs, Events or Success Stories in the Feed. Success Stories are highlighted in Gold 🌟.",
      options: [{ text: "⬅ Back", nextStep: "admin_help" }]
    }
  }
};

export default botData;