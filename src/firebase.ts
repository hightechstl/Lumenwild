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
import { seedItems } from './data';

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
const CURRENT_SCHEMA_VERSION = 2;

export function migrateGameState(raw: GameState): GameState {
  const existing = new Map((raw.inventory ?? []).map((item) => [item.id, item]));
  const achievements = (raw.achievements ?? []).map((name) =>
    name === 'A Little Brighter' ? 'Field Routine' : name === 'First Light' ? 'First Companion' : name,
  );
  return {
    ...raw,
    inventory: seedItems.map((seed) => ({ ...seed, quantity: existing.get(seed.id)?.quantity ?? seed.quantity })),
    equipped: raw.equipped ?? [],
    achievements: [...new Set(achievements)],
    lastAction: raw.lastAction?.replace(/glow/gi, 'quest').replace(/Glimmer/gi, 'creature') ?? 'Field record updated.',
  };
}

export function watchGameState(
  uid: string,
  onValue: (state: GameState | null) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    gameRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) return onValue(null);
      const data = snapshot.data();
      const migrated = migrateGameState(data.game as GameState);
      onValue(migrated);
      if ((data.schemaVersion ?? 1) < CURRENT_SCHEMA_VERSION) {
        void setDoc(gameRef(uid), { game: migrated, schemaVersion: CURRENT_SCHEMA_VERSION, updatedAt: serverTimestamp() }, { merge: true });
      }
    },
    onError,
  );
}

export function saveGameState(uid: string, state: GameState) {
  return setDoc(
    gameRef(uid),
    { game: migrateGameState(state), schemaVersion: CURRENT_SCHEMA_VERSION, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export const deleteGameState = (uid: string) => deleteDoc(gameRef(uid));
