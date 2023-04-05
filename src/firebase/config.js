// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJgoBqiJNprj1sc3zxjWX-SYGpPj2UxPU",
  authDomain: "chat-app-9a203.firebaseapp.com",
  projectId: "chat-app-9a203",
  storageBucket: "chat-app-9a203.appspot.com",
  messagingSenderId: "748350919143",
  appId: "1:748350919143:web:41ae673c3a11fdb6bb2d42",
  measurementId: "G-VXW2RMYT1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const storage = getStorage();
export const db = getFirestore()