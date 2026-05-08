import { useTranslation } from 'react-i18next';

const TitleWordCloud = ({ data }) => {
  const { t } = useTranslation();
  // Kelime bulutu renk paleti
  const colors = ['#6c5ce7', '#a29bfe', '#00cec9', '#0984e3', '#fdcb6e', '#e17055', '#74b9ff', '#81ecec', '#fab1a0', '#fd79a8'];

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
      <h5 className="fw-bold mb-4">{t('title_word_cloud_title')}</h5>
      <div className="d-flex flex-wrap justify-content-center align-items-center" style={{ minHeight: '200px', gap: '8px' }}>
        {data.length > 0 ? data.map((word, index) => {
          // Font boyutunu değerine göre ayarla (Örn: 10 ile 32 arası)
          const fontSize = Math.max(12, Math.min(32, 10 + word.value * 2));
          const color = colors[index % colors.length];
          
          return (
            <span
              key={index}
              className="badge px-3 py-2 rounded-pill hover-zoom"
              style={{
                fontSize: `${fontSize}px`,
                backgroundColor: 'transparent',
                color: color,
                border: `2px solid ${color}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              title={`${word.value} Mezun`}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${color}15`;
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {word.text} <span style={{ fontSize: '0.7em', marginLeft: '4px' }}>({word.value})</span>
            </span>
          );
        }) : <p className="text-muted small">{t('title_word_cloud_loading')}</p>}
      </div>
      <div className="mt-3 text-center border-top pt-2">
        <small className="text-muted">{t('title_word_cloud_desc')}</small>
      </div>
    </div>
  );
};

export default TitleWordCloud;
