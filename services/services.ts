import {db} from "../config/firebase";
import { getFirestore, getDoc, deleteDoc, where, collection, getDocs, updateDoc, addDoc, doc, query, orderBy, onSnapshot, setDoc} from 'firebase/firestore'
// import { route } from "next/dist/server/router";
import { NextRouter, useRouter } from 'next/router'
class CardDataService {

  async getSettingsDefFields(user: string) {
    console.log(user);
    const docRef = doc(db, user, 'deffields');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log("No such document!");
      }
  }

  async setSettingsDefFields(user: string, data: object) {
    try {
      console.log(data);
      await setDoc(doc(db, user, "deffields"), {...data});
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  

  async setUserFolders(user: string, data: object) {
    try {
      console.log(data);
      await setDoc(doc(db, user, "folders"), {...data});
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  getAll() {
    return db;
  }


  async userNameDef(userName: string) {
    let a=0
    const originalUserName = userName
    // const docRef = doc(db, 'users', user);
    async function userNameSearch (userName: any): Promise<any> {
      console.log(2, { userName });
      const docRef = query(collection(db, "users"), where("username", "==", userName));
      const docSnap = await getDocs(docRef);
      console.log(3, docSnap);
      console.log(4, docSnap.size);
      if (docSnap.size == 0) {
        console.log('Find a free name0:', userName)
        return userName
      } 
      a++
      return await userNameSearch(originalUserName + a)
    }
    const x = await userNameSearch(userName)
    console.log('Find a free name:', x)
    return x
  }

  async readUserData(uid: string|null, userName: string|null) {
    let a: any

    if (uid) {
      console.log(1,uid);
      const col = query(collection(db, 'users'), where("uid", "==", uid))
      const snap = await getDocs(col);
      const list = snap.docs.map(doc => {
          return {id: doc.id, data: doc.data()}
      });
      // console.log(list);
      // return list[0]
      a = list[0]
    }

    if (userName) {
      console.log({ userName });
      // const docRef = doc(db, 'users', user);
      const docRef = query(collection(db, "users"), where("username", "==", userName));
      const docSnap = await getDocs(docRef);
       
      docSnap.forEach((doc) => {
        a = doc.data()
      });

      uid = a.uid
    }

    await this.readById(uid as string, "folders").then((data: any) => {
      if (data){
        console.log(data)
        console.log(Object.values(data))
        const folders = Object.values(data) as Array<any>
        console.log(folders);
        a = {...a, folders}
        console.log(a);
        // return aa
      }
    })
    console.log(a);
    return a
  }


  async readById (user: string, id: string) {
    console.log({ user, id });
    const docRef = doc(db, user, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log("No such document!");
      }
  }
  
  async check_displayName(userNameToCheck: string) {
    console.log(userNameToCheck);
    try {
      const res = await fetch(`${location.origin}/api/User?displayName=${userNameToCheck}`);
      const data = await res.json();
      return data[0].uid
    } catch (err) {
      console.log(err);
      return null
    }
    // console.log("check_displayName")
    // const q = query(collection(db, "users"), where("displayName", "==", userNameToCheck));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });

    // const usersRef = collection(db, "users").whereEqualTo("displayName", userNameToCheck).get()
    //   .then((snapshot: { empty: any }) => {
    //       if (snapshot.empty) {
    //           console.log('displayName is unique', snapshot.empty);
    //           return false;
    //       } else {
    //           console.log('displayName already exists');
    //           return true;
    //       }
    //   });
  }

  async read (user: string, folder: string){
    console.log(user, folder);
    // if (user.includes("/")) user = user.split("/")[0]
    const col = query(collection(db, user), orderBy('order'))
    const snap = await getDocs(col);
    const list = snap.docs.map(doc => {
        return {id: doc.id, folder: doc.data().folder, ...doc.data()}
    });
    console.log(list);
    if (folder == "all") {
      return list
    }else{
      return list.filter(item => item.folder == folder);
    }
  }

  async readByFolderName (user: string, folder: string){
    console.log(user, folder);
    // if (user.includes("/")) user = user.split("/")[0]
    const col = query(collection(db, user), orderBy('order'))
    const snap = await getDocs(col);
    const list = snap.docs.map(doc => {
        return {id: doc.id, folder: doc.data().folder, ...doc.data()}
    });
    console.log(list);
    if (folder == "all") {
      return list
    }else{
      const snap = await getDoc(doc(db, user, "folders"))
      const sese = Object.values(snap.data() as any).filter((item: any) => item.value == folder)[0]
      return list.filter((item: any) => item.folder == (sese as any).key )
    }
  }

  async create (user: string, data: { img: string; title: string; body: string; folder: string; order: number; }) {
    try {
        await addDoc(collection(db, user), data)
      } catch (err) {
        console.log(err)
      }
  }

  async setCard (user: string, card_id: string, data: { img: Array<any>; title: string; body: string; folder: string; order: number; }) {
    try {
      console.log(card_id)
      const docRef = doc(db, user, card_id)
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      if (docSnap.data()){ 
        card_id = card_id + '-' + new Date().getTime()
      }
      await setDoc(doc(db, user, card_id), data);
    } 
    catch (err) {
    }
  } 
  
  async userAdd ( data: { uid: string; email: string; username: string;}) {
    try {
      console.log(data);
      const docRef = await addDoc(collection(db, "users"), data);
      console.log("Document written with ID: ", docRef.id);
     
    } catch (err) {
        console.log(err)
      }
  }

  async update (user: string, id: string, data: { img: Array<any>; title: string; body: string; order: number; }) {
    console.log(user, id, data)
    const docRef = doc(db, user, id);
    await updateDoc(docRef, data)
    .then(docRef => {
        console.log("A New Document Field has been added to an existing document");
    })
    .catch(error => {
        console.log(error);
    })
    return "ok"
  }

  async delete (user: string, id: string) {
    console.log(id)
     await deleteDoc(doc(db, user, id));
  }
}

export default new CardDataService();