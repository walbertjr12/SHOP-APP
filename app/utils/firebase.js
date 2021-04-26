import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyATwxRKDaFo4W5v6Av2gOFu47etp-af2Uc",
  authDomain: "autorepuesto-2f8e5.firebaseapp.com",
  projectId: "autorepuesto-2f8e5",
  storageBucket: "autorepuesto-2f8e5.appspot.com",
  messagingSenderId: "525816904411",
  appId: "1:525816904411:web:4a9e22b6dad61f903d6afe",
  measurementId: "G-SY2R1BPHQD",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
