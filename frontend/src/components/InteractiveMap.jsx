import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, Pane } from 'react-leaflet';
import { Offcanvas } from 'react-bootstrap'; // Sağ panel için
import 'leaflet/dist/leaflet.css';

// Şehir Koordinatları
const CITY_COORDINATES = {
    "Adana": [37.0000, 35.3213],
    "Adıyaman": [37.7648, 38.2786],
    "Afyonkarahisar": [38.7569, 30.5387],
    "Ağrı": [39.7191, 43.0503],
    "Aksaray": [38.3687, 34.0360],
    "Amasya": [40.6499, 35.8353],
    "Ankara": [39.9334, 32.8597],
    "Antalya": [36.8969, 30.7133],
    "Ardahan": [41.1105, 42.7022],
    "Artvin": [41.1828, 41.8183],
    "Aydın": [37.8480, 27.8456],
    "Balıkesir": [39.6484, 27.8826],
    "Bartın": [41.6358, 32.3370],
    "Batman": [37.8812, 41.1351],
    "Bayburt": [40.2552, 40.2249],
    "Bilecik": [40.1418, 29.9793],
    "Bingöl": [38.8853, 40.4983],
    "Bitlis": [38.3938, 42.1232],
    "Bolu": [40.7350, 31.6060],
    "Burdur": [37.7203, 30.2900],
    "Bursa": [40.1950, 29.0600],
    "Çanakkale": [40.1553, 26.4142],
    "Çankırı": [40.6013, 33.6134],
    "Çorum": [40.5506, 34.9556],
    "Denizli": [37.7765, 29.0864],
    "Diyarbakır": [37.9250, 40.2100],
    "Düzce": [40.8438, 31.1565],
    "Edirne": [41.6772, 26.5550],
    "Elazığ": [38.6810, 39.2260],
    "Erzincan": [39.7505, 39.4914],
    "Erzurum": [39.9043, 41.2679],
    "Eskişehir": [39.7843, 30.5192],
    "Gaziantep": [37.0662, 37.3833],
    "Giresun": [40.9128, 38.3895],
    "Gümüşhane": [40.4602, 39.4810],
    "Hakkari": [37.5744, 43.7408],
    "Hatay": [36.2028, 36.1604],
    "Iğdır": [39.9237, 44.0450],
    "Isparta": [37.7648, 30.5566],
    "Istanbul": [41.0082, 28.9784],
    "İstanbul": [41.0082, 28.9784],
    "İzmir": [38.4192, 27.1287],
    "Kahramanmaraş": [37.5833, 36.9333],
    "Karabük": [41.2049, 32.6277],
    "Karaman": [37.1811, 33.2150],
    "Kars": [40.6010, 43.0940],
    "Kastamonu": [41.3887, 33.7827],
    "Kayseri": [38.7225, 35.4875],
    "Kilis": [36.7184, 37.1212],
    "Kırıkkale": [39.8468, 33.5153],
    "Kırklareli": [41.7355, 27.2256],
    "Kırşehir": [39.1450, 34.1600],
    "Kocaeli": [40.8533, 29.8815],
    "Konya": [37.8714, 32.4846],
    "Kütahya": [39.4242, 29.9830],
    "Malatya": [38.3554, 38.3335],
    "Manisa": [38.6191, 27.4289],
    "Mardin": [37.3122, 40.7351],
    "Mersin": [36.8121, 34.6415],
    "Muğla": [37.2153, 28.3636],
    "Muş": [38.7349, 41.4915],
    "Nevşehir": [38.6247, 34.7142],
    "Niğde": [37.9690, 34.6829],
    "Ordu": [40.9847, 37.8789],
    "Osmaniye": [37.0681, 36.2616],
    "Rize": [41.0201, 40.5234],
    "Sakarya": [40.7569, 30.3782],
    "Samsun": [41.2797, 36.3361],
    "Siirt": [37.9333, 41.9500],
    "Sinop": [42.0264, 35.1551],
    "Sivas": [39.7477, 37.0179],
    "Şanlıurfa": [37.1674, 38.7955],
    "Şırnak": [37.5164, 42.4610],
    "Tekirdağ": [40.9780, 27.5110],
    "Tokat": [40.3167, 36.5500],
    "Trabzon": [41.0027, 39.7168],
    "Tunceli": [39.1064, 39.5483],
    "Uşak": [38.6823, 29.4082],
    "Van": [38.5012, 43.4160],
    "Yalova": [40.6549, 29.2842],
    "Yozgat": [39.8200, 34.8040],
    "Zonguldak": [41.4564, 31.7987],
    "London": [51.5074, -0.1278],
    "New York": [40.7128, -74.0060],
    "San Francisco": [37.7749, -122.4194],
    "Berlin": [52.5200, 13.4050],
    "Amsterdam": [52.3676, 4.9041],
    "Singapore": [1.3521, 103.8198],
    "Dubai": [25.2048, 55.2708]
};

