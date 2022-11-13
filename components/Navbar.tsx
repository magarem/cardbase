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

const SiteTitle = (props: obj1) => {
  const { user } = useAuth()
  console.log({user});
  let title = "ZenBase"
  // if (user) {
  //    title = "ZenBase"
  // }else{

  // }
  
  // let title = "ZenBase"
  // const name = location.href.split('.')[0].split('//')[1]
  // const path = name.substring(0,1).toLocaleUpperCase()+name.substring(1)
  // title = (props.user?"ZenBase":path)
  // // console.log(path)
  // if (['', 'login', 'login2', 'signup'].includes(title.split('/')[1])){
  //   console.log(title)
  //   title = "ZenBase"
  // }
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
  let folder = router.asPath.split('/')[1]
  const user = props.user
  if (user) {
    return (
      <Container sx={{width:120}}>
        <Grid container  direction="row" spacing={2} justifyContent="center" alignItems="center" >
          <Grid item md={6}>
            <IconButton size="small" aria-label="edit" onClick={() => {
                router.push("/" + folder + "/new/edit")
                }}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid>
          <Grid item md={6}>
            <IconButton size="small" aria-label="list" onClick={() => {
                console.log(1);
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

const UserOptions = (props: obj2) => {
  // const user = props.user
  const { user, logout, userReadData } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
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
      setUserName(user.username)
    }
  },[user])

  const goHome = () => {
    // const url1 = window.location.protocol + '//' + window.location.origin.replace(/^[^.]+\./g, "")
    // const url1 = window.location.protocol + '//' + window.location.origin.replace(/^[^.]+\./g, "")
    // console.log( url1 + '/login');
    // router.push( url1 + '/login')
    router.push(process.env.NEXT_PUBLIC_DOMAIN as string);
    
    // location.href = url1 + '/login'
  }

  if (user) {
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
              {userName} 
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
                    pathname: '/usersettings',
                    query: { name: 'Someone' }
                }, '/usersettings');
                  }}>Definições</MenuItem>

                <MenuItem  onClick={() => {
                  logout()
                  goHome()
                  }}>Logout</MenuItem>
            </Menu>
        </Typography>
      </div>)
  } else {
    return (
      <Link href="/login" >
        <Button color="inherit">Login</Button>
      </Link>
    )
  }
}


const NavbarComp = (props: any) => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const AuthRequired = ['/', '/adm']
  console.log(user);
  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="fixed">
      <Toolbar>
      {user&&
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onMouseOver={props.toggleDrawer('left', true)}
          // onClick={props.toggleDrawer('left', true)}
        >
          <MenuIcon />
        </IconButton>
        }

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
