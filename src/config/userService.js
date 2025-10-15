import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from '@env';

// Nota: La app Firebase ya se inicializa en firebaseConfig.js. Aquí asumimos que el proyecto ya está inicializado
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

try {
  initializeApp(firebaseConfig);
} catch (e) {
  // ignore if already initialized
}

const storage = getStorage();
let firestore;
try {
  firestore = getFirestore();
} catch (e) {
  firestore = null;
}

async function uploadImageAndGetUrl(uri, path) {
  // Convierte uri a blob y sube a Storage
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err) {
    console.error('uploadImageAndGetUrl error', err);
    return null;
  }
}

async function updateUserData(uid, data = {}) {
  if (!firestore) return null;
  try {
    const userRef = doc(firestore, 'users', uid);
    // Usamos setDoc con merge para crear/actualizar
    await setDoc(userRef, data, { merge: true });
    return true;
  } catch (err) {
    console.error('updateUserData error', err);
    return false;
  }
}

export { uploadImageAndGetUrl, updateUserData };
