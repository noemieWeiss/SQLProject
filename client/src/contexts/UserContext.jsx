import { createContext, useContext, useState, useEffect } from 'react'
import { usersApi } from '../services/api'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem('username')
    
    if (!username) {
      setLoading(false)
      return
    }

    usersApi.getAll().then(users => {
      const found = users.find(u => u.username === username)
      if (found) {
        setUser(found)
      } else {
        localStorage.removeItem('username')
      }
      setLoading(false)
    })
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('username', userData.username)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('username')
  }

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
