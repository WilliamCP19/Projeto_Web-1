import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsSqSkyCkl-bMWNOumHLtSFD5pql8tv00",
  authDomain: "meavaccina.firebaseapp.com",
  projectId: "meavaccina",
  storageBucket: "meavaccina.appspot.com",
  messagingSenderId: "725239434093",
  appId: "1:725239434093:web:31eae1bc25656410832864",
  measurementId: "G-LFJEDD0BJ6"
};
  
const app = initializeApp(firebaseConfig);
const autenticador = getAuth(app);
const bancoDados = getFirestore(app);
const fotos = getStorage(app);

export { autenticador, bancoDados, fotos }
