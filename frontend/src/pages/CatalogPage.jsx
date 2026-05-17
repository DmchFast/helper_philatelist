import { useState } from 'react'
import { Typography, message } from 'antd'
import TwoFilters from '../components/filters/TwoFilters'
import HeaderBar from '../components/bars/HeaderBar'
import Sidebar from '../components/bars/Sidebar'
import StampGrid from '../components/grids/StampGrid'
import SelectAlbumModal from '../components/modal/SelectAlbumModal'
import CreateStampModal from '../components/modal/CreateStampModal'
import { useCollection } from '../context/CollectionContext'
import { countryOptions, navItems, sortOptions, stamps } from '../data/catalogData'
import './CatalogPage.css'

const { Title, Text } = Typography

function CatalogPage() {
  const { albums, addStampToAlbum } = useCollection()
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('Все страны')
  const [sortMode, setSortMode] = useState('По названию')
  const [selectAlbumOpen, setSelectAlbumOpen] = useState(false)
  const [createStampOpen, setCreateStampOpen] = useState(false)
  const [selectedStampFromCatalog, setSelectedStampFromCatalog] = useState(null)
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredStamps = stamps
    .filter((stamp) => {
      const matchesCountry = countryFilter === 'Все страны' || stamp.country === countryFilter
      const matchesSearch = stamp.title.toLowerCase().includes(normalizedSearch)
      return matchesCountry && matchesSearch
    })
    .sort((a, b) => {
      if (sortMode === 'По названию') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  const handleAddToCollection = (stamp) => {
    setSelectedStampFromCatalog(stamp)
    setSelectAlbumOpen(true)
  }

  const handleSelectAlbum = (album) => {
    setSelectedAlbumId(album.id)
    setSelectAlbumOpen(false)
    setCreateStampOpen(true)
  }

  const handleCreateStampFromCatalog = (newStamp) => {
    if (selectedAlbumId) {
      addStampToAlbum(selectedAlbumId, newStamp);
      const album = albums.find(a => a.id === selectedAlbumId);
      const albumName = album
        ? Array.isArray(album.title)
          ? album.title.join(' ')
          : album.title || album.name || 'альбом'
        : 'альбом'
      message.success(`Марка "${newStamp.title}" добавлена в альбом "${albumName}"`);
    }
    setCreateStampOpen(false);
    setSelectedStampFromCatalog(null);
    setSelectedAlbumId(null);
  };

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
              <Title level={2} className="title">
                Каталог марок
              </Title>
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

          <StampGrid
            stamps={filteredStamps}
            onAdd={handleAddToCollection}
          />
        </main>
      </div>

      <SelectAlbumModal
        open={selectAlbumOpen}
        onCancel={() => {
          setSelectAlbumOpen(false)
          setSelectedStampFromCatalog(null)
        }}
        onSelect={handleSelectAlbum}
        albums={albums}
      />

      <CreateStampModal
        open={createStampOpen}
        onCancel={() => {
          setCreateStampOpen(false)
          setSelectedStampFromCatalog(null)
          setSelectedAlbumId(null)
        }}
        onCreate={handleCreateStampFromCatalog}
        initialData={selectedStampFromCatalog}
      />
    </div>
  )
}

export default CatalogPage