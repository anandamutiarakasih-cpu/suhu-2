/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Firebase Service & Realtime Synchronization Engine
 * Multi-Sync: Firebase RTDB (Direct REST + Modular SDK + Native SSE) + Global Cloud Relay (ntfy SSE/REST) + BroadcastChannel + LocalStorage
 */

import { firebaseConfig } from '../config/firebase-config.js';
import { getPredicate } from '../data/predicates.js';
import {
  SHUFFLE_CHALLENGES,
  WORD_SCRAMBLE_ITEMS,
  HEAT_CALCULATION_ITEMS
} from '../data/questions-bank.js';

class FirebaseService {
  constructor() {
    this.app = null;
    this.db = null;
    this.isFirebaseReady = false;
    this.serverTimeOffset = 0;
    this.broadcast = null;
    this.listeners = new Map();
    this.activeSSE = new Map(); // sessionCode -> cleanup fn

    // Standardized RTDB Base URL (ensuring no trailing slash)
    this.rtdbUrl = (firebaseConfig.databaseURL || 'https://suhu-2-ipa-default-rtdb.asia-southeast1.firebasedatabase.app').replace(/\/$/, '');

    this.initBroadcastChannel();
    this.initFirebase();
  }

  initBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcast = new BroadcastChannel('thermo_champions_suhu_mesh');
        this.broadcast.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }
  }

  async initFirebase() {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const { getDatabase, ref, onValue, set, update, get } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js');

      this.app = initializeApp(firebaseConfig);
      this.db = firebaseConfig.databaseURL ? getDatabase(this.app, firebaseConfig.databaseURL) : getDatabase(this.app);
      this.fbRef = ref;
      this.fbOnValue = onValue;
      this.fbSet = set;
      this.fbUpdate = update;
      this.fbGet = get;

      // Listen for server time offset from RTDB
      const offsetRef = ref(this.db, '.info/serverTimeOffset');
      onValue(offsetRef, (snap) => {
        this.serverTimeOffset = snap.val() || 0;
      });

      // Listen for connection status
      const connRef = ref(this.db, '.info/connected');
      onValue(connRef, (snap) => {
        const val = snap.val();
        this.isOnline = !!val;
        console.log(val ? '🟢 Firebase RTDB Online' : '🟠 Firebase RTDB Offline/Connecting');
      });

      this.isFirebaseReady = true;
      console.log('✅ Firebase Realtime Database SDK Initialized.');
    } catch (err) {
      console.warn('⚠️ Firebase SDK initial note (running on direct REST & SSE sync):', err.message);
      this.isFirebaseReady = false;
    }
  }

  getServerTime() {
    return Date.now() + this.serverTimeOffset;
  }

  handleBroadcastMessage(msg) {
    if (!msg || !msg.type) return;
    const { sessionCode, data } = msg;
    if (this.listeners.has(sessionCode)) {
      const callbacks = this.listeners.get(sessionCode);
      callbacks.forEach((cb) => cb(data));
    }
  }

  /**
   * NOTIFY SESSION UPDATE ACROSS ALL LAYERS
   */
  notifySessionUpdate(sessionCode, sessionData) {
    if (!sessionCode || !sessionData) return;

    // 1. In-process subscribers
    if (this.listeners.has(sessionCode)) {
      this.listeners.get(sessionCode).forEach((cb) => cb(sessionData));
    }

    // 2. BroadcastChannel for tabs on the same browser
    if (this.broadcast) {
      try {
        this.broadcast.postMessage({
          type: 'SESSION_UPDATE',
          sessionCode,
          data: sessionData
        });
      } catch (e) {}
    }

    // 3. LocalStorage persistence
    try {
      localStorage.setItem(`tc_session_${sessionCode}`, JSON.stringify(sessionData));
    } catch (e) {}

    // 4. Global Cloud Relay (Cross-Device Internet Relay)
    this.publishToCloudRelay(sessionCode, sessionData);
  }

  getLocalSession(sessionCode) {
    try {
      const raw = localStorage.getItem(`tc_session_${sessionCode}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * GLOBAL CLOUD RELAY (ntfy.sh Server-Sent Events & REST)
   */
  async publishToCloudRelay(sessionCode, sessionData) {
    if (!sessionCode || !sessionData) return;
    try {
      await fetch(`https://ntfy.sh/tc_suhu_${sessionCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
    } catch (err) {
      console.warn('Cloud relay publish error:', err.message);
    }
  }

  async fetchFromCloudRelay(sessionCode) {
    if (!sessionCode) return null;
    try {
      const res = await fetch(`https://ntfy.sh/tc_suhu_${sessionCode}/json?poll=1&since=12h`);
      if (!res.ok) return null;
      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          if (item && item.message) {
            const data = JSON.parse(item.message);
            if (data && data.code === sessionCode) {
              return data;
            }
          }
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Cloud relay fetch error:', err.message);
    }
    return null;
  }

  listenToCloudRelay(sessionCode, callback) {
    if (!sessionCode || typeof EventSource === 'undefined') return () => {};
    try {
      const eventSource = new EventSource(`https://ntfy.sh/tc_suhu_${sessionCode}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.message) {
            const data = JSON.parse(payload.message);
            if (data && data.code === sessionCode) {
              try {
                localStorage.setItem(`tc_session_${sessionCode}`, JSON.stringify(data));
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
      console.warn('EventSource cloud relay error:', err.message);
      return () => {};
    }
  }

  /**
   * FIREBASE RTDB NATIVE SSE LISTENER
   * Realtime Database pushes live events directly over HTTP stream
   */
  listenToFirebaseSSE(sessionCode, callback) {
    if (!sessionCode || typeof EventSource === 'undefined') return () => {};
    try {
      const sseUrl = `${this.rtdbUrl}/sessions/${sessionCode}.json`;
      const es = new EventSource(sseUrl);

      es.addEventListener('put', (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg && msg.path === '/' && msg.data) {
            callback(msg.data);
          } else if (msg && msg.path) {
            // Subpath updated, refresh session
            this.getSession(sessionCode).then((s) => {
              if (s) callback(s);
            });
          }
        } catch (e) {}
      });

      es.addEventListener('patch', (event) => {
        try {
          this.getSession(sessionCode).then((s) => {
            if (s) callback(s);
          });
        } catch (e) {}
      });

      return () => {
        es.close();
      };
    } catch (e) {
      return () => {};
    }
  }

  /**
   * CREATE A NEW GAME SESSION
   */
  async createSession(title = 'Sesi Pembelajaran Suhu SMP') {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'TC';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const sessionData = {
      code,
      title,
      createdAt: this.getServerTime(),
      status: 'LOBBY',
      currentPhase: 'LOBBY',
      phaseStartTime: null,
      phaseDuration: 0,
      teams: {},
      settings: {
        game1MemorizeTime: 35,
        game1PlayTime: 75,
        game2WordTime: 20,
        game3TotalTime: 120,
        maxTeams: 8
      }
    };

    // 1. Direct REST write to RTDB (Immediate, infallible sync)
    try {
      const putRes = await fetch(`${this.rtdbUrl}/sessions/${code}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (putRes.ok) {
        console.log('✅ Sesi dibuat di Firebase RTDB (REST):', code);
      }
    } catch (e) {
      console.warn('REST session create warning:', e);
    }

    // 2. Push via Firebase Modular SDK if ready
    if (this.isFirebaseReady && this.db) {
      try {
        const sRef = this.fbRef(this.db, `sessions/${code}`);
        await this.fbSet(sRef, sessionData);
      } catch (e) {
        console.warn('Firebase SDK set error:', e);
      }
    }

    // 3. Broadcast across all layers
    this.notifySessionUpdate(code, sessionData);
    return sessionData;
  }

  /**
   * JOIN SESSION & REGISTER TEAM (1 to 8)
   */
  async joinSession(sessionCode, teamNumber, teamName, members) {
    const cleanCode = String(sessionCode || '').trim().toUpperCase();
    const num = parseInt(teamNumber, 10);
    if (isNaN(num) || num < 1 || num > 8) {
      throw new Error('Nomor kelompok harus berada di antara 1 sampai 8.');
    }

    let session = await this.getSession(cleanCode);
    if (!session) {
      throw new Error(`Sesi dengan kode ${cleanCode} tidak ditemukan.`);
    }

    if (session.status !== 'LOBBY') {
      throw new Error('Permainan sudah dimulai atau telah berakhir.');
    }

    if (session.teams && session.teams[`team_${num}`] && session.teams[`team_${num}`].claimed) {
      const mySaved = this.getStoredTeamSession();
      if (!mySaved || mySaved.teamNumber !== num || mySaved.sessionCode !== cleanCode) {
        throw new Error(`Kelompok ${num} sudah diambil oleh perangkat lain.`);
      }
    }

    const teamData = {
      number: num,
      name: (teamName || `Kelompok ${num}`).trim(),
      members: Array.isArray(members) ? members : [],
      claimed: true,
      ready: true,
      joinedAt: this.getServerTime(),
      scores: {
        game1: 0,
        game2: 0,
        game3: 0,
        total: 0
      },
      progress: {
        game1Submitted: false,
        game2Index: 0,
        game3Index: 0
      },
      predicate: 'Temperature Rookie'
    };

    if (!session.teams) session.teams = {};
    session.teams[`team_${num}`] = teamData;

    // 1. Direct REST write to RTDB (Guaranteed sync)
    try {
      await fetch(`${this.rtdbUrl}/sessions/${cleanCode}/teams/team_${num}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData)
      });
      console.log(`✅ Kelompok ${num} bergabung ke sesi ${cleanCode} via REST.`);
    } catch (e) {
      console.warn('REST join team warning:', e);
    }

    // 2. Firebase Modular SDK update
    if (this.isFirebaseReady && this.db) {
      try {
        const teamRef = this.fbRef(this.db, `sessions/${cleanCode}/teams/team_${num}`);
        await this.fbSet(teamRef, teamData);
      } catch (e) {
        console.warn('Firebase join error:', e);
      }
    }

    this.notifySessionUpdate(cleanCode, session);
    this.saveTeamSession(cleanCode, num, teamName);

    return { success: true, teamNumber: num, sessionCode: cleanCode };
  }

  /**
   * SET SESSION PHASE (ADMIN CONTROL)
   */
  async setSessionPhase(sessionCode, phase) {
    const cleanCode = String(sessionCode || '').trim().toUpperCase();
    let session = await this.getSession(cleanCode);
    if (!session) throw new Error('Sesi tidak ditemukan.');

    let duration = 0;
    if (phase === 'GAME1_MEMORIZE') duration = session.settings?.game1MemorizeTime || 35;
    else if (phase === 'GAME1_PLAY') duration = session.settings?.game1PlayTime || 75;
    else if (phase === 'GAME2') duration = (session.settings?.game2WordTime || 20) * 10;
    else if (phase === 'GAME3') duration = session.settings?.game3TotalTime || 120;
    else if (phase === 'FINISHED') duration = 0;

    session.status = phase;
    session.currentPhase = phase;
    session.phaseStartTime = this.getServerTime();
    session.phaseDuration = duration;

    const phasePayload = {
      status: phase,
      currentPhase: phase,
      phaseStartTime: session.phaseStartTime,
      phaseDuration: duration
    };

    // 1. Direct REST PATCH to RTDB
    try {
      await fetch(`${this.rtdbUrl}/sessions/${cleanCode}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phasePayload)
      });
    } catch (e) {
      console.warn('REST setPhase warning:', e);
    }

    // 2. Modular SDK update
    if (this.isFirebaseReady && this.db) {
      try {
        const sessionRef = this.fbRef(this.db, `sessions/${cleanCode}`);
        await this.fbUpdate(sessionRef, phasePayload);
      } catch (e) {
        console.warn('Firebase setPhase error:', e);
      }
    }

    this.notifySessionUpdate(cleanCode, session);
    return session;
  }

  /**
   * SUBMIT GAME 1 (Shuffle & Recall)
   */
  async submitGame1(sessionCode, teamNumber, userAnswers) {
    const cleanCode = String(sessionCode || '').trim().toUpperCase();
    const session = await this.getSession(cleanCode);
    if (!session || !session.teams || !session.teams[`team_${teamNumber}`]) {
      throw new Error('Data kelompok tidak ditemukan.');
    }

    const team = session.teams[`team_${teamNumber}`];
    if (team.progress?.game1Submitted) {
      return { success: false, message: 'Game 1 sudah dikirim sebelumnya.' };
    }

    let correctCount = 0;
    for (const challenge of SHUFFLE_CHALLENGES) {
      const ans = (userAnswers[challenge.id] || '').trim();
      if (ans.toLowerCase() === challenge.correctAnswer.toLowerCase()) {
        correctCount++;
      }
    }

    let score = correctCount * 2.5;
    if (correctCount === SHUFFLE_CHALLENGES.length) {
      score += 5; // Perfect 10/10 bonus
    }
    score = Math.min(30, Math.round(score * 10) / 10);

    team.scores.game1 = score;
    team.scores.total = Math.min(100, Math.round((team.scores.game1 + (team.scores.game2 || 0) + (team.scores.game3 || 0)) * 10) / 10);
    team.predicate = getPredicate(team.scores.total).title;
    team.progress.game1Submitted = true;

    const updatePayload = {
      'scores/game1': score,
      'scores/total': team.scores.total,
      'progress/game1Submitted': true,
      predicate: team.predicate
    };

    // 1. Direct REST update
    try {
      await fetch(`${this.rtdbUrl}/sessions/${cleanCode}/teams/team_${teamNumber}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: team.scores,
          progress: team.progress,
          predicate: team.predicate
        })
      });
    } catch (e) {}

    // 2. Firebase Modular SDK update
    if (this.isFirebaseReady && this.db) {
      try {
        const teamRef = this.fbRef(this.db, `sessions/${cleanCode}/teams/team_${teamNumber}`);
        await this.fbUpdate(teamRef, updatePayload);
      } catch (e) {}
    }

    this.notifySessionUpdate(cleanCode, session);
    return {
      success: true,
      score,
      correctCount,
      totalItems: SHUFFLE_CHALLENGES.length,
      isPerfect: correctCount === SHUFFLE_CHALLENGES.length
    };
  }

  /**
   * SUBMIT GAME 2 SINGLE WORD
   */
  async submitGame2Word(sessionCode, teamNumber, itemId, answer, remainingSec = 0) {
    const cleanCode = String(sessionCode || '').trim().toUpperCase();
    const session = await this.getSession(cleanCode);
    if (!session || !session.teams || !session.teams[`team_${teamNumber}`]) {
      throw new Error('Data kelompok tidak ditemukan.');
    }

    const team = session.teams[`team_${teamNumber}`];
    const item = WORD_SCRAMBLE_ITEMS.find((w) => w.id === itemId);
    if (!item) return { correct: false, score: 0 };

    const cleanUser = (answer || '').replace(/\s+/g, '').toUpperCase();
    const cleanTarget = item.answer.replace(/\s+/g, '').toUpperCase();
    const isCorrect = cleanUser === cleanTarget;

    let addedScore = 0;
    if (isCorrect) {
      addedScore = item.points || 3.0;
      if (remainingSec > 0) {
        const fraction = Math.min(1, Math.max(0, remainingSec / (item.timeLimit || 20)));
        addedScore += fraction * 0.5;
      }
      addedScore = Math.round(addedScore * 10) / 10;
    }

    const currentG2 = team.scores?.game2 || 0;
    const newG2 = Math.min(35, Math.round((currentG2 + addedScore) * 10) / 10);

    team.scores.game2 = newG2;
    team.scores.total = Math.min(100, Math.round(((team.scores.game1 || 0) + newG2 + (team.scores.game3 || 0)) * 10) / 10);
    team.predicate = getPredicate(team.scores.total).title;

    // 1. Direct REST update
    try {
      await fetch(`${this.rtdbUrl}/sessions/${cleanCode}/teams/team_${teamNumber}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: team.scores,
          predicate: team.predicate
        })
      });
    } catch (e) {}

    // 2. Firebase Modular SDK update
    if (this.isFirebaseReady && this.db) {
      try {
        const teamRef = this.fbRef(this.db, `sessions/${cleanCode}/teams/team_${teamNumber}`);
        await this.fbUpdate(teamRef, {
          'scores/game2': newG2,
          'scores/total': team.scores.total,
          predicate: team.predicate
        });
      } catch (e) {}
    }

    this.notifySessionUpdate(cleanCode, session);
    return {
      success: true,
      correct: isCorrect,
      addedScore,
      totalGame2Score: newG2,
      expected: item.answer
    };
  }

  /**
   * SUBMIT GAME 3 CALCULATION
   */
  async submitGame3Calculation(sessionCode, teamNumber, itemId, rawAnswer, remainingSec = 0) {
    const cleanCode = String(sessionCode || '').trim().toUpperCase();
    const session = await this.getSession(cleanCode);
    if (!session || !session.teams || !session.teams[`team_${teamNumber}`]) {
      throw new Error('Data kelompok tidak ditemukan.');
    }

    const team = session.teams[`team_${teamNumber}`];
    const item = HEAT_CALCULATION_ITEMS.find((h) => h.id === itemId);
    if (!item) return { correct: false, score: 0 };

    let clean = String(rawAnswer || '').trim().replace(/\s+/g, '');
    if (/^\d{1,3}(\.\d{3})+$/.test(clean)) {
      clean = clean.replace(/\./g, '');
    } else if (/^\d+,\d+$/.test(clean)) {
      clean = clean.replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }

    const num = parseFloat(clean);
    const expected = item.correctAnswer;
    const tolerance = item.tolerance || 0.01;
    const isCorrect = !isNaN(num) && Math.abs(num - expected) <= Math.max(0.001, Math.abs(expected) * tolerance);

    let addedScore = 0;
    if (isCorrect) {
      addedScore = item.points || 3.5;
      if (remainingSec > 0) {
        const fraction = Math.min(1, Math.max(0, remainingSec / 120));
        addedScore += fraction * 0.5;
      }
      addedScore = Math.round(addedScore * 10) / 10;
    }

    const currentG3 = team.scores?.game3 || 0;
    const newG3 = Math.min(35, Math.round((currentG3 + addedScore) * 10) / 10);

    team.scores.game3 = newG3;
    team.scores.total = Math.min(100, Math.round(((team.scores.game1 || 0) + (team.scores.game2 || 0) + newG3) * 10) / 10);
    team.predicate = getPredicate(team.scores.total).title;

    // 1. Direct REST update
    try {
      await fetch(`${this.rtdbUrl}/sessions/${cleanCode}/teams/team_${teamNumber}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: team.scores,
          predicate: team.predicate
        })
      });
    } catch (e) {}

    // 2. Firebase Modular SDK update
    if (this.isFirebaseReady && this.db) {
      try {
        const teamRef = this.fbRef(this.db, `sessions/${cleanCode}/teams/team_${teamNumber}`);
        await this.fbUpdate(teamRef, {
          'scores/game3': newG3,
          'scores/total': team.scores.total,
          predicate: team.predicate
        });
      } catch (e) {}
    }

    this.notifySessionUpdate(cleanCode, session);
    return {
      success: true,
      correct: isCorrect,
      addedScore,
      totalGame3Score: newG3,
      expected: item.correctAnswer,
      explanation: item.explanation
    };
  }

  /**
   * RESET SESSION
   */
  async resetSession(sessionCode) {
    const cleanCode = String(sessionCode || '').trim().toUpperCase();
    const session = await this.getSession(cleanCode);
    if (!session) return;

    session.status = 'LOBBY';
    session.currentPhase = 'LOBBY';
    session.phaseStartTime = null;
    session.phaseDuration = 0;
    if (session.teams) {
      Object.keys(session.teams).forEach((k) => {
        session.teams[k].scores = { game1: 0, game2: 0, game3: 0, total: 0 };
        session.teams[k].progress = { game1Submitted: false, game2Index: 0, game3Index: 0 };
        session.teams[k].predicate = 'Temperature Rookie';
      });
    }

    // 1. Direct REST write
    try {
      await fetch(`${this.rtdbUrl}/sessions/${cleanCode}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
    } catch (e) {}

    // 2. Firebase Modular SDK
    if (this.isFirebaseReady && this.db) {
      try {
        const sessionRef = this.fbRef(this.db, `sessions/${cleanCode}`);
        await this.fbSet(sessionRef, session);
      } catch (e) {}
    }

    this.notifySessionUpdate(cleanCode, session);
    return session;
  }

  /**
   * LISTEN TO SESSION IN REALTIME (RTDB SDK + RTDB SSE + CLOUD RELAY + STORAGE)
   */
  listenToSession(sessionCode, callback) {
    const cleanCode = String(sessionCode || '').trim().toUpperCase();
    if (!this.listeners.has(cleanCode)) {
      this.listeners.set(cleanCode, new Set());
    }
    this.listeners.get(cleanCode).add(callback);

    // Initial load
    this.getSession(cleanCode).then((s) => {
      if (s) callback(s);
    });

    // 1. Firebase Live SDK Listener
    if (this.isFirebaseReady && this.db) {
      try {
        const sRef = this.fbRef(this.db, `sessions/${cleanCode}`);
        this.fbOnValue(sRef, (snap) => {
          const val = snap.val();
          if (val) {
            this.notifySessionUpdate(cleanCode, val);
          }
        });
      } catch (e) {}
    }

    // 2. Firebase Native RTDB SSE Listener
    const cleanupFbSSE = this.listenToFirebaseSSE(cleanCode, (data) => {
      if (data) {
        if (this.listeners.has(cleanCode)) {
          this.listeners.get(cleanCode).forEach((cb) => cb(data));
        }
      }
    });

    // 3. Global Cloud Relay SSE Listener (For cross-device sync)
    const cleanupCloudSSE = this.listenToCloudRelay(cleanCode, (data) => {
      if (this.listeners.has(cleanCode)) {
        this.listeners.get(cleanCode).forEach((cb) => cb(data));
      }
    });

    // 4. Storage event for multi-tab testing
    const storageHandler = (e) => {
      if (e.key === `tc_session_${cleanCode}` && e.newValue) {
        try {
          const val = JSON.parse(e.newValue);
          callback(val);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      if (this.listeners.has(cleanCode)) {
        this.listeners.get(cleanCode).delete(callback);
      }
      if (cleanupFbSSE) cleanupFbSSE();
      if (cleanupCloudSSE) cleanupCloudSSE();
      window.removeEventListener('storage', storageHandler);
    };
  }

  /**
   * GET SESSION (RTDB REST -> MODULAR SDK -> CLOUD RELAY -> LOCALSTORAGE)
   */
  async getSession(sessionCode) {
    if (!sessionCode) return null;
    const cleanCode = String(sessionCode).trim().toUpperCase();

    // 1. Fast Direct REST Fetch from Firebase RTDB (Instant, bypasses any SDK connection delay)
    try {
      const res = await fetch(`${this.rtdbUrl}/sessions/${cleanCode}.json`);
      if (res.ok) {
        const val = await res.json();
        if (val && typeof val === 'object' && val.code) {
          try {
            localStorage.setItem(`tc_session_${cleanCode}`, JSON.stringify(val));
          } catch (e) {}
          return val;
        }
      }
    } catch (e) {
      console.warn('REST getSession warning:', e);
    }

    // 2. Try Firebase RTDB Modular SDK
    if (this.isFirebaseReady && this.db) {
      try {
        const sRef = this.fbRef(this.db, `sessions/${cleanCode}`);
        const snap = await this.fbGet(sRef);
        if (snap.exists()) {
          const val = snap.val();
          try {
            localStorage.setItem(`tc_session_${cleanCode}`, JSON.stringify(val));
          } catch (e) {}
          return val;
        }
      } catch (e) {}
    }

    // 3. Try Global Cloud Relay
    const cloudSession = await this.fetchFromCloudRelay(cleanCode);
    if (cloudSession && cloudSession.code) {
      try {
        localStorage.setItem(`tc_session_${cleanCode}`, JSON.stringify(cloudSession));
      } catch (e) {}
      return cloudSession;
    }

    // 4. Fallback to LocalStorage
    return this.getLocalSession(cleanCode);
  }

  saveTeamSession(sessionCode, teamNumber, teamName) {
    const cred = { sessionCode, teamNumber, teamName, savedAt: Date.now() };
    localStorage.setItem('tc_team_session', JSON.stringify(cred));
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
    localStorage.removeItem('tc_team_session');
  }
}

export const firebaseService = new FirebaseService();
