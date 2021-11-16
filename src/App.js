import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyA5we1X9VqP5LYreZ8Wa9XW4YOFvGeisXc",
  authDomain: "superchat-cc2d4.firebaseapp.com",
  projectId: "superchat-cc2d4",
  storageBucket: "superchat-cc2d4.appspot.com",
  messagingSenderId: "245943375008",
  appId: "1:245943375008:web:74e6eb60e36c1b6283e5c5"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>

      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;
