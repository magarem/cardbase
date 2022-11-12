import { route } from 'next/dist/server/router'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { Copyright } from '@material-ui/icons'
import { CssBaseline, Box, Typography, TextField, Button, Container, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Link from '@mui/material/Link';
import AlertDialog from '../components/AlertDialog'
import CardDataService from '../services/services'
import { displayName } from 'react-quill'
import { auth, db } from '../config/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, startAt } from 'firebase/firestore'
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

interface pp {
  name: string;
  label: string;
  type: string;
  autofocus: boolean;
}
const Signup = () => {
  const router = useRouter()
  const { user, registerUser, signup, registerWithEmailAndPassword, login, logout } = useAuth()
  
  console.log({user});
  // if (user) logout()
  interface ttt {email:string; password: string; confirmpassword: string}
  const fields = [
    {name:'email', label: 'e-mail', type: 'email', autofocus: true}, 
    {name:'password', label: 'Senha', type: 'password',  minLength: 6},
    {name:'confirmpassword', label: 'Confirma Senha', type: 'password',  minLength: 6, autofocus: false,  check: 'password'},
    // {name:'displayName', label: 'Nome de usuário', type: '', autofocus: false}
    ]

  console.log(user)
  const [flgErrorDialog, setFlgErrorDialog] = useState(false)
  const formBegin = {uid: '', email: '', password: '', username: ''}
  const [data, setData] = useState(formBegin)
  const [open, setOpen] = React.useState(false);
  const [buttonCreateAccount, setButtonCreateAccount] = React.useState(false);

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // useEffect(() => {
    
  //   if (location.href !== location.href.replace(/^[^.]+\./g, "")){
  //     const url1 = window.location.protocol + '//' + window.location.origin.replace(/^[^.]+\./g, "")
  //     console.log( url1 + '/signup');
  //     // location.href = url1 + '/signup'
  //     router.push(url1 + '/signup')
  //   }
  // },[])
  
  const registra = async (email: string, password: string) => {
    console.log(email, password);
    
    const userCredential = await signup(email, password)
    if (userCredential) {
      console.log(userCredential);
      const user = userCredential.uid
      console.log(user);
      
      const data2 = {uid: user, email: data.email, username: data.email.split('@')[0]}
      console.log(data2);
      
      await CardDataService.userAdd(data2)

      const docRef2 = await setDoc(doc(db, data2.uid, "settings"), {0:{key: 'home', value: 'home'}});
      console.log("User settings with ID: ", docRef2);
    }
  }
 
  useEffect(() => {
    registra(router.query.email as string, router.query.password as string)
  },[router.query.email])

  const handleSignup = async (e: any) => {
    e.preventDefault()
    // const {user} = await createUserWithEmailAndPassword(auth, data.email, data.password)
    // console.log(user);
    const hostname = window.location.host
    const url2 = window.location.protocol + '//' + data.email.split('@')[0] + '.' + hostname + '/signup?email=' + data.email + '&password=' + data.password
    console.log(url2);
    // router.push(url2)
    // registra(data.email, data.password)
    // const userCredential = await signup(data.email, data.password)
    // console.log(userCredential);
    // const user = userCredential.uid
    // console.log(user);
    
    // const data2 = {uid: user, email: data.email, username: data.email.split('@')[0]}
    // console.log(data2);
    
    // await CardDataService.userAdd(data2)

    // const docRef2 = await setDoc(doc(db, data2.uid, "settings"), {0:{key: 'home', value: 'home'}});
    // console.log("User settings with ID: ", docRef2);
    // const hostname = window.location.host 
    // const url = window.location.protocol + '//' + '.' + hostname + '/home'
    // console.log(url);
    // router.push(url)


    // const url = window.location.protocol + '//' + data2.username + '.' + window.location.host + '/home'
    // const url = window.location.protocol + '//' + window.location.host + '/login'
    // console.log(url);
      logout()
      router.push('signup2')
    // location.href = url
      // CardDataService.userAdd()

      // updateProfile(user, {displayName: displayName}).then((ret) => {
      //   console.log(ret)
      // })

      // updateProfile(user, {displayName: displayName}).then((ret2)=>{
      //   console.log(ret2);
      //   return ret2
      // }).catch((error) => {
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
      //   console.log(errorCode, errorMessage);
      //   return false
      // })

    // }).catch((error) => {
    //   console.log(error);
    //   return null// Only runs when there is an error/exception
    // })
    setButtonCreateAccount(true)
  } 


   
    // CardDataService.check_displayName(data.displayName)
    // if (!et1) {
    //     let error = false
    //     console.log("esse user name está disponível");
    //     console.log(data);
    //     fields.map((item) => {
    //       if (item.minLength){
    //         if (data[item.name].length<item.minLength) {
    //           alert('Erro no campo ' + item.label + ', mínimo de ' + item.minLength + ' dígitos')
    //           error = true
    //         }
    //         if (item.check){
    //           if (data[item.name] !== data[item.check]) {
    //             alert('Erro: Os campos ' + item.label + ' e ' + item.check + ' não conferem')
    //           }
    //         }
    //       }
    //     })
        
    //     if (!error){
    //       const user = await registerUser(data.email, data.displayName, data.password)
    //       console.log({user})
    //       if (!user){
    //         alert('Erro')
    //         setButtonCreateAccount(false)
    //       }
    //       if (user) {
    //         console.log("usuário criado com sucesso", user);

    //         CardDataService.addUserSettings(user.displayName, {key: 'home', value: 'home'})
    //           .then((x) => {
    //             console.log("Created new user settings item successfully!");
    //             console.log(x)
    //           })
    //           .catch((e) => {
    //             console.log(e);
    //           });
    //         // login(data.email, data.password).then((ret: { user: { displayName: string } })=>{
    //         //   console.log(ret.user.displayName);
    //         //   // router.push(ret.user.displayName + '/home')
    //         //   const url1 = window.location.protocol + '//' + ret.user.displayName + '.' + window.location.hostname + ':' + location.port
    //         //   console.log( url1 + '/home');
    //         //   location.href = url1 + '/home'
    //         // })
    //       }else{
    //         setFlgErrorDialog(true)
    //         setTimeout(() => {
    //           setFlgErrorDialog(false)
    //         }, 3000)
    //       }
        
    //   }
    // }else{
    //   alert('Esse nome de usuário já existe')
    //   setButtonCreateAccount(false)
    // }
  // }


  function handleChange(event: { target: { name: any; value: any } }) {
    setData({
      ...data, [event.target.name]: event.target.value
    })
    console.log(data);
  }

  return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Defina um nome de usuário"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">Pasta</InputLabel> */}
              {/* <TextField  
    
            margin="normal"
            required
            fullWidth
            id='displayName'
            label='Nome de usuário'
            name='displayName'
            autoFocus={true}
            onChange={handleChange}
            value={data.displayName}
            /> */}
                    </FormControl>
          </DialogContentText>
        </DialogContent>
      </Dialog>
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

          {/* <TextField
            
            margin="normal"
            required
            fullWidth
            id="teste2"
            label="teste2"
            name="teste2"
            autoFocus
            onChange={(e: any) =>
              setData({
                ...data,
                teste2: e.target.value,
              })
            }
            value={data.teste2}
          />




           <TextField
           
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
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
            variant="outlined" 
            margin="normal"
            required
            fullWidth
            id="displayName"
            label="Usuário"
            name="displayName"
            
            onChange={(e: any) =>
              setData({
                ...data,
                displayName: e.target.value,
              })
            }
            value={data.displayName}
          />


          <TextField
           
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
           
            onChange={(e: any) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
          /> */}
          <Button
            disabled={buttonCreateAccount}
            color="success"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Criar minha conta
          </Button>
          {/* <Typography align="center">
                  ou
          </Typography> */}<br/><br/>
          <Typography align="center">
            <Link href="/login" variant="body2">Já tenho uma conta</Link>
          </Typography>
          {/* <Button
            color="info"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Já tenho uma conta
          </Button> */}
          
        </Box>
      </Box>
      <CopyrightFooter sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}

export default Signup
