import { useEffect, useState } from 'react';
import AlumniService from './services/AlumniService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'; // Harita CSS'i
import InteractiveMap from './components/InteractiveMap';// <-- yeni eklendi bu worlmap olan eskisini sildik
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import './App.css';

function App() {
  const [alumniList, setAlumniList] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [sectorData, setSectorData] = useState([]); 
  const [sectorCount, setSectorCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  // Pasta grafik renkleri
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  useEffect(() => {
    AlumniService.getAllAlumni()
      .then(data => {
        setAlumniList(data);
        analyzeData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Hata:", error);
        setLoading(false);
      });
  }, []);

  const analyzeData = (data) => {
    // 1. Yıllara Göre Dağılım
    const yearCounts = {};
    data.forEach(student => {
      const year = student.graduationYear;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    const formattedYearData = Object.keys(yearCounts).map(year => ({
      name: year,
      mezunSayisi: yearCounts[year]
    }));
    setYearData(formattedYearData);

    // 2. Sektörlere Göre Dağılım
    const sectorCounts = {};
    const uniqueSectors = new Set(); 

    data.forEach(student => {
      const sectorName = student.company?.sector?.name || 'Diğer';
      sectorCounts[sectorName] = (sectorCounts[sectorName] || 0) + 1;
      
      if(student.company?.sector?.name) {
        uniqueSectors.add(student.company.sector.name);
      }
    });

    const formattedSectorData = Object.keys(sectorCounts).map(key => ({
      name: key,
      value: sectorCounts[key]
    }));

    setSectorData(formattedSectorData);
    setSectorCount(uniqueSectors.size);
  };

  return (
    <div>
      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-dark bg-dark mb-4 shadow-sm">
        <div className="container">
          <span className="navbar-brand mb-0 h1">🎓 BAU Alumni Dashboard</span>
        </div>
      </nav>

      <div className="container">
        {loading ? (
          <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            {/* --- İSTATİSTİK KARTLARI --- */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card text-white bg-primary mb-3 shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Toplam Mezun</h5>
                    <p className="card-text display-4 fw-bold">{alumniList.length}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card text-white bg-success mb-3 shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Farklı Sektörler</h5>
                    <p className="card-text display-4 fw-bold">{sectorCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- GRAFİKLER BÖLÜMÜ --- */}
            <div className="row mb-5">
              {/* Sol Taraf: Yıl Grafiği */}
              <div className="col-md-8">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">📅 Mezuniyet Yılı Dağılımı</h5>
                  </div>
                  <div className="card-body" style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="mezunSayisi" name="Mezun Sayısı" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Sağ Taraf: Sektör Grafiği */}
              <div className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">🏢 Sektör Dağılımı</h5>
                  </div>
                  <div className="card-body" style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* --- HARİTA BÖLÜMÜ (BURASI EKLENDİ) --- */}
            <div className="mb-5">
               <InteractiveMap alumniList={alumniList} />
            </div>

            {/* --- MEZUN LİSTESİ --- */}
            <h4 className="mb-3 border-bottom pb-2">Son Eklenen Mezunlar</h4>
            <div className="row">
              {alumniList.map((alumni) => (
                <div key={alumni.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm border-0 hover-card">
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <span className="display-6 p-3 bg-light rounded-circle">👨‍🎓</span>
                      </div>
                      <h5 className="card-title fw-bold">{alumni.firstName} {alumni.lastName}</h5>
                      <p className="text-muted mb-1">{alumni.jobTitle}</p>
                      <span className="badge bg-secondary mb-3">{alumni.department}</span>
                      
                      <div className="bg-light p-2 rounded">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Şirket:</small>
                          <span className="fw-bold text-primary">{alumni.company?.name || "-"}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Mezuniyet:</small>
                          <span className="fw-bold">{alumni.graduationYear}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;