import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/auth/AuthContext'
import LoginModal from './components/auth/LoginModal'
import RegisterModal from './components/auth/RegisterModal'
import CatalogPage from './pages/CatalogPage'
import PublicAlbumsPage from './pages/PublicAlbumsPage'
import MyCollectionPage from './pages/MyCollectionPage'
import UsersPage from './pages/UsersPage'
import AdminPage from './pages/AdminPage'

// Компонент-защита только для маршрутов, требующих авторизации
function PrivateRoute({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoginOpen(true)
    } else {
      setLoginOpen(false)
      setRegisterOpen(false)
    }
  }, [user])

  const handleSwitchToRegister = () => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }

  const handleCloseModals = () => {
    setLoginOpen(false)
    setRegisterOpen(false)
    navigate('/catalog', { replace: true })
  }

  if (user) return children

  return (
    <>
      <LoginModal
        open={loginOpen}
        onCancel={handleCloseModals}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        open={registerOpen}
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
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App