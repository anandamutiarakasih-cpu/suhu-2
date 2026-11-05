/**
 * THERMO CHAMPIONS — FIREBASE AUTHENTICATION MODULE
 * Pure Vanilla JavaScript (ES Modules)
 */

import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirebaseApp } from "./config.js";

let authInstance = null;
let currentUser = null;

export function getFirebaseAuth() {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  authInstance = getAuth(app);
  return authInstance;
}

/**
 * Sign in anonymously for student group device or admin
 */
export async function ensureAuthenticated() {
  const auth = getFirebaseAuth();
  if (!auth) {
    return null;
  }

  if (auth.currentUser) {
    currentUser = auth.currentUser;
    return currentUser;
  }

  try {
    const signInPromise = signInAnonymously(auth);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 1000));
    const cred = await Promise.race([signInPromise, timeoutPromise]);
    currentUser = cred.user;
    console.log('[FirebaseAuth] Signed in anonymously as uid:', currentUser.uid);
    return currentUser;
  } catch (err) {
    // Non-blocking fallback: RTDB works freely under open test rules
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function subscribeToAuth(callback) {
  const auth = getFirebaseAuth();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (callback) callback(user);
  });
}

export function getCurrentUser() {
  const auth = getFirebaseAuth();
  return auth ? auth.currentUser : currentUser;
}
