import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { GameState } from './types';

const firebaseConfig = {
  apiKey: 'AIzaSyA2qM0VteyAm0R75I5qfXT7PeBDRXTlWNM',
  authDomain: 'lumenwild-21b83.firebaseapp.com',
  projectId: 'lumenwild-21b83',
  storageBucket: 'lumenwild-21b83.firebasestorage.app',
  messagingSenderId: '803705637367',
  appId: '1:803705637367:web:75cb47e227ceffd18ec6f2',
  measurementId: 'G-E6MCG32RHR',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

if (import.meta.env.PROD) {
  void isSupported().then((supported) => supported && getAnalytics(firebaseApp));
}

export const observeAccount = (listener: (user: User | null) => void) =>
  onAuthStateChanged(auth, listener);

export async function createAccount(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: displayName.trim() || 'Wanderer' });
  return credential.user;
}

export const signInAccount = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutAccount = () => signOut(auth);

const gameRef = (uid: string) => doc(db, 'players', uid);

export function watchGameState(
  uid: string,
  onValue: (state: GameState | null) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    gameRef(uid),
    (snapshot) => onValue(snapshot.exists() ? (snapshot.data().game as GameState) : null),
    onError,
  );
}

export function saveGameState(uid: string, state: GameState) {
  return setDoc(
    gameRef(uid),
    { game: state, schemaVersion: 1, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export const deleteGameState = (uid: string) => deleteDoc(gameRef(uid));
