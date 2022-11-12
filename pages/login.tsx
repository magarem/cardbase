import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Logout } from '@mui/icons-material';

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


const Login = () => {
  const router = useRouter()
  const {logout, userReadDataByEmail } = useAuth()
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const callLogin2 = async () => {
    if (data.email){
      // fetch('/api/User?email=' + data.email)
      // .then((res) => res.json())
      // .then((data) => {
      //   console.log(window.location.host);
      //   const url = window.location.protocol + '//' + data.displayName.toLowerCase() + '.' + window.location.host + '/login2'
      //   router.push(url)
      // })
      
      const data2 = await userReadDataByEmail(data.email)
      console.log(data2);
      const url = window.location.protocol + '//' + data2.data.username.toLowerCase() + '.' + window.location.host + '/login2'
      console.log(url);
      router.push(url + '?email=' + data.email)
      // location.href = url
    }
  }

  const goHome = () => {
    const url1 = window.location.protocol + '//' + window.location.origin.replace(/^[^.]+\./g, "")
    console.log( url1 + '/login');
    location.href = url1 + '/login'
    
  }
  // useEffect(() => {
  //   // if (user) logout()
  //   if (location.href !== location.href.replace(/^[^.]+\./g, "")){
  //     goHome()
  //   }
  //   console.log(location.href);
  // },[])
  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography component="h1" variant="h5" mt={5}>
            Login
          </Typography>
          <Box component="form"  noValidate sx={{ mt: 1 }}>
            <TextField
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
              value={data.email}/>
            {/* <TextField
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
            /> */}
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={callLogin2}>
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

export default Login
