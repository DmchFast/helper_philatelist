/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { stamps as initialStamps } from '../data/catalogData'
import defaultStamp from '../assets/default-stamp.png'
import {
  createCatalogStamp,
  deleteCatalogStamp,
  getCatalogStamps,
  mapCatalogStamp,
  mapFrontendStampToCatalogPayload,
  updateCatalogStamp,
  mergeById,
} from '../services/api'

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

  useEffect(() => {
    let active = true

    const loadCatalog = async () => {
      try {
        const remoteStamps = await getCatalogStamps()
        if (active && remoteStamps.length > 0) {
          setStamps(prev => mergeById(remoteStamps.map(mapCatalogStamp), prev))
        }
      } catch {
        // keep demo data when the backend is unavailable
      }
    }

    loadCatalog()

    return () => {
      active = false
    }
  }, [])

  // Добавление марки
  const addStamp = async (newStamp) => {
    const payload = mapFrontendStampToCatalogPayload(newStamp)

    try {
      const createdStamp = await createCatalogStamp(payload)
      const stampToAdd = mapCatalogStamp(createdStamp)
      setStamps(prev => [stampToAdd, ...prev.filter(stamp => String(stamp.id) !== String(stampToAdd.id))])
      return stampToAdd
    } catch {
      const nextId = `stamp-${crypto.randomUUID()}`
      const stampToAdd = normalizeStamp({ ...newStamp, id: nextId }, stamps.length)
      setStamps(prev => [stampToAdd, ...prev])
      return stampToAdd
    }
  }

  // Обновление марки – объединяем старые данные с новыми
  const updateStamp = async (updatedStamp) => {
    const currentStamp = stamps.find(stamp => String(stamp.id) === String(updatedStamp.id))
    const stampId = updatedStamp.catalogStampId || currentStamp?.catalogStampId || updatedStamp.id
    const payload = mapFrontendStampToCatalogPayload(updatedStamp)

    try {
      if (stampId !== undefined && stampId !== null) {
        const remoteStamp = await updateCatalogStamp(stampId, payload)
        const normalizedRemoteStamp = mapCatalogStamp(remoteStamp)
        setStamps(prev =>
          prev.map(stamp => {
            if (String(stamp.id) !== String(updatedStamp.id)) return stamp
            return { ...stamp, ...normalizedRemoteStamp, id: stamp.id, catalogStampId: normalizedRemoteStamp.catalogStampId }
          })
        )
        return normalizedRemoteStamp
      }
    } catch {
      // fall through to local update
    }

    setStamps(prev =>
      prev.map(stamp => {
        if (String(stamp.id) !== String(updatedStamp.id)) return stamp
        const merged = { ...stamp, ...updatedStamp }
        return normalizeStamp(merged)
      })
    )
    return updatedStamp
  }

  // Удаление марки
  const deleteStamp = async (stampId) => {
    const currentStamp = stamps.find(stamp => String(stamp.id) === String(stampId))

    try {
      if (currentStamp?.catalogStampId !== undefined && currentStamp?.catalogStampId !== null) {
        await deleteCatalogStamp(currentStamp.catalogStampId)
      }
    } catch {
      // keep local state in sync even if the remote delete fails
    }

    setStamps(prev => prev.filter(stamp => String(stamp.id) !== String(stampId)))
  }

  const value = { stamps, addStamp, updateStamp, deleteStamp }

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}