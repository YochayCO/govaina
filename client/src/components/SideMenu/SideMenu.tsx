import { List, ListItemButton } from '@mui/joy'
import { HomeOutlined, AutoGraph, InfoOutline } from '@mui/icons-material'

import './SideMenu.css'

function SideMenu() {
  return (
    <div className={'side-menu'}>
      <List className={'side-menu-list'}>
        <ListItemButton>
          <HomeOutlined />
          בית
        </ListItemButton>
        <ListItemButton>
          <InfoOutline />
          אודות
        </ListItemButton>
        <ListItemButton>
          <AutoGraph />
          איך אנחנו בודקים
        </ListItemButton>
      </List>
    </div>
  )
}

export default SideMenu