const InteractiveMap = ({ alumniList }) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null); 
    const [showSidebar, setShowSidebar] = useState(false);  
    const [cityAlumni, setCityAlumni] = useState([]);       

    // 1. Dünya Ülke Sınırlarını Çek (GeoJSON)
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(response => response.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error("Harita verisi yüklenemedi:", err));
    }, []);

    // 2. Mezunları Şehirlere Göre Grupla
    const groupedData = {};
    alumniList.forEach(alumni => {
        const city = alumni.city || "Bilinmiyor";
        if (!groupedData[city]) groupedData[city] = [];
        groupedData[city].push(alumni);
    });

    // 3. Ülke Üzerine Gelince ve Tıklayınca Ne Olsun?
    const onEachCountry = (country, layer) => {
        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ fillColor: "#0d6efd", fillOpacity: 0.4, weight: 2 });
            },
            mouseout: (e) => {
                e.target.setStyle({ fillColor: "transparent", fillOpacity: 0, weight: 1 });
            },
            click: (e) => {
                e.target._map.fitBounds(e.target.getBounds());
            }
        });
    };

    // Şehre tıklayınca Paneli Aç
    const handleCityClick = (city, alumni) => {
        setSelectedCity(city);
        setCityAlumni(alumni);
        setShowSidebar(true);
    };

    return (
        <>
            <div className="card shadow border-0 overflow-hidden" style={{ borderRadius: "15px" }}>
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold text-primary">🌍 Küresel Mezun Ağı</h5>
                    <small className="text-muted">Ülkelere tıklayarak yaklaşabilir, şehirlere tıklayarak mezunları görebilirsin.</small>
                </div>
                
                <div style={{ height: "500px", width: "100%", position: "relative" }}>
                    <MapContainer 
                        center={[39, 35]} 
                        zoom={3} 
                        style={{ height: "100%", width: "100%", background: "#f8f9fa" }}
                        minZoom={2}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CARTO'
                        />

                        {/* Ülke Sınırları (GeoJSON) - Altta Kalacak */}
                        {geoJsonData && (
                            <GeoJSON 
                                data={geoJsonData} 
                                style={{ color: "#333", weight: 1, fillColor: "transparent", fillOpacity: 0 }} 
                                onEachFeature={onEachCountry}
                            />
                        )}

                        {/* Noktalar için özel katman oluşturuyoruz (zIndex: 1000 ile en üste alıyoruz) */}
                        <Pane name="city-markers" style={{ zIndex: 1000 }}>
                            {Object.keys(groupedData).map((city, index) => {
                                const coords = CITY_COORDINATES[city];
                                if (!coords) return null;

                                const count = groupedData[city].length;
                                const radiusSize = 8 + (count * 3); 

                                return (
                                    <CircleMarker 
                                        key={index}
                                        center={coords}
                                        radius={radiusSize}
                                        pathOptions={{ color: '#ff7f50', fillColor: '#ff7f50', fillOpacity: 0.9 }} 
                                        eventHandlers={{
                                            click: (e) => {
                                                e.originalEvent.stopPropagation();
                                                handleCityClick(city, groupedData[city]);
                                            }
                                        }}
                                    >
                                        <Popup>
                                            <div className="text-center">
                                                <strong>{city}</strong><br/>
                                                {count} Mezun<br/>
                                                <span className="text-primary" style={{cursor:"pointer"}}>Detaylar için tıkla</span>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                );
                            })}
                        </Pane>
                    </MapContainer>
                </div>
            </div>

            {/* Yan Panel (Sidebar) */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>📍 {selectedCity} Mezunları</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p className="text-muted mb-4">Bu şehirde toplam <strong>{cityAlumni.length}</strong> mezunumuz çalışıyor.</p>
                    
                    {cityAlumni.map((alumni) => (
                        <div key={alumni.id} className="card mb-3 shadow-sm border-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="bg-light rounded-circle p-2 me-3 display-6">🎓</div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{alumni.firstName} {alumni.lastName}</h6>
                                        <small className="text-muted">{alumni.jobTitle}</small>
                                    </div>
                                </div>
                                <span className="badge bg-primary me-1">{alumni.company?.name}</span>
                                <span className="badge bg-secondary">{alumni.department}</span>
                                
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <small className="text-muted fw-bold">{alumni.graduationYear}</small>
                                    
                                    {/* --- LINKEDIN BUTONU (BURASI EKLENDİ) --- */}
                                    {alumni.linkedinUrl && (
                                        <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm" style={{fontSize: "12px"}}>
                                            LinkedIn ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default InteractiveMap;