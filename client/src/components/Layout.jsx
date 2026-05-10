import { useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usersApi } from '../services/api'
import usePersistentState from '../hooks/usePersistentState'
import useLastPath from '../hooks/useLastPath'
import '../styles/Home.css'

const ChangePasswordModal = ({ userId, onClose }) => {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!form.current || !form.next || !form.confirm) {
      setError('All fields are required')
      return
    }
    if (form.next !== form.confirm) {
      setError('New passwords do not match')
      return
    }
    if (form.next.length <= 8) {
      setError('New password must be more than 8 characters')
      return
    }
    if (!/[0-9]/.test(form.next)) {
      setError('New password must contain at least one number')
      return
    }
    if (!/[A-Z]/.test(form.next)) {
      setError('New password must contain at least one uppercase letter')
      return
    }
    setLoading(true)
    try {
      await usersApi.changePassword(userId, form.current, form.next)
      setSuccess(true)
    } catch (err) {
      setError(err.message === 'Current password is incorrect' ? 'Current password is incorrect' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="info-modal" onClick={onClose}>
      <div className="info-content change-pw-modal" onClick={e => e.stopPropagation()}>
        {success ? (
          <>
            <h3>Password Changed!</h3>
            <p>Your password has been updated successfully.</p>
            <button onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <h3>Change Password</h3>
            <div className="pw-field">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Current password"
                value={form.current}
                onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
              />
            </div>
            <div className="pw-field">
              <label>New Password</label>
              <input
                type="password"
                placeholder="New password"
                value={form.next}
                onChange={e => setForm(f => ({ ...f, next: e.target.value }))}
              />
            </div>
            <div className="pw-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            {error && <p className="pw-error">{error}</p>}
            <div className="pw-buttons">
              <button onClick={onClose} className="cancel-pw-btn">Cancel</button>
              <button onClick={handleSubmit} disabled={loading} className="save-pw-btn">
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

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
        <ChangePasswordModal
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
