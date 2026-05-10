import { Navigate, useParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

function ProtectedRoute({ children }) {
  const { userId } = useParams()
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.id.toString() !== userId) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
