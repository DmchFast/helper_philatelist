import React from 'react'
import AlbumStampCard from '../cards/AlbumStampCard'
import StampCard from '../cards/StampCard'
import './StampGrid.css'

function StampGrid({ stamps, onAdd, cardVariant = 'catalog' }) {
   const isAlbumView = cardVariant === 'album'

   return (
      <div className="stamp-grid-wrapper">
         <div className="stamp-grid">
            {stamps.map((stamp) =>
               isAlbumView ? (
                  <AlbumStampCard key={stamp.id} stamp={stamp} />
               ) : (
                  <StampCard key={stamp.id} stamp={stamp} onAdd={onAdd} />
               )
            )}
         </div>
      </div>
   )
}

export default StampGrid
