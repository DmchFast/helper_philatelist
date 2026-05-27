/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getMe,
  getProfile,
  getStoredAuthToken,
  login as loginRequest,
  mapAuthUser,
  register as registerRequest,
  setAuthToken,
  updateProfile as updateProfileRequest,
} from '../../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const hydrateAuth = async () => {
      const token = getStoredAuthToken()
      if (!token) {
        if (active) {
          setLoading(false)
        }
        return
      }

      try {
        setAuthToken(token)
        const [me, profile] = await Promise.all([getMe(), getProfile()])
        if (active) {
          setUser(mapAuthUser(me, profile))
        }
      } catch {
        setAuthToken(null)
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    hydrateAuth()

    return () => {
      active = false
    }
  }, [])

  const applyAuthenticatedUser = useCallback(async (token) => {
    setAuthToken(token)
    const [me, profile] = await Promise.all([getMe(), getProfile()])
    const nextUser = mapAuthUser(me, profile)
    setUser(nextUser)
    return nextUser
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const response = await loginRequest(email, password)
      await applyAuthenticatedUser(response.access_token)
      return true
    } catch {
      return false
    }
  }, [applyAuthenticatedUser])

  const register = useCallback(async (username, email, password) => {
    try {
      const response = await registerRequest(username, email, password)
      await applyAuthenticatedUser(response.access_token)
      return true
    } catch {
      return false
    }
  }, [applyAuthenticatedUser])

  const logout = useCallback(() => {
    setAuthToken(null)
    setUser(null)
  }, [])

  const updateUserProfile = useCallback(async (updatedData) => {
    if (!user) return false

    const payload = {
      first_name: updatedData.name ?? updatedData.first_name ?? user.name,
      last_name: updatedData.surname ?? updatedData.last_name ?? user.surname ?? '',
      country: updatedData.country ?? user.country ?? '',
      city: updatedData.city ?? user.city ?? '',
      bio: updatedData.bio ?? user.bio ?? '',
      avatar_url: updatedData.avatarUrl ?? updatedData.avatar_url ?? null,
    }

    try {
      await updateProfileRequest(payload)
      setUser((prev) =>
        prev
          ? {
            ...prev,
            ...updatedData,
            name: payload.first_name,
            surname: payload.last_name || '',
            city: payload.city || '',
            country: payload.country || '',
            bio: payload.bio || '',
          }
          : prev
      )
      return true
    } catch {
      return false
    }
  }, [user])

  const updateUserStats = useCallback((albumsCount, stampsCount) => {
    setUser((prev) => {
      if (!prev) return prev
      if (prev.albumsCount === albumsCount && prev.stampsCount === stampsCount) {
        return prev
      }
      return { ...prev, albumsCount, stampsCount }
    })
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateUserProfile, updateUserStats }),
    [user, loading, login, register, logout, updateUserProfile, updateUserStats]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}