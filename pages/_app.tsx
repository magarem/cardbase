import '../styles/globals.css'
import '../styles/styles.scss'
import '../styles/edit_input_tags.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import { AuthContextProvider } from '../context/AuthContext'
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/ProtectedRoute'
import Head from 'next/head'
const noAuthRequired = ['/', '/login', '/login2', '/signup', '/signup2', '/[folder]', '/[folder]/[id]/edit', '/[folder]/[id]', '/usersettings']
import Layout from '../components/layout'
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
    return (
      <>
        <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>ZenBase</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/apple-icon.png"></link>
        <meta name="theme-color" content="#080808" />
      </Head>
        <AuthContextProvider>
          <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {/* <Navbar /> */}
          <Layout>
            <Container fixed>
              <Box mt={10}>
                
                {(noAuthRequired.includes(router.pathname)) ? (
                  <Component {...pageProps} />
                ) : (
                  <ProtectedRoute>
                    <Component {...pageProps} />
                  </ProtectedRoute>
                )}
              </Box>
            </Container>
          </Layout>
          </ThemeProvider>
        </AuthContextProvider>
      </>
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
