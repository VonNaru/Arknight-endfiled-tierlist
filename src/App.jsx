import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Home from './components/Home'
import TierList from './components/tierlist'
import Favorites from './components/Favorites'
import Background from './components/background'
import AdminPanel from './components/AdminPanel'
import LoginModal from './components/LoginModal'
import CharacterDetailPage from './components/CharacterDetailPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [user, setUser] = useState(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleAdminClick = () => {
    if (!user) {
      // If not logged in, show login modal
      setShowLoginModal(true)
    } else {
      // If logged in, show admin panel (role check akan dilakukan di dalam AdminPanel)
      setShowAdminPanel(true)
    }
  }

  const handleCloseAdmin = () => {
    setShowAdminPanel(false)
  }

  const handleCloseLogin = () => {
    setShowLoginModal(false)
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setShowLoginModal(false)
    // Auto-open admin panel after successful login
    setShowAdminPanel(true)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setShowAdminPanel(false)
  }

  const handleCharacterAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    setSelectedCharacterId(null) // Close character detail when navigating
  }

  return (
    <Background page={currentPage}>
      <Header 
        onAdminClick={handleAdminClick} 
        user={user}
        onLogout={handleLogout}
      />
      <Navbar onNavigate={handleNavigate} />

      {selectedCharacterId ? (
        // Full Page Character Detail
        <CharacterDetailPage 
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)}
        />
      ) : (
        // Normal Pages
        <div style={{ marginLeft: '170px', marginTop: '80px', padding: '20px' }}>
          {currentPage === 'home' && <Home onCharacterClick={setSelectedCharacterId} />}
          {currentPage === 'about' && <TierList key={refreshTrigger} />}
          {currentPage === 'favorites' && <Favorites key={refreshTrigger} user={user} />}
        </div>
      )}

      {showLoginModal && (
        <LoginModal 
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showAdminPanel && (
        <AdminPanel 
          onClose={handleCloseAdmin} 
          onCharacterAdded={handleCharacterAdded}
          user={user}
        />
      )}
    </Background>
  )
}


export default App