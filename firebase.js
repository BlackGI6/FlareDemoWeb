import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// import other services like auth, storage, etc. as needed

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUNx-Djm3dpo1EC6a_720JJo7N2-2YILk",
    authDomain: "flare-demo-web.firebaseapp.com",
    projectId: "flare-demo-web",
    storageBucket: "flare-demo-web.appspot.com",
    messagingSenderId: "795864548384",
    appId: "1:795864548384:web:be9195509e4d6ee79e6845"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export the services you need
export { db, collection, addDoc, updateDoc, doc, storage };
