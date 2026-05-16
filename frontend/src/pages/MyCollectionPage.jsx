import { useState, useEffect } from 'react'
import { Button, Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AlbumGrid from '../components/grids/AlbumGrid'
import MyAlbumCard from '../components/cards/MyAlbumCard'
import AlbumStampsTable from '../components/tables/AlbumStampsTable'
import StampsFilters from '../components/filters/StampsFilters'
import { navItems } from '../data/catalogData'
import { useCollection } from '../context/CollectionContext'
import CreateAlbumModal from '../components/modal/CreateAlbumModal'
import CreateStampModal from '../components/modal/CreateStampModal'
import './CatalogPage.css'
import './MyCollectionPage.css'

const { Title } = Typography

function MyCollectionPage() {
  const {
    albums,
    addAlbum,
    deleteAlbum,
    toggleAlbumVisibility,
    addStampToAlbum,
    updateStampInAlbum,
    deleteStampFromAlbum,
  } = useCollection()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [countryValue, setCountryValue] = useState('Все страны')
  const [yearValue, setYearValue] = useState('Все года')
  const [sortValue, setSortValue] = useState('По названию')
  const [priceLimit, setPriceLimit] = useState(0)
  const [rareOnly, setRareOnly] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createStampModalOpen, setCreateStampModalOpen] = useState(false)

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredAlbums = albums.filter((album) =>
    album.title.join(' ').toLowerCase().includes(normalizedSearch)
  )

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId) || null

  useEffect(() => {
    if (selectedAlbum) {
      const prices = selectedAlbum.stamps?.map((s) => s.price || 0) || [0]
      const max = Math.max(...prices)
      setPriceLimit(max)
    } else {
      setPriceLimit(0)
    }
  }, [selectedAlbum])

  const handleCreateAlbum = (title) => {
    addAlbum(title)
    setCreateModalOpen(false)
  }

  const handleDeleteAlbum = (albumId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот альбом?')) {
      deleteAlbum(albumId)
    }
  }

  const handleCreateStamp = (newStamp) => {
    if (selectedAlbum) {
      addStampToAlbum(selectedAlbum.id, newStamp)
    }
    setCreateStampModalOpen(false)
  }

  const handleEditStamp = (updatedStamp) => {
    if (selectedAlbum) {
      updateStampInAlbum(selectedAlbum.id, updatedStamp)
    }
  }

  const handleDeleteStamp = (stampId) => {
    if (selectedAlbum) {
      deleteStampFromAlbum(selectedAlbum.id, stampId)
    }
  }

  const getPluralLabel = (count, one, few, many) => {
    const mod10 = count % 10
    const mod100 = count % 100
    if (mod10 === 1 && mod100 !== 11) return one
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
    return many
  }

  const stampCount = filteredAlbums.reduce(
    (total, album) => total + (album.stamps?.length || 0),
    0
  )
  const albumLabel = getPluralLabel(filteredAlbums.length, 'альбом', 'альбома', 'альбомов')
  const stampLabel = getPluralLabel(stampCount, 'марка', 'марки', 'марок')

  if (selectedAlbum) {
    const albumStamps = selectedAlbum.stamps || []
    const maxPrice = Math.max(
      ...albumStamps.map((stamp) => (typeof stamp.price === 'number' ? stamp.price : 0)),
      0
    )
    const uniqueCountries = Array.from(new Set(albumStamps.map((stamp) => stamp.country)))
    const uniqueYears = Array.from(new Set(albumStamps.map((stamp) => stamp.year)))

    const countryOptions = [
      { value: 'Все страны', label: 'Все страны' },
      ...uniqueCountries.map((country) => ({ value: country, label: country })),
    ]
    const yearOptions = [
      { value: 'Все года', label: 'Все года' },
      ...uniqueYears.map((year) => ({ value: year, label: year })),
    ]
    const sortOptions = [
      { value: 'По названию', label: 'По названию' },
      { value: 'По цене', label: 'По цене' },
      { value: 'По году', label: 'По году' },
    ]

    const filteredStamps = albumStamps
      .filter((stamp) => stamp.title.toLowerCase().includes(normalizedSearch))
      .filter((stamp) =>
        countryValue === 'Все страны' ? true : stamp.country === countryValue
      )
      .filter((stamp) => (yearValue === 'Все года' ? true : stamp.year === yearValue))
      .filter((stamp) => (stamp.price ? stamp.price <= priceLimit : true))
      .filter((stamp) => (rareOnly ? stamp.rarity !== 'Обычная' : true))
      .sort((a, b) => {
        if (sortValue === 'По цене') return (a.price || 0) - (b.price || 0)
        if (sortValue === 'По году') return Number(a.year) - Number(b.year)
        return a.title.localeCompare(b.title)
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
            <div className="my-collection-album-header">
              <div className="my-collection-album-title">
                <Button
                  type="text"
                  onClick={() => {
                    setSelectedAlbumId(null)
                    setSearchTerm('')
                    setCountryValue('Все страны')
                    setYearValue('Все года')
                    setSortValue('По названию')
                    setRareOnly(false)
                  }}
                  icon={
                    <span className="material-symbols-outlined my-collection-back-icon">
                      arrow_back
                    </span>
                  }
                  className="my-collection-back-btn"
                />
                <Title level={2} className="title">
                  Содержимое: {selectedAlbum.title.join(' ')}
                </Title>
              </div>
              <Button
                type="primary"
                className="add-stamp-btn"
                icon={<span className="material-symbols-outlined">add</span>}
                onClick={() => setCreateStampModalOpen(true)}
              >
                Добавить марку
              </Button>
            </div>

            <StampsFilters
              countryValue={countryValue}
              yearValue={yearValue}
              sortValue={sortValue}
              priceLimit={priceLimit}
              rareOnly={rareOnly}
              onCountryChange={setCountryValue}
              onYearChange={setYearValue}
              onSortChange={setSortValue}
              onPriceChange={setPriceLimit}
              onRareToggle={() => setRareOnly((prev) => !prev)}
              maxPrice={maxPrice}
              countryOptions={countryOptions}
              yearOptions={yearOptions}
              sortOptions={sortOptions}
            />

            <div className="my-collection-table-wrapper">
              <AlbumStampsTable
                stamps={filteredStamps}
                onEditStamp={handleEditStamp}
                onDeleteStamp={handleDeleteStamp}
              />
            </div>
          </main>
        </div>
        <CreateStampModal
          open={createStampModalOpen}
          onCancel={() => setCreateStampModalOpen(false)}
          onCreate={handleCreateStamp}
        />
      </div>
    )
  }

  return (
    <div className="catalog-page">
      <Sidebar items={navItems} />
      <div className="catalog-content">
        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Поиск по альбомам"
        />
        <main className="catalog-main">
          <div className="my-collection-title">
            <div>
              <Title level={2} className="title">
                Мои альбомы
              </Title>
              <div className="subtitle">
                Всего: {filteredAlbums.length} {albumLabel} • {stampCount} {stampLabel}
              </div>
            </div>
            <Button
              type="primary"
              className="add-album-btn"
              icon={<span className="material-symbols-outlined">add</span>}
              onClick={() => setCreateModalOpen(true)}
            >
              Создать альбом
            </Button>
          </div>
          <div className="my-collection-grid-wrapper">
            <AlbumGrid
              albums={filteredAlbums}
              onAlbumClick={(album) => setSelectedAlbumId(album.id)}
              gridVariant="collection"
              cardComponent={MyAlbumCard}
              cardProps={{ onToggleVisibility: toggleAlbumVisibility, onDelete: handleDeleteAlbum }}
            />
          </div>
        </main>
      </div>
      <CreateAlbumModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onCreate={handleCreateAlbum}
      />
    </div>
  )
}

export default MyCollectionPage