import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Usar la instancia ya configurada

const storage = getStorage();
const firestore = db; // Usar la instancia de Firestore ya configurada

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
