import { useState, useEffect, useMemo } from 'react'
import { Button, Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AlbumGrid from '../components/grids/AlbumGrid'
import MyAlbumCard from '../components/cards/MyAlbumCard'
import AlbumStampsTable from '../components/tables/AlbumStampsTable'
import StampsFilters from '../components/filters/StampsFilters'
import { navItems } from '../data/catalogData'
import { useAuth } from '../components/auth/AuthContext'
import { useCollection } from '../context/CollectionContext'
import CreateAlbumModal from '../components/modal/CreateAlbumModal'
import CreateStampModal from '../components/modal/CreateStampModal'
import DeleteConfirmModal from '../components/modal/DeleteConfirmModal'
import { useStampFilters, getUniqueCountries, getUniqueDecades, SORT_OPTIONS_LIST } from '../useFilters'
import './CatalogPage.css'
import './MyCollectionPage.css'

const { Title } = Typography

function MyCollectionPage() {
  const { user } = useAuth()
  const { albums, addAlbum, deleteAlbum, toggleAlbumVisibility, addStampToAlbum, updateStampInAlbum, deleteStampFromAlbum } = useCollection()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [countryValue, setCountryValue] = useState('Все страны')
  const [decadeValue, setDecadeValue] = useState('Все года')
  const [sortValue, setSortValue] = useState('По названию')
  const [priceLimit, setPriceLimit] = useState(0)
  const [rareOnly, setRareOnly] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createStampModalOpen, setCreateStampModalOpen] = useState(false)
  const [albumToDelete, setAlbumToDelete] = useState(null)

  const filteredAlbums = albums.filter(album => album.title.join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
  const selectedAlbum = albums.find(album => album.id === selectedAlbumId) || null

  const albumStamps = selectedAlbum?.stamps || []
  const countryOptions = useMemo(() => {
    const countries = getUniqueCountries(albumStamps)
    return countries.map(c => ({ value: c, label: c }))
  }, [albumStamps])

  const decadeOptions = useMemo(() => {
    return getUniqueDecades(albumStamps)
  }, [albumStamps])

  const sortOptions = SORT_OPTIONS_LIST

  const filteredStamps = useStampFilters(
    albumStamps,
    searchTerm,
    countryValue,
    decadeValue,
    sortValue,
    priceLimit,
    rareOnly
  )

  useEffect(() => {
    if (selectedAlbum) {
      const maxPrice = Math.max(...albumStamps.map(s => s.price || 0), 0)
      setPriceLimit(maxPrice)
    } else {
      setPriceLimit(0)
    }
  }, [selectedAlbum, albumStamps])

  const handleCreateAlbum = (title) => { addAlbum(title, user?.name || 'Гость'); setCreateModalOpen(false) }
  const handleDeleteAlbum = (albumId) => { const album = albums.find(a => a.id === albumId); setAlbumToDelete(album) }
  const handleConfirmDeleteAlbum = () => { if (albumToDelete) { deleteAlbum(albumToDelete.id); setAlbumToDelete(null); if (selectedAlbumId === albumToDelete.id) setSelectedAlbumId(null) } }
  const handleCreateStamp = (newStamp) => { if (selectedAlbum) addStampToAlbum(selectedAlbum.id, newStamp); setCreateStampModalOpen(false) }
  const handleEditStamp = (updatedStamp) => { if (selectedAlbum) updateStampInAlbum(selectedAlbum.id, updatedStamp) }
  const handleDeleteStamp = (stampId) => { if (selectedAlbum) deleteStampFromAlbum(selectedAlbum.id, stampId) }

  const getPluralLabel = (count, one, two, five) => { const mod10 = count % 10, mod100 = count % 100; if (mod10 === 1 && mod100 !== 11) return one; if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return two; return five }
  const stampCount = filteredAlbums.reduce((total, album) => total + (album.stamps?.length || 0), 0)
  const albumLabel = getPluralLabel(filteredAlbums.length, 'альбом', 'альбома', 'альбомов')
  const stampLabel = getPluralLabel(stampCount, 'марка', 'марки', 'марок')

  if (selectedAlbum) {
    return (
      <div className="catalog-page">
        <Sidebar items={navItems} />
        <div className="catalog-content">
          <HeaderBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Поиск по маркам альбома" />
          <main className="catalog-main">
            <div className="my-collection-album-header">
              <div className="my-collection-album-title">
                <Button type="text" onClick={() => { setSelectedAlbumId(null); setSearchTerm(''); setCountryValue('Все страны'); setDecadeValue('Все года'); setSortValue('По названию'); setRareOnly(false) }} icon={<span className="material-symbols-outlined my-collection-back-icon">arrow_back</span>} className="my-collection-back-btn" />
                <Title level={2} className="title">Содержимое: {selectedAlbum.title.join(' ')}</Title>
              </div>
              <Button type="primary" className="add-stamp-btn" icon={<span className="material-symbols-outlined">add</span>} onClick={() => setCreateStampModalOpen(true)}>Добавить марку</Button>
            </div>
            <StampsFilters
              countryValue={countryValue}
              decadeValue={decadeValue}
              sortValue={sortValue}
              priceLimit={priceLimit}
              rareOnly={rareOnly}
              onCountryChange={setCountryValue}
              onDecadeChange={setDecadeValue}
              onSortChange={setSortValue}
              onPriceChange={setPriceLimit}
              onRareToggle={() => setRareOnly(prev => !prev)}
              maxPrice={Math.max(...albumStamps.map(s => s.price || 0), 0)}
              countryOptions={countryOptions}
              decadeOptions={decadeOptions}
              sortOptions={sortOptions}
              showRareButton={true}
            />
            <div className="my-collection-table-wrapper">
              <AlbumStampsTable stamps={filteredStamps} onEditStamp={handleEditStamp} onDeleteStamp={handleDeleteStamp} />
            </div>
          </main>
        </div>
        <CreateStampModal open={createStampModalOpen} onCancel={() => setCreateStampModalOpen(false)} onCreate={handleCreateStamp} />
      </div>
    )
  }

  return (
    <div className="catalog-page">
      <Sidebar items={navItems} />
      <div className="catalog-content">
        <HeaderBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Поиск по альбомам" />
        <main className="catalog-main">
          <div className="my-collection-title">
            <div><Title level={2} className="title">Мои альбомы</Title><div className="subtitle">Всего: {filteredAlbums.length} {albumLabel} • {stampCount} {stampLabel}</div></div>
            <Button type="primary" className="add-album-btn" icon={<span className="material-symbols-outlined">add</span>} onClick={() => setCreateModalOpen(true)}>Создать альбом</Button>
          </div>
          <div className="my-collection-grid-wrapper">
            <AlbumGrid albums={filteredAlbums} onAlbumClick={(album) => setSelectedAlbumId(album.id)} gridVariant="collection" cardComponent={MyAlbumCard} cardProps={{ onToggleVisibility: toggleAlbumVisibility, onDelete: handleDeleteAlbum }} />
          </div>
        </main>
      </div>
      <CreateAlbumModal open={createModalOpen} onCancel={() => setCreateModalOpen(false)} onCreate={handleCreateAlbum} />
      <DeleteConfirmModal open={Boolean(albumToDelete)} onCancel={() => setAlbumToDelete(null)} onConfirm={handleConfirmDeleteAlbum} title={`альбом "${albumToDelete?.title?.join(' ') || ''}"`} />
    </div>
  )
}

export default MyCollectionPage