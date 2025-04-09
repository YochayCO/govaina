import { Routes, Route } from 'react-router'

import './App.css'
import MainPage from './layouts/MainPage/MainPage'
import SideMenu from './components/SideMenu/SideMenu.tsx'
import AboutUs from './layouts/AboutUs/AboutUs.tsx'
import Methodology from './layouts/Methodology/Methodology.tsx'
import ChatController from './components/ChatController/ChatController.tsx'

function App() {
  return (
    <div className="app">
      <SideMenu />
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="chat" element={<ChatController />} />
        </Route>
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
    </div>
  )
}

export default App
