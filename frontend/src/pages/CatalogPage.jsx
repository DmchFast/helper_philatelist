import { useState } from 'react'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import { navItems } from '../data/catalogData'

function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="catalog-page">
      <Sidebar items={navItems} />
      <div className="catalog-content">
        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Поиск по маркам"
        />
        <main className="catalog-main">
          <h2>Каталог марок</h2>
        </main>
      </div>
    </div>
  )
}

export default CatalogPage