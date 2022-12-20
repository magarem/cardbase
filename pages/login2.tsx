import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// import { useCookies } from "react-cookie"

 

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

const Login2 = () => {
  // const [cookie, setCookie] = useCookies(["user"])
  const router = useRouter()
  const email = router.query.email
  const { user, login, folderReload } = useAuth()
  const [data, setData] = useState({ email: '', password: '' })
  const ref = useRef<HTMLInputElement>(null)
  
  console.log('0');
  
  // if (user.isLogged) router.push('Home')
  useEffect(() => {
    console.log(user.isLogged);
    
    if (user.isLogged) {
      // folderReload().then(()=>{
        router.push('Home')
      // })
    }
  },[user])

  const handleLogin = async (e: any) => {
    e.preventDefault()
    try {
      login(email, data.password).then((user: any)=>{
        console.log({user})
        let authOk = true
        if (user=='auth/wrong-password'){
          let authOk = false
          alert('Ops, parece que essa não é a senha correta. Tente novamente')
          setData({...data, password:''})
          ref.current?.focus();
        }
        if (user=='auth/too-many-requests'){
          let authOk = false
          alert('Muitas tentativas senha incorreta. Esta conta será bloqueada momentaniamente, tente novamente mais tarde')
          setData({...data, password:''})
          ref.current?.focus();
        }
        console.log(2);
        
        // setData({...data, password:''})
        // if (user.isLogged) router.push('/Home')
        
      })
    } catch (err) {
      console.log(1)
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
        }}>
        <Typography component="h1" variant="h5" mt={5}>
          Bem vindo
        </Typography>
        <h4>{window.location.host.split(".")[0]}</h4>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            inputRef={ref} 
            autoFocus={true}
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


