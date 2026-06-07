import axios from 'axios'
import defaultStamp from '../assets/default-stamp.png'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:7000'
const AUTH_TOKEN_KEY = 'philatelist_access_token'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export const getStoredAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } catch {
      // ignore storage failures
    }
    return
  }

  delete api.defaults.headers.common.Authorization
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {
    // ignore storage failures
  }
}

const storedToken = getStoredAuthToken()
if (storedToken) {
  setAuthToken(storedToken)
}

const unwrap = async (request) => (await request).data

export const getNoun = (number, one, two, five) => {
  let value = Math.abs(number)
  value %= 100
  if (value >= 5 && value <= 20) return five
  value %= 10
  if (value === 1) return one
  if (value >= 2 && value <= 4) return two
  return five
}

export const deriveRarity = (price) => (Number(price) >= 1000 ? 'Редкая' : 'Обычная')

export const mergeById = (...collections) => {
  const merged = new Map()
  for (const collection of collections) {
    for (const item of collection || []) {
      if (!item || item.id === undefined || item.id === null) continue
      const key = String(item.id)
      if (!merged.has(key)) {
        merged.set(key, item)
      }
    }
  }
  return Array.from(merged.values())
}

export const mapCatalogStamp = (stamp) => {
  const image = stamp.image_url || defaultStamp
  const price = stamp.catalog_price ?? 0

  return {
    id: stamp.id,
    catalogStampId: stamp.id,
    title: stamp.name_code,
    series: stamp.theme_series || '',
    year: stamp.year_issued ? String(stamp.year_issued) : '',
    country: stamp.country || '',
    image,
    photo: image,
    price: Number(price) || 0,
    description: stamp.features || '',
    rarity: deriveRarity(price),
  }
}

export const mapFrontendStampToCatalogPayload = (stamp) => ({
  name_code: stamp.title,
  country: stamp.country || null,
  year_issued: stamp.year ? Number(stamp.year) || null : null,
  nominal_value: stamp.nominalValue || null,
  catalog_price: stamp.price !== undefined ? Number(stamp.price) || 0 : null,
  circulation: stamp.circulation || null,
  perforation: stamp.perforation || null,
  theme_series: stamp.series || null,
  features: stamp.description || null,
  image_url: stamp.image || stamp.photo || null,
})

export const mapCollectionStamp = (collectionStamp) => {
  const catalogStamp = collectionStamp.catalog_stamp || {}
  const image = collectionStamp.image_url || collectionStamp.image || collectionStamp.photo || catalogStamp.image_url || defaultStamp
  const price = collectionStamp.purchase_price ?? collectionStamp.price ?? catalogStamp.catalog_price ?? 0
  const title = collectionStamp.title || catalogStamp.name_code || ''
  const series = collectionStamp.series || catalogStamp.theme_series || ''
  const year = collectionStamp.year_issued || collectionStamp.year || catalogStamp.year_issued || ''
  const country = collectionStamp.country || catalogStamp.country || ''

  return {
    id: collectionStamp.id,
    collectionStampId: collectionStamp.id,
    catalogStampId: collectionStamp.catalog_stamp_id ?? collectionStamp.catalogStampId ?? catalogStamp.id ?? null,
    title,
    series,
    year: year ? String(year) : '',
    country,
    image,
    photo: image,
    price: Number(price) || 0,
    description: collectionStamp.custom_notes || collectionStamp.description || catalogStamp.features || '',
    rarity: deriveRarity(price),
    purchaseDate: collectionStamp.purchase_date || collectionStamp.purchaseDate || null,
    conditionStatus: collectionStamp.condition_status || collectionStamp.conditionStatus || null,
  }
}

export const mapFrontendStampToCollectionPayload = (stamp) => ({
  catalog_stamp_id: stamp.catalogStampId ?? stamp.catalog_stamp_id ?? null,
  title: stamp.title || null,
  series: stamp.series || null,
  year_issued: stamp.year ? Number(stamp.year) || null : null,
  country: stamp.country || null,
  image_url: stamp.image || stamp.photo || null,
  purchase_price: stamp.price !== undefined ? Number(stamp.price) || 0 : null,
  purchase_date: stamp.purchaseDate || null,
  condition_status: stamp.conditionStatus || null,
  custom_notes: stamp.description || null,
})

