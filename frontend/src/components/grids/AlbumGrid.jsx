import AlbumCard from '../cards/AlbumCard'
import './AlbumGrid.css'

function AlbumGrid({
  albums,
  onAlbumClick,
  gridVariant = 'default',
  cardComponent: CardComponent = AlbumCard,
  cardProps = {},
}) {
  const gridClass = `album-grid${gridVariant === 'collection' ? ' album-grid--collection' : ''}`

  return (
    <div className={gridClass}>
      {albums.map((album) => (
        <div key={album.id}>
          {onAlbumClick ? (
            <div
              className="album-grid__item"
              onClick={() => onAlbumClick(album)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onAlbumClick(album) }}
            >
              <CardComponent album={album} {...cardProps} />
            </div>
          ) : (
            <CardComponent album={album} {...cardProps} />
          )}
        </div>
      ))}
    </div>
  )
}

export default AlbumGrid