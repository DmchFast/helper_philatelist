import AlbumCard from '../cards/AlbumCard'
import './AlbumGrid.css'

function AlbumGrid({ albums }) {
  return (
    <div className="album-grid">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  )
}

export default AlbumGrid
