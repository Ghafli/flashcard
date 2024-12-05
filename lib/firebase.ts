import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { get, ref } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCbFgzskHBVVAI-GnI1bfcv6qgNb2yeo04",
  authDomain: "flashcardaap.firebaseapp.com",
  databaseURL: "https://flashcardaap-default-rtdb.firebaseio.com",
  projectId: "flashcardaap",
  storageBucket: "flashcardaap.firebasestorage.app",
  messagingSenderId: "44206754596",
  appId: "1:44206754596:web:9bebd49b6a12498de581b1",
  measurementId: "G-JZR83FDRZ5"
};

const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);

// Initialize analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  }).catch((error) => {
    console.error("Error checking Firebase Analytics support:", error);
  });
}

export { analytics };

export const getDeckById = async (deckId: string) => {
  const deckRef = ref(database, `decks/${deckId}`);
  const snapshot = await get(deckRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error('Deck not found');
  }
};
