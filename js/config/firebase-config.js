/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Firebase SDK Modular Configuration
 * Proyek: suhu-2-ipa
 */

export const OFFICIAL_RTDB_URL = "https://suhu-2-ipa-default-rtdb.asia-southeast1.firebasedatabase.app";

// Auto-purge any stale or broken references from localStorage
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('tc_rtdb_url');
  }
} catch (e) {}

// Dynamically check if ?db= parameter is explicitly provided in the URL query string
let initialDbUrl = OFFICIAL_RTDB_URL;
try {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const db = params.get('db');
    if (db && decodeURIComponent(db).trim().startsWith('https://')) {
      initialDbUrl = decodeURIComponent(db).trim();
    }
  }
} catch (e) {
  console.warn('DB URL detection error:', e);
}

export const firebaseConfig = {
  apiKey: "AIzaSyCErNW-portvbj7qSL-cCK1DaWNpW2yRFg",
  authDomain: "suhu-2-ipa.firebaseapp.com",
  projectId: "suhu-2-ipa",
  storageBucket: "suhu-2-ipa.firebasestorage.app",
  messagingSenderId: "137693547137",
  appId: "1:137693547137:web:4f17c9c5c8e7a47ad2db80",
  measurementId: "G-HQGHW6NYJT",
  databaseURL: initialDbUrl
};

// Admin default credentials for teacher login
export const ADMIN_CREDENTIALS = {
  passcode: "THERMO2026", // Admin master passcode for fast classroom deployment
  title: "Admin Guru IPA SMP - Materi Suhu"
};
