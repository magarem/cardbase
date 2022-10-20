import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import dataServices from '../services/services'
import { useRouter } from 'next/router'
const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  console.log(user)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  

  const registerUser = async (email: string, displayName: any, password: string) => {
      console.log("1> Check user displayName")
      const et1 = await dataServices.check_displayName(displayName)
      console.log(et1);
      console.log("2> registra user")
      if (!et1) {
        try {
          const ret = await createUserWithEmailAndPassword(auth, email, password)
          console.log("ok", ret.user)
          await updateProfile(ret.user, {displayName: displayName})
          console.log("ok", ret.user.uid)
          return ret.user.uid
        } catch (error) {
          return null// Only runs when there is an error/exception
        }
      }else{
        console.log("esse username já existe")
      }
      
      
      // console.log("ok", ret2)
        // console.log("ok", ret.user)
        // console.log("3> Updating profile to save displayName")
        //   updateProfile(ret.user, {displayName: displayName}).then((data)=>{
        //     console.log("ok", ret.user.uid)
        //    // return ret.user.uid
        //   })
        //   // return true
      //  },(error) => {
      //   console.log({error});
      //   return error
      // })
      // return true
  }

  const signup = async (email: string, displayName: string, password: string) => {
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      console.log(user);
      return await updateProfile(user, {
        displayName: displayName
        })
       
    } catch (error) {
      // console.log(error.message);
    }
  }


  // const signupRes = (email: string, displayName: string, password: string) => {
  //    createUserWithEmailAndPassword(auth, email, password)
  //   .then((res) => {
  //     console.log(res.user.uid);
  //     const user = auth.currentUser;
  //     console.log(user);
  //     return updateProfile(user, {
  //       displayName: displayName
  //       })
  //   })
  // }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    setUser(null)
    await signOut(auth)
  }

  const a = 10

  return (
    <AuthContext.Provider value={{ a, user, login, signup, registerUser, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
