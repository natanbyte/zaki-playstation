import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { AppUser } from "@/types";
import type { LoginFormData } from "../types";

// Map Firebase User to our internal clean AppUser type
const mapFirebaseUser = (user: FirebaseUser): AppUser => ({
  uid: user.uid,
  email: user.email || "",
  role: "admin", // Default role for portal users, owner checked via claims or doc
  displayName: user.displayName || user.email?.split("@")[0] || "Admin",
});

// Authenticate user with email and password
export const loginWithEmail = async (data: LoginFormData): Promise<AppUser> => {
  const credential = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  return mapFirebaseUser(credential.user);
};

// Sign out current authenticated user
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Listener for auth state changes
export const subscribeToAuth = (
  callback: (user: AppUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    callback(mapFirebaseUser(firebaseUser));
  });
};

