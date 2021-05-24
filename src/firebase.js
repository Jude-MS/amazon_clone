import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDgc8wIBnIdqN_KWvg5LgCLAvD5zD7tsf4",
    authDomain: "clone-9ad41.firebaseapp.com",
    databaseURL: "https://clone-9ad41.firebaseio.com",
    projectId: "clone-9ad41",
    storageBucket: "clone-9ad41.appspot.com",
    messagingSenderId: "1048211513253",
    appId: "1:1048211513253:web:a7a4b9fd7777587cc0124c",
    measurementId: "G-HR6L31S5QK"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export {db, auth };