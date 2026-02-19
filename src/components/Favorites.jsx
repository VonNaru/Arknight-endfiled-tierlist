import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';
const FAVORITES_STORAGE_KEY = 'zzz-favorites';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [draggedChar, setDraggedChar] = useState(null);

  const tiers = ['S', 'A', 'B', 'C', 'D'];

  useEffect(() => {
    // Load favorites from localStorage
    loadFavorites();
    loadAllCharacters();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const loadAllCharacters = async () => {
    try {
      const response = await fetch(`${API_URL}/characters`);
      const data = await response.json();
      setAllCharacters(data);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  };

  const handleAddFavorite = (characterId, tier) => {
    try {
      // Find character details from allCharacters
      const character = allCharacters.find(c => c.id === characterId);
      if (!character) {
        console.error('Character not found');
        return;
      }

      // Check if already in favorites
      const existingIndex = favorites.findIndex(f => f.character_id === characterId);
      if (existingIndex !== -1) {
        console.log('Character already in favorites');
        return;
      }

      // Create new favorite object
      const newFavorite = {
        id: Date.now(), // Use timestamp as unique ID
        character_id: characterId,
        custom_tier: tier,
        notes: '',
        created_at: new Date().toISOString(),
        name: character.name,
        element: character.element,
        rarity: character.rarity,
        role: character.role,
        original_tier: character.tier,
        image_url: character.image_url
      };

      const updatedFavorites = [...favorites, newFavorite];
      saveFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const handleUpdateFavorite = (favoriteId, newTier) => {
    try {
      const updatedFavorites = favorites.map(fav => 
        fav.id === favoriteId 
          ? { ...fav, custom_tier: newTier }
          : fav
      );
      saveFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleRemoveFavorite = (favoriteId) => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
      saveFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleDragStart = (char, isFromFavorites = false, favoriteId = null) => {
    setDraggedChar({
      characterId: char.id || char.character_id,
      favoriteId: favoriteId,
      isFromFavorites: isFromFavorites,
      data: char
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (tier) => {
    if (!draggedChar) return;

    const characterId = draggedChar.characterId;
    
    // If dragging from favorites (already in tier list), update the tier
    if (draggedChar.favoriteId) {
      handleUpdateFavorite(draggedChar.favoriteId, tier);
    } else {
      // If dragging from available characters, check if already exists
      const existing = favorites.find(f => f.character_id === characterId);
      
      if (existing) {
        // Already exists, update tier
        handleUpdateFavorite(existing.id, tier);
      } else {
        // New favorite, add it
        handleAddFavorite(characterId, tier);
      }
    }
    
    setDraggedChar(null);
  };

  const getCharactersInTier = (tier) => {
    return favorites.filter(f => f.custom_tier === tier);
  };

  const getUnassignedCharacters = () => {
    const favoriteCharIds = favorites.map(f => f.character_id);
    return allCharacters.filter(char => !favoriteCharIds.includes(char.id));
  };

  const tierColors = {
    'S': '#ff6b6b',
    'A': '#feca57',
    'B': '#f1c40f',
    'C': '#a8e6cf',
    'D': '#95a5a6'
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌟 My Personal Tier List</h2>
      <p style={styles.subtitle}>Drag and drop characters to create your own tier list!</p>

      {/* Tier List */}
      <div style={styles.tierListContainer}>
        {tiers.map(tier => (
          <div 
            key={tier} 
            style={{...styles.tierRow, backgroundColor: tierColors[tier]}}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(tier)}
          >
            <div style={styles.tierLabel}>{tier}</div>
            <div style={styles.tierContent}>
              {getCharactersInTier(tier).map(fav => (
                <div 
                  key={fav.id} 
                  style={styles.characterCard}
                  draggable
                  onDragStart={() => handleDragStart(fav, true, fav.id)}
                  onDoubleClick={() => handleRemoveFavorite(fav.id)}
                  title="Drag to move tier | Double click to remove"
                >
                  <img src={fav.image_url} alt={fav.name} style={styles.charImage} />
                  <div style={styles.charName}>{fav.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Available Characters */}
      <div style={styles.availableSection}>
        <h3 style={styles.sectionTitle}>📌 Available Characters (Drag to add)</h3>
        <div style={styles.characterGrid}>
          {getUnassignedCharacters().map(char => (
            <div 
              key={char.id} 
              style={styles.availableChar}
              draggable
              onDragStart={() => handleDragStart(char, false, null)}
              title="Drag to add to tier list"
            >
              <img src={char.image_url} alt={char.name} style={styles.charImage} />
              <div style={styles.charName}>{char.name}</div>
              <div style={styles.originalTier}>Tier: {char.tier}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    color: '#fff',
    padding: '20px',
    maxWidth: '1400px'
  },
  title: {
    fontSize: '32px',
    margin: '0 0 10px 0',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '16px',
    color: '#aaa',
    textAlign: 'center',
    marginBottom: '30px'
  },
  loginMessage: {
    fontSize: '18px',
    color: '#aaa',
    textAlign: 'center',
    marginTop: '50px'
  },
  tierListContainer: {
    marginBottom: '40px'
  },
  tierRow: {
    display: 'flex',
    minHeight: '100px',
    marginBottom: '10px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.1)'
  },
  tierLabel: {
    width: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexShrink: 0
  },
  tierContent: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '10px',
    alignItems: 'center',
    minHeight: '100px'
  },
  characterCard: {
    width: '80px',
    cursor: 'move',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  charImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid rgba(255,255,255,0.3)',
    backgroundColor: '#1a1a1a'
  },
  charName: {
    fontSize: '10px',
    textAlign: 'center',
    marginTop: '4px',
    color: '#fff',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  availableSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    border: '2px dashed rgba(255,255,255,0.2)'
  },
  sectionTitle: {
    fontSize: '20px',
    marginTop: 0,
    marginBottom: '20px',
    color: '#fff'
  },
  characterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '15px'
  },
  availableChar: {
    cursor: 'move',
    transition: 'transform 0.2s',
    textAlign: 'center'
  },
  originalTier: {
    fontSize: '9px',
    color: '#aaa',
    marginTop: '2px'
  }
};
