import { useMemo, useState } from 'react'
import { Button, Tabs, Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AdminStampsTable from '../components/tables/AdminStampsTable'
import AdminUsersTable from '../components/tables/AdminUsersTable'
import AdminStampFilters from '../components/filters/AdminStampFilters'
import SingleFilter from '../components/filters/SingleFilter'
import CreateStampModal from '../components/modal/CreateStampModal'
import DeleteConfirmModal from '../components/modal/DeleteConfirmModal'
import { navItems } from '../data/catalogData'
import { userRoleOptions } from '../data/usersData'
import { useCatalog } from '../context/CatalogContext'
import { useUsers } from '../context/UsersContext'
import './AdminPage.css'
import './CatalogPage.css'

const { Title, Text } = Typography

const stampSortOptions = [
  { value: 'По названию', label: 'По названию' },
  { value: 'По году', label: 'По году' },
]

function AdminPage() {
  const { stamps, addStamp, updateStamp, deleteStamp } = useCatalog()
  const { users, updateUserRole, deleteUser } = useUsers()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('stamps')
  const [createStampOpen, setCreateStampOpen] = useState(false)
  const [stampCountryValue, setStampCountryValue] = useState('Все страны')
  const [stampYearValue, setStampYearValue] = useState('Все года')
  const [stampSortValue, setStampSortValue] = useState('По названию')
  const [stampPriceLimit, setStampPriceLimit] = useState(() =>
    Math.max(...stamps.map((stamp) => Number(stamp.price) || 0), 0)
  )
  const [roleFilter, setRoleFilter] = useState('Все роли')
  const [userToDelete, setUserToDelete] = useState(null)

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const stampMaxPrice = useMemo(
    () => Math.max(...stamps.map((stamp) => Number(stamp.price) || 0), 0),
    [stamps]
  )

  const stampCountryOptions = useMemo(() => {
    const countries = Array.from(new Set(stamps.map((stamp) => stamp.country).filter(Boolean)))
    return [{ value: 'Все страны', label: 'Все страны' }, ...countries.map((country) => ({ value: country, label: country }))]
  }, [stamps])

  const stampYearOptions = useMemo(() => {
    const years = Array.from(new Set(stamps.map((stamp) => stamp.year).filter(Boolean)))
    return [{ value: 'Все года', label: 'Все года' }, ...years.map((year) => ({ value: year, label: year }))]
  }, [stamps])

  const filteredStamps = useMemo(() => {
    return stamps
      .filter((stamp) => {
        const fullText = [stamp.title, stamp.series, stamp.country].join(' ').toLowerCase()
        return fullText.includes(normalizedSearch)
      })
      .filter((stamp) =>
        stampCountryValue === 'Все страны' ? true : stamp.country === stampCountryValue
      )
      .filter((stamp) =>
        stampYearValue === 'Все года' ? true : String(stamp.year) === String(stampYearValue)
      )
      .filter((stamp) => (stampPriceLimit ? (Number(stamp.price) || 0) <= stampPriceLimit : true))
      .sort((a, b) => {
        if (stampSortValue === 'По году') return Number(a.year) - Number(b.year)
        return a.title.localeCompare(b.title)
      })
  }, [normalizedSearch, stampCountryValue, stampPriceLimit, stampSortValue, stampYearValue, stamps])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.roleLabel || user.role]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
      const matchesRole = roleFilter === 'Все роли' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [normalizedSearch, roleFilter, users])

  const handleCreateStamp = (newStamp) => {
    addStamp(newStamp)
    setCreateStampOpen(false)
    // Обновляем лимит цены
    const newMax = Math.max(...stamps.map(s => Number(s.price) || 0), Number(newStamp.price) || 0)
    setStampPriceLimit(newMax)
  }

  const handleEditStamp = (updatedStamp) => {
    updateStamp(updatedStamp)
    setStampPriceLimit(prev => Math.max(prev, Number(updatedStamp.price) || 0))
  }

  const handleDeleteStamp = (stampId) => {
    deleteStamp(stampId)
  }

  const handleRoleChange = (user, role) => {
    updateUserRole(user.id, role)
  }

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return
    deleteUser(userToDelete.id)
    setUserToDelete(null)
  }

  const adminTabs = [
    {
      key: 'stamps',
      label: 'Марки',
      children: (
        <div className="admin-section">
          <div className="admin-section__head">
            <div className="admin-section__title-block">
              <Title level={3} className="admin-section__title">
                Каталог марок
              </Title>
              <div className="subtitle">
                Управление марками из каталога
              </div>
            </div>

            <div className="admin-section__controls">
              <AdminStampFilters
                countryValue={stampCountryValue}
                yearValue={stampYearValue}
                sortValue={stampSortValue}
                priceLimit={stampPriceLimit}
                onCountryChange={setStampCountryValue}
                onYearChange={setStampYearValue}
                onSortChange={setStampSortValue}
                onPriceChange={setStampPriceLimit}
                maxPrice={stampMaxPrice}
                countryOptions={stampCountryOptions}
                yearOptions={stampYearOptions}
                sortOptions={stampSortOptions}
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
              <Title level={3} className="admin-section__title">
                Роли пользователей
              </Title>
              <div className="admin-section__subtitle">
                Управление ролями и удаляйте пользователей
              </div>
            </div>

            <div className="admin-section__controls">
              <SingleFilter
                value={roleFilter}
                options={userRoleOptions}
                onChange={setRoleFilter}
                ariaLabel="Фильтр по роли пользователя"
              />
            </div>
          </div>

          <div className="admin-table-wrapper">
            <AdminUsersTable
              users={filteredUsers}
              onRoleChange={handleRoleChange}
              onDeleteUser={setUserToDelete}
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="admin-page">
      <Sidebar items={navItems} />
      <div className="admin-content">
        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder={activeTab === 'stamps' ? 'Поиск по маркам' : 'Поиск по пользователям'}
        />

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

      <CreateStampModal
        open={createStampOpen}
        onCancel={() => setCreateStampOpen(false)}
        onCreate={handleCreateStamp}
        showPriceField={false}
      />

      <DeleteConfirmModal
        open={Boolean(userToDelete)}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDeleteUser}
        title={`пользователя "${userToDelete?.name || ''}"`}
      />
    </div>
  )
}

export default AdminPage