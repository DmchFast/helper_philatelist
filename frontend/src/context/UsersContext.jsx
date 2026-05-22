import { createContext, useContext, useState, useMemo } from 'react'
import { users as initialUsers, userRoleOptions } from '../data/usersData'

const UsersContext = createContext(null)

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) throw new Error('useUsers must be used within UsersProvider')
  return context
}

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(() => initialUsers)

  // Изменение роли пользователя
  const updateUserRole = (userId, newRole) => {
    const selectedRole = userRoleOptions.find(opt => opt.value === newRole)
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, role: newRole, roleLabel: selectedRole?.label || user.roleLabel }
          : user
      )
    )
  }

  // Удаление пользователя
  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const value = useMemo(
    () => ({ users, updateUserRole, deleteUser }),
    [users]
  )

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}