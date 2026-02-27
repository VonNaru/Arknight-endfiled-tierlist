import { useState, useEffect } from 'react';
import { characterAPI } from '../api/api';

const styles = {
  container: {
    display: 'flex',
    gap: '30px',
    padding: '30px',
    backgroundColor: '#0a0e27',
    minHeight: '100vh',
    marginLeft: '170px',
    marginTop: '80px'
  },
  leftPanel: {
    flex: '0 0 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  closeButton: {
    position: 'fixed',
    top: '90px',
    right: '30px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '32px',
    cursor: 'pointer',
    zIndex: 10
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '450px',
    overflow: 'hidden',
    borderRadius: '15px'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f1e',
    color: '#666',
    fontSize: '18px'
  },
  tierBadge: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 140px)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  name: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0
  },
  badges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px'
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  statCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statLabel: {
    color: '#aaa',
    fontSize: '12px',
    marginBottom: '5px',
    textTransform: 'uppercase'
  },
  statValue: {
    color: '#667eea',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  description: {
    color: '#ccc',
    fontSize: '14px',
    lineHeight: '1.6',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '15px',
    borderRadius: '10px'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#667eea'
  }
};

const tierColors = {
  'T0': { bg: '#ff6b6b', text: '#fff' },
  'T0.5': { bg: '#feca57', text: '#333' },
  'T1': { bg: '#48dbfb', text: '#333' },
  'T1.5': { bg: '#1dd1a1', text: '#333' },
  'T2': { bg: '#a29bfe', text: '#fff' },
  'T3': { bg: '#636e72', text: '#fff' }
};

const elementColors = {
  'Physical': '#ff9f43',
  'Fire': '#ee5253',
  'Ice': '#54a0ff',
  'Electric': '#f368e0',
  'Ether': '#9b59b6'
};

export default function CharacterDetail({ characterId, onClose }) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (characterId) {
      fetchCharacter();
    }
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      const data = await characterAPI.getById(characterId);
      setCharacter(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching character:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTierStyle = (tier) => {
    const colors = tierColors[tier] || tierColors['T3'];
    return {
      ...styles.tierBadge,
      backgroundColor: colors.bg,
      color: colors.text
    };
  };

  const getElementStyle = (element) => {
    const color = elementColors[element] || '#667eea';
    return {
      ...styles.badge,
      backgroundColor: color,
      color: '#fff'
    };
  };

  if (loading) {
    return (
      <div style={styles.overlay} onClick={handleOverlayClick}>
        <div style={styles.modal}>
          <div style={styles.loading}>Loading character details...</div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div style={styles.overlay} onClick={handleOverlayClick}>
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={onClose}>×</button>
          <div style={{ ...styles.loading, color: '#ff6b6b' }}>
            {error || 'Character not found'}
          </div>
        </div>
      </div>
    );
  }

  const element = character.elements?.name || character.element || 'Unknown';
  const role = character.roles?.display_text || character.role || 'Unknown';
  const rarity = character.rarities?.display_text || character.rarity || 'N/A';
  const weapon = character.weapons?.name || 'N/A';

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <button 
          style={styles.closeButton} 
          onClick={onClose}
          onMouseEnter={(e) => e.target.style.color = '#ff6b6b'}
          onMouseLeave={(e) => e.target.style.color = '#fff'}
        >
          ×
        </button>

        {/* Image */}
        <div style={styles.imageContainer}>
          {character.image_url ? (
            <img src={character.image_url} alt={character.name} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>No Image Available</div>
          )}
          <div style={getTierStyle(character.tier)}>
            {character.tier || 'T3'}
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.name}>{character.name}</h1>
              <div style={styles.badges}>
                <span style={getElementStyle(element)}>{element}</span>
                <span style={{ ...styles.badge, backgroundColor: '#667eea', color: '#fff' }}>
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Rarity</div>
              <div style={styles.statValue}>{'⭐'.repeat(Number(rarity) || 5)}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Element</div>
              <div style={styles.statValue}>{element}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Role</div>
              <div style={styles.statValue}>{role}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Weapon</div>
              <div style={styles.statValue}>{weapon}</div>
            </div>
          </div>

          {/* Skill */}
          {character.skill && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                ⚡ Skill
              </h3>
              <div style={styles.description}>
                {character.skill}
              </div>
            </div>
          )}

          {/* Ultimate */}
          {character.ultimate && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                💥 Ultimate
              </h3>
              <div style={styles.description}>
                {character.ultimate}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
