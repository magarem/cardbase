import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../config/firebase'

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

  const registerUser = async (email, name, password) => {
    try {
      console.log("> Registering user")
      const {
        user
      } = await createUserWithEmailAndPassword(auth, email, password)
  
      console.log("> Updating profile")
      await updateProfile(user, {
        displayName: name,
      });
     
      return user
      console.log(11)
      // window.location.pathname = `/subscriptions`;
    } catch (e) {
      console.log(e)
    }
  }

  const signup = async (email: string, displayName: string, password: string) => {
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      console.log(user);
      return await updateProfile(user, {
        displayName: displayName
        })
       
    } catch (error) {
      console.log(error.message);
    }
  }


  const signupRes = (email: string, displayName: string, password: string) => {
     createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      console.log(res.user.uid);
      const user = auth.currentUser;
      console.log(user);
      return updateProfile(user, {
        displayName: displayName
        })
    })
  }

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
