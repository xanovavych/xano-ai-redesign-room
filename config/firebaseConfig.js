// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "xano-apps.firebaseapp.com",
  projectId: "xano-apps",
  storageBucket: "xano-apps.firebasestorage.app",
  messagingSenderId: "811359008837",
  appId: "1:811359008837:web:052e0f5feee34c7e8f8b2c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
