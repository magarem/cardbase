import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
// export async function getServerSideProps(context) {
//   console.log(context);
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/login"
//       }
//     }
// }

const Home: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  router.push(user.displayName + "/adm/list" )
  return (
    <div className={styles.container}>
      <h1>CardBase</h1>
    </div>
  )
}

export default Home
