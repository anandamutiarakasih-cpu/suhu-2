/**
 * THERMO CHAMPIONS — FIREBASE INITIALIZER & CONFIG
 * Menggunakan kredensial aktif proyek resmi: suhu-2-ipa.
 * Vanilla JavaScript (ES Modules) via official Google Firebase Modular SDK.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

// Storage keys for persistent settings
export const STORAGE_KEYS = {
  FIREBASE_CONFIG: 'thermo_firebase_config',
  ACTIVE_SESSION: 'thermo_active_session',
  ACTIVE_GROUP: 'thermo_active_group',
  DEVICE_TOKEN: 'thermo_device_token',
  ADMIN_SESSION_ID: 'thermo_admin_session_id',
  MUTED: 'thermo_muted',
  RTDB_URL: 'tc_rtdb_url'
};

// Auto-purge any stale references to kalor3 from previous sessions
try {
  if (typeof localStorage !== 'undefined') {
    const savedUrl = localStorage.getItem(STORAGE_KEYS.RTDB_URL);
    if (savedUrl && savedUrl.includes('kalor3')) {
      localStorage.removeItem(STORAGE_KEYS.RTDB_URL);
    }
    const savedCfg = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (savedCfg && savedCfg.includes('kalor3')) {
      localStorage.removeItem(STORAGE_KEYS.FIREBASE_CONFIG);
    }
  }
} catch (e) {}

// Deteksi dinamis parameter ?db= dari URL atau LocalStorage
let initialDbUrl = "https://suhu-2-ipa-default-rtdb.asia-southeast1.firebasedatabase.app";
try {
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const db = params.get('db');
      if (db && decodeURIComponent(db).trim().startsWith('https://')) {
        initialDbUrl = decodeURIComponent(db).trim();
        localStorage.setItem(STORAGE_KEYS.RTDB_URL, initialDbUrl);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.RTDB_URL);
    if (saved && saved.startsWith('https://') && !saved.includes('kalor3')) {
      initialDbUrl = saved;
    }
  }
} catch (e) {
  console.warn('DB URL detection error:', e);
}

// Kredensial aktif Firebase Realtime Database (Proyek: suhu-2-ipa)
export const firebaseConfig = {
  apiKey: "AIzaSyCErNW-portvbj7qSL-cCK1DaWNpW2yRFg",
  authDomain: "suhu-2-ipa.firebaseapp.com",
  projectId: "suhu-2-ipa",
  storageBucket: "suhu-2-ipa.firebasestorage.app",
  databaseURL: initialDbUrl
};

// Admin default credentials for teacher login
export const ADMIN_CREDENTIALS = {
  passcode: "THERMO2026",
  title: "Admin Guru IPA SMP"
};

/**
 * Get or generate persistent unique device token
 */
export function getDeviceToken() {
  let token = localStorage.getItem(STORAGE_KEYS.DEVICE_TOKEN);
  if (!token) {
    token = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.DEVICE_TOKEN, token);
  }
  return token;
}

/**
 * Get current Firebase Configuration object
 */
export function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.databaseURL && !parsed.databaseURL.includes('kalor3')) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[FirebaseConfig] Failed to parse stored config:', e);
  }
  return firebaseConfig;
}

/**
 * Save updated Firebase config to localStorage
 */
export function setFirebaseConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') return false;
  localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(cfg));
  if (cfg.databaseURL) {
    localStorage.setItem(STORAGE_KEYS.RTDB_URL, cfg.databaseURL);
  }
  return true;
}

/**
 * Initialize or get Firebase App instance
 */
let appInstance = null;

export function getFirebaseApp() {
  if (appInstance) return appInstance;

  const apps = getApps();
  if (apps.length > 0) {
    appInstance = getApp();
    return appInstance;
  }

  const config = getFirebaseConfig();
  try {
    appInstance = initializeApp(config);
    console.log('✅ Firebase App initialized successfully with project:', config.projectId);
    return appInstance;
  } catch (err) {
    console.error('❌ Error initializing Firebase App:', err);
    return null;
  }
}
