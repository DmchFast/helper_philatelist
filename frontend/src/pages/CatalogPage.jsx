import { useState } from 'react'
import { Typography } from 'antd'
import TwoFilters from '../components/filters/TwoFilters'
import HeaderBar from '../components/bars/HeaderBar'
import Sidebar from '../components/bars/Sidebar'
import { countryOptions, navItems, sortOptions, stamps } from '../data/catalogData'

const { Title, Text } = Typography

function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('Все страны')
  const [sortMode, setSortMode] = useState('По названию')

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredStamps = stamps
    .filter((stamp) => {
      const matchesCountry = countryFilter === 'Все страны' || stamp.country === countryFilter
      const matchesSearch = stamp.title.toLowerCase().includes(normalizedSearch)
      return matchesCountry && matchesSearch
    })
    .sort((a, b) => {
      if (sortMode === 'По названию') return a.title.localeCompare(b.title)
      return 0
    })

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
          <div className="catalog-title">
            <div>
              <Title level={2} className="title">Каталог марок</Title>
              <Text className="subtitle">Всего: {filteredStamps.length} марок</Text>
            </div>
            <TwoFilters
              firstValue={countryFilter}
              secondValue={sortMode}
              firstOptions={countryOptions}
              secondOptions={sortOptions}
              onFirstChange={setCountryFilter}
              onSecondChange={setSortMode}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default CatalogPage