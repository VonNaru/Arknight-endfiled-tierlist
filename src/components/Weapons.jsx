import { useState, useEffect } from 'react';
import { API_URL } from '../api/api';

const styles = {
  container: {
    padding: '20px',
    color: 'white'
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#fff'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  weaponCard: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  },
  weaponCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
  },
  weaponImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: '#0f0f1e'
  },
  weaponInfo: {
    padding: '15px'
  },
  weaponName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#fff'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px'
  },
  label: {
    color: '#aaa',
    fontWeight: '600'
  },
  value: {
    color: '#667eea',
    fontWeight: 'bold'
  },
  errorMessage: {
    color: '#ff6666',
    textAlign: 'center',
    padding: '20px'
  },
  loadingMessage: {
    color: '#aaa',
    textAlign: 'center',
    padding: '20px'
  }
};

export default function Weapons() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchWeapons();
  }, []);

  const fetchWeapons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/weapons`);
      const data = await response.json();
      setWeapons(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching weapons:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loadingMessage}>Loading weapons...</div>;
  }

  if (error) {
    return <div style={styles.errorMessage}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚔️ Weapons</h2>
      <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '20px' }}>
        {weapons.length} weapons available
      </p>

      <div style={styles.gridContainer}>
        {weapons.map((weapon) => (
          <div
            key={weapon.id}
            style={{
              ...styles.weaponCard,
              ...(hoveredId === weapon.id ? styles.weaponCardHover : {})
            }}
            onMouseEnter={() => setHoveredId(weapon.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {weapon.image_url && (
              <img
                src={weapon.image_url}
                alt={weapon.name}
                style={styles.weaponImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div style={styles.weaponInfo}>
              <div style={styles.weaponName}>{weapon.name}</div>
              
              {weapon.type && (
                <div style={styles.statRow}>
                  <span style={styles.label}>Type:</span>
                  <span style={styles.value}>{weapon.type}</span>
                </div>
              )}

              {weapon.rarity && (
                <div style={styles.statRow}>
                  <span style={styles.label}>Rarity:</span>
                  <span style={styles.value}>{'⭐'.repeat(weapon.rarity)}</span>
                </div>
              )}

              {weapon.effect && (
                <div style={{...styles.statRow, flexDirection: 'column'}}>
                  <span style={styles.label}>Effect:</span>
                  <span style={{...styles.value, marginTop: '5px'}}>{weapon.effect}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {weapons.length === 0 && (
        <div style={styles.loadingMessage}>No weapons found</div>
      )}
    </div>
  );
}
