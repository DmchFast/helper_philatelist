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

  // Создать альбом
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

  // Удалить альбом
  const deleteAlbum = (albumId) => {
    setAlbums(prev => prev.filter(album => album.id !== albumId))
  }

  // Видимость альбома
  const toggleAlbumVisibility = (albumId) => {
    setAlbums(prev =>
      prev.map(album =>
        album.id === albumId ? { ...album, isPublic: !album.isPublic } : album
      )
    )
  }

  // Обновить альбом (замена)
  const updateAlbum = (albumId, updatedAlbum) => {
    setAlbums(prev =>
      prev.map(album => (album.id === albumId ? updatedAlbum : album))
    )
  }

  const value = useMemo(
    () => ({
      albums,
      addAlbum,
      deleteAlbum,
      toggleAlbumVisibility,
      updateAlbum,
    }),
    [albums]
  )

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}