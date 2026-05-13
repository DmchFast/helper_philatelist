import { useState } from 'react'
import { Typography, Button } from 'antd'
import TwoFilters from '../components/filters/TwoFilters'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AlbumGrid from '../components/grids/AlbumGrid'
import StampGrid from '../components/grids/StampGrid'
import { countryOptions, navItems, sortOptions } from '../data/catalogData'
import { albums, authorOptions, themeOptions } from '../data/publicAlbumsData'
import './PublicAlbumsPage.css'
import './CatalogPage.css'

const { Title, Text } = Typography

function PublicAlbumsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [authorValue, setAuthorValue] = useState('Все авторы')
  const [themeValue, setThemeValue] = useState('Все темы')
  const [countryFilter, setCountryFilter] = useState('Все страны')
  const [sortMode, setSortMode] = useState('По названию')

  if (selectedAlbum) {
    const albumStamps = selectedAlbum.stamps || []
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filteredStamps = albumStamps
      .filter((stamp) => {
        const matchesSearch = stamp.title.toLowerCase().includes(normalizedSearch)
        const matchesCountry = countryFilter === 'Все страны' || stamp.country === countryFilter
        return matchesSearch && matchesCountry
      })
      .sort((a, b) => {
        if (sortMode === 'По названию') {
          return a.title.localeCompare(b.title)
        }
        return 0
      })

    return (
      <div className="catalog-page">
        <Sidebar items={navItems} />
        <div className="catalog-content">
          <HeaderBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Поиск по маркам альбома"
          />

          <main className="catalog-main">
            <div className="albums-title">
              <div className="album-header-row">
                <Button
                  type="text"
                  onClick={() => {
                    setSelectedAlbum(null)
                    setSearchTerm('')
                    setCountryFilter('Все страны')
                    setSortMode('По названию')
                  }}
                  icon={<span className="material-symbols-outlined">arrow_back</span>}
                  className="album-back-btn"
                />
                <div>
                  <Title level={2} className="albums-heading">
                    {selectedAlbum.title.join(' ')}
                  </Title>
                  <Text className="albums-subtitle">{filteredStamps.length} марок в альбоме</Text>
                </div>
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
            <StampGrid stamps={filteredStamps} cardVariant="album" />
          </main>
        </div>
      </div>
    )
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredAlbums = albums.filter((album) => {
    const fullTitle = album.title.join(' ').toLowerCase()
    const matchesSearch = fullTitle.includes(normalizedSearch)
    const matchesAuthor = authorValue === 'Все авторы' || album.author === authorValue
    const matchesTheme = themeValue === 'Все темы' || album.theme === themeValue
    return matchesSearch && matchesAuthor && matchesTheme
  })

  return (
    <div className="albums-page">
      <Sidebar items={navItems} />
      <div className="albums-content">
        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Поиск по альбомам"
        />

        <main className="albums-main">
          <div className="albums-title">
            <div>
              <Title level={2} className="albums-heading">
                Общедоступные альбомы
              </Title>
              <Text className="albums-subtitle">Найдено: {filteredAlbums.length} альбомов</Text>
            </div>

            <TwoFilters
              firstValue={authorValue}
              secondValue={themeValue}
              firstOptions={authorOptions}
              secondOptions={themeOptions}
              onFirstChange={setAuthorValue}
              onSecondChange={setThemeValue}
            />
          </div>

          <div className="album-grid-wrapper">
            <AlbumGrid
              albums={filteredAlbums}
              onAlbumClick={setSelectedAlbum}
              gridVariant="collection"
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PublicAlbumsPage