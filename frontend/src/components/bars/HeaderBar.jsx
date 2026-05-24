import { useState } from 'react'
import { Avatar, Input, Typography, Button } from 'antd'
import { useAuth } from '../auth/AuthContext'
import LoginModal from '../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'
import ProfileModal from '../modal/ProfileModal'
import './HeaderBar.css'

const { Text } = Typography

function HeaderBar({ searchTerm, onSearchChange, placeholder }) {
  const { user, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSwitchToRegister = () => {
    setRegisterOpen(true)
    setTimeout(() => setLoginOpen(false), 250)
  }

  const handleSwitchToLogin = () => {
    setLoginOpen(true)
    setTimeout(() => setRegisterOpen(false), 250)
  }

  const openLogin = () => {
    setLoginOpen(true)
    setRegisterOpen(false)
  }

  const openRegister = () => {
    setRegisterOpen(true)
    setLoginOpen(false)
  }

  const handleOpenProfile = () => {
    setProfileOpen(true)
  }

  const isAdmin = user?.role === 'admin'
  const displayName = user?.surname ? `${user.name} ${user.surname}` : user?.name

  return (
    <header className="catalog-header">
      <div className="header-search">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          prefix={<span className="material-symbols-outlined icon">search</span>}
        />
      </div>

      <div className="header-actions">
        {user ? (
          <>
            <Avatar 
              className={`header-avatar${isAdmin ? ' header-avatar--admin' : ''}`}
              onClick={handleOpenProfile} 
              style={{ cursor: 'pointer' }}
            >
              {user.name?.[0] || 'U'}
            </Avatar>
            <div className="header-user">
              <Text className="header-name">{displayName}</Text>
              <Text className="header-role">
                {user.role === 'admin' ? 'АДМИНИСТРАТОР' : 'КОЛЛЕКЦИОНЕР'}
              </Text>
            </div>
            <span className="header-divider" />
            <button type="button" className="icon-button" onClick={logout} aria-label="Выйти">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </>
        ) : (
          <div className="header-buttons">
            <Button className="header-login-btn" onClick={openLogin}>
              Войти
            </Button>
            <Button type='primary' className="header-register-btn" onClick={openRegister}>
              Регистрация
            </Button>
          </div>
        )}
      </div>

      <LoginModal
        open={loginOpen}
        onCancel={() => setLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        open={registerOpen}
        onCancel={() => setRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  )
}

export default HeaderBar