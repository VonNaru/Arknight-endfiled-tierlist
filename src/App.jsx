import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/tierlist'
import Favorites from './components/Favorites'
import Background from './components/background'
import AdminPanel from './components/AdminPanel'
import LoginModal from './components/LoginModal'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [user, setUser] = useState(null)

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

  return (
    <Background page={currentPage}>
      <Header 
        onAdminClick={handleAdminClick} 
        user={user}
        onLogout={handleLogout}
      />
      <Navbar onNavigate={setCurrentPage} />

      <div style={{ marginLeft: '170px', marginTop: '80px', padding: '20px' }}>
        {currentPage === 'home' && <Home />}
        {currentPage === 'about' && <About key={refreshTrigger} />}
        {currentPage === 'favorites' && <Favorites key={refreshTrigger} />}
      </div>

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