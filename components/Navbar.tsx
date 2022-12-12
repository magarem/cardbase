import React, {useEffect, useState} from 'react'
import Link from '@mui/material/Link';
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { PhotoLibrary } from '@material-ui/icons/';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface obj1 {
  user: string
}

const Navbar = (props: any) => {

  const { user, logout } = useAuth();
  console.log(props)
  const router = useRouter()
  // const user = props.user
  console.log(user);

  const SiteTitle = () => {
    let title = "ZenBase"
    console.log(user?.isLogged);
    
    if (!user?.isLogged) {
      title = location.hostname.split('.')[0]
    }

    console.log(title);
    
    return (
      <>{title}</>
    )
  }

  interface obj2 {
    user: {
      displayName: string;
    }
  }
  
  const PageMenu = () => {
    const router = useRouter()
    let folder = router.asPath.split('/')[1]
    // const user = props.user
    if (user) {
      return (
        <Container sx={{width:120}}>
          <Grid container  direction="row" spacing={1} justifyContent="center" alignItems="center" >
            <Grid item md={6}>
              <IconButton size="small" aria-label="edit" onClick={() => {
                  router.push("/" + folder + "/new/edit")
                  }}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item md={6}>
              <IconButton size="small" aria-label="list" onClick={() => {
                  if (folder=='usersettings') folder = 'home'
                  router.push("/" + folder )
                  }}>
                <PhotoLibrary />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      )
    }else{
      return null
    }
  }
  
  const UserOptions = () => {
  
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState(null);
    const open_ = Boolean(anchorEl);
  
    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    useEffect(() => {
      if (user){
        console.log(user);
        // setUserName(user.username)
      }
    },[])
  
    const goToLogin = () => {
      console.log(user);
      const url = window.location.protocol + '//' + window.location.host + '/login'
      console.log(url);
      // router.push(url + '?email=' + user.email)
      router.push(url)
      // router.push(process.env.NEXT_PUBLIC_DOMAIN as string);
    }
    
    const goHome = () => {
      router.push(process.env.NEXT_PUBLIC_DOMAIN as string);
    }
  
    if (user.isLogged) {
      return (
        <div>
          <Typography variant="h6" noWrap component="div" align="right" >
                <Button
                  color='success'
                  startIcon={<AccountCircleIcon />}
                  id="basic-button"
                  variant="text"
                  aria-controls={'basic-menu'}
                  aria-haspopup="true"
                  aria-expanded={'true'}
                  onClick={handleClick}
                >
                {user.username} 
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open_}
                  onClick={handleClose}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}>
                   <MenuItem onClick={() => {
                    router.push({
                      pathname: '/usersettings'
                  }, '/usersettings');
                    }}>Definições</MenuItem>
  
                  <MenuItem  onClick={() => {
                    logout()
                    goHome()
                    }}>Sair</MenuItem>
              </Menu>
          </Typography>
        </div>)
    } else {
      return (
        <></>
        // <Link href="/login" >
          // <Button color="inherit" onClick={goToLogin}>Entrar</Button>
        // </Link>
      )
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="fixed">
      <Toolbar>
      {user.isLogged&&
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 0 }}
          onMouseOver={props.toggleDrawer('left', true)}
          onClick={props.toggleDrawer('left', true)}>
          <MenuIcon />
        </IconButton>
        }
        <Grid  sx={{ mt: -1.4 }} container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={6} sm={6} md={6} style={{textAlign: "left"}}>
            <Typography variant="h6" component="div" >
              <SiteTitle />
            </Typography>
          </Grid>
          {/* <Grid item xs={4} sm={4} md={4} style={{textAlign: "center"}} >
            <PageMenu user={user}/>
          </Grid> */}
          <Grid item xs={6} sm={6} md={6} style={{textAlign: "right"}} >
            <UserOptions />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default Navbar
