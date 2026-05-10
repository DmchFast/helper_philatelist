import { Typography } from 'antd'
import './AlbumCard.css'

const { Text } = Typography

function AlbumCard({ album }) {
  return (
    <article className="album-card">
      <div className="album-card__media">
        <div className="album-card__grid">
          {album.tiles.map((src, index) => (
            <div key={`${album.id}-${index}`} className="album-card__tile">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
          <div className="album-card__tile album-card__tile--count">
            <span>{album.extraCount}</span>
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
          <Text className="album-card__author-name">{album.author}</Text>
        </div>
      </div>
    </article>
  )
}

export default AlbumCard