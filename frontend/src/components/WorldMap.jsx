import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet'in varsayılan marker ikonlarını düzeltmek için gerekli
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Şehirlerin koordinat listesi (Manuel Eşleşme)
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

const WorldMap = ({ alumniList }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
                <h5 className="mb-0">🌍 Küresel Mezun Ağı</h5>
            </div>
            <div className="card-body p-0">
                <MapContainer center={[41.0082, 28.9784]} zoom={2} style={{ height: "400px", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {alumniList.map((alumni, index) => {
                        // Mezunun şehrine göre koordinatı bul
                        const coords = CITY_COORDINATES[alumni.city] || CITY_COORDINATES["Istanbul"]; // Bulamazsa İstanbul'u göster

                        return (
                            <Marker key={index} position={coords}>
                                <Popup>
                                    <strong>{alumni.firstName} {alumni.lastName}</strong> <br />
                                    {alumni.jobTitle} <br />
                                    {alumni.company?.name} <br />
                                    📍 {alumni.city}, {alumni.country}
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default WorldMap;