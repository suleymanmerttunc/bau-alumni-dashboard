import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { Offcanvas } from 'react-bootstrap'; // Sağ panel için
import 'leaflet/dist/leaflet.css';

// Şehir Koordinatları (Yeni şehirler ekledikçe buraya koordinat girmen gerekir)
const CITY_COORDINATES = {
    "Istanbul": [41.0082, 28.9784],
    "İstanbul": [41.0082, 28.9784],
    "Ankara": [39.9334, 32.8597],
    "Izmir": [38.4192, 27.1287],
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
    const [selectedCity, setSelectedCity] = useState(null); // Tıklanan şehir
    const [showSidebar, setShowSidebar] = useState(false);  // Panel açık mı?
    const [cityAlumni, setCityAlumni] = useState([]);       // Seçilen şehrin mezunları

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
        const countryName = country.properties.name;

        // Hover Rengi (Mavi tonu)
        layer.on({
            mouseover: (e) => {
                e.target.setStyle({
                    fillColor: "#0d6efd", // Bootstrap Primary Blue
                    fillOpacity: 0.4,
                    weight: 2
                });
            },
            mouseout: (e) => {
                e.target.setStyle({
                    fillColor: "transparent",
                    fillOpacity: 0,
                    weight: 1
                });
            },
            click: (e) => {
                // Tıklayınca ülkeye zoom yap
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
                        center={[20, 0]} 
                        zoom={2} 
                        style={{ height: "100%", width: "100%", background: "#f8f9fa" }}
                        minZoom={2}
                    >
                        {/* Light Mode Harita Katmanı (Clean & Modern) */}
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {/* Ülke Sınırları Katmanı */}
                        {geoJsonData && (
                            <GeoJSON 
                                data={geoJsonData} 
                                style={{ color: "#333", weight: 1, fillColor: "transparent", fillOpacity: 0 }} 
                                onEachFeature={onEachCountry}
                            />
                        )}

                        {/* Şehir Baloncukları */}
                        {Object.keys(groupedData).map((city, index) => {
                            const coords = CITY_COORDINATES[city];
                            if (!coords) return null;

                            const count = groupedData[city].length;
                            // Baloncuk boyutu mezun sayısına göre büyüsün (Min: 8, Her mezun +3px)
                            const radiusSize = 8 + (count * 3); 

                            return (
                                <CircleMarker 
                                    key={index}
                                    center={coords}
                                    radius={radiusSize}
                                    pathOptions={{ color: '#ff7f50', fillColor: '#ff7f50', fillOpacity: 0.7 }} // Mercan rengi
                                    eventHandlers={{
                                        click: () => handleCityClick(city, groupedData[city])
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
                    </MapContainer>
                </div>
            </div>

            {/* --- SAĞDAN AÇILAN PANEL (SIDEBAR) --- */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        📍 {selectedCity} Mezunları
                    </Offcanvas.Title>
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
                                <div className="mt-2 text-end">
                                    <small className="text-muted fw-bold">{alumni.graduationYear}</small>
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