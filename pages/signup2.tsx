import React from 'react'
import { useRouter } from 'next/router'
import { CssBaseline, Box, Typography, Button, Container} from '@mui/material'
import Link from '@mui/material/Link';

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
const Signup2 = () => {
  const router = useRouter()

  const goLoginPage = () => {
    const url = window.location.protocol + '//' + router.query.username + '.' + window.location.host + '/login2'
    console.log(url);
    router.push(url + '?email=' + router.query.email)
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
