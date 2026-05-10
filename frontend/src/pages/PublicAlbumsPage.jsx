import { useState } from 'react'
import { Typography } from 'antd'
import TwoFilters from '../components/filters/TwoFilters'
import AlbumGrid from '../components/grids/AlbumGrid'
import HeaderBar from '../components/bars/HeaderBar'
import Sidebar from '../components/bars/Sidebar'
import { navItems } from '../data/catalogData'
import { albums, authorOptions, themeOptions } from '../data/publicAlbumsData'
import './PublicAlbumsPage.css'

const { Title, Text } = Typography

function PublicAlbumsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [authorValue, setAuthorValue] = useState('Все авторы')
  const [themeValue, setThemeValue] = useState('Все темы')

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const visibleAlbums = albums.filter((album) => {
    const matchesSearch = album.title.join(' ').toLowerCase().includes(normalizedSearch)
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
                Публичные альбомы
              </Title>
              <Text className="albums-subtitle">
                Исследуйте редкие марки и тематические альбомы со всего мира
              </Text>
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
            <AlbumGrid albums={visibleAlbums} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PublicAlbumsPage