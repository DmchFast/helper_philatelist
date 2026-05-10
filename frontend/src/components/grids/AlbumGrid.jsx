import AlbumCard from '../cards/AlbumCard'
import './AlbumGrid.css'

function AlbumGrid({ albums, onAlbumClick }) {
  return (
    <div className="album-grid">
      {albums.map((album) => (
        <div key={album.id}>
          {onAlbumClick ? (
            <button
              type="button"
              className="album-grid__item"
              onClick={() => onAlbumClick(album)}
            >
              <AlbumCard album={album} />
            </button>
          ) : (
            <AlbumCard album={album} />
          )}
        </div>
      ))}
    </div>
  )
}

export default AlbumGrid
