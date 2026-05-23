import { createContext, useContext, useState, useMemo } from 'react'
import { stamps as initialStamps } from '../data/catalogData'
import defaultStamp from '../assets/default-stamp.png'

// Функция нормализации одной марки
const normalizeStamp = (stamp, index) => {
  // приоритет: stamp.image (новый) > stamp.photo (старый) > defaultStamp
  const imageUrl = stamp.image || stamp.photo || defaultStamp
  return {
    ...stamp,
    id: stamp.id || `stamp-${Date.now()}-${index}`,
    image: imageUrl,
    price: typeof stamp.price === 'number' ? stamp.price : (stamp.price ? Number(stamp.price) : 0),
    description: stamp.description || '',
    rarity: stamp.rarity || 'Обычная',
  }
}

const normalizedInitialStamps = initialStamps.map((stamp, idx) => normalizeStamp(stamp, idx))

const CatalogContext = createContext(null)

export const useCatalog = () => {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog must be used within CatalogProvider')
  return context
}

export const CatalogProvider = ({ children }) => {
  const [stamps, setStamps] = useState(() => normalizedInitialStamps)

  // Добавление марки
  const addStamp = (newStamp) => {
    const nextId = `stamp-${Date.now()}`
    const stampToAdd = normalizeStamp({ ...newStamp, id: nextId }, stamps.length)
    setStamps(prev => [stampToAdd, ...prev])
    return stampToAdd
  }

  // Обновление марки – объединяем старые данные с новыми
  const updateStamp = (updatedStamp) => {
    setStamps(prev =>
      prev.map(stamp => {
        if (stamp.id !== updatedStamp.id) return stamp
        // Объединяем старое и новое, чтобы не потерять поля (например, photo)
        const merged = { ...stamp, ...updatedStamp }
        return normalizeStamp(merged)
      })
    )
  }

  // Удаление марки
  const deleteStamp = (stampId) => {
    setStamps(prev => prev.filter(stamp => stamp.id !== stampId))
  }

  const value = useMemo(
    () => ({ stamps, addStamp, updateStamp, deleteStamp }),
    [stamps]
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}