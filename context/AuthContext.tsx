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
  const [stateFolder, setStateFolder] = React.useState([{key: '', value: ''}])


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
          // const url = window.location.protocol + '//' + ret?.data.username + '.' + window.location.host + '/home'
          // const hostname = window.location.host 
          // const url = window.location.protocol + '//' + hostname + '/home'
          // console.log(url);
          // router.push(url)
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
    const ret = stateFolder.find(item => item.value == value)?.key
    return ret
  }
  const folderReload = () => {
    dataServices.readById(user.uid, "settings").then((data: any) => {
      console.log(data)
      console.log(Object.values(data))
      setStateFolder(Object.values(data))
      console.log(stateFolder);
      // return Object.values(data)
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

  const registerUser = async (email: string, displayName: any, password: string) => {
      console.log("1> Check user displayName")
      dataServices.check_displayName(displayName).then((ret)=>{
        if (ret) {
          try {
            console.log({email, password});
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log(user);
              updateProfile(user, {displayName: displayName}).then((ret2)=>{
                console.log(ret2);
                return ret2
              })
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
              return false
            });
          } catch (error) {
            return null// Only runs when there is an error/exception
          }
        }else{
          console.log("erro")
          return null
        }
      })
  }

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

  const login = (email: string, password: string) => {
    // return signInWithEmailAndPassword(auth, email, password)
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
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
    await signOut(auth)
  }


  return (
    <AuthContext.Provider value={{user, folderReload, getFolders, getFolderKeyByValue, setFolders, login, signup,  registerUser, userReadDataBy, userReadDataByEmail, userReadData, registerWithEmailAndPassword, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
