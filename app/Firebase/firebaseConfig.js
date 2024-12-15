// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, remove, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3Mq7s5cI3h7twVhS-Gve_HyPXmepV8go",
  authDomain: "swatantra-6.firebaseapp.com",
  projectId: "swatantra-6",
  storageBucket: "swatantra-6.firebasestorage.app",
  messagingSenderId: "688214329801",
  appId: "1:688214329801:web:587a77e63f9a8a16504018"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, push, remove, set };