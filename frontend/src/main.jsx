import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/reset.css'
import './theme.css'
import './index.css'
import App from './App.jsx'
import { CollectionProvider } from './context/CollectionContext'
import { CatalogProvider } from './context/CatalogContext'
import { UsersProvider } from './context/UsersContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CollectionProvider>
        <CatalogProvider>
          <UsersProvider>
            <App />
          </UsersProvider>
        </CatalogProvider>
      </CollectionProvider>
    </BrowserRouter>
  </StrictMode>,
)