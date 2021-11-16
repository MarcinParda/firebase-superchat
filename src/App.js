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
    const messageRef = firestore.collection('messages');
    const query = messageRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, {idField: 'id'})
    console.log(messages)

    return (
        <>
            <div>
                {messages && messages.map(message =>
                    <ChatMessage key={message.id} message={message} />
                )}
            </div>
        </>
    )
}

function ChatMessage(props) {
    const { text, uid } = props.message;

    return <p>{text}</p>
}

export default App;
