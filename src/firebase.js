import firebase from 'firebase';
import 'firebase/storage';


const firebaseApp = firebase.initializeApp(
    {
      apiKey: "AIzaSyCSRHbf2JrR65Wbrw9oLMiEi08EdOnQI5M",
      authDomain: "cbit-talks.firebaseapp.com",
      databaseURL: "https://cbit-talks.firebaseio.com",
      projectId: "cbit-talks",
      storageBucket: "cbit-talks.appspot.com",
      messagingSenderId: "527110876031",
      appId: "1:527110876031:web:b47901b64e5406c314484a",
      measurementId: "G-Z26JEDEDD4"
    }
);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db,auth,storage,firebase as default};
