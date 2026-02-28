import { useState, useEffect } from 'react';
import { characterAPI } from '../api/api';

// Add pulse animation
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;

// Inject animation style
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseAnimation;
  document.head.appendChild(style);
}

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '25px',
    backgroundColor: '#0a0e27',
    minHeight: '100vh',
    marginLeft: '170px',
    marginTop: '80px'
  },
  closeButton: {
    position: 'fixed',
    top: '20px',
    right: '30px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '28px',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'color 0.2s'
  },
  leftPanel: {
    flex: '0 0 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '280px',
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    backgroundColor: '#0f0f1e'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block'
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
    top: '12px',
    left: '12px',
    padding: '8px 14px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    backdropFilter: 'blur(10px)'
  },
  header: {
    marginBottom: '12px'
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 10px 0'
  },
  badges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '10px',
    fontWeight: 'bold',
    backdropFilter: 'blur(10px)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px'
  },
  statCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    color: '#aaa',
    fontSize: '11px',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  statValue: {
    color: '#667eea',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 160px)',
    paddingRight: '20px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
    paddingBottom: '10px'
  },
  description: {
    color: '#ccc',
    fontSize: '13px',
    lineHeight: '1.5',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid rgba(102, 126, 234, 0.2)'
  },
  skillsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  skillCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease'
  },
  skillName: {
    color: '#667eea',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '6px'
  },
  skillRank: {
    color: '#aaa',
    fontSize: '11px',
    marginBottom: '6px'
  },
  skillDescription: {
    color: '#ccc',
    fontSize: '12px',
    lineHeight: '1.4'
  },
  potentialCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 193, 7, 0.3)',
    marginBottom: '10px'
  },
  potentialNumber: {
    color: '#ffc107',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  talentCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    marginBottom: '10px'
  },
  talentNumber: {
    color: '#4caf50',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  imageSkeleton: {
    width: '100%',
    height: '280px',
    backgroundColor: '#1a2a4a',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 2s infinite',
    color: '#667eea',
    fontSize: '14px',
    position: 'relative'
  },
  loading: {
    textAlign: 'center',
    padding: '100px 50px',
    color: '#667eea',
    fontSize: '18px'
  },
  error: {
    textAlign: 'center',
    padding: '100px 50px',
    color: '#ff6b6b',
    fontSize: '18px'
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

export default function CharacterDetailPage({ characterId, onClose }) {
  const [character, setCharacter] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (characterId) {
      setImageLoading(true);
      setImageError(false);
      fetchCharacter();
    }
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      const data = await characterAPI.getById(characterId);
      setCharacter(data);
      
      // Fetch character skills
      try {
        const skillsData = await characterAPI.getSkills(characterId);
        setSkills(skillsData);
      } catch (skillsErr) {
        console.error('Error fetching skills:', skillsErr);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching character:', err);
    } finally {
      setLoading(false);
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

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading character details...</div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div style={styles.container}>
        <button 
          style={styles.closeButton} 
          onClick={onClose}
          onMouseEnter={(e) => e.target.style.color = '#ff6b6b'}
          onMouseLeave={(e) => e.target.style.color = '#fff'}
        >
          ←
        </button>
        <div style={styles.error}>
          {error || 'Character not found'}
        </div>
      </div>
    );
  }

  const element = character.elements?.name || character.element || 'Unknown';
  const role = character.roles?.display_text || character.role || 'Unknown';
  const rarity = character.rarities?.display_text || character.rarity || 'N/A';
  const weapon = character.weapons?.name || 'N/A';

  return (
    <div style={styles.container}>
      <button 
        style={styles.closeButton} 
        onClick={onClose}
        onMouseEnter={(e) => e.target.style.color = '#ff6b6b'}
        onMouseLeave={(e) => e.target.style.color = '#fff'}
      >
        ←
      </button>

      {/* Left Panel */}
      <div style={styles.leftPanel}>
        {/* Image */}
        <div style={styles.imageContainer}>
          {imageLoading && !imageError && (
            <div style={styles.imageSkeleton}>
              <span>🖼️ Loading image...</span>
            </div>
          )}
          
          {imageError && (
            <div style={styles.imageSkeleton}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
                <div>Image failed to load</div>
                <div style={{ fontSize: '12px', marginTop: '5px', color: '#aaa' }}>
                  {character.name}
                </div>
              </div>
            </div>
          )}
          
          {character.image_url ? (
            <img 
              src={character.image_url} 
              alt={character.name}
              style={{
                ...styles.image,
                display: imageLoading || imageError ? 'none' : 'block'
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div style={styles.imageSkeleton}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                <div>No image URL</div>
              </div>
            </div>
          )}
          
          <div style={getTierStyle(character.tier)}>
            {character.tier || 'T3'}
          </div>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.name}>{character.name}</h1>
          <div style={styles.badges}>
            <span style={getElementStyle(element)}>{element}</span>
            <span style={{ ...styles.badge, backgroundColor: '#667eea', color: '#fff' }}>
              {role}
            </span>
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
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        {/* Overview */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            👤 Character Overview
          </h3>
          <div style={styles.description}>
            {character.description || 'No description available for this character.'}
          </div>
        </div>

        {/* Skills - When skills data is available */}
        {skills && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              ⚡ Combat Skills
            </h3>
            <div style={styles.skillsContainer}>
              <div style={styles.skillCard}>
                <div style={styles.skillName}>Basic Attack</div>
                <div style={styles.skillRank}>Rank {skills.basic_attack_rank || 1}</div>
                <div style={styles.skillDescription}>{skills.basic_attack_description || 'Loading...'}</div>
              </div>
              <div style={styles.skillCard}>
                <div style={styles.skillName}>Normal Skill</div>
                <div style={styles.skillRank}>Rank {skills.normal_skill_rank || 1}</div>
                <div style={styles.skillDescription}>{skills.normal_skill_description || 'Loading...'}</div>
              </div>
              <div style={styles.skillCard}>
                <div style={styles.skillName}>Combo Skill</div>
                <div style={styles.skillRank}>Rank {skills.combo_skill_rank || 1}</div>
                <div style={styles.skillDescription}>{skills.combo_skill_description || 'Loading...'}</div>
              </div>
              <div style={styles.skillCard}>
                <div style={styles.skillName}>Ultimate</div>
                <div style={styles.skillRank}>Rank {skills.ultimate_rank || 1}</div>
                <div style={styles.skillDescription}>{skills.ultimate_description || 'Loading...'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Potentials - When skills data is available */}
        {skills && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              ✨ Potentials
            </h3>
            {[1, 2, 3, 4, 5].map(i => {
              const nameKey = `potential_${i}_name`;
              const descKey = `potential_${i}_description`;
              return (
                <div key={i} style={styles.potentialCard}>
                  <div style={styles.potentialNumber}>Potential {i}</div>
                  <div style={{ color: '#ffc107', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>
                    {skills[nameKey] || `Potential ${i}`}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '12px', lineHeight: '1.4' }}>
                    {skills[descKey] || 'Loading...'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Talents - When skills data is available */}
        {skills && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              🎯 Talents
            </h3>
            {[1, 2].map(i => {
              const nameKey = `talent_${i}_name`;
              const descKey = `talent_${i}_description`;
              return (
                <div key={i} style={styles.talentCard}>
                  <div style={styles.talentNumber}>Talent {i}</div>
                  <div style={{ color: '#4caf50', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>
                    {skills[nameKey] || `Talent ${i}`}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '12px', lineHeight: '1.4' }}>
                    {skills[descKey] || 'Loading...'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fallback message */}
        {!skills && (
          <div style={styles.section}>
            <div style={styles.description}>
              💡 Skills, Potentials, and Talents data coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
