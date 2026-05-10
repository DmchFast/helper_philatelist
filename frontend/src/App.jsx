import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthContext'
import CatalogPage from './pages/CatalogPage'
import PublicAlbumsPage from './pages/PublicAlbumsPage'
import MyCollectionPage from './pages/MyCollectionPage'
import UsersPage from './pages/UsersPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/collection" element={<PublicAlbumsPage />} />
        <Route path="/my-collection" element={<MyCollectionPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App