import { List, ListItemButton } from '@mui/joy'
import { HomeOutlined, AutoGraph, InfoOutline } from '@mui/icons-material'

import './SideMenu.css'

interface SideMenuProps {
  page: number
  setPage: (page: number) => void
}

function SideMenu({ page, setPage }: SideMenuProps) {
  return (
    <div className={'side-menu'}>
      <List className={'side-menu-list'}>
        <ListItemButton selected={page == 0} onClick={() => setPage(0)}>
          <HomeOutlined />
          בית
        </ListItemButton>
        <ListItemButton selected={page == 1} onClick={() => setPage(1)}>
          <InfoOutline />
          אודות
        </ListItemButton>
        <ListItemButton selected={page == 2} onClick={() => setPage(2)}>
          <AutoGraph />
          איך אנחנו בודקים
        </ListItemButton>
      </List>

      <a
        href={'https://www.ceci.org.il/'}
        target={'_blank'}
        rel={'noopener noreferrer'}
      >
        <img src={'/merkaz-logo-1.png'} alt={'logo'} className={'logo'} />
      </a>
    </div>
  )
}

export default SideMenu
