import { useState } from 'react'
import { usersApi } from '../services/api'

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

export default ChangePasswordModal
