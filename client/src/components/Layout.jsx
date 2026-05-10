import { useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import usePersistentState from '../hooks/usePersistentState'
import useLastPath from '../hooks/useLastPath'
import ChangePassword from './ChangePassword'
import '../styles/Home.css'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useUser()
  const [showInfo, setShowInfo] = usePersistentState(user?.id ? `ui:layout:${user.id}:showInfo` : null, false)
  const [showChangePw, setShowChangePw] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const isHomePage = location.pathname.includes('/home')
  useLastPath()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="home-nav">
          <div className="user-avatar" onClick={() => setShowInfo(!showInfo)}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!isHomePage && <button onClick={() => navigate(`/users/${user.id}/home`)}>Home</button>}
          <button onClick={() => setShowInfo(!showInfo)}>Info</button>
          <button onClick={() => setShowChangePw(true)}>Change Password</button>
          <button onClick={() => navigate(`/users/${user.id}/todos`)}>Todos</button>
          <button onClick={() => navigate(`/users/${user.id}/posts`)}>Posts</button>
          <button onClick={() => setShowLogoutConfirm(true)} className="logout-btn">Logout</button>
        </nav>

        {location.pathname.includes('/home') ? <h1>Welcome, {user.name}!</h1> : null}
      </header>

      {showInfo && (
        <div className="info-modal">
          <div className="info-content">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => setShowInfo(false)}>Close</button>
          </div>
        </div>
      )}

      {showChangePw && (
        <ChangePassword
          userId={user.id}
          onClose={() => setShowChangePw(false)}
        />
      )}

      {showLogoutConfirm && (
        <div className="info-modal" onClick={() => setShowLogoutConfirm(false)}>
          <div className="info-content change-pw-modal" onClick={e => e.stopPropagation()}>
            <h3>Log Out</h3>
            <p>Are you sure you want to log out?</p>
            <div className="pw-buttons">
              <button onClick={() => setShowLogoutConfirm(false)} className="cancel-pw-btn">Cancel</button>
              <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </div>
          </div>
        </div>
      )}

      <main className="home-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
