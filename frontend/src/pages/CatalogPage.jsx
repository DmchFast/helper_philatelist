import { useState, useMemo } from 'react'
import { Typography, message } from 'antd'
import ThreeFilters from '../components/filters/ThreeFilters'  // ← новый импорт
import HeaderBar from '../components/bars/HeaderBar'
import Sidebar from '../components/bars/Sidebar'
import StampGrid from '../components/grids/StampGrid'
import SelectAlbumModal from '../components/modal/SelectAlbumModal'
import CreateStampModal from '../components/modal/CreateStampModal'
import { useCollection } from '../context/CollectionContext'
import { useCatalog } from '../context/CatalogContext'
import { navItems } from '../data/catalogData'
import { useStampFilters, getUniqueCountries, getUniqueDecades, SORT_OPTIONS_LIST_NO_PRICE } from '../useFilters'
import './CatalogPage.css'

const { Title, Text } = Typography

function CatalogPage() {
  const { stamps } = useCatalog()
  const { albums, addStampToAlbum } = useCollection()
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('Все страны')
  const [decadeFilter, setDecadeFilter] = useState('Все года')      // ← новое состояние
  const [sortMode, setSortMode] = useState('По названию')

  // Опции для фильтров
  const countryOptions = useMemo(() => {
    const countries = getUniqueCountries(stamps)
    return countries.map(c => ({ value: c, label: c }))
  }, [stamps])

  const decadeOptions = useMemo(() => {
    return getUniqueDecades(stamps)
  }, [stamps])

  const sortOptions = SORT_OPTIONS_LIST_NO_PRICE

  // Фильтрация с учётом десятилетия
  const filteredStamps = useStampFilters(
    stamps,
    searchTerm,
    countryFilter,
    decadeFilter,      // ← передаём десятилетие
    sortMode,
    0,
    false
  )

  const [selectAlbumOpen, setSelectAlbumOpen] = useState(false)
  const [createStampOpen, setCreateStampOpen] = useState(false)
  const [selectedStampFromCatalog, setSelectedStampFromCatalog] = useState(null)
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)

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
      const albumName = album ? (Array.isArray(album.title) ? album.title.join(' ') : album.title) : 'альбом'
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
        <HeaderBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Поиск по маркам" />
        <main className="catalog-main">
          <div className="catalog-title">
            <div>
              <Title level={2} className="title">Каталог марок</Title>
              <Text className="subtitle">Всего: {filteredStamps.length} марок</Text>
            </div>
            {/* Заменяем TwoFilters на ThreeFilters */}
            <ThreeFilters
              countryValue={countryFilter}
              decadeValue={decadeFilter}
              sortValue={sortMode}
              onCountryChange={setCountryFilter}
              onDecadeChange={setDecadeFilter}
              onSortChange={setSortMode}
              countryOptions={countryOptions}
              decadeOptions={decadeOptions}
              sortOptions={sortOptions}
            />
          </div>
          <StampGrid stamps={filteredStamps} onAdd={handleAddToCollection} />
        </main>
      </div>
      <SelectAlbumModal open={selectAlbumOpen} onCancel={() => { setSelectAlbumOpen(false); setSelectedStampFromCatalog(null) }} onSelect={handleSelectAlbum} albums={albums} />
      <CreateStampModal open={createStampOpen} onCancel={() => { setCreateStampOpen(false); setSelectedStampFromCatalog(null); setSelectedAlbumId(null) }} onCreate={handleCreateStampFromCatalog} initialData={selectedStampFromCatalog} showImageUrlField={false} />
    </div>
  )
}

export default CatalogPage