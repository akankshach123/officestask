// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuBTlJ7jMIztlJ6Up8l3YOWIhHW8cfFy4",
  authDomain: "todo-146ef.firebaseapp.com",
  projectId: "todo-146ef",
  storageBucket: "todo-146ef.appspot.com",
  messagingSenderId: "29540659751",
  appId: "1:29540659751:web:85e656a990a9684ce79402",
  measurementId: "G-6TCDPBL85S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};