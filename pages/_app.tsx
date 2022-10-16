import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import NavbarPublic from '../components/NavbarPublic'
import { AuthContextProvider } from '../context/AuthContext'
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/ProtectedRoute'

const noAuthRequired = ['/', '/login', '/signup']

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
});

const main = {"margin": "100px;"}
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  // if (!["/adm"].includes(router.asPath)){
    return (
      <AuthContextProvider>
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar />
        <Container fixed>
          <Box mt={10}>
        {(noAuthRequired.includes(router.pathname)||router.pathname.indexOf("/adm/")==-1) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
        </Box>
        </Container>
        </ThemeProvider>
      </AuthContextProvider>
    )
  }
  // else{
  //   return (
  //     <ThemeProvider theme={darkTheme}>
  //       <CssBaseline />
  //       <NavbarPublic/>
  //       <main><Component {...pageProps} /></main>
  //     </ThemeProvider>

  //     // <ThemeProvider theme={darkTheme}>
  //     // <CssBaseline />
  //     // <NavbarPublic/>
  //     // <Container fixed>
  //     //   <Box>
  //     //      <main>
  //     //    <Component {...pageProps} /></main>
  //     //    </Box>
  //     //    </Container>
  //     // </ThemeProvider>
  //   )
  // }
// }

export default MyApp
