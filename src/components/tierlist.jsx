import { useState, useEffect } from 'react'
import { characterAPI } from '../api/api'

// Tier configurations
const TIERS = ['S', 'A', 'B', 'C', 'D']
const ROLES = ['Guard', 'Striker', 'Supporter', 'Caster', 'Defender','Vanguard']

const TIER_COLORS = {
  'S': '#FFD700',    // Gold
  'A': '#FF6B6B',    // Red
  'B': '#4ECDC4',    // Teal
  'C': '#95E1D3',    // Mint
  'D': '#A8DADC'     // Blue
}

// Character Card Component
function CharacterCard({ character, tierColor }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '90px',
      margin: '5px',
      position: 'relative'
    }}>
      <div style={{
        width: '90px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#2a2a2a',
        position: 'relative'
      }}>
        {character.image_url ? (
          <img
            src={character.image_url}
            alt={character.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `<div style="color: white; font-size: 40px;">${character.name[0]}</div>`
            }}
          />
        ) : (
          <div style={{ color: 'white', fontSize: '40px' }}>
            {character.name[0]}
          </div>
        )}
      </div>
    </div>
  )
}

// Main Component
export default function TierList() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    loadCharacters()
    
    // Auto refresh setiap 3 detik untuk melihat perubahan
    const interval = setInterval(() => {
      loadCharacters()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const loadCharacters = async () => {
    try {
      console.log('Fetching characters from API...')
      const data = await characterAPI.getAll()
      console.log('Characters received:', data)
      console.log('Number of characters:', data.length)
      setCharacters(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading characters:', error)
      setLoading(false)
    }
  }

  const getTierData = () => {
    const tierData = {}

    TIERS.forEach(tier => {
      tierData[tier] = {}
      ROLES.forEach(role => {
        tierData[tier][role] = []
      })
    })

    characters.forEach(char => {
      // Gunakan tier_name dari database (prioritas utama)
      // Jika tidak ada, gunakan 'D' sebagai default
      const tier = char.tier_name || 'D'
      const role = char.role_name || 'Guard'
      
      if (tierData[tier] && tierData[tier][role]) {
        tierData[tier][role].push(char)
      } else if (!tierData[tier]) {
        // Jika tier tidak ada di TIERS array, masukkan ke 'D'
        tierData['D'][role]?.push(char)
      }
    })

    return tierData
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
        Loading characters...
      </div>
    )
  }

  const tierData = getTierData()

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1 style={{
        color: 'white',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '36px'
      }}>
        ZZZ Character Tier List
      </h1>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedRole(null)}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedRole === null ? '#FFD700' : '#333',
            color: selectedRole === null ? '#000' : '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: selectedRole === null ? 'bold' : 'normal',
            transition: 'all 0.3s'
          }}
        >
          All
        </button>
        {ROLES.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedRole === role ? '#FF6B6B' : '#333',
              color: selectedRole === role ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: selectedRole === role ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            {role}
          </button>
        ))}
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
      }}>
        <thead>
          <tr>
            <th style={{
              border: '2px solid #333',
              padding: '12px',
              backgroundColor: '#333',
              color: 'white',
              fontSize: '18px'
            }}>
              Tier
            </th>
            <th style={{
              border: '2px solid #333',
              padding: '12px',
              backgroundColor: '#333',
              color: 'white',
              fontSize: '18px'
            }}>
              Characters
            </th>
          </tr>
        </thead>
        <tbody>
          {TIERS.map(tier => (
            <tr key={tier}>
              <td style={{
                border: '2px solid #333',
                padding: '12px',
                backgroundColor: TIER_COLORS[tier],
                fontWeight: 'bold',
                fontSize: '28px',
                textAlign: 'center',
                width: '100px',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {tier}
              </td>
              <td style={{
                border: '2px solid #333',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                verticalAlign: 'top'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {selectedRole 
                    ? tierData[tier][selectedRole]?.map(char => (
                        <CharacterCard
                          key={char.id}
                          character={char}
                          tierColor={TIER_COLORS[tier]}
                        />
                      ))
                    : ROLES.flatMap(role => tierData[tier][role]).map(char => (
                        <CharacterCard
                          key={char.id}
                          character={char}
                          tierColor={TIER_COLORS[tier]}
                        />
                      ))
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        color: 'white'
      }}>
        <h3>Total Characters: {characters.length}</h3>
        <p style={{ color: '#888', marginTop: '10px' }}>
          📊 Tier list ini hanya untuk dilihat (view-only).
        </p>
        <p style={{ color: '#888', marginTop: '5px' }}>
          🔐 Hanya admin yang dapat menambah atau mengedit karakter melalui Admin Panel.
        </p>
      </div>
    </div>
  )
}


