import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, db } from '../config/firebase'
import dataServices from '../services/services'
import router, { useRouter } from 'next/router'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import React from 'react'
const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stateFolder, setStateFolder] = React.useState([{key: '', value: '', order:0}])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged", user);
      if (user) {
        userReadData(user.uid).then((ret)=>{
          console.log(ret);
          setUser({
            uid: user.uid,
            email: user.email,
            username: ret?.data.username
          })
        })
       
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const setFolders = (data: any) => {
    setStateFolder(data)
  }
  const getFolders = () => {
    return stateFolder
  }
  const getFolderKeyByValue = (value: string) => {
    console.log(stateFolder);
    const ret = stateFolder.find(item => item.value == value)?.key
    return ret
  }

  const folderReload = async () => {
    await dataServices.readById(user.uid, "settings").then((data: any) => {
      if (data){
        console.log(data)
        console.log(Object.values(data))
        const aa = Object.values(data) as Array<any>
        setStateFolder(aa)
        console.log(stateFolder);
        return true
        // return Object.values(data)
      }
    })
  }

  React.useEffect(() => {
    if (user){
      // setStateFolder(null)
      console.log(stateFolder[0].key);
      console.log(user.uid);
      folderReload()
    }
    // return () => getFolders()
  }, [router.query, user])

  const userReadData = async (uid: string)=> {
    console.log(uid);
    const col = query(collection(db, 'users'), where("uid", "==", uid))
    const snap = await getDocs(col);
    const list = snap.docs.map(doc => {
        return {id: doc.id, data: doc.data()}
    });
    console.log(list);
    return list[0]
  }

  const userReadDataBy = async (field: string, value: string)=> {
    console.log({field, value});
    const col = query(collection(db, 'users'), where(field, "==", value))
    const snap = await getDocs(col);
    const list = snap.docs.map(doc => {
        return {id: doc.id, data: doc.data()}
    });
    console.log(list);
    return list[0]
  }

  const userReadDataByEmail = async (email: string)=> {
    console.log(email);
    const col = query(collection(db, 'users'), where("email", "==", email))
    const snap = await getDocs(col);
    const list = snap.docs.map(doc => {
        return {id: doc.id, data: doc.data()}
    });
    console.log(list);
    return list[0]
  }
  
  const registerWithEmailAndPassword = async (name: any, email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      // alert(err.message);
    }
  }
  
  const signup = async (email: string, password: string) => {
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      console.log(user);
      return user
    } catch (error) {
      // console.log(error.message);
    }
  }

  const login = async (email: string, password: string) => {
    // return signInWithEmailAndPassword(auth, email, password)
     return await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // folderReload()
        return user
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Senha não confere')
        return null
      });
  }

  const logout = async () => {
    setUser(null)
    signOut(auth).then(() => {
      console.log('logout');
      // router.push(process.env.NEXT_PUBLIC_DOMAIN+'/login');
    }).catch((error) => {
      console.log('Error logout');
    });
  }


  return (
    <AuthContext.Provider value={{user, folderReload, getFolders, getFolderKeyByValue, setFolders, login, signup, userReadDataBy, userReadDataByEmail, userReadData, registerWithEmailAndPassword, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
