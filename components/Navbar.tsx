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
import Switch from '@mui/material/Switch';
import { FormControlLabel } from '@mui/material';
interface obj1 {
  user: string
}
const label = { inputProps: { 'aria-label': 'Size switch demo' } };


const Navbar = (props: any) => {

  const { user, flagMoveItens, setFlagMoveItens, logout } = useAuth();
  console.log(props)
  const router = useRouter()
  // const user = props.user
  console.log(user);

  const SiteTitle = () => {
    let title = "ZenBase"
    console.log(user?.isLogged);
    // if (!user?.isLogged && 
    //   location.href.substring(7).split('/')[1]!='login' && 
    //   location.href.substring(7).split('/')[1]!='signup' &&
    //   !location.href.substring(7).split('/')[1].includes('login2')) {
    //   title = location.hostname.split('.')[0]
    // }
    console.log(title);
    return (
      <Link href="#" underline="none" color="inherit" onClick={()=>{router.push('/Home')}} >{title}</Link>
    )
  }

  interface obj2 {
    user: {
      displayName: string;
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
    
    // useEffect(() => {
    //   if (user){
    //     console.log(user);
    //     // setUserName(user.username)
    //   }
    // },[])
  
    const goToLogin = () => {
      console.log(user);
      // alert(window.location.host)
      // const url = window.location.protocol + '//' + window.location.host + '/login'
      // console.log(url);
      // router.push(url + '?email=' + user.email)
      router.push('/login2?email='+user.email)
      // router.push(process.env.NEXT_PUBLIC_DOMAIN as string);
    }
    
    const goHome = () => {
      router.push(process.env.NEXT_PUBLIC_DOMAIN + '/login' as string);
    }
  
    if (true) {
      return (
        <div>
          <Typography variant="h6" noWrap component="div" align="right" >
               {/* {alert(JSON.stringify(user,null,2))} */}
               {user.uid&&
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
                }
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open_}
                  onClick={handleClose}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}>
                  {user.isLogged?
                    <div>
                      <MenuItem onClick={() => {
                        router.push({
                          pathname: '/usersettings'
                      }, '/usersettings');
                        }}>Definições
                      </MenuItem>
      
                      <MenuItem  onClick={() => {
                        logout()
                        goHome()
                        }}>Sair
                      </MenuItem>
                    </div>
                    :
                    <MenuItem onClick={() => {router.push('/login2?email='+user.email)}}>
                        Entrar
                    </MenuItem>
                  }
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
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlagMoveItens(event.target.checked);
  };
  // console.log(router.pathname)
  // console.log(router.query)
  // console.log(router.asPath)
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
        <Grid sx={{mt: -1.4}} container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={5} sm={5} md={5} style={{textAlign: "left"}}>
            <Typography variant="h6" component="div" >
              <SiteTitle />
            </Typography>
          </Grid>
          <Grid item xs={2} sm={2} md={2} style={{textAlign: "center", paddingTop:20}} >
             {user.isLogged&&['/Home','/[folder]'].includes(router.pathname)&&<Switch {...label} checked={flagMoveItens}
              onChange={handleChange} size="small"  />}
          </Grid>

          <Grid item xs={5} sm={5} md={5} style={{textAlign: "right"}} >
            <UserOptions />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default Navbar
