import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth()

    if (loading) return null
    if (!user) return <Navigate to="/login" />
    if (role && user.role !== role) return <Navigate to="/unauthorized" />

    return children
}

export default ProtectedRoute
