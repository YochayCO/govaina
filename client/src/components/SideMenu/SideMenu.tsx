import { List, ListItemButton } from '@mui/joy'
import { HomeOutlined, AutoGraph, InfoOutline } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router'

import './SideMenu.css'

function SideMenu() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className={'side-menu'}>
      <List className={'side-menu-list'}>
        <ListItemButton
          selected={pathname == '/'}
          onClick={() => navigate('/')}
        >
          <HomeOutlined />
          בית
        </ListItemButton>
        <ListItemButton
          selected={pathname == '/about-us'}
          onClick={() => navigate('/about-us')}
        >
          <InfoOutline />
          אודות
        </ListItemButton>
        <ListItemButton
          selected={pathname == '/methodology'}
          onClick={() => navigate('/methodology')}
        >
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
