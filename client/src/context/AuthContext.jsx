// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/',
    withCredentials: true,
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const getCurrentUser = async () => {
        const res = await axiosInstance.get('/users/current-user')
        return res.data
    }

    const logoutUser = async () => {
        await axiosInstance.post('/users/logout')
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getCurrentUser()
                setUser(res.data)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const logout = async () => {
        await logoutUser()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
