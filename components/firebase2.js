// import * as firebase from "firebase";
// import "firebase/firestore";

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore'
import { getStorage } from "firebase/storage";

let config = {
    apiKey: "AIzaSyD5DJ3iMKgZD0EOC01Qs-AzE9Vvwn9xiLU",
    authDomain: "receitas-5968d.firebaseapp.com",
    projectId: "receitas-5968d",
    storageBucket: "receitas-5968d.appspot.com",
    messagingSenderId: "40238569100",
    appId: "1:40238569100:web:1aed03605a177708dc4da9",
    measurementId: "G-Q1SY3V6NJ7",
};

const app = initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {db, storage, auth}
// export default firebase.firestore();