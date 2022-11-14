import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { CssBaseline, Box, Typography, TextField, Button, Container, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Link from '@mui/material/Link';
import AlertDialog from '../components/AlertDialog'
import CardDataService from '../services/services'
import { db } from '../config/firebase'
import { doc, setDoc } from 'firebase/firestore'

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
  const fields = [
    {name:'email', label: 'e-mail', type: 'email', autofocus: true}, 
    {name:'password', label: 'Senha', type: 'password',  minLength: 6},
    {name:'confirmpassword', label: 'Confirma Senha', type: 'password',  minLength: 6, autofocus: false,  check: 'password'},
  ]

  const [flgErrorDialog, setFlgErrorDialog] = useState(false)
  const formBegin = {uid: '', email: '', password: '', username: ''}
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
    const userCredential = await signup(email, password)
    if (userCredential) {
      const user = userCredential.uid
      const data2 = {uid: user, email: data.email, username: data.email.split('@')[0]}
      const r2 = await CardDataService.userAdd(data2)
      // const docRef2 = await setDoc(doc(db, data2.uid, "settings"), {0:{key: 'Principal', value: 'Principal', order: 0}});
      CardDataService.addUserSettings(data2.uid, {0:{key: 'Principal', value: 'Principal', order: 0}})
      // console.log("User settings with ID: ", docRef2);
      return userCredential
    }
  }

  const handleSignup = async (e: any) => {
    e.preventDefault()
    registra(data.email, data.password).then(()=>{
      logout()
      router.push(process.env.NEXT_PUBLIC_DOMAIN + '/signup2?email=' + data.email + '&username=' + data.email.split('@')[0]);
    })
    setButtonCreateAccount(true)
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
         {fields.map((item, i)=>{
           return (
            <TextField  
            key={item.name}
            type={item.type}
            margin="normal"
            autoComplete="new-password"
            required
            fullWidth
            id={item.name}
            label={item.label}
            name={item.name}
            autoFocus={item.autofocus==true}
            onChange={handleChange}
            value={(data as any)[item.name]}
            />
            )
         })}
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
