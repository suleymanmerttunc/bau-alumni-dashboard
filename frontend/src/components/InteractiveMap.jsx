import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, Pane } from 'react-leaflet';
import { Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

const InteractiveMap = ({ alumniList, isAdmin, pendingCount, onNotificationClick }) => {
    const { t } = useTranslation();
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

    // Check if we have any valid markers to display
    const validMarkers = Object.keys(groupedData).filter(city => {
        const cityAlumniList = groupedData[city];
        return cityAlumniList[0].latitude && cityAlumniList[0].longitude;
    }).length;

    return (
        <>
            <div className="card shadow border-0 overflow-hidden" style={{ borderRadius: "15px" }}>
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0 fw-bold text-primary">{t('global_alumni_network')}</h5>
                        <small className="text-muted">{t('map_instructions')}</small>
                    </div>
                </div>

                <div style={{ height: "500px", width: "100%", position: "relative" }}>
                    {validMarkers > 0 ? (
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
                                const radiusSize = 10 + (Math.log10(count + 1) * 15);

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
                                                <strong>{city}</strong><br />
                                                {count} Mezun<br />
                                                <span className="text-primary" style={{ cursor: "pointer" }}>{t('city_details_click')}</span>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                );
                            })}
                        </Pane>
                    </MapContainer>
                    ) : (
                        <div style={{ 
                            height: "100%", 
                            width: "100%", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            backgroundColor: "#f8f9fa",
                            flexDirection: "column"
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "48px", marginBottom: "10px" }}>📍</p>
                                <p style={{ color: "#6c757d", marginBottom: "5px", fontWeight: "500" }}>{t('map_no_data')}</p>
                                <small style={{ color: "#999" }}>{t('map_no_data_desc')}</small>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Yan Panel */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end" className="shadow-lg">
                <Offcanvas.Header closeButton className="bg-light border-bottom">
                    <Offcanvas.Title className="fw-bold text-primary">📍 {selectedCity} Mezunları</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-4">
                    <p className="text-muted mb-4 small">
                        Bu şehirde toplam <strong>{cityAlumni.length}</strong> mezunumuz yer alıyor.
                        Bilgiler AI tarafından LinkedIn üzerinden güncellenmektedir.
                    </p>

                    {cityAlumni.map((alumni) => (
                        <div key={alumni.id} className="card mb-3 shadow-sm border-0 position-relative" style={{ borderRadius: '12px', borderLeft: '5px solid #0d6efd' }}>
                            <div className="card-body text-start">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-soft-primary rounded-circle me-3" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e7f1ff' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🎓</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h6 className="mb-0 fw-bold">{alumni.firstName} {alumni.lastName}</h6>
                                        {/* AI'dan gelen unvan varsa onu göster, yoksa manuel girileni kullan */}
                                        <small className="text-primary fw-semibold">
                                            {alumni.currentTitle || alumni.jobTitle}
                                        </small>
                                    </div>
                                </div>

                                {/* Şirket Bilgisi - AI'nın bulduğu şirket ismini önceliklendiriyoruz */}
                                <div className="mb-3">
                                    <span className="badge rounded-pill bg-dark py-2 px-3 w-100 text-truncate" title={alumni.companyName}>
                                        🏢 {alumni.companyName || "Şirket Analiz Ediliyor..."}
                                    </span>
                                </div>

                                <div className="d-flex flex-wrap gap-1 mb-3">
                                    <span className="badge bg-light text-dark border">{alumni.department}</span>
                                    <span className="badge bg-light text-dark border">🗓️ {alumni.graduationYear}</span>
                                </div>

                                <div className="d-flex justify-content-end border-top pt-3">
                                    {alumni.linkedinUrl && (
                                        <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm rounded-pill px-4"
                                            style={{ fontSize: "12px", transition: '0.3s' }}>
                                            LinkedIn Profili ↗
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