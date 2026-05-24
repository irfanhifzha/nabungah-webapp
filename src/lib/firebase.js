import { initializeApp } from "firebase/app";
import { getAuth }  from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
} from "firebase/firestore";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyDm8iM6pcRlk9U9yZvcYq7ksm3OlK86SQ0",
  authDomain: "nabungah.firebaseapp.com",
  projectId: "nabungah",
  storageBucket: "nabungah.firebasestorage.app",
  messagingSenderId: "1062705561789",
  appId: "1:1062705561789:web:9b527850a302e5581ab7d4",
  measurementId: "G-3R8RHHHPPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Enable offline persistence
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Offline persistence enabled");
  })
  .catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Multiple tabs open, persistence only works in one tab");
    } else if (err.code === "unimplemented") {
      console.warn("Browser does not support offline persistence");
    }
  });

// https://firebase.google.com/docs/firestore/manage-data/add-data