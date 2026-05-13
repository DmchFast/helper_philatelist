import { useState, useCallback } from 'react'
import { Button, Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AlbumGrid from '../components/grids/AlbumGrid'
import MyAlbumCard from '../components/cards/MyAlbumCard'
import { navItems } from '../data/catalogData'
import { albums as initialAlbums } from '../data/myCollectionData'
import './CatalogPage.css'
import './MyCollectionPage.css'

const { Title, Text } = Typography

function MyCollectionPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [albums, setAlbums] = useState(initialAlbums)

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredAlbums = albums.filter((album) =>
    album.title.join(' ').toLowerCase().includes(normalizedSearch)
  )

  const handleToggleVisibility = useCallback((albumId) => {
    setAlbums(prev =>
      prev.map(album =>
        album.id === albumId ? { ...album, isPublic: !album.isPublic } : album
      )
    )
  }, [])

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
                    setSelectedAlbum(null)
                    setSearchTerm('')
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
              >
                Добавить марку
              </Button>
            </div>

            <div className="my-collection-placeholder">
              <Text className="my-collection-placeholder-text">
                Таблица
              </Text>
            </div>
          </main>
        </div>
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
            >
              Создать альбом
            </Button>
          </div>

          <div className="my-collection-grid-wrapper">
            <AlbumGrid
              albums={filteredAlbums}
              onAlbumClick={setSelectedAlbum}
              gridVariant="collection"
              cardComponent={MyAlbumCard}
              cardProps={{ onToggleVisibility: handleToggleVisibility }}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MyCollectionPage