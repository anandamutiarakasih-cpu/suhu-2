/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Firebase SDK Modular Configuration
 * Proyek: suhu-2-ipa
 */

// Auto-purge any stale references to legacy kalor3 from localStorage
try {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('tc_rtdb_url');
    if (saved && saved.includes('kalor3')) {
      localStorage.removeItem('tc_rtdb_url');
    }
  }
} catch (e) {}

// Dynamically check if ?db= parameter is provided in the URL or LocalStorage
let initialDbUrl = "https://suhu-2-ipa-default-rtdb.asia-southeast1.firebasedatabase.app";
try {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const db = params.get('db');
    if (db && decodeURIComponent(db).trim().startsWith('https://')) {
      initialDbUrl = decodeURIComponent(db).trim();
      localStorage.setItem('tc_rtdb_url', initialDbUrl);
    } else {
      const saved = localStorage.getItem('tc_rtdb_url');
      if (saved && saved.startsWith('https://') && !saved.includes('kalor3')) {
        initialDbUrl = saved;
      }
    }
  } else if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('tc_rtdb_url');
    if (saved && saved.startsWith('https://') && !saved.includes('kalor3')) {
      initialDbUrl = saved;
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