export const mapUserListItem = (user) => ({
  id: user.id,
  role: user.role,
  roleLabel: user.roleLabel || (user.role === 'admin' ? 'АДМИНИСТРАТОР' : 'КОЛЛЕКЦИОНЕР'),
  name: user.name || user.email || '',
  email: user.email,
  avatar: user.avatar || (user.name?.[0] || user.email?.[0] || '?').toUpperCase(),
  albumsCount: user.albumsCount ?? user.albums_count ?? 0,
  stampsCount: user.stampsCount ?? user.stamps_count ?? 0,
  city: user.city || '',
  country: user.country || '',
  joinedAt: user.joinedAt ?? (user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()),
  bio: user.bio || '',
})

export const mapAuthUser = (me, profile) => ({
  name: profile?.first_name || me.email.split('@')[0],
  surname: profile?.last_name || '',
  email: me.email,
  role: me.role,
  city: profile?.city || '',
  country: profile?.country || '',
  bio: profile?.bio || '',
  collectionSince: me.created_at ? new Date(me.created_at).getFullYear() : new Date().getFullYear(),
  albumsCount: me.albums_count || 0,
  stampsCount: me.stamps_count || 0,
})

export const mapAlbum = (album, stamps = [], ownerName = 'Я') => {
  const mappedStamps = stamps.map(mapCollectionStamp)
  const totalStamps = mappedStamps.length

  return {
    id: album.id,
    title: [album.title],
    badge: `${totalStamps} ${getNoun(totalStamps, 'марка', 'марки', 'марок')}`,
    author: ownerName,
    ownerName,
    theme: album.description || 'Мои альбомы',
    extraCount: totalStamps > 3 ? `+${totalStamps - 3}` : '+0',
    tiles: mappedStamps.slice(0, 3).map((stamp) => stamp.image || defaultStamp),
    isPublic: Boolean(album.is_public),
    stamps: mappedStamps,
    description: album.description || '',
    categoryId: album.category_id || null,
  }
}

export const login = async (email, password) => unwrap(api.post('/auth/login', { email, password }))

export const register = async (username, email, password) => unwrap(api.post('/auth/register', {
  email,
  password,
  first_name: username,
}))

export const getMe = async () => unwrap(api.get('/auth/me'))

export const getProfile = async () => unwrap(api.get('/auth/profile'))

export const updateProfile = async (payload) => unwrap(api.put('/auth/profile', payload))

export const getCatalogStamps = async (params = {}) => unwrap(api.get('/catalog/stamps', { params }))

export const createCatalogStamp = async (payload) => unwrap(api.post('/catalog/stamps', payload))

export const updateCatalogStamp = async (stampId, payload) => unwrap(api.put(`/catalog/stamps/${stampId}`, payload))

export const deleteCatalogStamp = async (stampId) => unwrap(api.delete(`/catalog/stamps/${stampId}`))

export const getMyAlbums = async () => {
  const albums = await unwrap(api.get('/albums/'))
  const albumsWithStamps = await Promise.all(
    albums.map(async (album) => {
      const stamps = await unwrap(api.get(`/albums/${album.id}/stamps`))
      return mapAlbum(album, stamps, 'Я')
    })
  )
  return albumsWithStamps
}

export const createAlbum = async (payload) => unwrap(api.post('/albums/', payload))

export const updateAlbum = async (albumId, payload) => unwrap(api.put(`/albums/${albumId}`, payload))

export const deleteAlbum = async (albumId) => unwrap(api.delete(`/albums/${albumId}`))

export const getAlbumStamps = async (albumId) => unwrap(api.get(`/albums/${albumId}/stamps`))

export const addStampToAlbum = async (albumId, payload) => unwrap(api.post(`/albums/${albumId}/stamps`, payload))

export const updateCollectionStamp = async (albumId, stampId, payload) => unwrap(api.put(`/albums/${albumId}/stamps/${stampId}`, payload))

export const deleteCollectionStamp = async (albumId, stampId) => unwrap(api.delete(`/albums/${albumId}/stamps/${stampId}`))

export const getPublicAlbums = async (params = {}) => {
  const albums = await unwrap(api.get('/public/albums', { params }))
  return albums.map((album) => mapAlbum(album, album.stamps || [], album.owner_name || album.ownerName || ''))
}

export const getUsers = async (params = {}) => unwrap(api.get('/users/', { params }))

export const getAdminUsers = async (params = {}) => unwrap(api.get('/admin/users/', { params }))

export const updateUserRole = async (userId, role) => unwrap(api.put(`/admin/users/${userId}/role`, { role }))

export const deleteUser = async (userId) => unwrap(api.delete(`/admin/users/${userId}`))

export const getCategories = async () => unwrap(api.get('/categories/'))

export default api
