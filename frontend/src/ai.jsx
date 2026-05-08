const botData = {
  tr: {
    start: {
      message: "Merhaba! BAU Mezun Sistemi asistanına hoş geldin. Bu sistem; mezun haritası, mülakat koçu, kariyer simülatörü, analiz paneli ve mezun akışı özellikleriyle tasarlandı.",
      options: [
        { text: "🧭 Sistemi Tanıt", nextStep: "system_overview" },
        { text: "🗺️ Mezun Haritası", nextStep: "map_info" },
        { text: "🔮 Kariyer Simülatörü", nextStep: "career_simulator_info" },
        { text: "🤖 Mülakat Koçu", nextStep: "interview_coach_info" },
        { text: "🏢 Mezun Akışı", nextStep: "feed_info" },
        { text: "🛡️ Yönetici Rehberi", nextStep: "admin_help" }
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
    // --- SİSTEM BİLGİLERİ ---
    system_overview: {
      message: "Bu sistemde:\n- Mezun haritasında şehir ve ülke bazlı mezun dağılımını görebilirsin.\n- AI Kariyer Simülatörü sana en uygun yetkinlik yol haritasını çıkarır.\n- Mülakat Koçu gerçek zamanlı soru, cevap ve geri bildirim sunar.\n- Analiz paneli filtreleme, sektör ve mezun istatistikleri sağlar.\n- Mezun akışı ile iş ilanları, etkinlikler ve başarı hikayelerini paylaşabilirsin.",
      options: [
        { text: "⬅ Geri", nextStep: "start" }
      ]
    },
    map_info: {
      message: "Mezun Haritası bölümünde şehirleri tıklayarak o şehirdeki mezunları görebilir, ülke sınırlarına tıklayarak haritada yakınlaşabilirsin.",
      options: [
        { text: "⬅ Geri", nextStep: "start" }
      ]
    },
    career_simulator_info: {
      message: "Kariyer Simülatörü, mevcut mezun verileri ve hedef alanına göre AI önerileri üretir. Mevcut mezun sayısı her zaman güncel olarak hesaplanır.",
      options: [
        { text: "⬅ Geri", nextStep: "start" }
      ]
    },
    interview_coach_info: {
      message: "Mülakat Koçu modülü, CV ve iş tanımına göre 7 soru sunar, yanıtları puanlar ve anlık geri bildirim verir.",
      options: [
        { text: "⬅ Geri", nextStep: "start" }
      ]
    },
    feed_info: {
      message: "Mezun Akışı bölümünde iş ilanları, etkinlikler ve başarı hikayeleri bulunur. Adminler kendi duyurularını yayınlayabilir.",
      options: [
        { text: "⬅ Geri", nextStep: "start" }
      ]
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
      message: "Hello! Welcome to the BAU Alumni System assistant. This platform guides you through the alumni map, interview coach, career simulator, analytics dashboard and alumni feed.",
      options: [
        { text: "🧭 System Tour", nextStep: "system_overview" },
        { text: "🗺️ Alumni Map", nextStep: "map_info" },
        { text: "🔮 Career Simulator", nextStep: "career_simulator_info" },
        { text: "🤖 Interview Coach", nextStep: "interview_coach_info" },
        { text: "🏢 Alumni Feed", nextStep: "feed_info" },
        { text: "🛡️ Admin Guide", nextStep: "admin_help" }
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
      message: "Quick System Overview:",
      options: [
        { text: "🧭 System Features", nextStep: "system_overview" },
        { text: "🗺️ Alumni Map", nextStep: "map_info" },
        { text: "🔮 Career Simulator", nextStep: "career_simulator_info" },
        { text: "🤖 Interview Coach", nextStep: "interview_coach_info" },
        { text: "🏠 Main Menu", nextStep: "start" }
      ]
    },
    system_overview: {
      message: "In this system:\n- The Alumni Map shows graduate distribution by city and country.\n- The AI Career Simulator generates a skill roadmap based on alumni data.\n- The Interview Coach provides 7 tailored questions, scoring and feedback.\n- The Analytics Dashboard offers filters, sector stats and trends.\n- The Alumni Feed shares job posts, events and success stories.",
      options: [{ text: "⬅ Back", nextStep: "start" }]
    },
    map_info: {
      message: "In Alumni Map, click countries to zoom in and cities to view graduates in that location.",
      options: [{ text: "⬅ Back", nextStep: "start" }]
    },
    career_simulator_info: {
      message: "The Career Simulator uses current alumni data and your target interest to create AI-driven career guidance.",
      options: [{ text: "⬅ Back", nextStep: "start" }]
    },
    interview_coach_info: {
      message: "The Interview Coach guides you through answers, scores your responses and offers real-time improvement tips.",
      options: [{ text: "⬅ Back", nextStep: "start" }]
    },
    feed_info: {
      message: "The Alumni Feed lets you see shared jobs, events and success stories. Admins can post announcements directly.",
      options: [{ text: "⬅ Back", nextStep: "start" }]
    },
    help_center: {
      message: "This assistant focuses on the alumni system, including map, interview coach, career simulator and feed. Use the options to explore those modules.",
      options: [{ text: "⬅ Back", nextStep: "sss_main" }]
    },
    burs_options: {
      message: "Use the main menu to learn about the alumni map, AI career simulator, interview coach and the feed system.",
      options: [{ text: "⬅ Back", nextStep: "sss_main" }]
    },
    dekanlik_loc: {
      message: "The BAU Alumni System is built to navigate alumni data, careers, and interview practice. Check the featured modules from the main menu.",
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