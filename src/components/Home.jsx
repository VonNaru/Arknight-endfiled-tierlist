import { useState, useEffect } from 'react';
import { characterAPI } from '../api/api';
import maluImage from '/images/malu_tuh.jpg'

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
  characterCard: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  },
  characterCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
  },
  characterImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: '#0f0f1e'
  },
  characterInfo: {
    padding: '15px'
  },
  characterName: {
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

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const data = await characterAPI.getAll();
      setCharacters(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching characters:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loadingMessage}>Loading characters...</div>;
  }

  if (error) {
    return <div style={styles.errorMessage}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 Character List</h1>
      
      {characters.length === 0 ? (
        <div style={styles.loadingMessage}>No characters found</div>
      ) : (
        <div style={styles.gridContainer}>
          {characters.map(char => (
            <div 
              key={char.id}
              style={{
                ...styles.characterCard,
                ...(hoveredId === char.id ? styles.characterCardHover : {})
              }}
              onMouseEnter={() => setHoveredId(char.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {char.image_url ? (
                <img src={char.image_url} alt={char.name} style={styles.characterImage} />
              ) : (
                <div style={{...styles.characterImage, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  No Image
                </div>
              )}
              
              <div style={styles.characterInfo}>
                <div style={styles.characterName}>{char.name}</div>
                
                <div style={styles.statRow}>
                  <span style={styles.label}>Rarity:</span>
                  <span style={styles.value}>{char.rarities?.display_text || 'N/A'}</span>
                </div>

                <div style={styles.statRow}>
                  <span style={styles.label}>Element:</span>
                  <span style={styles.value}>{char.elements?.name || 'N/A'}</span>
                </div>

                <div style={styles.statRow}>
                  <span style={styles.label}>Role:</span>
                  <span style={styles.value}>{char.roles?.display_text || 'N/A'}</span>
                </div>

                <div style={styles.statRow}>
                  <span style={styles.label}>Weapon:</span>
                  <span style={styles.value}>{char.weapons?.name || 'N/A'}</span>
                </div>

                <div style={styles.statRow}>
                  <span style={styles.label}>Tier:</span>
                  <span style={styles.value}>{char.tier || 'T3'}</span>
                </div>

                {char.skill && (
                  <div style={{...styles.statRow, flexDirection: 'column'}}>
                    <span style={styles.label}>Skill:</span>
                    <span style={{color: '#ccc', fontSize: '12px', marginTop: '5px'}}>{char.skill}</span>
                  </div>
                )}

                {char.ultimate && (
                  <div style={{...styles.statRow, flexDirection: 'column'}}>
                    <span style={styles.label}>Ultimate:</span>
                    <span style={{color: '#ccc', fontSize: '12px', marginTop: '5px'}}>{char.ultimate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

