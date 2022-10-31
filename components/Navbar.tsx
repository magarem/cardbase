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
import { AddAPhoto } from '@mui/icons-material';
import { PhotoLibrary } from '@material-ui/icons/';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NoteIcon from '@mui/icons-material/Note';

interface obj1 {
  user: string
}

const SiteTitle = (props: obj1) => {
  let title = "ZenBase"
  const path = location.pathname.substring(1)
  title = (props.user?"ZenBase":path)
  if (['', 'login', 'signup'].includes(path)){
    title = "ZenBase"
  }
  return (
    <>{title}</>
  )
}
interface obj2 {
  user: {
    displayName: string;
  }
}

const PageMenu = (props: obj2) => {
  const router = useRouter()
  const user = props.user
  if (user) {
    return (
      <Container sx={{width:120}}>
        <Grid container  direction="row" spacing={2} justifyContent="center" alignItems="center" >
          <Grid item md={6}>
            <IconButton size="small" aria-label="delete" onClick={() => {
                router.push('/' + user.displayName + '/adm/create')
                }}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid>
          <Grid item md={6}>
            <IconButton size="small" aria-label="delete" onClick={() => {
                router.push('/'+user.displayName +'/adm/list?cardSession=all')
                }}>
              <PhotoLibrary />
            </IconButton>
          </Grid>
        {/* <IconButton size="small" aria-label="delete" onClick={() => {
            router.push('/'+user.displayName +'/adm/list?type=section')
            }}>
          <NoteIcon />
        </IconButton> */}
        </Grid>
      </Container>
    )
  }else{
    return null
  }
}

const UserOptions = (props: obj2) => {
  const user = props.user
  const { logout } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null);
  const open_ = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (user) {
    return (
      <div>
        <Typography variant="h6" noWrap component="div" align="right">
              <Button
                startIcon={<AccountCircleIcon />}
                id="basic-button"
                variant="text"
                aria-controls={'basic-menu'}
                aria-haspopup="true"
                aria-expanded={'true'}
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
                <MenuItem  onClick={() => {
                  logout()
                  router.push('/login')
                  }}>Logout</MenuItem>
              
            </Menu>
        </Typography>
      </div>)
  } else {
    return (
      <>
        {/* <Link href="/signup" >
        <Button color="inherit">Registrar</Button>
        </Link> */}
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
    <AppBar position="fixed">
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
          <Grid item xs={4} sm={4} md={4} style={{textAlign: "left"}}>
            <Typography variant="h6" component="div" >
              <SiteTitle user={user}/>
            </Typography>
          </Grid>
          <Grid item xs={4} sm={4} md={4} style={{textAlign: "center"}} >
            <PageMenu user={user}/>
          </Grid>
          <Grid item xs={4} sm={4} md={4} style={{textAlign: "right"}} >
            <UserOptions user={user}/>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default NavbarComp
