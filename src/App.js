import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {AiOutlineSend, BsChatLeft, BsChatLeftText, FiLogOut} from "react-icons/all";

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
                <h1 className="flex align-items-center">
                    <span>Superchat</span>
                    <BsChatLeftText className="ml-sm" />
                </h1>
                <SignOut />
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
        <>
            <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
            <p>Do not violate the community guidelines or you will be banned for life!</p>
        </>
    )

}

function SignOut() {
    return auth.currentUser && (
        <button className="flex align-items-center sign-out" onClick={() => auth.signOut()}> <h3 className="flex align-items-center margin-0 font-regular" ><FiLogOut/><span className="ml-xs" >Sign Out</span></h3></button>
    )
}


function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');


    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (<>
        <main>

            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

            <span ref={dummy} />

        </main>

        <form onSubmit={sendMessage}>

            <input
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="send message..."
            />

            <button type="submit" disabled={!formValue}><AiOutlineSend className="font-lg" /></button>

        </form>
    </>)
}


function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL || 'https://avatars.dicebear.com/api/adventurer/your-cust.svg'}  alt={"photo"}/>
            <p>{text}</p>
        </div>
    )
}


export default App;
