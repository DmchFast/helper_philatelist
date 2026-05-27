import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Sidebar.css'

function Sidebar({ items }) {
  const { user } = useAuth()

  // Филтрация пуктов меню, администрирование только для admin
  const visibleItems = items.filter(
    (item) => item.id !== 'admin' || user?.role === 'admin'
  )

  const getPath = (id) => {
    switch (id) {
      case 'catalog': return '/catalog'
      case 'collection': return '/collection'
      case 'my': return '/my-collection'
      case 'users': return '/users'
      case 'admin': return '/admin'
      default: return '/'
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">Ф</div>
        <div className="sidebar__brand-text">СПРАВОЧНИК <span>ФИЛАТЕЛИСТА</span></div>
      </div>
      <nav className="sidebar__nav">
        {visibleItems.map((item) => {   // ← Было items, стало visibleItems
          const path = getPath(item.id)
          return (
            <NavLink
              key={item.id}
              to={path}
              end
              className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
            >
              <span className="material-symbols-outlined sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar