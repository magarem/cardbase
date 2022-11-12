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
const Signup2 = () => {
  const router = useRouter()

  const goLoginPage = () => {
    router.push('login');
  };

  return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',}}>
        <Typography component="h1" variant="h5" mt={4} align="center">
          Usuário registrado com sucesso
        </Typography><br/>
        <Button onClick={goLoginPage}>Entrar</Button>
      </Box>
      <CopyrightFooter sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}

export default Signup2
