import { useState, useEffect } from 'react';
import { API_URL } from '../api/api';

const styles = {
  container: {
    padding: '20px',
    color: 'white',
    marginLeft: '150px',
    minHeight: '100vh'
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#fff'
  },
  filterSection: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
  },
  filterTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  searchBar: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '25px',
    borderRadius: '8px',
    border: '2px solid #667eea',
    backgroundColor: '#0f0f1e',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box'
  },
  searchBarFocus: {
    borderColor: '#ff9d3d'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '25px'
  },
  filterButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '2px solid #667eea',
    backgroundColor: '#0f0f1e',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    fontSize: '14px'
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    color: '#fff',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
  },
  gearTypeContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px',
    flexWrap: 'wrap'
  },
  gearTypeIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    border: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    backgroundColor: '#0f0f1e'
  },
  gearTypeIconActive: {
    borderColor: '#667eea',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
    backgroundColor: '#1a1a3e'
  },
  artsDmgContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  artsDmgTag: {
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    border: '2px solid transparent',
    fontSize: '12px'
  },
  artsDmgTagAny: {
    backgroundColor: '#FFD700',
    color: '#000'
  },
  artsDmgTagAnyActive: {
    borderColor: '#FFD700',
    boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)'
  },
  artsDmgTagStun: {
    backgroundColor: '#808080',
    color: '#fff'
  },
  artsDmgTagStunActive: {
    borderColor: '#808080',
    boxShadow: '0 5px 15px rgba(128, 128, 128, 0.4)'
  },
  artsDmgTagSlow: {
    backgroundColor: '#FF4444',
    color: '#fff'
  },
  artsDmgTagSlowActive: {
    borderColor: '#FF4444',
    boxShadow: '0 5px 15px rgba(255, 68, 68, 0.4)'
  },
  artsDmgTagFreeze: {
    backgroundColor: '#00BFFF',
    color: '#000'
  },
  artsDmgTagFreezeActive: {
    borderColor: '#00BFFF',
    boxShadow: '0 5px 15px rgba(0, 191, 255, 0.4)'
  },
  artsDmgTagPoison: {
    backgroundColor: '#90EE90',
    color: '#000'
  },
  artsDmgTagPoisonActive: {
    borderColor: '#90EE90',
    boxShadow: '0 5px 15px rgba(144, 238, 144, 0.4)'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '30px'
  },
  gearCard: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  },
  gearCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
  },
  gearImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: '#0f0f1e'
  },
  gearInfo: {
    padding: '15px'
  },
  gearName: {
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
  emptyMessage: {
    textAlign: 'center',
    padding: '40px',
    color: '#aaa',
    fontSize: '18px'
  },
  loadingMessage: {
    textAlign: 'center',
    padding: '40px',
    color: '#aaa',
    fontSize: '18px'
  }
};

const GEAR_TYPES = {
  armor: { icon: '🛡️', label: 'Armor' },
  glove: { icon: '🧤', label: 'Glove' },
  kit: { icon: '🔧', label: 'Kit' }
};

const LEVELS = ['LV 10', 'LV 20', 'LV 28', 'LV 36', 'LV 50', 'LV 70'];

const ARTS_DMG_TYPES = [
  { id: 'any', label: 'Any', style: styles.artsDmgTagAny },
  { id: 'stun', label: 'Stun', style: styles.artsDmgTagStun },
  { id: 'slow', label: 'Slow', style: styles.artsDmgTagSlow },
  { id: 'freeze', label: 'Freeze', style: styles.artsDmgTagFreeze },
  { id: 'poison', label: 'Poison', style: styles.artsDmgTagPoison }
];

