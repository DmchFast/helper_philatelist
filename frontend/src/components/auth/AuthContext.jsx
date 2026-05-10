import { createContext, useContext, useState, useMemo } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // { name, email, role }

  const login = async (email, password) => {
    // Имитация запроса
    if (email === 'a@mail.ru' && password === '123') {
      setUser({ name: 'Администратор', email, role: 'admin' })
      return true
    }
    if (email && password) {
      setUser({ name: email.split('@')[0], email, role: 'user' })
      return true
    }
    return false
  }

  const register = async (username, email, password) => {
    // Нельзя зарегистрировать админа
    if (email === 'a@mail.ru') return false
    if (username && email && password) {
      setUser({ name: username, email, role: 'user' })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}