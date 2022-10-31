import {db} from "../config/firebase";
import { getFirestore, getDoc, deleteDoc, where, collection, getDocs, updateDoc, addDoc, doc, query, orderBy, onSnapshot} from 'firebase/firestore'
// import { route } from "next/dist/server/router";
import { NextRouter, useRouter } from 'next/router'
class CardDataService {
  getAll() {
    return db;
  }

  async readById (user: string, id: string){
    const docRef = doc(db, user, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
  }
  
  async check_displayName(userNameToCheck: string) {
    console.log(location.origin);
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



  async read (user: string, cardSession: string){
    console.log(user, cardSession);
    const col = query(collection(db, user), orderBy('order'))
    const snap = await getDocs(col);
    const list = snap.docs.map(doc => {
        return {id: doc.id, cardSession: doc.data().cardSession, ...doc.data()}
    });
    console.log(list);
    if (cardSession == "all") {
      return list
    }else{
      return list.filter(item => item.cardSession == cardSession);
    }
  }

  async create (user: string, data: { img: string; title: string; body: string; cardSession: string; type: any; order: number; }) {
    try {
        await addDoc(collection(db, user), data)
      } catch (err) {
        console.log(err)
      }
  }

  async update (user: string, id: string, data: { img: string; title: string; body: string; cardSession?: string|undefined; type: any; order: number; }) {
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