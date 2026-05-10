import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/auth/AuthContext'
import CatalogPage from './pages/CatalogPage'
import PublicAlbumsPage from './pages/PublicAlbumsPage'
import MyCollectionPage from './pages/MyCollectionPage'
import UsersPage from './pages/UsersPage'
import AdminPage from './pages/AdminPage'

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
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/collection" element={<PublicAlbumsPage />} />
        <Route path="/my-collection" element={<MyCollectionPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App