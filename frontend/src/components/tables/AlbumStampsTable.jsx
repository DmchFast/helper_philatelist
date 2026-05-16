import { useState } from 'react'
import { Typography } from 'antd'
import AlbumDetailModal from '../modal/AlbumDetailModalCard'
import EditStampModal from '../modal/EditStampModal'
import DeleteConfirmModal from '../modal/DeleteConfirmModal'
import defaultStamp from '../../assets/default-stamp.png'
import './AlbumStampsTable.css'

const { Text } = Typography

function AlbumStampsTable({ stamps = [], onEditStamp, onDeleteStamp }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState(null)

  const handleView = (stamp) => {
    setSelectedStamp(stamp)
    setDetailOpen(true)
  }

  const handleEdit = (stamp) => {
    setSelectedStamp(stamp)
    setEditOpen(true)
  }

  const handleDelete = (stamp) => {
    setSelectedStamp(stamp)
    setDeleteOpen(true)
  }

  const handleSaveEdit = (updatedStamp) => {
    if (onEditStamp) {
      onEditStamp(updatedStamp)
    }
    setEditOpen(false)
    setSelectedStamp(null)
  }

  const handleConfirmDelete = () => {
    if (onDeleteStamp && selectedStamp) {
      onDeleteStamp(selectedStamp.id)
    }
    setDeleteOpen(false)
    setSelectedStamp(null)
  }

  return (
    <div className="album-stamps">
      <div className="album-stamps__head">
        <span>Марка</span>
        <span>Информация</span>
        <span>Цена</span>
        <span>Год</span>
        <span>Действия</span>
      </div>
      <div className="album-stamps__body">
        {stamps.length === 0 ? (
          <div className="album-stamps__row album-stamps__row--empty">
            <span className="album-stamps__empty">В этом альбоме пока нет марок.</span>
          </div>
        ) : (
          stamps.map((stamp) => (
            <div key={stamp.id} className="album-stamps__row">
              <div className="album-stamps__cell album-stamps__cell--stamp">
                <div className="album-stamps__thumb">
                  <img src={stamp.image || defaultStamp} alt={stamp.title} loading="lazy" />
                </div>
              </div>

              <div className="album-stamps__cell">
                <Text className="album-stamps__info">
                  <Text className="album-stamps__name"> {stamp.title}</Text>
                  <br />
                  {stamp.country} • {stamp.series}
                </Text>
              </div>

              <div className="album-stamps__cell">
                <span className="album-stamps__price">{stamp.price} ₽</span>
              </div>

              <div className="album-stamps__cell">
                <Text className="album-stamps__year">{stamp.year}</Text>
              </div>

              <div className="album-stamps__cell album-stamps__actions">
                <button
                  type="button"
                  className="album-stamps__action"
                  aria-label="Просмотр"
                  onClick={() => handleView(stamp)}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button
                  type="button"
                  className="album-stamps__action"
                  aria-label="Редактировать"
                  onClick={() => handleEdit(stamp)}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  type="button"
                  className="album-stamps__action"
                  aria-label="Удалить"
                  onClick={() => handleDelete(stamp)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AlbumDetailModal
        open={detailOpen}
        stamp={selectedStamp}
        onClose={() => {
          setDetailOpen(false)
          setSelectedStamp(null)
        }}
      />
      <EditStampModal
        open={editOpen}
        stamp={selectedStamp}
        onCancel={() => {
          setEditOpen(false)
          setSelectedStamp(null)
        }}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        onCancel={() => {
          setDeleteOpen(false)
          setSelectedStamp(null)
        }}
        onConfirm={handleConfirmDelete}
        title={`марку "${selectedStamp?.title}"`}
      />
    </div>
  )
}

export default AlbumStampsTable