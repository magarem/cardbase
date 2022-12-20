import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import dataServices from '../services/services'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const { user, setUser } = useAuth()

  const router = useRouter()
  // alert(location.href)
  // alert(process.env.NEXT_PUBLIC_DOMAIN)
  // alert(location.href==process.env.NEXT_PUBLIC_DOMAIN)
  // alert(user.isLogged)

  const go = (username: string) => {
    dataServices.readUserData(null, username).then((ret) => {
      console.log(ret);
      
      router.push("/Home") 
      // setUser({
      //   uid: user.uid,
      //   email: user.email,
      //   username: ret?.data.username,
      //   folders: ret.folders,
      //   isLogged: true
      // })
    })
  }

  // useEffect(() => {
    if (user.isLogged) {
      if (location.href !== process.env.NEXT_PUBLIC_DOMAIN+'/'){
        router.push("/Home")
      }else{
        router.push("/login2?email="+user.email)
      }
    }else{
      // alert('not logged')
      // alert(location.href == process.env.NEXT_PUBLIC_DOMAIN+'/')
      if (location.href == process.env.NEXT_PUBLIC_DOMAIN+'/'){
        router.push("/login")
      }else{
        let username = location.href.split('//')[1].split('.')[0]
        go(username)
      }
    }


    // if ( location.href == process.env.NEXT_PUBLIC_DOMAIN){
    //   // alert('to login')
    //   // router.push( process.env.NEXT_PUBLIC_DOMAIN + '/login' );
    //   router.push("/login")
    // }else{
    //   router.push("/Home")
    // }
  // },[])
  // router.push("/Home")
  // if (user.isLogged) {
  //   router.push("/Home")
  // } else {
  //   router.push("/Home")
  // }
  return (
    <div className={styles.container}>
    </div>
  )
}

export default Home
