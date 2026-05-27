/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../components/auth/AuthContext'
import defaultStamp from '../assets/default-stamp.png'
import {
  addStampToAlbum as addStampToAlbumRequest,
  createAlbum as createAlbumRequest,
  deleteAlbum as deleteAlbumRequest,
  deleteCollectionStamp,
  getMyAlbums,
  mapAlbum,
  mapCollectionStamp,
  mapFrontendStampToCatalogPayload,
  mapFrontendStampToCollectionPayload,
  updateAlbum as updateAlbumRequest,
  updateCollectionStamp,
} from '../services/api'

const CollectionContext = createContext(null)

export const useCollection = () => {
  const context = useContext(CollectionContext)
  if (!context) throw new Error('useCollection must be used within CollectionProvider')
  return context
}

export const CollectionProvider = ({ children }) => {
  const { user, updateUserStats } = useAuth()
  const [albums, setAlbums] = useState([])
  const userId = user?.email || null

  // Обновление статистики пользователя при изменении альбомов
  useEffect(() => {
    if (!userId) return

    const albumsCount = albums.length
    const stampsCount = albums.reduce((total, album) => total + (album.stamps?.length || 0), 0)
    updateUserStats(albumsCount, stampsCount)
  }, [albums, userId, updateUserStats])

  useEffect(() => {
    let active = true

    const loadAlbums = async () => {
      if (!userId) return

      try {
        const remoteAlbums = await getMyAlbums()
        if (active) {
          setAlbums(remoteAlbums)
        }
      } catch {
        // keep current in-memory state if the backend is unavailable
      }
    }

    loadAlbums()

    return () => {
      active = false
    }
  }, [userId])

  const addAlbum = async (title, ownerName) => {
    const localAlbum = {
      id: `my-${crypto.randomUUID()}`,
      title: [title],
      badge: '0 марок',
      author: ownerName || 'Я',
      ownerName: ownerName || 'Я',
      theme: 'Мои альбомы',
      extraCount: '+0',
      tiles: [],
      isPublic: false,
      stamps: [],
      description: '',
    }

    try {
      const remoteAlbum = await createAlbumRequest({
        title,
        description: '',
        is_public: false,
      })
      const normalizedRemoteAlbum = mapAlbum(remoteAlbum, [], ownerName || 'Я')
      setAlbums(prev => [normalizedRemoteAlbum, ...prev.filter(album => String(album.id) !== String(normalizedRemoteAlbum.id))])
      return normalizedRemoteAlbum
    } catch {
      setAlbums(prev => [...prev, localAlbum])
      return localAlbum
    }
  }

  const deleteAlbum = async (albumId) => {
    try {
      if (!String(albumId).startsWith('my-')) {
        await deleteAlbumRequest(albumId)
      }
    } catch {
      // ignore backend failure and keep local changes
    }
    setAlbums(prev => prev.filter(album => String(album.id) !== String(albumId)))
  }

  const toggleAlbumVisibility = async (albumId) => {
    const currentAlbum = albums.find(album => String(album.id) === String(albumId))
    const nextVisibility = !(currentAlbum?.isPublic)

    try {
      if (!String(albumId).startsWith('my-')) {
        const remoteAlbum = await updateAlbumRequest(albumId, {
          title: currentAlbum?.title?.join(' ') || currentAlbum?.title || '',
          description: currentAlbum?.description || '',
          is_public: nextVisibility,
        })
        const normalizedRemoteAlbum = mapAlbum(remoteAlbum, currentAlbum?.stamps || [], currentAlbum?.ownerName || 'Я')
        setAlbums(prev => prev.map(album => (String(album.id) === String(albumId) ? normalizedRemoteAlbum : album)))
        return
      }
    } catch {
      // fall back to local toggle
    }

    setAlbums(prev =>
      prev.map(album =>
        String(album.id) === String(albumId) ? { ...album, isPublic: nextVisibility } : album
      )
    )
  }

  const updateAlbum = async (albumId, updatedAlbum) => {
    const currentAlbum = albums.find(album => String(album.id) === String(albumId))
    const nextTitle = Array.isArray(updatedAlbum.title)
      ? updatedAlbum.title.join(' ')
      : updatedAlbum.title || currentAlbum?.title?.join(' ') || ''

    try {
      if (!String(albumId).startsWith('my-')) {
        const remoteAlbum = await updateAlbumRequest(albumId, {
          title: nextTitle,
          description: updatedAlbum.description ?? currentAlbum?.description ?? '',
          is_public: updatedAlbum.isPublic ?? updatedAlbum.is_public ?? currentAlbum?.isPublic ?? false,
        })
        const normalizedRemoteAlbum = mapAlbum(remoteAlbum, currentAlbum?.stamps || [], currentAlbum?.ownerName || 'Я')
        setAlbums(prev => prev.map(album => (String(album.id) === String(albumId) ? normalizedRemoteAlbum : album)))
        return normalizedRemoteAlbum
      }
    } catch {
      // fall back to local update
    }

    const nextAlbum = {
      ...currentAlbum,
      ...updatedAlbum,
      title: Array.isArray(updatedAlbum.title) ? updatedAlbum.title : [nextTitle],
    }

    setAlbums(prev =>
      prev.map(album => (String(album.id) === String(albumId) ? nextAlbum : album))
    )
    return nextAlbum
  }

  const updateAlbumTitle = async (albumId, newTitleString) => {
    return updateAlbum(albumId, { title: [newTitleString] })
  }

  const addStampToAlbum = async (albumId, stamp) => {
    const localStamp = {
      id: stamp.id || `stamp-${crypto.randomUUID()}`,
      collectionStampId: stamp.collectionStampId || null,
      catalogStampId: stamp.catalogStampId || null,
      title: stamp.title,
      series: stamp.series,
      year: stamp.year,
      country: stamp.country,
      image: stamp.image || stamp.photo || defaultStamp,
      photo: stamp.photo || stamp.image || defaultStamp,
      price: typeof stamp.price === 'number' ? stamp.price : (stamp.price ? Number(stamp.price) : 0),
      description: stamp.description || '',
      rarity: stamp.rarity || 'Обычная',
    }

    try {
      if (!String(albumId).startsWith('my-')) {
        const remoteStamp = await addStampToAlbumRequest(albumId, {
          ...mapFrontendStampToCollectionPayload(stamp),
        })
        const normalizedRemoteStamp = mapCollectionStamp(remoteStamp)

        setAlbums(prev =>
          prev.map(album => {
            if (String(album.id) !== String(albumId)) return album
            const updatedStamps = [...(album.stamps || []), normalizedRemoteStamp]
            const newBadge = `${updatedStamps.length} ${getNoun(updatedStamps.length, 'марка', 'марки', 'марок')}`
            const extraCountValue = updatedStamps.length > 3 ? `+${updatedStamps.length - 3}` : '+0'
            return {
              ...album,
              stamps: updatedStamps,
              badge: newBadge,
              extraCount: extraCountValue,
              tiles: updatedStamps.slice(0, 3).map((item) => item.image || defaultStamp),
            }
          })
        )
        return normalizedRemoteStamp
      }
    } catch {
      // fall back to local update
    }

    setAlbums(prev =>
      prev.map(album => {
        if (String(album.id) !== String(albumId)) return album
        const updatedStamps = [...(album.stamps || []), localStamp]
        const newBadge = `${updatedStamps.length} ${getNoun(updatedStamps.length, 'марка', 'марки', 'марок')}`
        const extraCountValue = updatedStamps.length > 3 ? `+${updatedStamps.length - 3}` : '+0'
        return {
          ...album,
          stamps: updatedStamps,
          badge: newBadge,
          extraCount: extraCountValue,
          tiles: updatedStamps.slice(0, 3).map((item) => item.image || defaultStamp),
        }
      })
    )
    return localStamp
  }

  const updateStampInAlbum = async (albumId, updatedStamp) => {
    const currentAlbum = albums.find(album => String(album.id) === String(albumId))
    const currentStamp = currentAlbum?.stamps?.find(stamp => String(stamp.id) === String(updatedStamp.id))
    const catalogStampId = updatedStamp.catalogStampId || currentStamp?.catalogStampId
    const collectionStampId = updatedStamp.collectionStampId || currentStamp?.collectionStampId || updatedStamp.id

    try {
      if (!String(albumId).startsWith('my-')) {
        if (collectionStampId) {
          await updateCollectionStamp(albumId, collectionStampId, mapFrontendStampToCollectionPayload(updatedStamp))
        }
      }
    } catch {
      // keep local updates when backend calls fail
    }

    setAlbums(prev =>
      prev.map(album => {
        if (String(album.id) !== String(albumId)) return album
        const updatedStamps = (album.stamps || []).map(stamp =>
          String(stamp.id) === String(updatedStamp.id)
            ? {
              ...stamp,
              ...updatedStamp,
              collectionStampId: stamp.collectionStampId || updatedStamp.collectionStampId,
              catalogStampId: stamp.catalogStampId || updatedStamp.catalogStampId,
            }
            : stamp
        )
        return {
          ...album,
          stamps: updatedStamps,
          tiles: updatedStamps.slice(0, 3).map((item) => item.image || defaultStamp),
        }
      })
    )
  }

  const deleteStampFromAlbum = async (albumId, stampId) => {
    const currentAlbum = albums.find(album => String(album.id) === String(albumId))
    const currentStamp = currentAlbum?.stamps?.find(stamp => String(stamp.id) === String(stampId))

    try {
      if (!String(albumId).startsWith('my-') && currentStamp?.collectionStampId) {
        await deleteCollectionStamp(albumId, currentStamp.collectionStampId)
      }
    } catch {
      // ignore and continue with the local update
    }

    setAlbums(prev =>
      prev.map(album => {
        if (String(album.id) !== String(albumId)) return album
        const updatedStamps = (album.stamps || []).filter(stamp => String(stamp.id) !== String(stampId))
        const newBadge = `${updatedStamps.length} ${getNoun(updatedStamps.length, 'марка', 'марки', 'марок')}`
        const extraCountValue = updatedStamps.length > 3 ? `+${updatedStamps.length - 3}` : '+0'
        return {
          ...album,
          stamps: updatedStamps,
          badge: newBadge,
          extraCount: extraCountValue,
          tiles: updatedStamps.slice(0, 3).map((item) => item.image || defaultStamp),
        }
      })
    )
  }

  const getNoun = (number, one, two, five) => {
    let n = Math.abs(number)
    n %= 100
    if (n >= 5 && n <= 20) return five
    n %= 10
    if (n === 1) return one
    if (n >= 2 && n <= 4) return two
    return five
  }

  const value = {
    albums,
    addAlbum,
    deleteAlbum,
    toggleAlbumVisibility,
    updateAlbum,
    updateAlbumTitle,
    addStampToAlbum,
    updateStampInAlbum,
    deleteStampFromAlbum,
  }

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}