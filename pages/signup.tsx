import { route } from 'next/dist/server/router'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { Copyright } from '@material-ui/icons'
import { CssBaseline, Box, Typography, TextField, Button, Container } from '@mui/material'
import Link from '@mui/material/Link';
import AlertDialog from '../components/AlertDialog'
import dataServices from '../services/services'
  
function CopyrightFooter(props: any) {
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


const Signup = () => {
  const router = useRouter()
  const { user, signup, registerUser, login, logout } = useAuth()
  console.log(user)
  const [flgErrorDialog, setFlgErrorDialog] = useState(false)
  const [data, setData] = useState({
    email: '',
    displayName: '',
    password: '',
  })

  const handleSignup = async (e: any) => {
    e.preventDefault()
    // dataServices.check_displayName(data.displayName)
    // const et1 = await dataServices.check_displayName(data.displayName)
    // console.log(et1);
    // if (!et1) {
        console.log("esse user name está disponível");
        const user = await registerUser(data.email, data.displayName, data.password)
        console.log({user})
        if (user) {
          console.log("usuário criado com sucesso", user);
          logout()
          login(data.email, data.password).then((ret: { user: { displayName: string } })=>{
            console.log(ret.user.displayName);
            router.push(ret.user.displayName + '/adm/list')
          })
        }else{
          setFlgErrorDialog(true)
          setTimeout(() => {
            setFlgErrorDialog(false)
          }, 3000)
        }
       
   
    //   }else{
    //   console.log("não disponível");
    // }
   
  }
  return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AlertDialog time img="" title="Erro" body="Esse e-mail ou nome do usuário já existente" mostra={flgErrorDialog} setMostra={setFlgErrorDialog}/>
      <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        <Typography component="h1" variant="h5" mt={4}>
          Registro
        </Typography>
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
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
            value={data.email}
          />
           <TextField
            variant="filled" 
            margin="normal"
            required
            fullWidth
            id="displayName"
            label="Usuário"
            name="displayName"
            autoComplete="email"
            autoFocus
            onChange={(e: any) =>
              setData({
                ...data,
                displayName: e.target.value,
              })
            }
            value={data.displayName}
          />
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
            color="success"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Criar minha conta
          </Button>
          <Typography align="center">
                  ou
          </Typography>
          <Link href="/login" variant="body2">
          <Button
            color="info"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Já tenho uma conta
          </Button>
          </Link>
        </Box>
      </Box>
      <CopyrightFooter sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}

export default Signup
