import { useMemo, useState } from 'react'
import { Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import SingleFilter from '../components/filters/SingleFilter'
import UserGrid from '../components/grids/UserGrid'
import UserInfoModal from '../components/modal/UserInfoModal'
import { navItems } from '../data/catalogData'
import { userRoleOptions } from '../data/usersData'
import { useUsers } from '../context/UsersContext'
import './UsersPage.css'
import './CatalogPage.css'

const { Title } = Typography

function UsersPage() {
  const { users } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('Все роли')
  const [selectedUser, setSelectedUser] = useState(null)

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesRole = roleFilter === 'Все роли' || user.role === roleFilter
      const matchesSearch =
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)

      return matchesRole && matchesSearch
    })
  }, [roleFilter, searchTerm, users])

  return (
    <div className="users-page">
      <Sidebar items={navItems} />
      <div className="users-content">
        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Поиск по пользователям"
        />
        <main className="users-main">
          <div className="users-title-row">
            <div>
              <Title level={2} className="title">
                Пользователи системы
              </Title>
              <div className="subtitle">
                Исследуйте сообщество филателистов и экспертов со всего мира
              </div>
            </div>

            <SingleFilter
              value={roleFilter}
              options={userRoleOptions}
              onChange={setRoleFilter}
              ariaLabel="Фильтр по роли"
            />
          </div>

          <div className="users-grid-wrapper">
            <UserGrid users={filteredUsers} onUserClick={setSelectedUser} />
          </div>
        </main>
      </div>

      <UserInfoModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        onCancel={() => setSelectedUser(null)}
      />
    </div>
  )
}

export default UsersPage