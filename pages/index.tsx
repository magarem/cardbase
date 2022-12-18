import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  if (user) {
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
