import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth, db } from '../config/firebase'
import dataServices from '../services/services'
import { useRouter } from 'next/router'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import React from 'react'
// import Cookies from 'universal-cookie';
// import { useCookies } from 'react-cookie';

interface UserType {
  email: string | null;
  uid: string | null;
  username: string | null;
  folders: Array<{key: string, value: string}> | null;
  isLogged: boolean;
}

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const router = useRouter()
  const [user, setUser] = useState<UserType>({
    uid: null,
    email: null,
    username: null,
    folders: [{key: '', value: ''}],
    isLogged: false
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [stateFolder, setStateFolder] = React.useState([{key: null, value: null, order:0}])
  // const [cookie, setCookie] = useCookies(["user"])
  const noAuthRequired = ['/', '/login', '/login2', '/signup', '/signup2', '/[folder]', '/[folder]/[id]', '/[folder]/[id]/index', '/usersettings']
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged', stateFolder);
      if (user) {
        dataServices.readUserData(user.uid, null).then((ret) => {
          console.log(ret);
          setUser({
            uid: user.uid,
            email: user.email,
            username: ret?.data.username,
            folders: ret.folders,
            isLogged: true
          })
        })
      } else {
        setUser({ email: null, uid: null, username: null, folders: null, isLogged: false });
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, []);


  // const cookies = new Cookies();
  // useEffect(() => {
  //   alert('auth called')
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     console.log("1onAuthStateChanged", user);
  //     alert(user)
  //     // console.log(cookie.user);
      
  //     // console.log(cookies.get('myCat')); // Pacman
     
  //     if (user) {
        
  //       // setCookie('user', user, { path: '/', domain: '.magadell.local' });

  //       // cookies.set('myCat', 'Pacman', { path: '/' });
  //       // console.log(cookies.get('myCat')); // Pacman
  //       // setCookie("user", JSON.stringify(user), {
  //       //   path: "/"})
  //       //  console.log(cookie.user);
         
  //       userReadData(user.uid).then((ret)=>{
  //         console.log(ret);
  //         setUser({
  //           uid: user.uid,
  //           email: user.email,
  //           username: ret?.data.username
  //         })
  //       })
  //     } else {
  //       // if ( false ) {
  //       //   user = cookie.user
  //       //   console.log(user);
          
  //       // }else{
  //         console.log(11,{user});
          
  //         setUser(null)
  //         if (!noAuthRequired.includes(router.pathname)) {
  //           console.log(22);
  //           // router.push(process.env.NEXT_PUBLIC_DOMAIN+'/login')
  //         }
  //     }
  //     setLoading(false)
  //   })
  //   return () => unsubscribe()
  // }, [])

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  //.sort((a, b) => (a.order > b.order) ? 1 : -1)
  const setFolders = (data: any) => {
    setStateFolder(data)
  }
  const getFolders = () => {
    return stateFolder.map((item: any)=>{
      return {...item, value: item.value}
    }).sort((a, b) => (a.order > b.order) ? 1 : -1)
  }
  
  const getFolderKeyByValue = (value: string) => {
    console.log(stateFolder);
    const ret = user.folders?.find(item => item.value == value)?.key
    return ret
  }

  const folderReloadByGuest = async (uid: string, folder: string) => {
    return await dataServices.readById(uid, "folders").then((data: any) => {
      if (data){
        console.log(data)
        console.log(Object.values(data))
        const aa = Object.values(data) as Array<any>
        // setStateFolder(aa)
        // console.log(stateFolder);
        return aa.find(item => item.value == folder)?.key
      }
    })
  }

  const folderReload = async () => {
    console.log('folderReload', user.uid);
    return await dataServices.readById(user.uid as string, "folders").then((data: any) => {
      if (data){
        console.log(data)
        console.log(Object.values(data))
        const aa = Object.values(data) as Array<any>
        console.log(aa);
        setStateFolder(aa)
        console.log(stateFolder);
        return aa
      }
    })
  }

  // React.useEffect(() => {
  //     alert(JSON.stringify(stateFolder))
  // }, [stateFolder[0].key])
  
  React.useEffect(() => {
      console.log('AuthContext');
      if (user.uid){
        // setStateFolder(null)
        console.log(user.uid);
        // folderReload()
        console.log(stateFolder);
      }
  
  }, [])

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
    }
  }

  const login = async (email: string, password: string) => {
     return await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        return user
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return errorCode
        // return {code:-1, txt: 'Ops, parece que essa não é a senha correta. Tente novamente'}
      });
  }

  const logout = async () => {
    setUser({ email: null, uid: null, username: null, folders: null, isLogged: false })
    signOut(auth).then(() => {
      console.log('logout');
      // router.push(process.env.NEXT_PUBLIC_DOMAIN+'/login');
    }).catch((error) => {
      console.log('Error logout');
    });
  }


  return (
    <AuthContext.Provider value={{user, stateFolder, folderReload, getFolders, getFolderKeyByValue, folderReloadByGuest, setFolders, login, signup, userReadDataBy, userReadDataByEmail, userReadData, registerWithEmailAndPassword, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
