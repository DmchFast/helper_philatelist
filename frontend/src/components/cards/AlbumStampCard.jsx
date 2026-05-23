import { useState } from 'react'
import { Typography } from 'antd'
import AlbumDetailModal from '../modal/AlbumDetailModalCard'
import './AlbumStampCard.css'

const { Text } = Typography

function AlbumStampCard({ stamp }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const isRare = stamp.price && stamp.price >= 1000

  return (
    <article className="album-stamp-card">
      <div className="album-stamp-card__image">
        {isRare && <div className="album-stamp-card__rare-badge">Редкая</div>}
        <img src={stamp.image} alt="" loading="lazy" />
      </div>
      <div className="album-stamp-card__body">
        <div className="album-stamp-card__text">
          <div className="album-stamp-card__title">{stamp.title}</div>
          <div className="album-stamp-card__meta-group">
            <Text className="album-stamp-card__meta">Серия: {stamp.series}</Text>
            <Text className="album-stamp-card__meta">Год: {stamp.year}</Text>
            <Text className="album-stamp-card__meta">Страна: {stamp.country}</Text>
          </div>
        </div>
        <div className="album-stamp-card__actions">
          <button
            className="album-stamp-card__view-btn"
            onClick={() => setDetailOpen(true)}
            aria-label="Просмотр марки"
          >
            <span className="material-symbols-outlined">visibility</span>
          </button>
          <span className="album-stamp-card__badge">
            {stamp.price ? `${stamp.price} ₽` : '—'}
          </span>
        </div>
      </div>

      <AlbumDetailModal
        open={detailOpen}
        stamp={stamp}
        onClose={() => setDetailOpen(false)}
      />
    </article>
  )
}

export default AlbumStampCard