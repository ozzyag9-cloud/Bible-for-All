import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// This will be populated after Firebase setup
let firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  firestoreDatabaseId: ""
};

try {
  // Try to import the config if it exists
  const config = await import('../firebase-applet-config.json');
  firebaseConfig = config.default;
} catch (e) {
  console.warn("Firebase config not found. Please complete setup.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connectivity Test
async function testConnection() {
  try {
    if (firebaseConfig.projectId) {
      await getDocFromServer(doc(db, 'test', 'connection'));
    }
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
