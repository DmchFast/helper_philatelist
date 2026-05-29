import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './components/auth/AuthContext'
import LoginModal from './components/auth/LoginModal'
import RegisterModal from './components/auth/RegisterModal'
import CatalogPage from './pages/CatalogPage'
import PublicAlbumsPage from './pages/PublicAlbumsPage'
import MyCollectionPage from './pages/MyCollectionPage'
import UsersPage from './pages/UsersPage'
import AdminPage from './pages/AdminPage'

// Компонент-защита только для маршрутов, требующих авторизации
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState('login')

  const handleSwitchToRegister = () => {
    setAuthMode('register')
  }

  const handleSwitchToLogin = () => {
    setAuthMode('login')
  }

  const handleCloseModals = () => {
    setAuthMode('login')
    navigate('/catalog', { replace: true })
  }

  if (loading) return null
  if (user) return children

  return (
    <>
      <LoginModal
        open={authMode === 'login'}
        onCancel={handleCloseModals}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        open={authMode === 'register'}
        onCancel={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}

function AdminRoute() {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') {
    return <Navigate to="/catalog" replace />
  }
  return <AdminPage />
}

function App() {
  return (
    <Routes>
      {/* Открытые для всех маршруты */}
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/collection" element={<PublicAlbumsPage />} />
      <Route path="/" element={<Navigate to="/catalog" replace />} />

      {/* Защищённые маршруты – требуют авторизации */}
      <Route
        path="/my-collection"
        element={
          <PrivateRoute>
            <MyCollectionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminRoute />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App