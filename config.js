/**
 * THERMO CHAMPIONS — GLOBAL CONFIGURATION & SUPABASE INITIALIZER
 * Pure Vanilla JavaScript & Supabase Realtime Client
 */

const THERMO_CONFIG = {
  // Supabase Publishable Key provided by user
  DEFAULT_SUPABASE_KEY: 'sb_publishable__xFEKpJLEyceeRzqdcceXw_o_wUh_zz',
  
  // Supabase Project URL for nbtxatgtfqanuipwmetg
  DEFAULT_SUPABASE_URL: localStorage.getItem('thermo_supabase_url') || 'https://nbtxatgtfqanuipwmetg.supabase.co',
  
  // Maximum scores per mode
  MAX_SCORE_QUIZ: 35,
  MAX_SCORE_MEMORY: 30,
  MAX_SCORE_CALC: 35,
  MAX_TOTAL_SCORE: 100,
  
  // Storage keys
  STORAGE_KEYS: {
    SUPABASE_URL: 'thermo_supabase_url',
    SUPABASE_KEY: 'thermo_supabase_key',
    ACTIVE_SESSION: 'thermo_active_session',
    ACTIVE_GROUP: 'thermo_active_group',
    DEVICE_TOKEN: 'thermo_device_token',
    ADMIN_SESSION_ID: 'thermo_admin_session_id',
    MUTED: 'thermo_muted'
  }
};

/**
 * Retrieve or generate a persistent device token for this browser
 */
function getDeviceToken() {
  let token = localStorage.getItem(THERMO_CONFIG.STORAGE_KEYS.DEVICE_TOKEN);
  if (!token) {
    token = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem(THERMO_CONFIG.STORAGE_KEYS.DEVICE_TOKEN, token);
  }
  return token;
}

/**
 * Get the current Supabase configuration (URL & Key)
 */
function getSupabaseConfig() {
  const url = localStorage.getItem(THERMO_CONFIG.STORAGE_KEYS.SUPABASE_URL) || THERMO_CONFIG.DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem(THERMO_CONFIG.STORAGE_KEYS.SUPABASE_KEY) || THERMO_CONFIG.DEFAULT_SUPABASE_KEY;
  return { url: url.trim(), key: key.trim() };
}

/**
 * Save new Supabase configuration
 */
function setSupabaseConfig(url, key) {
  if (url) localStorage.setItem(THERMO_CONFIG.STORAGE_KEYS.SUPABASE_URL, url.trim());
  if (key) localStorage.setItem(THERMO_CONFIG.STORAGE_KEYS.SUPABASE_KEY, key.trim());
}

/**
 * Create or return the global Supabase client instance
 */
let _supabaseClientInstance = null;

function getSupabaseClient() {
  if (_supabaseClientInstance) return _supabaseClientInstance;

  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    console.warn('[ThermoChampions] Supabase URL is not configured yet.');
    return null;
  }

  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    console.error('[ThermoChampions] Supabase JS library is not loaded from CDN.');
    return null;
  }

  try {
    _supabaseClientInstance = window.supabase.createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    return _supabaseClientInstance;
  } catch (err) {
    console.error('[ThermoChampions] Error initializing Supabase client:', err);
    return null;
  }
}

// Reset instance if config changes
function resetSupabaseClient() {
  _supabaseClientInstance = null;
}
