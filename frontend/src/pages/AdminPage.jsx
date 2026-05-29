import { useMemo, useState } from 'react'
import { Button, Tabs, Typography } from 'antd'
import { useAuth } from '../components/auth/AuthContext'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AdminStampsTable from '../components/tables/AdminStampsTable'
import AdminUsersTable from '../components/tables/AdminUsersTable'
import ThreeFilters from '../components/filters/ThreeFilters'
import SingleFilter from '../components/filters/SingleFilter'
import CreateStampModal from '../components/modal/CreateStampModal'
import DeleteConfirmModal from '../components/modal/DeleteConfirmModal'
import { navItems } from '../data/catalogData'
import { userRoleOptions } from '../data/usersData'
import { useCatalog } from '../context/CatalogContext'
import { useUsers } from '../context/UsersContext'
import { getUniqueCountries, getUniqueDecades, useStampFilters, SORT_OPTIONS_LIST_NO_PRICE } from '../useFilters'   // ← изменён импорт
import './AdminPage.css'

const { Title } = Typography

function AdminPage() {
  const { user: currentUser } = useAuth()
  const { stamps, addStamp, updateStamp, deleteStamp } = useCatalog()
  const { users, updateUserRole, deleteUser } = useUsers()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('stamps')
  const [createStampOpen, setCreateStampOpen] = useState(false)
  const [stampCountryValue, setStampCountryValue] = useState('Все страны')
  const [stampDecadeValue, setStampDecadeValue] = useState('Все года')
  const [stampSortValue, setStampSortValue] = useState('По названию')
  const [stampPriceLimit, setStampPriceLimit] = useState(() =>
    Math.max(...stamps.map((stamp) => Number(stamp.price) || 0), 0)
  )
  const [roleFilter, setRoleFilter] = useState('Все роли')
  const [userToDelete, setUserToDelete] = useState(null)

  const countryOptions = useMemo(() => {
    const countries = getUniqueCountries(stamps)
    return countries.map(c => ({ value: c, label: c }))
  }, [stamps])

  const decadeOptions = useMemo(() => {
    return getUniqueDecades(stamps)
  }, [stamps])

  const sortOptions = SORT_OPTIONS_LIST_NO_PRICE   // ← изменено

  const filteredStamps = useStampFilters(
    stamps,
    searchTerm,
    stampCountryValue,
    stampDecadeValue,
    stampSortValue,
    stampPriceLimit,
    false // нет кнопки "Редкие"
  )

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (currentUser?.email && user.email === currentUser.email) return false
      const matchesSearch = [user.name, user.email, user.roleLabel || user.role]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'Все роли' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [currentUser?.email, searchTerm, roleFilter, users])

  const handleCreateStamp = (newStamp) => {
    addStamp(newStamp)
    setCreateStampOpen(false)
    const newMax = Math.max(...stamps.map(s => Number(s.price) || 0), Number(newStamp.price) || 0)
    setStampPriceLimit(newMax)
  }

  const handleEditStamp = (updatedStamp) => {
    updateStamp(updatedStamp)
    setStampPriceLimit(prev => Math.max(prev, Number(updatedStamp.price) || 0))
  }

  const handleDeleteStamp = (stampId) => deleteStamp(stampId)
  const handleRoleChange = (user, role) => updateUserRole(user.id, role)
  const handleConfirmDeleteUser = () => { if (userToDelete) { deleteUser(userToDelete.id); setUserToDelete(null) } }

  const adminTabs = [
    {
      key: 'stamps',
      label: 'Марки',
      children: (
        <div className="admin-section">
          <div className="admin-section__head">
            <div className="admin-section__title-block">
              <Title level={3} className="title">
                Каталог марок
              </Title>
              <div className="subtitle">
                Управление марками из каталога
              </div>
            </div>

            <div className="admin-section__controls">
              <ThreeFilters
                countryValue={stampCountryValue}
                decadeValue={stampDecadeValue}
                sortValue={stampSortValue}
                onCountryChange={setStampCountryValue}
                onDecadeChange={setStampDecadeValue}
                onSortChange={setStampSortValue}
                countryOptions={countryOptions}
                decadeOptions={decadeOptions}
                sortOptions={sortOptions}
              />
              <Button
                type="primary"
                className="admin-add-btn"
                icon={<span className="material-symbols-outlined">add</span>}
                onClick={() => setCreateStampOpen(true)}
              >
                Добавить марку
              </Button>
            </div>
          </div>
          <div className="admin-table-wrapper">
            <AdminStampsTable
              stamps={filteredStamps}
              onEditStamp={handleEditStamp}
              onDeleteStamp={handleDeleteStamp}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'users',
      label: 'Пользователи',
      children: (
        <div className="admin-section">
          <div className="admin-section__head">
            <div className="admin-section__title-block">
              <Title level={3} className="title">
                Роли пользователей
              </Title>
              <div className="subtitle">
                Управление ролями и удаление пользователей
              </div>
            </div>

            <div className="admin-section__controls">
              <SingleFilter value={roleFilter} options={userRoleOptions} onChange={setRoleFilter} ariaLabel="Фильтр по роли пользователя" />
            </div>
          </div>
          <div className="admin-table-wrapper">
            <AdminUsersTable users={filteredUsers} onRoleChange={handleRoleChange} onDeleteUser={setUserToDelete} />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="admin-page">
      <Sidebar items={navItems} />
      <div className="admin-content">
        <HeaderBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder={activeTab === 'stamps' ? 'Поиск по маркам' : 'Поиск по пользователям'} />
        <main className="admin-main">
          <div className="admin-title-row">
            <div>
              <Title level={2} className="title" style={{marginBottom: 0}}>
                Администрирование
              </Title>
            </div>
          </div>
          <Tabs className="admin-tabs" activeKey={activeTab} onChange={setActiveTab} items={adminTabs} />
        </main>
      </div>
      <CreateStampModal open={createStampOpen} onCancel={() => setCreateStampOpen(false)} onCreate={handleCreateStamp} showPriceField={false} />
      <DeleteConfirmModal open={Boolean(userToDelete)} onCancel={() => setUserToDelete(null)} onConfirm={handleConfirmDeleteUser} title={`пользователя "${userToDelete?.name || ''}"`} />
    </div>
  )
}

export default AdminPage