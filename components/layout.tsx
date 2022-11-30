import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Navbar from './Navbar'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import { Avatar } from '@mui/material';
type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Layout({ children }: any) {
  const router = useRouter()
  const { user, folderReload, getFolders } = useAuth()
  const [stateFolder, setStateFolder] = React.useState([{key: 'home', value: 'home'}])
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });


  function golink(key: string, value: string): void {
    // console.log({key, value});
    // const pos = router.asPath.indexOf('/',1)
    // const pathRest = (pos>0)?router.asPath.substring(pos):""
    // console.log({pos, pathRest})
    router.push('/' + value)
  }

  function capitalizeFirstLetter(str: string) {
    return str?.charAt(0).toUpperCase() + str?.slice(1)
  }

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      folderReload()
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        <ListItem>
            <ListItemText primary="Pastas" />
        </ListItem>
        {user.folders&&user.folders.map((item: any, index: any) => (
          <ListItem key={item.value} disablePadding onClick={()=>golink(item.key, item.value)}>
            <ListItemButton>
              <ListItemIcon>
              <Avatar>
                    {(item.key=='/')?
                    <HomeIcon/>:
                    <FolderIcon />
                    }
                  </Avatar>
              </ListItemIcon>
              <ListItemText primary={capitalizeFirstLetter(item.value)} />
            </ListItemButton>
          </ListItem>
        ))}<br/>
      </List>
      <Divider/>
    </Box>
  );
  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          {user.isLogged&&
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}>
              {list(anchor)}
            </Drawer>
          }
          <Navbar toggleDrawer={toggleDrawer}/>
          <main>{children}</main>
        </React.Fragment>
      ))}
    </div>
  );
}


