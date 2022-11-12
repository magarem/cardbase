import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import { Button, Form } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { Stack } from 'react-bootstrap';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        ZenSite
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}






const Login2 = () => {
  const router = useRouter()
  const email = router.query.email
 
  const { user, login, logout, userReadDataBy } = useAuth()
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  
  useEffect(() => {
    if (user) router.push('home')
  },[user])

  const handleLogin = async (e: any) => {
    e.preventDefault()
    // console.log(user)
    try {
      console.log(email, data.password)
      // const user = await login(email, data.password)
      await login(email, data.password)
      // login(email, data.password).then((ret: { user: { username: string; }; })=>{
        // console.log(ret.user)
        // const hostname = window.location.host 
        // const url = window.location.protocol + '//' + hostname + '/home'
        // console.log(url);
        // if (ret.user) 
      console.log(user);
        
      // if (user) router.push('home')
      // })

     
    } catch (err) {
      console.log(err)
    }
  }

  return (

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" mt={5}>
            Bem vindo
          </Typography>
          
          <h4>{window.location.host.split(".")[0]}</h4>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            {/* <TextField
              variant="filled" 
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e: any) =>
                setData({
                  ...data,
                  email: e.target.value,
                })
              }
              value={data.email}
            /> */}
            <TextField
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e: any) =>
                setData({
                  ...data,
                  password: e.target.value,
                })
              }
              value={data.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Próximo
            </Button>
            <Typography align="center">
              <Link href="#" variant="body2">
                  Esqueceu sua senha?
              </Link><br/><br/>
              <Link href="/signup" variant="body2">
                Criar nova conta
              </Link>
            </Typography>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  )
}


export default Login2


