/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { users as initialUsers, userRoleOptions } from '../data/usersData'
import { deleteUser as deleteUserRequest, getUsers, mapUserListItem, mergeById, updateUserRole as updateUserRoleRequest } from '../services/api'
import { useAuth } from '../components/auth/AuthContext'

const UsersContext = createContext(null)

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) throw new Error('useUsers must be used within UsersProvider')
  return context
}

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(() => initialUsers)
  const { user } = useAuth()

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      if (!user) return

      try {
        const remoteUsers = await getUsers()
        if (active && remoteUsers.length > 0) {
          setUsers(prev => mergeById(remoteUsers.map(mapUserListItem), prev))
        }
      } catch {
        // fallback to demo data
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [user])

  // Изменение роли пользователя
  const updateUserRole = async (userId, newRole) => {
    const selectedRole = userRoleOptions.find(opt => opt.value === newRole)

    try {
      if (!String(userId).startsWith('user-')) {
        await updateUserRoleRequest(userId, newRole)
      }
    } catch {
      // fall back to local state changes
    }

    setUsers(prev =>
      prev.map(currentUser =>
        String(currentUser.id) === String(userId)
          ? { ...currentUser, role: newRole, roleLabel: selectedRole?.label || currentUser.roleLabel }
          : currentUser
      )
    )
  }

  // Удаление пользователя
  const deleteUser = async (userId) => {
    try {
      if (!String(userId).startsWith('user-')) {
        await deleteUserRequest(userId)
      }
    } catch {
      // ignore remote failures to keep the UI responsive
    }

    setUsers(prev => prev.filter(currentUser => String(currentUser.id) !== String(userId)))
  }

  const value = { users, updateUserRole, deleteUser }

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}