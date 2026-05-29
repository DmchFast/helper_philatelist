import { Typography } from 'antd'
import defaultStamp from '../../assets/default-stamp.png'
import './AlbumCard.css'

const { Text } = Typography

function AlbumCard({ album }) {
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

  const authorName = album.ownerName || album.author

  return (
    <article className="album-card">
      <div className="album-card__media">
        <div className="album-card__grid">
          {tiles.map((src, index) => (
            <div key={`${album.id}-tile-${index}`} className="album-card__tile">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
          <div className="album-card__tile album-card__tile--count">
            <span>{extraCount}</span>
          </div>
        </div>
      </div>
      <div className="album-card__body">
        <div className="album-card__header">
          <div className="album-card__title">
            {album.title.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="album-card__badge">{album.badge}</div>
        </div>
        <div className="album-card__author">
          <span className="album-card__avatar">
            <span className="material-symbols-outlined">person</span>
          </span>
          <Text className="album-card__author-name">{authorName}</Text>
        </div>
      </div>
    </article>
  )
}

export default AlbumCard