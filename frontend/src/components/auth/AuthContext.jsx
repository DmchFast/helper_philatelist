import { createContext, useContext, useState, useMemo } from 'react'

export const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    if (email === 'a@mail.ru' && password === '123') {
      setUser({
        name: 'Администратор',
        surname: '',
        email,
        role: 'admin',
        city: '',
        country: '',
        bio: '',
        collectionSince: new Date().getFullYear(),
        stampsCount: 0,
        albumsCount: 0
      })
      return true
    }
    if (email && password) {
      setUser({
        name: email.split('@')[0],
        surname: '',
        email,
        role: 'user',
        city: '',
        country: '',
        bio: '',
        collectionSince: new Date().getFullYear(),
        stampsCount: 0,
        albumsCount: 0
      })
      return true
    }
    return false
  }

  const register = async (username, email, password) => {
    if (email === 'a@mail.ru') return false
    if (username && email && password) {
      setUser({
        name: username,
        surname: '',
        email,
        role: 'user',
        city: '',
        country: '',
        bio: '',
        collectionSince: new Date().getFullYear(),
        stampsCount: 0,
        albumsCount: 0
      })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const updateUserProfile = (updatedData) => {
    setUser(prev => prev ? { ...prev, ...updatedData } : prev)
  }

  const updateUserStats = (albumsCount, stampsCount) => {
    setUser(prev => prev ? { ...prev, albumsCount, stampsCount } : prev)
  }

  const value = useMemo(
    () => ({ user, login, register, logout, updateUserProfile, updateUserStats }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}