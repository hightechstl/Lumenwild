import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  setDoc,
} from 'firebase/firestore';
import type { GameState } from './types';
import { recoverState, starterCreature } from './game';
import { seedItems } from './data';
import {hydrateQuestState} from './quests/questEngine';
import {hydrateCraftingState} from './crafting/craftingEngine';
import {hydrateCreature} from './creatures/creatureEngine';

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
  void import('firebase/analytics').then(async ({ getAnalytics, isSupported }) => {
    if (await isSupported()) getAnalytics(firebaseApp);
  });
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
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email.trim());

const gameRef = (uid: string) => doc(db, 'players', uid);
export const CURRENT_SCHEMA_VERSION = 11;
export class SaveConflictError extends Error { constructor(){super('This save changed on another device. Your field journal has been refreshed.')} }

export function migrateGameState(raw: GameState): GameState {
  const existing = new Map((raw.inventory ?? []).map((item) => [item.id, item]));
  const achievements = (raw.achievements ?? []).map((name) =>
    name === 'A Little Brighter' ? 'Field Routine' : name === 'First Light' ? 'First Companion' : name,
  );
  const baseCreatures = raw.creatures?.length ? raw.creatures : [starterCreature(raw.species, raw.creatureName, raw.needs?.bond ?? 81)];
  const now = Date.now();
  const creatures = baseCreatures.map((creature) => hydrateCreature({
    ...creature,
    stats: creature.stats ?? (creature.species === 'mosskit' ? { tracking: 82, agility: 60, resolve: 55 } : creature.species === 'galecrest' ? { tracking: 55, agility: 88, resolve: 50 } : starterCreature(raw.species, raw.creatureName).stats),
    energy: creature.energy ?? (creature.id === raw.activeCreatureId ? raw.needs?.energy ?? 64 : 100),
    maxEnergy: creature.maxEnergy ?? 100,
    energyUpdatedAt: creature.energyUpdatedAt ?? now,
  } as GameState['creatures'][number]));
  const discoveries: GameState['discoveries'] = raw.discoveries?.length ? [...raw.discoveries] : ['mosskit'];
  if (creatures.some((creature) => creature.species === 'mosskit') && !discoveries.includes('galecrest')) discoveries.push('galecrest');
  return hydrateCraftingState(hydrateQuestState(recoverState({
    ...raw,
    saveRevision: Number.isFinite(raw.saveRevision) ? raw.saveRevision : 0,
    recentActions: Array.isArray(raw.recentActions) ? raw.recentActions.slice(-30) : [],
    materials: raw.materials ?? {},
    discoveredMaterials: raw.discoveredMaterials ?? [],
    discoveredRecipes: raw.discoveredRecipes ?? [],
    cosmetics: raw.cosmetics ?? [],
    questRecords: raw.questRecords ?? {},
    questHistory: raw.questHistory ?? [],
    inventory: seedItems.map((seed) => ({ ...seed, quantity: existing.get(seed.id)?.quantity ?? seed.quantity })),
    equipped: raw.equipped ?? [],
    achievements: [...new Set(achievements)],
    dailyCareDate: raw.dailyCareDate ?? '',
    creatures,
    activeCreatureId: creatures.some((creature) => creature.id === raw.activeCreatureId) ? raw.activeCreatureId : creatures[0].id,
    discoveries,
    encounterProgress: raw.encounterProgress ?? { mosskit: 0 },
    encounterDays: raw.encounterDays ?? {},
    encounterRotationDate: raw.encounterRotationDate ?? '',
    encounterRotation: raw.encounterRotation ?? [],
    encounterAttemptDate: raw.encounterAttemptDate ?? '',
    dailyEncounterAttempts: raw.dailyEncounterAttempts ?? {},
    fieldDays: raw.fieldDays ?? [],
    forageDate: raw.forageDate ?? '',
    foragePlays: raw.foragePlays ?? 0,
    lastAction: raw.lastAction?.replace(/glow/gi, 'quest').replace(/Glimmer/gi, 'creature') ?? 'Field record updated.',
  }, now), now));
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

export function saveGameState(uid: string, state: GameState, actionId: string) {
  return runTransaction(db, async transaction => {
    const ref=gameRef(uid);const snapshot=await transaction.get(ref);
    const remote=snapshot.exists()?migrateGameState(snapshot.data().game as GameState):null;
    if(remote?.recentActions.includes(actionId))return remote;
    if(remote&&remote.saveRevision!==state.saveRevision)throw new SaveConflictError();
    const saved=migrateGameState({...state,saveRevision:(remote?.saveRevision??-1)+1,recentActions:[...(remote?.recentActions??[]),actionId].slice(-30)});
    transaction.set(ref,{game:saved,schemaVersion:CURRENT_SCHEMA_VERSION,updatedAt:serverTimestamp()},{merge:true});
    return saved;
  });
}

export const deleteGameState = (uid: string) => deleteDoc(gameRef(uid));
