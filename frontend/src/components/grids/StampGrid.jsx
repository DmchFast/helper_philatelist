import React from 'react'
import StampCard from '../cards/StampCard'
import './StampGrid.css'

function StampGrid({ stamps, onAdd }) {
   return (
      <div className="stamp-grid-wrapper">
         <div className="stamp-grid">
            {stamps.map((stamp) => (
               <StampCard key={stamp.id} stamp={stamp} onAdd={onAdd} />
            ))}
         </div>
      </div>
   )
}

export default StampGrid
