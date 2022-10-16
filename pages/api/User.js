import admin from '../../lib/firebase'
import { auth } from "../../lib/firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default async function handler(req, res) {
  console.log(10, req.cookies)
    const firebase = admin.firestore()
    // const username = req.query.username
    const key = Object.keys(req.query)[0]
    const value = Object.values(req.query)[0]
    console.log(process.env.NODE_ENV)
    console.log(key, value)
   
    if (req.method === 'GET') {

      if (key=="islogged") {
        // const auth = getAuth();
        const user = req.query.islogged
        const getCurrentUser = () => firebase.auth().currentUse
        console.log(getCurrentUser);
        // admin.auth().onAuthStateChanged((user)=> {
        //   if (user) {
        //     console.log(1)
        //     // User is signed in.
        //   } else {
        //     console.log(0)
        //     // No user is signed in.
        //   }
        // });
      
      }
      if (key=="all"){
        admin.auth().listUsers()
        .then((userRecord) => {
          res.status(200).json(userRecord)
        }).catch (erro => {
          res.status(200).json(erro)
        })
      }

      if (key=="uid") {
        const uid = req.query.uid
        admin.auth().getUser(uid)
        .then((userRecord) => {
          res.status(200).json(userRecord)
        }).catch (erro => {
          res.status(200).json(erro)
        })
      }

      if (key=="email") {
        const email = req.query.email
        console.log(2, email)
        console.log(2,req.query)
        
          admin.auth().getUserByEmail(email)
          .then((userRecord) => {
            res.status(200).json(userRecord)
          }).catch (erro => {
          res.status(200).json(erro)
        })
      } 
      
      if (key=="displayName") {
        const displayName = req.query.displayName
        console.log(2, displayName)
        console.log(2,req.query)
        let ret = []
        admin.auth().listUsers()
        .then((userRecord) => {
          userRecord.users.map((item)=>{
            if (item.displayName==displayName){
              ret.push(item)
            }
          })
          res.status(200).json(ret)
        })
   
      }
    }

   
}