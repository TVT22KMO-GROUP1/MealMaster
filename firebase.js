import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBZddhaXEIA8bsZW80NPRw4vY5jqTviyEc",
  authDomain: "meal-base-99bc5.firebaseapp.com",
  databaseURL: 'https://meal-base-99bc5-default-rtdb.firebaseio.com/',
  projectId: "meal-base-99bc5",
  storageBucket: "meal-base-99bc5.appspot.com",
  messagingSenderId: "973496362349",
  appId: "1:973496362349:web:84236a6738ae5882a7e664"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

export {
  app,
  auth,
  firestore,
  database,
  getAuth,
  signInWithEmailAndPassword,
};

