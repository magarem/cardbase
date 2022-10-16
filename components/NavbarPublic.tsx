import React, {useState} from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const MakeTitle = () => {
  const router = useRouter()
  return (
    <>
      <h4>{router.asPath.substring(1)}</h4>
    </>
    
  )
}

const NavbarPublic = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container rowSpacing={2} columnSpacing={2}>
            {/* <Grid item xs={0} sm={0} md={0} >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CardBase
          </Typography>
          </Grid> */}
            <Grid item xs={12} sm={12} md={12}  >
              <MakeTitle/>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box> 
  )
}
export default NavbarPublic
