import './App.css'
import MainPage from './layouts/MainPage/MainPage'
import SideMenu from "./components/SideMenu/SideMenu.tsx";

function App() {

  return (
    <div className="app">
      <SideMenu/>
      <MainPage />
    </div>
  )
}

export default App
