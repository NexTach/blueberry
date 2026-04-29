import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import type { Session } from '../types/session';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SESSION_REF = doc(db, 'session', 'current');

export async function updateSession(data: Partial<Omit<Session, 'updatedAt'>>) {
  await setDoc(SESSION_REF, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export function subscribeSession(callback: (session: Session | null) => void): Unsubscribe {
  return onSnapshot(SESSION_REF, (snap) => {
    callback(snap.exists() ? (snap.data() as Session) : null);
  });
}

export async function resetSession() {
  await updateSession({ status: 'standby', visitorName: '', welcomeMessage: '' });
}

export async function updateTheme(themeId: import('../types/session').ThemeId) {
  await setDoc(SESSION_REF, { themeId, updatedAt: serverTimestamp() }, { merge: true });
}
