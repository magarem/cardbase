import {db} from "../config/firebase";
import { getFirestore, getDoc, deleteDoc, where, collection, getDocs, updateDoc, addDoc, doc, query, orderBy, onSnapshot} from 'firebase/firestore'

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
  
  async read (user: string, type: string){
    console.log(user,type);
    const citiesCol = query(collection(db, user), orderBy('order'))
    const citySnapshot = await getDocs(citiesCol);
    

    // citySnapshot.docs.flatMap(o => o.type==type ? [o.name] : []);

    // var reduced = citySnapshot.docs.reduce(function(filtered, option) {
    //   if (option.type == type) {
    //      var someNewValue = { name: option.name, newProperty: 'Foo' }
    //      filtered.push(someNewValue);
    //   }
    //   return filtered;
    // }, [])
    
    
    //  const cityList = [{id:'', title:'', body:'', order:0, type:''}]
    const cityList = citySnapshot.docs.map(doc => {
        // return { id: doc.id, ...doc.data()}
        return {id: doc.id, type: doc.data().type, ...doc.data()}
    });
    console.log(cityList);
    return cityList.filter(item => item.type == type);
    // if (type == "card"){
    //   return cityList.filter(item => item.type == type || item.type == undefined);
    // }else{
    //   return cityList.filter(item => item.type == type);
    // }
  }

  async create (user: string, data: { img: string; title: string; body: string; type: any; order: number; }) {
    try {
        await addDoc(collection(db, user), data)
        // onClose()
      } catch (err) {

        console.log(err)
      }
  }

  async update (user: string, id: string, data: { img: string; title: string; body: string; type: any; order: number; }) {
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