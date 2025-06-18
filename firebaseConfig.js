// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACU-sNHmRAOh5Hu1ZpNgfh9ZmY6h3hG8E",
  authDomain: "maschat-40238.firebaseapp.com",
  projectId: "maschat-40238",
  storageBucket: "maschat-40238.firebasestorage.app",
  messagingSenderId: "797894122462",
  appId: "1:797894122462:web:9b01ec84f4c89d2ee21b4f",
  measurementId: "G-JF29J7C5LF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);