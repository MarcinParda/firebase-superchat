import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

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

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    );
}

function ChatRoom() {
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, {idField: 'id'});

    const [formValue, setFormValue] = useState('');

    const sendMessage = async(e) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser;
        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })
        setFormValue('');
    }

    return (
        <>
            <div>
                {messages && messages.map(message =>
                    <ChatMessage key={message.id} message={message} />
                )}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    type="text"
                />
                <button type="submit">SEND</button>
            </form>
        </>
    )
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL} alt="avatar"/>
            <p>{text}</p>
        </div>
    )
}

export default App;
