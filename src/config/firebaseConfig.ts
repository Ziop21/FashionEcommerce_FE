import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAv0OZERpgGP_dVueJXgBGrWkCgAMUyisY",
  authDomain: "fashionecommerce-2377f.firebaseapp.com",
  projectId: "fashionecommerce-2377f",
  storageBucket: "fashionecommerce-2377f.appspot.com",
  messagingSenderId: "813379111417",
  appId: "1:813379111417:web:d1fa07e865bd294e0c9528"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);