import { useState } from 'react'
import { Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import { navItems } from '../data/catalogData'

const { Title } = Typography

function MyCollectionPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <Sidebar items={navItems} />
      <div>
        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Поиск по альбомам"
        />
        <main>
        </main>
      </div>
    </div>
  )
}

export default MyCollectionPage