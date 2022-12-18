import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  // alert(location.href)
  // alert(process.env.NEXT_PUBLIC_DOMAIN)
  // alert(location.href==process.env.NEXT_PUBLIC_DOMAIN)
  // if ( location.href == process.env.NEXT_PUBLIC_DOMAIN){
  //   // alert('to login')
  //   // router.push( process.env.NEXT_PUBLIC_DOMAIN + '/login' );
  //   router.push("/login")
  // }else{
  //   router.push("/Home")
  // }
  
  if (user.isLogged) {
    router.push("/Home")
  } else {
    router.push("/login")
  }
  return (
    <div className={styles.container}>
    </div>
  )
}

export default Home
