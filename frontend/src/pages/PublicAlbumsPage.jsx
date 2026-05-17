import { useMemo, useState } from 'react'
import { Typography, Button } from 'antd'
import TwoFilters from '../components/filters/TwoFilters'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AlbumGrid from '../components/grids/AlbumGrid'
import StampGrid from '../components/grids/StampGrid'
import { countryOptions, navItems, sortOptions } from '../data/catalogData'
import { albums as publicAlbumsData, authorOptions, themeOptions } from '../data/publicAlbumsData'
import { useCollection } from '../context/CollectionContext'
import './PublicAlbumsPage.css'
import './CatalogPage.css'

const { Title, Text } = Typography

function PublicAlbumsPage() {
  const { albums: collectionAlbums } = useCollection()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [authorValue, setAuthorValue] = useState('Все авторы')
  const [themeValue, setThemeValue] = useState('Все темы')
  const [countryFilter, setCountryFilter] = useState('Все страны')
  const [sortMode, setSortMode] = useState('По названию')

  const allPublicAlbums = useMemo(() => {
    const publicUserAlbums = collectionAlbums
      .filter((album) => album.isPublic)
      .map((album) => ({
        ...album,
        author: album.ownerName || album.author,
        ownerName: album.ownerName || album.author,
      }))

    const staticPublicAlbums = publicAlbumsData.map((album) => ({
      ...album,
      author: album.ownerName || album.author,
      ownerName: album.ownerName || album.author,
    }))

    return [...staticPublicAlbums, ...publicUserAlbums]
  }, [collectionAlbums])

  const publicAuthorOptions = useMemo(() => {
    const authors = Array.from(
      new Set(allPublicAlbums.map((album) => album.ownerName || album.author).filter(Boolean))
    )
    return [
      { value: 'Все авторы', label: 'Все авторы' },
      ...authors.map((author) => ({ value: author, label: author })),
    ]
  }, [allPublicAlbums])

  const publicThemeOptions = useMemo(() => {
    const themes = Array.from(new Set(allPublicAlbums.map((album) => album.theme).filter(Boolean)))
    return [
      { value: 'Все темы', label: 'Все темы' },
      ...themes.map((theme) => ({ value: theme, label: theme })),
    ]
  }, [allPublicAlbums])

  const selectedPublicAlbum = useMemo(
    () => allPublicAlbums.find((album) => album.id === selectedAlbum?.id) || null,
    [allPublicAlbums, selectedAlbum]
  )

  if (selectedPublicAlbum) {
    const albumStamps = selectedPublicAlbum.stamps || []
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
                    {selectedPublicAlbum.title.join(' ')}
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
  const filteredAlbums = allPublicAlbums.filter((album) => {
    const fullTitle = album.title.join(' ').toLowerCase()
    const matchesSearch = fullTitle.includes(normalizedSearch)
    const albumAuthor = album.ownerName || album.author
    const matchesAuthor = authorValue === 'Все авторы' || albumAuthor === authorValue
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
              firstOptions={publicAuthorOptions.length > 1 ? publicAuthorOptions : authorOptions}
              secondOptions={publicThemeOptions.length > 1 ? publicThemeOptions : themeOptions}
              onFirstChange={setAuthorValue}
              onSecondChange={setThemeValue}
            />
          </div>

          <div className="album-grid-wrapper">
            <AlbumGrid
              albums={filteredAlbums}
              onAlbumClick={(album) => setSelectedAlbum(album)}
              gridVariant="collection"
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PublicAlbumsPage