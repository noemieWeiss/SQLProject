import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usersApi } from '../services/api'
import '../styles/forms.css'

function Register() {
  const formRef = useRef()
  const navigate = useNavigate()
  const { login } = useUser()

  const handleRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    const username = formData.get('username')
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const usernameExists = await usersApi.checkUsername(username)
      if (usernameExists) {
        alert('Username already exists')
        return
      }

      const createdUser = await usersApi.create({ username, name, email, password })
      if (!createdUser?.id) {
        alert('Registration failed')
        return
      }
      login(createdUser)
      navigate(`/users/${createdUser.id}/home`)
    } catch (error) {
      alert('Server error - please try again')
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <h2>Register</h2>
        <form ref={formRef} onSubmit={handleRegister}>
          <input type="text" name="username" placeholder="Username" required />
          <input type="text" name="name" placeholder="Full Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
          <button type="submit">Register</button>
        </form>
        <button className="secondary-btn" onClick={() => navigate('/login')}>
          Already have an account? Login
        </button>
      </div>
    </div>
  )
}

export default Register
