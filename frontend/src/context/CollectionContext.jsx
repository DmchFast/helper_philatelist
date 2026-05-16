import { createContext, useContext, useState, useMemo } from 'react'
import { albums as initialAlbums } from '../data/myCollectionData'

const CollectionContext = createContext(null)

export const useCollection = () => {
  const context = useContext(CollectionContext)
  if (!context) throw new Error('useCollection must be used within CollectionProvider')
  return context
}

export const CollectionProvider = ({ children }) => {
  const [albums, setAlbums] = useState(initialAlbums)

  const addAlbum = (title) => {
    const newAlbum = {
      id: `my-${Date.now()}`,
      title: [title],
      badge: '0 марок',
      author: 'Я',
      theme: 'Мои альбомы',
      extraCount: '+0',
      tiles: [],
      isPublic: false,
      stamps: [],
    }
    setAlbums(prev => [...prev, newAlbum])
    return newAlbum
  }

  const deleteAlbum = (albumId) => {
    setAlbums(prev => prev.filter(album => album.id !== albumId))
  }

  const toggleAlbumVisibility = (albumId) => {
    setAlbums(prev =>
      prev.map(album =>
        album.id === albumId ? { ...album, isPublic: !album.isPublic } : album
      )
    )
  }

  const updateAlbum = (albumId, updatedAlbum) => {
    setAlbums(prev =>
      prev.map(album => (album.id === albumId ? updatedAlbum : album))
    )
  }

  // Добавление марки в альбом
  const addStampToAlbum = (albumId, stamp) => {
    setAlbums(prev =>
      prev.map(album => {
        if (album.id !== albumId) return album
        const updatedStamps = [...(album.stamps || []), stamp]
        const newBadge = `${updatedStamps.length} ${getNoun(updatedStamps.length, 'марка', 'марки', 'марок')}`
        const extraCountValue = updatedStamps.length > 3 ? `+${updatedStamps.length - 3}` : ''
        return {
          ...album,
          stamps: updatedStamps,
          badge: newBadge,
          extraCount: extraCountValue,
        }
      })
    )
  }

  // Обновление марки в альбоме
  const updateStampInAlbum = (albumId, updatedStamp) => {
    setAlbums(prev =>
      prev.map(album => {
        if (album.id !== albumId) return album
        const updatedStamps = (album.stamps || []).map(stamp =>
          stamp.id === updatedStamp.id ? updatedStamp : stamp
        )
        return { ...album, stamps: updatedStamps }
      })
    )
  }

  // Удаление марки из альбома
  const deleteStampFromAlbum = (albumId, stampId) => {
    setAlbums(prev =>
      prev.map(album => {
        if (album.id !== albumId) return album
        const updatedStamps = (album.stamps || []).filter(stamp => stamp.id !== stampId)
        const newBadge = `${updatedStamps.length} ${getNoun(updatedStamps.length, 'марка', 'марки', 'марок')}`
        const extraCountValue = updatedStamps.length > 3 ? `+${updatedStamps.length - 3}` : ''
        return {
          ...album,
          stamps: updatedStamps,
          badge: newBadge,
          extraCount: extraCountValue,
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

  const value = useMemo(
    () => ({
      albums,
      addAlbum,
      deleteAlbum,
      toggleAlbumVisibility,
      updateAlbum,
      addStampToAlbum,
      updateStampInAlbum,
      deleteStampFromAlbum,
    }),
    [albums]
  )

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}