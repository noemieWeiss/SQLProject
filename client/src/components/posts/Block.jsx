import { useState } from 'react'

const BlockModal = ({ userName, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }
    setLoading(true)
    setError('')
    const result = await onConfirm(password)
    setLoading(false)
    if (!result.success) {
      setError(result.message === 'Wrong password' ? 'Wrong password' : result.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>Block User</h3>
        <p>Block <strong>{userName}</strong>?<br/>Their posts will no longer appear in your feed.</p>
        <p className="modal-subtitle">Enter your password to confirm:</p>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          className="modal-input"
          autoFocus
        />
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-buttons">
          <button onClick={onCancel} disabled={loading} className="cancel-btn">Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="block-confirm-btn">
            {loading ? '...' : 'Block'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockModal
