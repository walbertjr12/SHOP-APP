import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC6FR92zROQ1Ou7AoqnY-Nd9wehadls858",
  authDomain: "the-shop-23cc4.firebaseapp.com",
  databaseURL: "https://the-shop-23cc4.firebaseio.com",
  projectId: "the-shop-23cc4",
  storageBucket: "the-shop-23cc4.appspot.com",
  messagingSenderId: "820743776640",
  appId: "1:820743776640:web:17123adf5a536c06863965",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
