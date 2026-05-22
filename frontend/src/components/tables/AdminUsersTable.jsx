import { Select, Typography } from 'antd'
import './AdminUsersTable.css'

const { Text } = Typography

const roleOptions = [
  { value: 'collector', label: 'Коллекционер' },
  { value: 'admin', label: 'Администратор' },
]

function AdminUsersTable({ users = [], onRoleChange, onDeleteUser }) {
  return (
    <div className="admin-users">
      <div className="admin-users__scroll">
        <div className="admin-users__head">
          <span>Пользователь</span>
          <span>Почта</span>
          <span>Роль</span>
          <span>Действия</span>
        </div>

        <div className="admin-users__body">
          {users.length === 0 ? (
            <div className="admin-users__row admin-users__row--empty">
              <span className="admin-users__empty">Пользователи не найдены.</span>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="admin-users__row">
                <div className="admin-users__cell admin-users__cell--user">
                  <div className="admin-users__avatar">{user.avatar || user.name?.[0] || '?'}</div>
                  <div>
                    <Text className="admin-users__name">{user.name}</Text>
                    <div className="admin-users__meta">
                      {user.city ? `${user.city}, ` : ''}
                      {user.country}
                    </div>
                  </div>
                </div>

                <div className="admin-users__cell">
                  <Text className="admin-users__email">{user.email}</Text>
                </div>

                <div className="admin-users__cell admin-users__cell--role">
                  <Select
                    className="admin-users__role-select"
                    value={user.role}
                    options={roleOptions}
                    onChange={(value) => onRoleChange?.(user, value)}
                    suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
                  />
                </div>

                <div className="admin-users__cell admin-users__actions">
                  <button
                    type="button"
                    className="admin-users__action"
                    aria-label="Удалить пользователя"
                    onClick={() => onDeleteUser?.(user)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsersTable