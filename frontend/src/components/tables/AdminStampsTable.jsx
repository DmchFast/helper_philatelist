import { useState } from 'react'
import { Typography } from 'antd'
import EditStampModal from '../modal/EditStampModal'
import DeleteConfirmModal from '../modal/DeleteConfirmModal'
import defaultStamp from '../../assets/default-stamp.png'
import './AdminStampsTable.css'

const { Text } = Typography

function AdminStampsTable({ stamps = [], onEditStamp, onDeleteStamp }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState(null)

  const handleEdit = (stamp) => {
    setSelectedStamp(stamp)
    setEditOpen(true)
  }

  const handleDelete = (stamp) => {
    setSelectedStamp(stamp)
    setDeleteOpen(true)
  }

  const handleSaveEdit = (updatedStamp) => {
    onEditStamp?.(updatedStamp)
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
    <div className="admin-stamps">
      <div className="admin-stamps__scroll">
        <div className="admin-stamps__head">
          <span>Марка</span>
          <span>Страна</span>
          <span>Серия</span>
          <span>Год</span>
          <span>Действия</span>
        </div>
        <div className="admin-stamps__body">
          {stamps.length === 0 ? (
            <div className="admin-stamps__row admin-stamps__row--empty">
              <span className="admin-stamps__empty">Марки не найдены.</span>
            </div>
          ) : (
            stamps.map((stamp) => (
              <div key={stamp.id} className="admin-stamps__row">
                <div className="admin-stamps__cell admin-stamps__cell--stamp" data-label="Марка">
                  <div className="admin-stamps__thumb">
                    <img src={stamp.image || defaultStamp} alt={stamp.title} loading="lazy" />
                  </div>
                  <div className="admin-stamps__title-block">
                    <Text className="admin-stamps__name">{stamp.title}</Text>
                    <div className="admin-stamps__meta">Карточка из каталога</div>
                  </div>
                </div>

                <div className="admin-stamps__cell" data-label="Страна">
                  <Text className="admin-stamps__info">{stamp.country}</Text>
                </div>

                <div className="admin-stamps__cell" data-label="Серия">
                  <Text className="admin-stamps__info">{stamp.series}</Text>
                </div>

                <div className="admin-stamps__cell" data-label="Год">
                  <Text className="admin-stamps__year">{stamp.year}</Text>
                </div>

                <div className="admin-stamps__cell admin-stamps__actions" data-label="Действия">
                  <button
                    type="button"
                    className="admin-stamps__action"
                    aria-label="Редактировать"
                    onClick={() => handleEdit(stamp)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    type="button"
                    className="admin-stamps__action"
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
      </div>

      <EditStampModal
        open={editOpen}
        stamp={selectedStamp}
        onCancel={() => {
          setEditOpen(false)
          setSelectedStamp(null)
        }}
        onSave={handleSaveEdit}
        showPriceField={false}
        showDescriptionField={false}
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

export default AdminStampsTable