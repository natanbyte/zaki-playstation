import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = process.argv[2] || "admin@zakiplaystation.com";
const password = process.argv[3] || "admin123";

console.log(`Mencoba mendaftarkan user: ${email}...`);

try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  console.log(`✅ Berhasil membuat akun: ${userCredential.user.email}`);
  console.log(`UID: ${userCredential.user.uid}`);
} catch (error) {
  if (error.code === "auth/email-already-in-use") {
    console.log(`ℹ️ Akun ${email} sudah terdaftar di Firebase.`);
  } else {
    console.error("❌ Gagal mendaftarkan akun:", error.code, error.message);
  }
}
process.exit(0);

