import { useState } from 'react'

import './App.css'
import MainPage from './layouts/MainPage/MainPage'
import SideMenu from './components/SideMenu/SideMenu.tsx'
import AboutUs from './layouts/AboutUs/AboutUs.tsx'
import Methodology from './layouts/Methodology/Methodology.tsx'

function App() {
  const [page, setPage] = useState<number>(0)

  return (
    <div className="app">
      <SideMenu page={page} setPage={setPage} />
      {page == 0 && <MainPage />}
      {page == 1 && <AboutUs />}
      {page == 2 && <Methodology />}
    </div>
  )
}

export default App
