/**
 * THERMO CHAMPIONS — REALTIME DATABASE & MULTI-LAYER ENGINE
 * Persis seperti arsitektur di folder Kalor2 & Kalor3:
 * Dual-Sync: Firebase RTDB (kalor3-ff4af) + Global Cloud Relay (SSE/REST) + BroadcastChannel + LocalStorage
 */

import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue,
  off
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getFirebaseApp, getFirebaseConfig, getDeviceToken, STORAGE_KEYS } from "./config.js";
import { ensureAuthenticated } from "./auth.js";
import { getPredicate } from "../../data/questions.js";

class RealtimeDatabaseEngine {
  constructor() {
    this.db = null;
    this.serverTimeOffset = 0;
    this.broadcast = null;
    this.sessionListeners = new Map(); // code -> Set of callbacks
    this.activeSSE = new Map();        // code -> cleanup fn
    this.isOnline = false;

    this.initBroadcastChannel();
    this.initDatabase();
  }

  initBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcast = new BroadcastChannel('thermo_champions_mesh');
        this.broadcast.onmessage = (event) => {
          if (!event || !event.data) return;
          const { sessionCode, data } = event.data;
          if (sessionCode && this.sessionListeners.has(sessionCode)) {
            this.sessionListeners.get(sessionCode).forEach(cb => {
              try { cb(data); } catch (e) { console.warn(e); }
            });
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }
  }

  initDatabase() {
    try {
      const app = getFirebaseApp();
      if (!app) return;
      const cfg = getFirebaseConfig();
      this.db = cfg.databaseURL ? getDatabase(app, cfg.databaseURL) : getDatabase(app);

      // Listen for server time offset
      const offsetRef = ref(this.db, '.info/serverTimeOffset');
      onValue(offsetRef, (snap) => {
        this.serverTimeOffset = snap.val() || 0;
      });

      // Listen for connection status
      const connRef = ref(this.db, '.info/connected');
      onValue(connRef, (snap) => {
        const val = snap.val();
        this.isOnline = !!val;
        console.log(val ? '🟢 Firebase RTDB Online (Suhu 2)' : '🟠 Firebase RTDB Connecting...');
      });

      console.log('✅ Firebase Realtime Database Engine Initialized (Suhu 2).');
    } catch (err) {
      console.warn('Firebase RTDB note (falling back to Cloud Relay):', err.message);
    }
  }

  getSyncedServerNow() {
    return Date.now() + this.serverTimeOffset;
  }

  cleanCode(code) {
    return String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  /**
   * NOTIFY SESSION UPDATE ACROSS ALL LAYERS (RTDB + SSE Cloud Relay + BroadcastChannel + LocalStorage)
   */
  notifySessionUpdate(sessionCode, sessionData) {
    const code = this.cleanCode(sessionCode);
    if (!code || !sessionData) return;

    // 1. In-process subscribers
    if (this.sessionListeners.has(code)) {
      this.sessionListeners.get(code).forEach(cb => {
        try { cb(sessionData); } catch (e) { console.warn(e); }
      });
    }

    // 2. BroadcastChannel for same browser/tabs (0ms latency)
    if (this.broadcast) {
      try {
        this.broadcast.postMessage({
          type: 'SESSION_UPDATE',
          sessionCode: code,
          data: sessionData
        });
      } catch (e) {}
    }

    // 3. LocalStorage persistence
    try {
      localStorage.setItem(`tc_session_${code}`, JSON.stringify(sessionData));
    } catch (e) {}

    // 4. Global Cloud Relay (ntfy.sh SSE/REST for cross-device & cellular connection)
    this.publishToCloudRelay(code, sessionData);
  }

  async publishToCloudRelay(code, sessionData) {
    if (!code || !sessionData) return;
    try {
      await fetch(`https://ntfy.sh/tc_suhu_${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
    } catch (err) {
      // Quiet fail if offline
    }
  }

  async fetchFromCloudRelay(code) {
    if (!code) return null;
    try {
      const res = await fetch(`https://ntfy.sh/tc_suhu_${code}/json?poll=1&since=12h`);
      if (!res.ok) return null;
      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          if (item && item.message) {
            const data = JSON.parse(item.message);
            if (data && this.cleanCode(data.sessionCode || data.code) === code) {
              return data;
            }
          }
        } catch (e) {}
      }
    } catch (err) {}
    return null;
  }

