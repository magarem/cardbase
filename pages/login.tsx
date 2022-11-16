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

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        ZenBase
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Login = () => {
  
  const router = useRouter()
  const { userReadDataByEmail } = useAuth()
  const [data, setData] = useState({ email: '', password: '', })

  const callLogin2 = async () => {
    if (data.email){
      const data2 = await userReadDataByEmail(data.email)
      if (data2) {
        console.log(data2);
        const url = window.location.protocol + '//' + data2.data.username.toLowerCase() + '.' + window.location.host + '/login2'
        console.log(url);
        router.push(url + '?email=' + data.email)
      }else{
        alert('Usuário não existe')
      }
    }
  }

  useEffect(() => {
    if ( location.href !== process.env.NEXT_PUBLIC_DOMAIN ){
      router.push( process.env.NEXT_PUBLIC_DOMAIN + '/login' );
    }
  },[])
  
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
            Entrar
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
                  email: e.target.value.toLowerCase(),
                })
              }
              value={data.email}/>
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
