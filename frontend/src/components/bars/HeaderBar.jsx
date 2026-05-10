import { useState } from 'react'
import { Avatar, Input, Typography, Button } from 'antd'
import { useAuth } from '../auth/AuthContext'
import LoginModal from '../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'
import './HeaderBar.css'

const { Text } = Typography

function HeaderBar({ searchTerm, onSearchChange, placeholder }) {
  const { user, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

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
            <Avatar className="header-avatar">{user.name?.[0] || 'U'}</Avatar>
            <div className="header-user">
              <Text className="header-name">{user.name}</Text>
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
            <Button className="header-login-btn" onClick={() => setLoginOpen(true)}>
              Войти
            </Button>
            <Button className="header-register-btn" onClick={() => setRegisterOpen(true)}>
              Регистрация
            </Button>
          </div>
        )}
      </div>

      <LoginModal open={loginOpen} onCancel={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onCancel={() => setRegisterOpen(false)} />
    </header>
  )
}

export default HeaderBar