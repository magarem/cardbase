import React, {useState} from 'react'
// import { Container, Nav, Navbar } from 'react-bootstrap'
import Link from '@mui/material/Link';
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

import ListItemIcon from '@mui/material/ListItemIcon';
import ButtonGroup from '@mui/material/ButtonGroup';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as Icons from '@material-ui/icons/'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';

const PageMenu = ({user}) => {
  const router = useRouter()
  if (user) {
    return (
      <div>
        {/* <ButtonGroup size="small" aria-label="small button group">
          <Button>Criar</Button>
          <Button>Listar</Button>
        </ButtonGroup> */}

        {/* <IconButton color="primary"  > */}
     
        {/* </IconButton> */}
        <Link
          component="button"
          onClick={() => {
            router.push('/' + user.displayName + '/adm/create')
            }} >
          <ListItemIcon>
            {React.createElement(Icons["AddAPhoto"])}
          </ListItemIcon>
        </Link> 
        <Link
          component="button"
          onClick={() => {
            router.push('/'+user.displayName +'/adm/list')
            }}>
          <ListItemIcon>
            {React.createElement(Icons["PhotoLibrary"])}
          </ListItemIcon>
        </Link>
      </div>
    )
  }else{
    return null
  }
}

const UserOptions = ({user}) => {
  const { logout } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null);
  const open_ = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (user) {
    return (
      <div>
        <Typography variant="h7" noWrap component="div" align="right">
              <Button
                startIcon={<AccountCircleIcon />}
                id="basic-button"
                variant="text"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
              {user.displayName} 
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open_}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
               <Link
                component="button"
                onClick={() => {
                  logout()
                  router.push('/login')
                  }}
                >
                Logout
              </Link>
            </Menu>
        </Typography>
      </div>)
  } else {
    return (
      <>
        <Link href="/signup" >
        <Button color="inherit">Registrar</Button>
        </Link>
        <Link href="/login" >
        <Button color="inherit">Login</Button>
        </Link>
      </>
    )
  }
}

const NavbarComp = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const AuthRequired = ['/', '/adm']
  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}

        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={4} sm={4} md={4} >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CardBase
        </Typography>
        </Grid>
            <Grid item xs={4} sm={4} md={4}  >
            <PageMenu user={user}/>
          </Grid>
          <Grid item xs={4} sm={4} md={4}  >
            <UserOptions user={user}/>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default NavbarComp