  listenToCloudRelay(code, callback) {
    if (!code || typeof EventSource === 'undefined') return () => {};
    try {
      const eventSource = new EventSource(`https://ntfy.sh/tc_suhu_${code}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.message) {
            const data = JSON.parse(payload.message);
            if (data && this.cleanCode(data.sessionCode || data.code) === code) {
              try {
                localStorage.setItem(`tc_session_${code}`, JSON.stringify(data));
              } catch (e) {}
              callback(data);
            }
          }
        } catch (e) {}
      };
      return () => {
        eventSource.close();
      };
    } catch (err) {
      return () => {};
    }
  }

  getLocalSession(code) {
    try {
      const raw = localStorage.getItem(`tc_session_${code}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * CREATE A NEW TOURNAMENT SESSION (ADMIN)
   */
  async createSession(title = 'Turnamen Suhu IPA Kelas VII', customCode = '') {
    // Non-blocking background auth check
    ensureAuthenticated().catch(() => {});

    // Determine sessionCode
    let sessionCode = '';
    const cleanCustom = this.cleanCode(customCode);
    if (cleanCustom && cleanCustom.length >= 2) {
      sessionCode = cleanCustom.toUpperCase();
    } else {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let rand = '';
      for (let i = 0; i < 4; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      sessionCode = `TC-${rand}`;
    }
    const code = this.cleanCode(sessionCode);

    const sessionData = {
      id: code,
      sessionCode: sessionCode,
      code: code,
      subject: 'SUHU',
      edition: 'THERMO CHAMPIONS — SUHU 2',
      title: (title || 'Turnamen Suhu IPA Kelas VII').trim(),
      status: 'waiting', // waiting | started | paused | ended
      currentPhase: 'LOBBY',
      createdAt: this.getSyncedServerNow(),
      startedAt: null,
      endedAt: null,
      totalDurationSeconds: 0,
      teams: {}
    };

    // Pre-initialize empty teams 1 to 8 (supports both group1..8 and team_1..8)
    for (let i = 1; i <= 8; i++) {
      sessionData.teams[`group${i}`] = null;
      sessionData.teams[`team_${i}`] = null;
    }

    // 1. Direct REST write to Firebase RTDB (Super fast & reliable: ~50ms)
    const cfg = getFirebaseConfig();
    if (cfg && cfg.databaseURL) {
      try {
        const cleanDbUrl = cfg.databaseURL.replace(/\/$/, '');
        // Save under both clean code (TC8921) and display code (TC-8921)
        await fetch(`${cleanDbUrl}/sessions/${code}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        });
        if (sessionCode !== code) {
          fetch(`${cleanDbUrl}/sessions/${encodeURIComponent(sessionCode)}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Direct RTDB REST write note:', err.message);
      }
    }

    // 2. Write to Firebase RTDB via Modular SDK (non-blocking)
    if (this.db) {
      try {
        const sRef = ref(this.db, `sessions/${code}`);
        set(sRef, sessionData).catch(e => console.warn('SDK set catch:', e));
      } catch (err) {
        console.warn('Firebase SDK set note:', err.message);
      }
    }

    // 3. Broadcast across all layers
    this.notifySessionUpdate(code, sessionData);

    return {
      success: true,
      sessionId: code,
      sessionCode: sessionCode,
      session: sessionData
    };
  }

  /**
   * GET SESSION BY CODE (Firebase RTDB -> Direct REST Multi-Match -> Cloud Relay -> LocalStorage)
   */
  async getSession(rawCode) {
    if (!rawCode) return null;
    const code = this.cleanCode(rawCode);
    if (!code) return null;

    // 1. Direct REST GET from Firebase RTDB with Multi-Format Matching
    const cfg = getFirebaseConfig();
    if (cfg && cfg.databaseURL) {
      try {
        const cleanDbUrl = cfg.databaseURL.replace(/\/$/, '');
        
        // A. Try clean code (e.g. TC7890 or SUHU01)
        let res = await fetch(`${cleanDbUrl}/sessions/${code}.json`);
        let val = res.ok ? await res.json() : null;

        // B. Try raw exact code if different (e.g. TC-7890)
        const rawTrim = encodeURIComponent(String(rawCode).trim());
        if ((!val || !val.code) && rawTrim !== code) {
          res = await fetch(`${cleanDbUrl}/sessions/${rawTrim}.json`);
          val = res.ok ? await res.json() : null;
        }

        // C. Fallback: Scan /sessions.json to match case-insensitively & flexibly
        if (!val || !val.code) {
          const allRes = await fetch(`${cleanDbUrl}/sessions.json`);
          if (allRes.ok) {
            const allSessions = await allRes.json();
            if (allSessions && typeof allSessions === 'object') {
              for (const [key, s] of Object.entries(allSessions)) {
                if (!s) continue;
                const kClean = this.cleanCode(key);
                const sCode = this.cleanCode(s.code);
                const sSessionCode = this.cleanCode(s.sessionCode);
                const sId = this.cleanCode(s.id);
                if (kClean === code || sCode === code || sSessionCode === code || sId === code) {
                  val = s;
                  break;
                }
              }
            }
          }
        }

        if (val && (val.code || val.sessionCode || val.title)) {
          try { localStorage.setItem(`tc_session_${code}`, JSON.stringify(val)); } catch (e) {}
          return val;
        }
      } catch (e) {
        console.warn('REST getSession error:', e);
      }
    }

    // 2. Try Firebase RTDB SDK
    if (this.db) {
      try {
        const sRef = ref(this.db, `sessions/${code}`);
        const snap = await get(sRef);
        if (snap.exists()) {
          const val = snap.val();
          try {
            localStorage.setItem(`tc_session_${code}`, JSON.stringify(val));
          } catch (e) {}
          return val;
        }
      } catch (e) {
        console.warn('RTDB SDK getSession error:', e.message);
      }
    }

    // 3. Try Global Cloud Relay
    const cloudSession = await this.fetchFromCloudRelay(code);
    if (cloudSession) {
      try {
        localStorage.setItem(`tc_session_${code}`, JSON.stringify(cloudSession));
      } catch (e) {}
      return cloudSession;
    }

    // 4. Fallback to LocalStorage
    return this.getLocalSession(code);
  }

  /**
   * CLAIM GROUP SLOT (1 to 8)
   */
  async claimGroupSlot(rawCode, groupNumber, groupName, members, customDeviceToken = null) {
    const code = this.cleanCode(rawCode);
    const num = Number(groupNumber);
    if (isNaN(num) || num < 1 || num > 8) {
      throw new Error('Nomor kelompok harus antara 1 sampai 8.');
    }

    const deviceToken = customDeviceToken || getDeviceToken();
    let session = await this.getSession(code);
    if (!session) {
      throw new Error(`Sesi dengan kode ${rawCode} tidak ditemukan.`);
    }

    if (!session.teams) session.teams = {};
    const groupKey = `group${num}`;
    const existing = session.teams[groupKey];

    // Check if slot already taken
    if (existing && existing.claimed) {
      if (existing.deviceToken !== deviceToken) {
        return {
          success: false,
          message: `Kelompok ${num} sudah dipilih oleh perangkat lain! Silakan pilih nomor kelompok lain.`
        };
      }
      // Re-connection from same device
      existing.isOnline = true;
      existing.lastActive = this.getSyncedServerNow();
    } else {
      // New claim
      session.teams[groupKey] = {
        groupNumber: num,
        number: num,
        groupName: (groupName || `Kelompok ${num}`).trim(),
        name: (groupName || `Kelompok ${num}`).trim(),
        members: Array.isArray(members) ? members : [],
        deviceToken: deviceToken,
        claimed: true,
        ready: true,
        status: (session.status === 'started' || session.currentPhase === 'started') ? 'in_game' : 'ready',
        isOnline: true,
        joinedAt: this.getSyncedServerNow(),
        lastActive: this.getSyncedServerNow(),
        scores: { quiz: 0, memory: 0, calc: 0, game1: 0, game2: 0, game3: 0, total: 0 },
        completedModes: { quiz: false, memory: false, calc: false },
        progress: { game1Submitted: false, game2Index: 0, game3Index: 0 },
        totalDurationSeconds: 0,
        predicate: 'TEMPERATURE ROOKIE'
      };
      // Keep team_${num} in sync
      session.teams[`team_${num}`] = session.teams[groupKey];
    }

    const claimedGroup = session.teams[groupKey];
    this.saveTeamSession(code, num, claimedGroup.groupName);

    // 1. Direct REST write to Firebase RTDB
    const cfg = getFirebaseConfig();
    if (cfg && cfg.databaseURL) {
      try {
        const cleanDbUrl = cfg.databaseURL.replace(/\/$/, '');
        fetch(`${cleanDbUrl}/sessions/${code}/teams/${groupKey}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(claimedGroup)
        }).catch(() => {});
        fetch(`${cleanDbUrl}/sessions/${code}/teams/team_${num}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(claimedGroup)
        }).catch(() => {});
      } catch (err) {}
    }

    // 2. Push to Firebase RTDB SDK
    if (this.db) {
      try {
        const teamRef = ref(this.db, `sessions/${code}/teams/${groupKey}`);
        set(teamRef, claimedGroup).catch(() => {});
        const teamAltRef = ref(this.db, `sessions/${code}/teams/team_${num}`);
        set(teamAltRef, claimedGroup).catch(() => {});
      } catch (err) {
        console.warn('Firebase team set error:', err.message);
      }
    }

    // 3. Broadcast across all layers
    this.notifySessionUpdate(code, session);

    return {
      success: true,
      group: claimedGroup
    };
  }

  /**
   * RELEASE GROUP SLOT
   */
  async releaseGroupSlot(rawCode, groupNumber, deviceToken) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session || !session.teams) return false;

    const groupKey = `group${groupNumber}`;
    const slot = session.teams[groupKey];
    if (slot && slot.deviceToken === deviceToken) {
      session.teams[groupKey] = null;

      if (this.db) {
        try {
          const teamRef = ref(this.db, `sessions/${code}/teams/${groupKey}`);
          await set(teamRef, null);
        } catch (e) {}
      }

      this.notifySessionUpdate(code, session);
      return true;
    }
    return false;
  }

  /**
   * LISTEN TO SESSION STATUS AND DATA
   */
  listenToSession(rawCode, callback) {
    const code = this.cleanCode(rawCode);
    if (!code) return () => {};

    if (!this.sessionListeners.has(code)) {
      this.sessionListeners.set(code, new Set());
    }
    this.sessionListeners.get(code).add(callback);

    // Initial fetch
    this.getSession(code).then(s => {
      if (s) callback(s);
    });

    // 1. Firebase Live RTDB Listener
    let fbUnsub = null;
    if (this.db) {
      try {
        const sRef = ref(this.db, `sessions/${code}`);
        fbUnsub = onValue(sRef, (snap) => {
          const val = snap.val();
          if (val) {
            this.notifySessionUpdate(code, val);
          }
        });
      } catch (e) {}
    }

    // 2. Global Cloud Relay SSE Listener
    const cleanupSSE = this.listenToCloudRelay(code, (data) => {
      if (this.sessionListeners.has(code)) {
        this.sessionListeners.get(code).forEach(cb => cb(data));
      }
    });

    // 3. LocalStorage storage event
    const storageHandler = (e) => {
      if (e.key === `tc_session_${code}` && e.newValue) {
        try {
          const val = JSON.parse(e.newValue);
          callback(val);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      if (this.sessionListeners.has(code)) {
        this.sessionListeners.get(code).delete(callback);
      }
      if (fbUnsub && this.db) {
        try { off(ref(this.db, `sessions/${code}`)); } catch (e) {}
      }
      if (cleanupSSE) cleanupSSE();
      window.removeEventListener('storage', storageHandler);
    };
  }

  /**
   * LISTEN TO 8 LOBBY SLOTS
   */
  listenToLobbyGroups(rawCode, callback) {
    return this.listenToSession(rawCode, (session) => {
      if (!session) {
        callback({});
        return;
      }
      callback(session.teams || {});
    });
  }

  /**
   * LISTEN TO REAL-TIME LEADERBOARD
   */
  listenToLeaderboard(rawCode, callback) {
    return this.listenToSession(rawCode, (session) => {
      if (!session || !session.teams) {
        callback([]);
        return;
      }

      const list = [];
      for (let i = 1; i <= 8; i++) {
        const t = session.teams[`group${i}`];
        if (t && t.claimed) {
          const totalSkor = t.scores?.total || 0;
          list.push({
            groupNumber: t.groupNumber || i,
            groupName: t.groupName || t.name || `Kelompok ${i}`,
            membersCount: (t.members || []).length,
            skorQuiz: t.scores?.quiz || 0,
            skorMemory: t.scores?.memory || 0,
            skorNumberChains: t.scores?.calc || 0,
            totalSkor: totalSkor,
            totalDurationSeconds: t.totalDurationSeconds || 0,
            status: t.status || 'ready',
            predicate: t.predicate || getPredicate(totalSkor).title,
            lastUpdate: t.lastActive || Date.now()
          });
        }
      }

      // Ranking sort: 1. Total score DESC, 2. Duration ASC
      list.sort((a, b) => {
        if (b.totalSkor !== a.totalSkor) return b.totalSkor - a.totalSkor;
        return a.totalDurationSeconds - b.totalDurationSeconds;
      });

      callback(list);
    });
  }

  /**
   * START TOURNAMENT TOGETHER (ADMIN)
   */
  async startTournamentTogether(rawCode) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session) return false;

    session.status = 'started';
    session.startedAt = this.getSyncedServerNow();

    if (session.teams) {
      for (let i = 1; i <= 8; i++) {
        const k = `group${i}`;
        if (session.teams[k]) {
          session.teams[k].status = 'in_game';
        }
      }
    }

    if (this.db) {
      try {
        const sRef = ref(this.db, `sessions/${code}`);
        await set(sRef, session);
      } catch (e) {}
    }

    this.notifySessionUpdate(code, session);
    return true;
  }

  async pauseTournament(rawCode) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session) return;

    session.status = 'paused';
    session.pausedAt = this.getSyncedServerNow();

    if (this.db) {
      try {
        await update(ref(this.db, `sessions/${code}`), { status: 'paused', pausedAt: session.pausedAt });
      } catch (e) {}
    }

    this.notifySessionUpdate(code, session);
  }

