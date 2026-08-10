// firebase.config.js
 
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    initializeFirestore,
    persistentLocalCache,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    doc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
  
const firebaseConfig = {
   apiKey: "AIzaSyA3T7yf8UDxuL36jCJjVnHAn2GqoGOtPAo",
  authDomain: "venginehub.firebaseapp.com",
  projectId: "venginehub",
  storageBucket: "venginehub.firebasestorage.app",
  messagingSenderId: "1074606785731",
  appId: "1:1074606785731:web:1390b7d5756166e513ce76"

}; 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const provider = new GoogleAuthProvider();
const db = initializeFirestore(app, {
    localCache: persistentLocalCache()
});

export {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    doc,
    deleteDoc,
    serverTimestamp,
     auth,
    provider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
};