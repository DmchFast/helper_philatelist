import { useState } from 'react'
import { Typography } from 'antd'
import Sidebar from '../components/bars/Sidebar'
import HeaderBar from '../components/bars/HeaderBar'
import { navItems } from '../data/catalogData'

function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <Sidebar items={navItems} />
      <div>
        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Поиск"
        />
        <main>
        </main>
      </div>
    </div>
  )
}

export default AdminPage