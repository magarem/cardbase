import {db} from "../../../config/firebase";
import { getFirestore,getDoc, deleteDoc, where, collection, getDocs, updateDoc, addDoc, doc, query, orderBy, onSnapshot} from 'firebase/firestore'
import CardDataService from "../../../services/services";

const folderReloadByGuest = async (uid: string, folder: string) => {
  if (folder) {
    return await CardDataService.readById(uid, "folders").then((data: any) => {
      if (data){
        console.log(data)
        console.log(22, Object.values(data))
        const aa = Object.values(data) as Array<any>
        console.log(44, folder);
        
        // console.log(33, aa.find(item => item.value.toLowerCase() == folder.toLowerCase())?.key);
        
        return aa.find(item => item.value.toLowerCase() == folder.toLowerCase())?.key
      }
    })
  }
}

const firstLetterCapital = (str: string) => {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export default (req: any, res: any) => {
  console.log(req.headers.host);
  // const username = req.headers.host.split('.')[0]
  const username = req.query.username
  console.log(username);
 
  async function ler(userUid: any, folder: any) {
    console.log(55, userUid, folder);
    let citiesCol
    if (folder) {
      console.log(77);
       citiesCol = query(collection(db, userUid), where('folder', '==', folder))
    } else {
       citiesCol = query(collection(db, userUid))
    }
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => {
        return {id:doc.id, ...doc.data()}
    });
    console.log(cityList);
    return cityList.sort((a, b) => (a.order > b.order) ? 1 : -1)
  }
  
  CardDataService.readUserData(username).then(async (ret)=>{
    const folder = req.query.folder
    console.log(11, await folderReloadByGuest(ret.uid, folder));
    if (folder) {
      const folderKey = await folderReloadByGuest(ret.uid, folder)
      if (folderKey){
        ler(ret.uid, folderKey).then((a) => {
          res.status(200).json(a);
        }) 
      }else {
        res.status(200).json([]);
      }
    }else {
      ler(ret.uid, null).then((a) => {
        res.status(200).json(a);
      })
    }
  })
}