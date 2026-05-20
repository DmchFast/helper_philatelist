import { useMemo, useState } from 'react'
import { Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import SingleFilter from '../components/filters/SingleFilter'
import UserCard from '../components/cards/UserCard'
import UserInfoModal from '../components/modal/UserInfoModal'
import { navItems } from '../data/catalogData'
import { userRoleOptions, users } from '../data/usersData'
import './UsersPage.css'

const { Title } = Typography

function UsersPage() {
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
  }, [roleFilter, searchTerm])

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
              <Title level={2} className="users-heading">
                Пользователи системы
              </Title>
              <div className="users-subtitle">
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

          <section className="users-grid" aria-label="Список пользователей">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onOpenProfile={setSelectedUser} />
            ))}
          </section>
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