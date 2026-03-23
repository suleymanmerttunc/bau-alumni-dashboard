import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, Pane } from 'react-leaflet';
import { Offcanvas } from 'react-bootstrap'; 
import 'leaflet/dist/leaflet.css';

const InteractiveMap = ({ alumniList, isAdmin, pendingCount, onNotificationClick }) => {
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
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0 fw-bold text-primary">🌍 Küresel Mezun Ağı</h5>
                        <small className="text-muted">Ülkelere tıklayarak yaklaşabilir, şehirlere tıklayarak mezunları görebilirsin.</small>
                    </div>
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

                        {/* Noktalar için özel katman oluşturuyoruz */}
                        <Pane name="city-markers" style={{ zIndex: 1000 }}>
                            {Object.keys(groupedData).map((city, index) => {
                                const cityAlumniList = groupedData[city];
                                
                                // Backend'den gelen dinamik koordinatları al
                                const lat = cityAlumniList[0].latitude;
                                const lon = cityAlumniList[0].longitude;

                                // Eğer koordinat yoksa noktayı çizme
                                if (!lat || !lon) return null;

                                const coords = [lat, lon];
                                const count = cityAlumniList.length;
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
                                                handleCityClick(city, cityAlumniList);
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

            {/* Yan Panel */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>📍 {selectedCity} Mezunları</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p className="text-muted mb-4">Bu şehirde toplam <strong>{cityAlumni.length}</strong> mezunumuz çalışıyor.</p>
                    
                    {/* Yan Paneldeki Mezun Kartları Listesi */}
                    {cityAlumni.map((alumni) => (
                        <div key={alumni.id} className="card mb-3 shadow-sm border-0">
                            <div className="card-body text-start"> 
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-light rounded-circle p-2 me-3 display-6 m-0" style={{width:'60px', height:'60px', fontSize:'2rem', display:'flex', alignItems:'center', justifyContent:'center', margin: '0 !important'}}>🎓</div>
                                        <div>
                                            <h6 className="mb-1 fw-bold text-start">{alumni.firstName} {alumni.lastName}</h6>
                                            <small className="text-muted d-block text-start">{alumni.jobTitle}</small>
                                        </div>
                                </div>
                                
                                {/* Şirket ve Bölüm Etiketleri */}
                                <span className="badge bg-primary me-1">{alumni.companyName || "Şirket Bilgisi Yok"}</span>
                                <span className="badge bg-secondary">{alumni.department}</span>
                                
                                {/* Mezuniyet Yılı ve LinkedIn Butonu */}
                                <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-2">
                                    <small className="text-muted fw-bold">Mezuniyet: {alumni.graduationYear}</small>
                                    
                                    {alumni.linkedinUrl && (
                                        <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm" style={{fontSize: "12px", borderRadius:'20px'}}>
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