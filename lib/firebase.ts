
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA89eqGp7ogwSP_p5qQHlz-B-nsZg47iPs",
  authDomain: "carcashpro.firebaseapp.com",
  projectId: "carcashpro",
  storageBucket: "carcashpro.firebasestorage.app",
  messagingSenderId: "133666049852",
  appId: "1:133666049852:web:ef6e21aca3fa85834f1839",
  measurementId: "G-F7R8GVDLE2"
};

// Initialize Firebase (check if already initialized for hot-reload safety)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const analytics = firebase.analytics();
