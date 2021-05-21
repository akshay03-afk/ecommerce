import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAmy5yMsXrAOv4KJORES3_uG_XWf-pNqqs",
    authDomain: "ecommerce-d3b13.firebaseapp.com",
    projectId: "ecommerce-d3b13",
    storageBucket: "ecommerce-d3b13.appspot.com",
    messagingSenderId: "847126805698",
    appId: "1:847126805698:web:281f60a511fb722d2f4f5b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
  export const googleAuthProvider  = new firebase.auth.GoogleAuthProvider();
