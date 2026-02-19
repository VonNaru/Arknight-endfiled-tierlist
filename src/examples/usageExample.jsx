import { useState, useEffect } from 'react'
import { characterAPI, tierListAPI } from '../api/api'

function TierListExample() {
  const [characters, setCharacters] = useState([])
  const [tierLists, setTierLists] = useState([])
  const [selectedTiers, setSelectedTiers] = useState({})

  // Load characters saat component mount
  useEffect(() => {
    loadCharacters()
    loadTierLists()
  }, [])

  const loadCharacters = async () => {
    try {
      const data = await characterAPI.getAll()
      setCharacters(data)
    } catch (error) {
      console.error('Error loading characters:', error)
    }
  }

  const loadTierLists = async () => {
    try {
      const data = await tierListAPI.getAll()
      setTierLists(data)
    } catch (error) {
      console.error('Error loading tier lists:', error)
    }
  }

  const handleTierChange = (characterId, tier) => {
    setSelectedTiers(prev => ({
      ...prev,
      [characterId]: tier
    }))
  }

  const saveTierList = async () => {
    try {
      const items = Object.entries(selectedTiers).map(([characterId, tier]) => ({
        character_id: parseInt(characterId),
        tier: tier
      }))

      await tierListAPI.create({
        user_name: 'Guest Player',
        items: items
      })

      alert('Tier list saved!')
      loadTierLists()
    } catch (error) {
      console.error('Error saving tier list:', error)
      alert('Failed to save tier list')
    }
  }

  const addRating = async (characterId) => {
    const rating = prompt('Rating (1-5):')
    const review = prompt('Review:')
    
    if (rating && review) {
      try {
        await characterAPI.addRating(characterId, {
          rating: parseInt(rating),
          review: review,
          user_name: 'Guest Player'
        })
        alert('Rating added!')
      } catch (error) {
        console.error('Error adding rating:', error)
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>ZZZ Character Tier List</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Characters</h2>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Element</th>
              <th>Rarity</th>
              <th>Role</th>
              <th>Tier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {characters.map(char => (
              <tr key={char.id}>
                <td>{char.name}</td>
                <td>{char.element}</td>
                <td>{'⭐'.repeat(char.rarity)}</td>
                <td>{char.role}</td>
                <td>
                  <select 
                    value={selectedTiers[char.id] || ''} 
                    onChange={(e) => handleTierChange(char.id, e.target.value)}
                  >
                    <option value="">-</option>
                    <option value="T0">T0</option>
                    <option value="T0.5">T0.5</option>
                    <option value="T1">T1</option>
                    <option value="T1.5">T1.5</option>
                    <option value="T2">T2</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => addRating(char.id)}>Add Rating</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={saveTierList} style={{ marginTop: '10px' }}>
          Save Tier List
        </button>
      </div>

      <div>
        <h2>Saved Tier Lists ({tierLists.length})</h2>
        <ul>
          {tierLists.map(list => (
            <li key={list.id}>
              {list.user_name} - {list.item_count} characters - {new Date(list.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TierListExample
