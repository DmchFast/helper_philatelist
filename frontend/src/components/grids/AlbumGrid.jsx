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
            <button
              type="button"
              className="album-grid__item"
              onClick={() => onAlbumClick(album)}
            >
              <CardComponent album={album} {...cardProps} />
            </button>
          ) : (
            <CardComponent album={album} {...cardProps} />
          )}
        </div>
      ))}
    </div>
  )
}

export default AlbumGrid