  async resumeTournament(rawCode) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session) return;

    session.status = 'started';

    if (this.db) {
      try {
        await update(ref(this.db, `sessions/${code}`), { status: 'started' });
      } catch (e) {}
    }

    this.notifySessionUpdate(code, session);
  }

  async endTournament(rawCode) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session) return;

    session.status = 'ended';
    session.endedAt = this.getSyncedServerNow();

    if (this.db) {
      try {
        await update(ref(this.db, `sessions/${code}`), { status: 'ended', endedAt: session.endedAt });
      } catch (e) {}
    }

    this.notifySessionUpdate(code, session);
  }

  /**
   * SUBMIT ANSWER DIRECT
   */
  async submitAnswerDirect(rawCode, groupNumber, deviceToken, mode, itemId, answer, isCorrect, scoreWeight, timeSpentSeconds = 0) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session || !session.teams) {
      throw new Error('Sesi tidak ditemukan.');
    }

    const groupKey = `group${groupNumber}`;
    const team = session.teams[groupKey];
    if (!team) {
      throw new Error(`Data Kelompok ${groupNumber} tidak ditemukan.`);
    }

    if (!session.submissions) session.submissions = {};
    const subKey = `${groupKey}_${mode}_${itemId}`;

    if (session.submissions[subKey]) {
      return {
        duplicate: true,
        awardedScore: session.submissions[subKey].awardedScore || 0,
        isCorrect: session.submissions[subKey].isCorrect || false
      };
    }

    const awardedScore = isCorrect ? scoreWeight : 0;

    session.submissions[subKey] = {
      mode,
      itemId,
      answer,
      isCorrect,
      awardedScore,
      deviceToken,
      submittedAt: this.getSyncedServerNow()
    };

    if (!team.scores) team.scores = { quiz: 0, memory: 0, calc: 0, game1: 0, game2: 0, game3: 0, total: 0 };
    if (mode === 'quiz' || mode === 'game1') {
      team.scores.quiz = Math.min(35, Math.round(((team.scores.quiz || 0) + awardedScore) * 10) / 10);
      team.scores.game1 = team.scores.quiz;
    }
    if (mode === 'memory' || mode === 'game2') {
      team.scores.memory = Math.min(30, Math.round(((team.scores.memory || 0) + awardedScore) * 10) / 10);
      team.scores.game2 = team.scores.memory;
    }
    if (mode === 'calc' || mode === 'game3') {
      team.scores.calc = Math.min(35, Math.round(((team.scores.calc || 0) + awardedScore) * 10) / 10);
      team.scores.game3 = team.scores.calc;
    }

    team.scores.total = Math.min(100, Math.round(((team.scores.quiz || 0) + (team.scores.memory || 0) + (team.scores.calc || 0)) * 10) / 10);
    team.predicate = getPredicate(team.scores.total).title;
    team.lastActive = this.getSyncedServerNow();

    if (timeSpentSeconds > 0) {
      team.totalDurationSeconds = (team.totalDurationSeconds || 0) + Number(timeSpentSeconds);
    }

    // Keep team_${groupNumber} in sync
    session.teams[`team_${groupNumber}`] = team;

    if (this.db) {
      try {
        const teamRef = ref(this.db, `sessions/${code}/teams/${groupKey}`);
        await set(teamRef, team);
        const teamAltRef = ref(this.db, `sessions/${code}/teams/team_${groupNumber}`);
        await set(teamAltRef, team);
        const subRef = ref(this.db, `sessions/${code}/submissions/${subKey}`);
        await set(subRef, session.submissions[subKey]);
      } catch (e) {}
    }

    this.notifySessionUpdate(code, session);

    return {
      duplicate: false,
      isCorrect,
      awardedScore,
      scores: team.scores
    };
  }

  async markModeCompleted(rawCode, groupNumber, modeKey) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session || !session.teams) return;

    const groupKey = `group${groupNumber}`;
    const team = session.teams[groupKey];
    if (team) {
      if (!team.completedModes) team.completedModes = {};
      team.completedModes[modeKey] = true;

      if (this.db) {
        try {
          await update(ref(this.db, `sessions/${code}/teams/${groupKey}/completedModes`), { [modeKey]: true });
        } catch (e) {}
      }
      this.notifySessionUpdate(code, session);
    }
  }

  async finishGroupGame(rawCode, groupNumber) {
    const code = this.cleanCode(rawCode);
    let session = await this.getSession(code);
    if (!session || !session.teams) return;

    const groupKey = `group${groupNumber}`;
    const team = session.teams[groupKey];
    if (team) {
      team.status = 'finished';

      if (this.db) {
        try {
          await update(ref(this.db, `sessions/${code}/teams/${groupKey}`), { status: 'finished' });
        } catch (e) {}
      }
      this.notifySessionUpdate(code, session);
    }
  }

  saveTeamSession(sessionCode, teamNumber, teamName) {
    const cred = { sessionCode, teamNumber, teamName, savedAt: Date.now() };
    try { localStorage.setItem('tc_team_session', JSON.stringify(cred)); } catch (e) {}
  }

  getStoredTeamSession() {
    try {
      const raw = localStorage.getItem('tc_team_session');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  clearStoredTeamSession() {
    try { localStorage.removeItem('tc_team_session'); } catch (e) {}
  }
}

export const rtdbEngine = new RealtimeDatabaseEngine();

// Export function wrappers matching the API
export const getRTDB = () => rtdbEngine.db;
export const getSyncedServerNow = () => rtdbEngine.getSyncedServerNow();
export const createSession = (title, customCode) => rtdbEngine.createSession(title, customCode);
export const getSessionByCode = async (rawCode) => {
  const session = await rtdbEngine.getSession(rawCode);
  if (!session) return null;
  return {
    sessionId: session.code || rtdbEngine.cleanCode(rawCode),
    session: session
  };
};
export const claimGroupSlot = (sCode, gNum, gName, mem, dev) => rtdbEngine.claimGroupSlot(sCode, gNum, gName, mem, dev);
export const releaseGroupSlot = (sCode, gNum, dev) => rtdbEngine.releaseGroupSlot(sCode, gNum, dev);
export const listenToSession = (sCode, cb) => rtdbEngine.listenToSession(sCode, cb);
export const listenToLobbyGroups = (sCode, cb) => rtdbEngine.listenToLobbyGroups(sCode, cb);
export const listenToLeaderboard = (sCode, cb) => rtdbEngine.listenToLeaderboard(sCode, cb);
export const startTournamentTogether = (sCode) => rtdbEngine.startTournamentTogether(sCode);
export const pauseTournament = (sCode) => rtdbEngine.pauseTournament(sCode);
export const resumeTournament = (sCode) => rtdbEngine.resumeTournament(sCode);
export const endTournament = (sCode) => rtdbEngine.endTournament(sCode);
export const submitAnswerDirect = (sCode, gNum, dev, m, id, ans, cor, w, t) => rtdbEngine.submitAnswerDirect(sCode, gNum, dev, m, id, ans, cor, w, t);
export const markModeCompleted = (sCode, gNum, m) => rtdbEngine.markModeCompleted(sCode, gNum, m);
export const finishGroupGame = (sCode, gNum) => rtdbEngine.finishGroupGame(sCode, gNum);
