import { useEffect, useMemo, useState } from 'react'
import { Typography, Button } from 'antd'
import TwoFilters from '../components/filters/TwoFilters'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import AlbumGrid from '../components/grids/AlbumGrid'
import StampGrid from '../components/grids/StampGrid'
import { navItems } from '../data/catalogData'
import { albums as publicAlbumsData } from '../data/publicAlbumsData'
import { useCollection } from '../context/CollectionContext'
import { useStampFilters, getUniqueCountries, SORT_OPTIONS_LIST, getUniqueAlbumAuthors, getUniqueAlbumThemes, sortAlbums } from '../useFilters'
import { getPublicAlbums, mergeById } from '../services/api'
import './PublicAlbumsPage.css'
import './CatalogPage.css'

const { Title, Text } = Typography

function PublicAlbumsPage() {
  const { albums: collectionAlbums } = useCollection()
  const [remotePublicAlbums, setRemotePublicAlbums] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [authorValue, setAuthorValue] = useState('Все авторы')
  const [themeValue, setThemeValue] = useState('Все темы')
  const [countryFilter, setCountryFilter] = useState('Все страны')
  const [sortMode, setSortMode] = useState('По названию')

  useEffect(() => {
    let active = true

    const loadPublicAlbums = async () => {
      try {
        const albums = await getPublicAlbums()
        if (active && albums.length > 0) {
          setRemotePublicAlbums(albums)
        }
      } catch {
        // fallback to local demo data
      }
    }

    loadPublicAlbums()

    return () => {
      active = false
    }
  }, [])

  const allPublicAlbums = useMemo(() => {
    const publicUserAlbums = collectionAlbums.filter(album => album.isPublic)
    return mergeById(remotePublicAlbums, publicUserAlbums, publicAlbumsData)
  }, [collectionAlbums, remotePublicAlbums])

  const authorOptions = useMemo(() => {
    const authors = getUniqueAlbumAuthors(allPublicAlbums)
    return authors.map(a => ({ value: a, label: a }))
  }, [allPublicAlbums])

  const themeOptions = useMemo(() => {
    const themes = getUniqueAlbumThemes(allPublicAlbums)
    return themes.map(t => ({ value: t, label: t }))
  }, [allPublicAlbums])

  const selectedPublicAlbum = useMemo(() => allPublicAlbums.find(album => album.id === selectedAlbum?.id) || null, [allPublicAlbums, selectedAlbum])

  const albumStamps = selectedPublicAlbum?.stamps || []
  const countrySelectOptions = getUniqueCountries(albumStamps).map(c => ({ value: c, label: c }))
  const albumSortOptions = SORT_OPTIONS_LIST
  const filteredAlbumStamps = useStampFilters(
    albumStamps,
    searchTerm,
    countryFilter,
    'Все года',
    sortMode,
    0,
    false
  )

  const filteredAlbums = useMemo(() => {
    let result = allPublicAlbums.filter(album => {
      const fullTitle = album.title.join(' ').toLowerCase()
      const matchesSearch = fullTitle.includes(searchTerm.toLowerCase())
      const albumAuthor = album.ownerName || album.author
      const matchesAuthor = authorValue === 'Все авторы' || albumAuthor === authorValue
      const matchesTheme = themeValue === 'Все темы' || album.theme === themeValue
      return matchesSearch && matchesAuthor && matchesTheme
    })
    result = sortAlbums(result, sortMode)
    return result
  }, [allPublicAlbums, searchTerm, authorValue, themeValue, sortMode])

  if (selectedPublicAlbum) {
    return (
      <div className="catalog-page">
        <Sidebar items={navItems} />
        <div className="catalog-content">
          <HeaderBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Поиск по маркам альбома" />
          <main className="catalog-main">
            <div className="albums-title">
              <div className="album-header-row">
                <Button type="text" onClick={() => { setSelectedAlbum(null); setSearchTerm(''); setCountryFilter('Все страны'); setSortMode('По названию (А-Я)') }} icon={<span className="material-symbols-outlined">arrow_back</span>} className="album-back-btn" />
                <div><Title level={2} className="albums-heading">{selectedPublicAlbum.title.join(' ')}</Title><Text className="albums-subtitle">{filteredAlbumStamps.length} марок в альбоме</Text></div>
              </div>
              <TwoFilters firstValue={countryFilter} secondValue={sortMode} firstOptions={countrySelectOptions} secondOptions={albumSortOptions} onFirstChange={setCountryFilter} onSecondChange={setSortMode} />
            </div>
            <StampGrid stamps={filteredAlbumStamps} cardVariant="album" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="albums-page">
      <Sidebar items={navItems} />
      <div className="albums-content">
        <HeaderBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Поиск по альбомам" />
        <main className="albums-main">
          <div className="albums-title">
            <div><Title level={2} className="albums-heading">Общедоступные альбомы</Title><Text className="albums-subtitle">Найдено: {filteredAlbums.length} альбомов</Text></div>
            <TwoFilters firstValue={authorValue} secondValue={themeValue} firstOptions={authorOptions} secondOptions={themeOptions} onFirstChange={setAuthorValue} onSecondChange={setThemeValue} />
          </div>
          <div className="album-grid-wrapper">
            <AlbumGrid albums={filteredAlbums} onAlbumClick={(album) => setSelectedAlbum(album)} gridVariant="collection" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PublicAlbumsPage