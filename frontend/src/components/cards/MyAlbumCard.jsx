import { Typography } from 'antd'
import defaultStamp from '../../assets/default-stamp.png'
import './MyAlbumCard.css'

const { Text } = Typography

function MyAlbumCard({ album, onToggleVisibility, onDelete }) {
  const isPublic = album.isPublic !== false
  const visibilityLabel = isPublic ? 'Публичный' : 'Приватный'
  const visibilityIcon = isPublic ? 'public' : 'lock'

  const stamps = album.stamps || []
  const totalStamps = stamps.length
  const previewStamps = stamps.slice(0, 3)
  const remainingCount = totalStamps - 3

  // Первые 3 плитки
  const tiles = [
    ...previewStamps.map(s => s.image),
    ...Array(3 - previewStamps.length).fill(defaultStamp)
  ]

  // Четвёртая плитка
  const extraCount = remainingCount > 0 ? `+${remainingCount}` : ''

  const handleToggle = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (onToggleVisibility) {
      onToggleVisibility(album.id)
    }
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (onDelete) {
      onDelete(album.id)
    }
  }

  return (
    <article className="my-album-card">
      <div className="my-album-card__media">
        <div className="my-album-card__grid">
          {tiles.map((src, index) => (
            <div key={`${album.id}-tile-${index}`} className="my-album-card__tile">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
          <div className="my-album-card__tile my-album-card__tile--count">
            <span>{extraCount}</span>
          </div>
        </div>
      </div>
      <div className="my-album-card__body">
        <div className="my-album-card__header">
          <div className="my-album-card__title">
            {album.title.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="my-album-card__badge">{album.badge}</div>
        </div>
        <div className="my-album-card__footer">
          <button
            type="button"
            className="my-album-card__visibility-btn"
            onClick={handleToggle}
            aria-label={`Сделать ${visibilityLabel === 'Публичный' ? 'приватным' : 'публичным'}`}
          >
            <span className="material-symbols-outlined">{visibilityIcon}</span>
            <Text className="my-album-card__visibility-text">{visibilityLabel}</Text>
          </button>
          <button
            type="button"
            className="my-album-card__trash"
            aria-label="Удалить альбом"
            onClick={handleDeleteClick}
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default MyAlbumCard