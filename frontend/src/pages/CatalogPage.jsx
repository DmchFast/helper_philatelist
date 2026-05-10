import { useState } from 'react'
import Sidebar from '../components/bars/Sidebar'
import { navItems } from '../data/catalogData'

function CatalogPage() {
  return (
    <div className="catalog-page">
      <Sidebar items={navItems} />
      <div className="catalog-content">
        <main className="catalog-main">
          <h2>Каталог марок</h2>
        </main>
      </div>
    </div>
  )
}

export default CatalogPage