import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNEupEtcJH2UAtcN-ByHI_PbhRjN9DvF8",
  authDomain: "mobilestart-c425e.firebaseapp.com",
  projectId: "mobilestart-c425e",
  storageBucket: "mobilestart-c425e.firebasestorage.app",
  messagingSenderId: "183879377072",
  appId: "1:183879377072:web:2637eda65c390bb8771b75"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
