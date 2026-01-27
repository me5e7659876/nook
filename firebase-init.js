import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlAut-NDwKKS32UlE7rFUc6RYMuwwCixw",
  authDomain: "nook-decor.firebaseapp.com",
  projectId: "nook-decor",
  storageBucket: "nook-decor.firebasestorage.app",
  messagingSenderId: "678706358054",
  appId: "1:678706358054:web:872accfd8db8de933843e7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
