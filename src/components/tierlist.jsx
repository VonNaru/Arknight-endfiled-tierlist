import { useState, useEffect } from 'react'
import { characterAPI } from '../api/api'

// Tier configurations
const TIERS = ['T0', 'T0.5', 'T1', 'T1.5', 'T2', 'T3']
const ROLES = ['Attacker', 'Stun', 'Support']

const TIER_COLORS = {
  'T0': '#ff4444',
  'T0.5': '#ff8844',
  'T1': '#ffcc44',
  'T1.5': '#88cc44',
  'T2': '#44ccff',
  'T3': '#44ff88'
}

// TIER_ASSIGNMENTS tidak digunakan lagi - semua data dari database
// const TIER_ASSIGNMENTS = {
//   'Jane Doe': { tier: 'T0', role: 'Attacker' },
//   'Yixuan': { tier: 'T0', role: 'Attacker' },
//   ...
// }

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
      // Gunakan tier dari database (prioritas utama)
      // Jika tidak ada, gunakan 'T3' sebagai default
      const tier = char.tier || 'T3'
      const role = char.role || 'Attacker'
      
      if (tierData[tier] && tierData[tier][role]) {
        tierData[tier][role].push(char)
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
        marginBottom: '30px',
        textAlign: 'center',
        fontSize: '36px'
      }}>
        ZZZ Character Tier List
      </h1>

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
            {ROLES.map(role => (
              <th key={role} style={{
                border: '2px solid #333',
                padding: '12px',
                backgroundColor: '#333',
                color: 'white',
                fontSize: '18px'
              }}>
                {role}
              </th>
            ))}
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
              {ROLES.map(role => (
                <td key={role} style={{
                  border: '2px solid #333',
                  padding: '12px',
                  backgroundColor: '#2a2a2a',
                  verticalAlign: 'top'
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {tierData[tier][role].map(char => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        tierColor={TIER_COLORS[tier]}
                      />
                    ))}
                  </div>
                </td>
              ))}
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


