import {db} from "../../../config/firebase";
import { getFirestore,getDoc, deleteDoc, where, collection, getDocs, updateDoc, addDoc, doc, query, orderBy, onSnapshot} from 'firebase/firestore'

export default (req, res) => {

async function ler() {
  // const aa = location.pathname
  const { username } = req.query
  console.log(username);
  const citiesCol = query(collection(db, username),orderBy("order"))
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => {
        return {id:doc.id, ...doc.data()}
    });
    console.log(cityList);
    
    return cityList;
  }
  ler().then((a)=>{
    // console.log(a);
    res.status(200).json(a);
  }) 
  
}