export default function Gear() {
  const [gears, setGears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGearType, setSelectedGearType] = useState(new Set());
  const [selectedLevel, setSelectedLevel] = useState(new Set());
  const [selectedArtsDmg, setSelectedArtsDmg] = useState(new Set());
  const [focusedSearch, setFocusedSearch] = useState(false);

  useEffect(() => {
    fetchGears();
  }, []);

  const fetchGears = async () => {
    try {
      setLoading(true);
      // Mock data - dalam praktik akan replace dengan API call
      const mockGears = [
        {
          id: 1,
          name: 'Iron Armor',
          type: 'armor',
          level: 'LV 10',
          defense: 100,
          artsDmg: 'any',
          image: 'https://via.placeholder.com/250x200?text=Iron+Armor'
        },
        {
          id: 2,
          name: 'Leather Glove',
          type: 'glove',
          level: 'LV 20',
          atk: 50,
          artsDmg: 'stun',
          image: 'https://via.placeholder.com/250x200?text=Leather+Glove'
        },
        {
          id: 3,
          name: 'Repair Kit',
          type: 'kit',
          level: 'LV 28',
          healing: 75,
          artsDmg: 'freeze',
          image: 'https://via.placeholder.com/250x200?text=Repair+Kit'
        },
        {
          id: 4,
          name: 'Steel Armor',
          type: 'armor',
          level: 'LV 36',
          defense: 150,
          artsDmg: 'slow',
          image: 'https://via.placeholder.com/250x200?text=Steel+Armor'
        },
        {
          id: 5,
          name: 'Combat Glove',
          type: 'glove',
          level: 'LV 50',
          atk: 100,
          artsDmg: 'poison',
          image: 'https://via.placeholder.com/250x200?text=Combat+Glove'
        },
        {
          id: 6,
          name: 'Advanced Kit',
          type: 'kit',
          level: 'LV 70',
          healing: 150,
          artsDmg: 'any',
          image: 'https://via.placeholder.com/250x200?text=Advanced+Kit'
        }
      ];
      setGears(mockGears);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching gears:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleGearType = (type) => {
    const newSet = new Set(selectedGearType);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedGearType(newSet);
  };

  const toggleLevel = (level) => {
    const newSet = new Set(selectedLevel);
    if (newSet.has(level)) {
      newSet.delete(level);
    } else {
      newSet.add(level);
    }
    setSelectedLevel(newSet);
  };

  const toggleArtsDmg = (dmgType) => {
    const newSet = new Set(selectedArtsDmg);
    if (newSet.has(dmgType)) {
      newSet.delete(dmgType);
    } else {
      newSet.add(dmgType);
    }
    setSelectedArtsDmg(newSet);
  };

  const filteredGears = gears.filter((gear) => {
    const matchesSearch =
      gear.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedGearType.size === 0 || selectedGearType.has(gear.type);
    const matchesLevel =
      selectedLevel.size === 0 || selectedLevel.has(gear.level);
    const matchesArtsDmg =
      selectedArtsDmg.size === 0 || selectedArtsDmg.has(gear.artsDmg);

    return matchesSearch && matchesType && matchesLevel && matchesArtsDmg;
  });

  if (loading) {
    return <div style={styles.loadingMessage}>Loading gears...</div>;
  }

  if (error) {
    return <div style={styles.loadingMessage}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Gear</h1>

      {/* Search Bar */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search gear..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setFocusedSearch(true)}
          onBlur={() => setFocusedSearch(false)}
          style={{
            ...styles.searchBar,
            ...(focusedSearch && styles.searchBarFocus)
          }}
        />
      </div>

      {/* Gear Type Filter */}
      <div style={styles.filterSection}>
        <div style={styles.filterTitle}>Gear</div>
        <div style={styles.gearTypeContainer}>
          {Object.entries(GEAR_TYPES).map(([key, value]) => (
            <div
              key={key}
              style={{
                ...styles.gearTypeIcon,
                ...(selectedGearType.has(key) && styles.gearTypeIconActive)
              }}
              onClick={() => toggleGearType(key)}
              title={value.label}
            >
              {value.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div style={styles.filterSection}>
        <div style={styles.filterTitle}>Level</div>
        <div style={styles.buttonGroup}>
          {LEVELS.map((level) => (
            <button
              key={level}
              style={{
                ...styles.filterButton,
                ...(selectedLevel.has(level) && styles.filterButtonActive)
              }}
              onClick={() => toggleLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Arts DMG Boost Type Filter */}
      <div style={styles.filterSection}>
        <div style={styles.filterTitle}>Arts DMG Boost Type</div>
        <div style={styles.artsDmgContainer}>
          {ARTS_DMG_TYPES.map((type) => (
            <button
              key={type.id}
              style={{
                ...styles.artsDmgTag,
                ...type.style,
                ...(selectedArtsDmg.has(type.id) &&
                  (type.id === 'any' && styles.artsDmgTagAnyActive) ||
                  (type.id === 'stun' && styles.artsDmgTagStunActive) ||
                  (type.id === 'slow' && styles.artsDmgTagSlowActive) ||
                  (type.id === 'freeze' && styles.artsDmgTagFreezeActive) ||
                  (type.id === 'poison' && styles.artsDmgTagPoisonActive))
              }}
              onClick={() => toggleArtsDmg(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gear Grid */}
      {filteredGears.length > 0 ? (
        <div style={styles.gridContainer}>
          {filteredGears.map((gear) => (
            <div
              key={gear.id}
              style={{
                ...styles.gearCard,
                ...(hoveredId === gear.id && styles.gearCardHover)
              }}
              onMouseEnter={() => setHoveredId(gear.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={gear.image}
                alt={gear.name}
                style={styles.gearImage}
              />
              <div style={styles.gearInfo}>
                <div style={styles.gearName}>{gear.name}</div>
                <div style={styles.statRow}>
                  <span style={styles.label}>Type:</span>
                  <span style={styles.value}>
                    {GEAR_TYPES[gear.type]?.label}
                  </span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.label}>Level:</span>
                  <span style={styles.value}>{gear.level}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.label}>Arts DMG:</span>
                  <span style={styles.value}>{gear.artsDmg}</span>
                </div>
                {gear.defense && (
                  <div style={styles.statRow}>
                    <span style={styles.label}>Defense:</span>
                    <span style={styles.value}>{gear.defense}</span>
                  </div>
                )}
                {gear.atk && (
                  <div style={styles.statRow}>
                    <span style={styles.label}>ATK:</span>
                    <span style={styles.value}>{gear.atk}</span>
                  </div>
                )}
                {gear.healing && (
                  <div style={styles.statRow}>
                    <span style={styles.label}>Healing:</span>
                    <span style={styles.value}>{gear.healing}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyMessage}>
          No gears found matching your filters.
        </div>
      )}
    </div>
  );
}
