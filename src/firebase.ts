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
import { recoverState, starterCreature } from './game';
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
const CURRENT_SCHEMA_VERSION = 4;

export function migrateGameState(raw: GameState): GameState {
  const existing = new Map((raw.inventory ?? []).map((item) => [item.id, item]));
  const achievements = (raw.achievements ?? []).map((name) =>
    name === 'A Little Brighter' ? 'Field Routine' : name === 'First Light' ? 'First Companion' : name,
  );
  const baseCreatures = raw.creatures?.length ? raw.creatures : [starterCreature(raw.species, raw.creatureName, raw.needs?.bond ?? 81)];
  const now = Date.now();
  const creatures = baseCreatures.map((creature) => ({
    ...creature,
    stats: creature.stats ?? (creature.species === 'mosskit' ? { tracking: 82, agility: 60, resolve: 55 } : creature.species === 'galecrest' ? { tracking: 55, agility: 88, resolve: 50 } : starterCreature(raw.species, raw.creatureName).stats),
    energy: creature.energy ?? (creature.id === raw.activeCreatureId ? raw.needs?.energy ?? 64 : 100),
    maxEnergy: creature.maxEnergy ?? 100,
    energyUpdatedAt: creature.energyUpdatedAt ?? now,
  }));
  const discoveries: GameState['discoveries'] = raw.discoveries?.length ? [...raw.discoveries] : ['mosskit'];
  if (creatures.some((creature) => creature.species === 'mosskit') && !discoveries.includes('galecrest')) discoveries.push('galecrest');
  return recoverState({
    ...raw,
    inventory: seedItems.map((seed) => ({ ...seed, quantity: existing.get(seed.id)?.quantity ?? seed.quantity })),
    equipped: raw.equipped ?? [],
    achievements: [...new Set(achievements)],
    creatures,
    activeCreatureId: creatures.some((creature) => creature.id === raw.activeCreatureId) ? raw.activeCreatureId : creatures[0].id,
    discoveries,
    encounterProgress: raw.encounterProgress ?? { mosskit: 0 },
    lastAction: raw.lastAction?.replace(/glow/gi, 'quest').replace(/Glimmer/gi, 'creature') ?? 'Field record updated.',
  }, now);
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
