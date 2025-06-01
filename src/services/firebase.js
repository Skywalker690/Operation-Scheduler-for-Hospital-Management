import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAx21NGiiyBkQGDWdPm7svR5TOb8PWO3b4",
  authDomain: "operation-scheduler-ead14.firebaseapp.com",
  projectId: "operation-scheduler-ead14",
  storageBucket: "operation-scheduler-ead14.appspot.com",  // fixed typo
  messagingSenderId: "394024799966",
  appId: "1:394024799966:web:985596a481d5bf5f7d7c4f",
  measurementId: "G-V3R7C144JS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export default firebase;
