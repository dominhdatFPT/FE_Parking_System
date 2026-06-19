import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey : "AIzaSyCDaOUcNh4lW4K3Gmz0nzDqgqfqfEsyO2A" , 
  authDomain : "smartparking-f628f.firebaseapp.com" , 
  projectId : "smartparking-f628f" , 
  storageBucket : "smartparking-f628f.firebasestorage.app" , 
  messagingSenderId : "513359286602" , 
  appId : "1:513359286602:web:e96c592069fc45d02771b3" , 
  measurementId : "G-K8MJXDQ4CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
