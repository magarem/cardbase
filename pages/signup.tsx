import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { CssBaseline, Box, Typography, TextField, Button, Container} from '@mui/material'
import Link from '@mui/material/Link';
import AlertDialog from '../components/AlertDialog'
import CardDataService from '../services/services'

// Make modifications to the theme with your own fields and widgets

const log = (type: any) => console.log.bind(console, type);

function CopyrightFooter(props: any) {
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

interface pp {
  name: string;
  label: string;
  type: string;
  autofocus: boolean;
}
const Signup = () => {

  const router = useRouter()
  const { signup, logout } = useAuth()

  interface ttt {email:string; password: string; confirmpassword: string}

  const [flgErrorDialog, setFlgErrorDialog] = useState(false)
  const formBegin = { email: '', password: '', passwordConfirm: ''}
  const [data, setData] = useState(formBegin)
  const [open, setOpen] = React.useState(false);
  const [buttonCreateAccount, setButtonCreateAccount] = React.useState(false);

  useEffect(() => {
    if (location.href !== process.env.NEXT_PUBLIC_DOMAIN){
      router.push(process.env.NEXT_PUBLIC_DOMAIN + '/signup');
    }
  },[])
  
  const registra = async (email: string, password: string) => {
    email = email.toLowerCase()
    const userNameDef = await CardDataService.userNameDef(email.split('@')[0].substring(0,18))
    console.log(userNameDef);
    const userCredential = await signup(email, password)
    if (userCredential) {
      const user = userCredential.uid
      const data2 = {uid: user, email: data.email, username: userNameDef}
      await CardDataService.userAdd(data2)
      // CardDataService.setUserFolders(user, {0:{key: '/', value: 'Home', order: 0}, 1:{key: 'principal', value: 'Principal', order: 1}})
      CardDataService.setUserFolders(user, {0:{key: 'principal', value: 'Principal', order: 0}})
      return userNameDef
    }else{
      alert("Esse email já está cadastrado")
      setButtonCreateAccount(false)
      return false
    }
  }

  const handleSignup = async (e: any) => {
    e.preventDefault()
    const email = data.email.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    console.log({email})
    let formOk = true
    if (data.password != data.passwordConfirm) {
      formOk = false
      alert('As senhas não são iguais')
    }
    if (data.password.length < 6) {
      formOk = false
      alert('A senha deve ter 6 digitos no mínimo')
    }
    if (formOk) {
      console.log(email, data.password)
      registra(email, data.password).then((x)=>{
        if (x) {
          logout()
          router.push(process.env.NEXT_PUBLIC_DOMAIN + '/signup2?email=' + email + '&username=' + x);
        }
      })
      setButtonCreateAccount(true)
    }
  } 

  function handleChange(event: { target: { name: any; value: any } }) {
    setData({
      ...data, [event.target.name]: event.target.value
    })
    console.log(data);
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
            type="email"
            margin="normal"
            autoComplete="new-password"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoFocus={true}
            onChange={(e: any) =>
              setData({
                ...data,
                email: e.target.value.toLowerCase().trim().substring(0,40).replace(' ','_')
              })
            }
            value={data.email}/>
            
            <TextField  
            type="password"
            margin="normal"
            autoComplete="new-password"
            required
            fullWidth
            id="password"
            label="Senha"
            name="password"
            onChange={(e: any) =>
              setData({
                ...data,
                password: e.target.value.substring(0,25)
              })
            }
            value={data.password}/>
            
            <TextField  
            type="password"
            margin="normal"
            autoComplete="new-password"
            required
            fullWidth
            id="passwordConfirm"
            label="Confirme senha"
            name="passwordConfirm"
            autoFocus={true}
            onChange={(e: any) =>
              setData({
                ...data,
                passwordConfirm: e.target.value.substring(0,25)
              })
            }
            value={data.passwordConfirm}/> 
            
          <Button
            disabled={buttonCreateAccount}
            color="success"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Criar minha conta
          </Button>
          <br/><br/>
          <Typography align="center">
            <Link href="/login" variant="body2">Já tenho uma conta</Link>
          </Typography>
        </Box>
      </Box>
      <CopyrightFooter sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
export default Signup
