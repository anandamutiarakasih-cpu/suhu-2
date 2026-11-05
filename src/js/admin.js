/**
 * THERMO CHAMPIONS — GAME MASTER & TEACHER ADMIN CONTROLLER (ES MODULES)
 * HTML5 + CSS3 + Vanilla JavaScript + Firebase Realtime Database
 */

import {
  getFirebaseApp,
  getFirebaseConfig,
  setFirebaseConfig,
  STORAGE_KEYS
} from "./firebase/config.js";
import { ensureAuthenticated } from "./firebase/auth.js";
import {
  getRTDB,
  createSession,
  listenToSession,
  listenToLobbyGroups,
  listenToLeaderboard,
  startTournamentTogether,
  pauseTournament,
  resumeTournament,
  endTournament
} from "./firebase/database.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { sounds } from "./utils/sounds.js";
import { showToast } from "./utils/ui.js";

class AdminApp {
  constructor() {
    this.currentSessionId = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION_ID) || null;
    this.currentSession = null;
    this.sessionListenerUnsub = null;
    this.lobbyListenerUnsub = null;
    this.leaderboardListenerUnsub = null;
    this.connectedGroupsCount = 0;
    this.latestLeaderboardData = [];
  }

  async init() {
    console.log('[ThermoChampions] Initializing Game Master Admin Dashboard...');
    this.bindEvents();
    this.loadFirebaseConfigUI();

    await ensureAuthenticated();
    this.testDatabaseConnection();

    if (this.currentSessionId) {
      this.loadSession(this.currentSessionId);
    }
  }

  bindEvents() {
    // Config modal / save
    const btnSaveCfg = document.getElementById('btn-save-config');
    if (btnSaveCfg) {
      btnSaveCfg.addEventListener('click', () => this.handleSaveConfig());
    }

    // Create session modal triggers
    const btnOpenCreate = document.getElementById('btn-open-create-modal');
    if (btnOpenCreate) {
      btnOpenCreate.addEventListener('click', () => {
        sounds.click();
        const m = document.getElementById('modal-create-session');
        if (m) m.style.display = 'flex';
      });
    }

    const btnSubmitCreate = document.getElementById('btn-confirm-create') || document.getElementById('btn-submit-create-session');
    if (btnSubmitCreate) {
      btnSubmitCreate.addEventListener('click', () => this.handleCreateSession());
    }

    const btnCancelCreate = document.getElementById('btn-cancel-create');
    if (btnCancelCreate) {
      btnCancelCreate.addEventListener('click', () => {
        sounds.click();
        const m = document.getElementById('modal-create-session');
        if (m) m.style.display = 'none';
      });
    }

    // Big Sync Start button: MULAI BERSAMA
    const btnStartSync = document.getElementById('btn-start-together');
    if (btnStartSync) {
      btnStartSync.addEventListener('click', () => this.handleStartTogether());
    }

    // Copy session code & link
    const btnCopyCode = document.getElementById('btn-copy-code');
    if (btnCopyCode) {
      btnCopyCode.addEventListener('click', () => this.copySessionCode());
    }

    const btnCopyLink = document.getElementById('btn-copy-link');
    if (btnCopyLink) {
      btnCopyLink.addEventListener('click', () => this.copyStudentDirectLink());
    }

    // Session controls: Pause, Resume, End, Reset
    const btnPause = document.getElementById('btn-pause-session');
    if (btnPause) {
      btnPause.addEventListener('click', () => this.handlePauseSession());
    }
    const btnResume = document.getElementById('btn-resume-session');
    if (btnResume) {
      btnResume.addEventListener('click', () => this.handleResumeSession());
    }
    const btnEnd = document.getElementById('btn-complete-session') || document.getElementById('btn-end-session');
    if (btnEnd) {
      btnEnd.addEventListener('click', () => this.handleEndSession());
    }
    const btnReset = document.getElementById('btn-reset-session');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.handleResetSession());
    }

    // Refresh Leaderboard
    const btnRefreshLb = document.getElementById('btn-refresh-leaderboard');
    if (btnRefreshLb) {
      btnRefreshLb.addEventListener('click', () => {
        sounds.click();
        if (this.currentSessionId) this.listenLeaderboard(this.currentSessionId);
        showToast('Papan peringkat disegarkan', 'info');
      });
    }

    // Export CSV
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => this.exportLeaderboardCSV());
    }

    // Modal close triggers
    document.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        }
      });
    });
  }

  loadFirebaseConfigUI() {
    const cfg = getFirebaseConfig();
    const urlInput = document.getElementById('cfg-firebase-url') || document.getElementById('cfg-supabase-url');
    if (urlInput && cfg.databaseURL) {
      urlInput.value = cfg.databaseURL;
    }
  }

  async handleSaveConfig() {
    sounds.click();
    const urlInput = document.getElementById('cfg-firebase-url') || document.getElementById('cfg-supabase-url');
    const val = (urlInput?.value || '').trim();
    if (!val) {
      showToast('Masukkan URL Firebase Realtime Database!', 'error');
      return;
    }

    const cfg = getFirebaseConfig();
    cfg.databaseURL = val;
    setFirebaseConfig(cfg);
    showToast('Konfigurasi Firebase diperbarui. Menguji koneksi...', 'info');

    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  async testDatabaseConnection() {
    const connPill = document.getElementById('connection-pill');
    const connText = document.getElementById('connection-text');

    try {
      const db = getRTDB();
      if (!db) throw new Error('Database RTDB tidak terinisialisasi');

      const testRef = ref(db, '.info/connected');
      const snap = await get(testRef);

      if (connPill) {
        connPill.className = 'connection-status status-online';
      }
      if (connText) {
        connText.textContent = 'Firebase Realtime Terhubung';
      }
    } catch (e) {
      console.warn('Database test connection warning:', e);
      if (connPill) {
        connPill.className = 'connection-status status-offline';
      }
      if (connText) {
        connText.textContent = 'Database Memerlukan Konfigurasi';
      }
    }
  }

  // ==========================================================================
  // CREATE SESSION
  // ==========================================================================
  async handleCreateSession() {
    sounds.click();
    const titleInput = document.getElementById('new-session-title') || document.getElementById('input-new-session-title');
    const title = (titleInput?.value || '').trim() || 'Turnamen Suhu IPA Kelas VII';

    const btnSubmit = document.getElementById('btn-confirm-create') || document.getElementById('btn-submit-create-session');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Membuat Sesi...';
    }

    try {
      const res = await createSession(title);
      if (res && res.sessionId) {
        this.currentSessionId = res.sessionId;
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION_ID, res.sessionId);
        showToast(`Sesi berhasil dibuat! Kode: ${res.sessionCode}`, 'success');

        const m = document.getElementById('modal-create-session');
        if (m) m.style.display = 'none';

        this.loadSession(res.sessionId);
      }
    } catch (err) {
      console.error('Error creating session:', err);
      showToast('Gagal membuat sesi: ' + err.message, 'error');
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Buat Sesi & Hasilkan Kode';
      }
    }
  }

  // ==========================================================================
  // LOAD & LISTEN ACTIVE SESSION
  // ==========================================================================
  loadSession(sessionId) {
    if (this.sessionListenerUnsub) this.sessionListenerUnsub();
    this.sessionListenerUnsub = listenToSession(sessionId, (session) => {
      if (!session) {
        console.warn('Session not found:', sessionId);
        return;
      }
      this.currentSession = session;
      this.updateSessionBanner(session);
    });

    this.listenLobbySlots(sessionId);
    this.listenLeaderboard(sessionId);
  }

  updateSessionBanner(session) {
    const codeDisplay = document.getElementById('session-code-display');
    const titleDisplay = document.getElementById('session-title-display');
    const statusBadge = document.getElementById('session-status-badge');

    if (codeDisplay) codeDisplay.textContent = session.sessionCode || '------';
    if (titleDisplay) titleDisplay.textContent = `${session.title || 'Turnamen Suhu'} • Dibuat pada ${new Date(session.createdAt || Date.now()).toLocaleTimeString()}`;

    if (statusBadge) {
      statusBadge.textContent = (session.status || 'WAITING').toUpperCase();
      if (session.status === 'started') {
        statusBadge.style.color = '#15803d';
      } else if (session.status === 'paused') {
        statusBadge.style.color = '#d97706';
      } else if (session.status === 'ended') {
        statusBadge.style.color = '#dc2626';
      } else {
        statusBadge.style.color = 'var(--navy)';
      }
    }

    // Toggle control buttons
    const btnPause = document.getElementById('btn-pause-session');
    const btnResume = document.getElementById('btn-resume-session');
    const btnStartSync = document.getElementById('btn-start-together');

    if (btnPause && btnResume) {
      if (session.status === 'started') {
        btnPause.style.display = 'inline-flex';
        btnResume.style.display = 'none';
      } else if (session.status === 'paused') {
        btnPause.style.display = 'none';
        btnResume.style.display = 'inline-flex';
      }
    }

    if (btnStartSync && session.status === 'started') {
      btnStartSync.disabled = true;
      btnStartSync.innerHTML = '<span>🚀 PERMAINAN SEDANG BERLANGSUNG</span>';
    }
  }

  // ==========================================================================
  // 8 GROUPS LIVE LOBBY MONITOR
  // ==========================================================================
  listenLobbySlots(sessionId) {
    if (this.lobbyListenerUnsub) this.lobbyListenerUnsub();
    const container = document.getElementById('lobby-grid-container');
    const badgeCount = document.getElementById('connected-count-badge');
    const btnStartSync = document.getElementById('btn-start-together');
    const hintSync = document.getElementById('start-sync-hint');

    this.lobbyListenerUnsub = listenToLobbyGroups(sessionId, (groups) => {
      let count = 0;
      if (container) container.innerHTML = '';

      for (let i = 1; i <= 8; i++) {
        const slot = groups[`group${i}`];
        const isJoined = Boolean(slot);
        if (isJoined) count++;

        const card = document.createElement('div');
        card.className = `lobby-group-card ${isJoined ? 'connected' : 'empty'}`;

        let membersListHtml = '';
        if (slot && slot.members && slot.members.length > 0) {
          membersListHtml = slot.members.map(m => `<span class="badge-member">👤 ${m.name} (${m.absen || '-'})</span>`).join('');
        }

        card.innerHTML = `
          <div class="l-card-head">
            <span class="l-card-num">KELOMPOK ${i}</span>
            <span class="l-card-badge ${isJoined ? 'badge-online' : 'badge-offline'}">
              ${isJoined ? (slot.status === 'finished' ? '🏁 Selesai' : slot.status === 'in_game' ? '🎮 Bermain' : '✓ Terhubung') : 'Kosong'}
            </span>
          </div>
          <div class="l-card-name">${isJoined ? (slot.groupName || `Kelompok ${i}`) : 'Menunggu Siswa Masuk...'}</div>
          ${isJoined ? `
            <div class="l-card-score">Skor Saat Ini: <strong>${slot.scores?.total || 0} / 100 Pts</strong></div>
            <div class="l-card-members">${membersListHtml}</div>
          ` : `
            <div style="font-size:0.75rem; color:var(--slate-400); margin-top:0.5rem;">Siswa belum memilih kelompok ini.</div>
          `}
        `;
        if (container) container.appendChild(card);
      }

      this.connectedGroupsCount = count;
      if (badgeCount) {
        badgeCount.textContent = `${count} / 8 Kelompok Terhubung`;
      }

      // Check if "MULAI BERSAMA" button should be enabled
      if (btnStartSync && this.currentSession && this.currentSession.status === 'waiting') {
        if (count >= 1) {
          btnStartSync.disabled = false;
          btnStartSync.style.opacity = '1';
          btnStartSync.style.cursor = 'pointer';
          if (hintSync) hintSync.textContent = `${count} kelompok siap di ruang tunggu. Klik tombol di atas untuk memulai secara serentak!`;
        } else {
          btnStartSync.disabled = true;
          btnStartSync.style.opacity = '0.6';
          if (hintSync) hintSync.textContent = 'Tombol akan aktif setelah minimal 1 kelompok bergabung di ruang tunggu.';
        }
      }
    });
  }

  // ==========================================================================
  // REAL-TIME LEADERBOARD
  // ==========================================================================
  listenLeaderboard(sessionId) {
    if (this.leaderboardListenerUnsub) this.leaderboardListenerUnsub();
    const tbody = document.getElementById('admin-leaderboard-tbody');

    this.leaderboardListenerUnsub = listenToLeaderboard(sessionId, (list) => {
      this.latestLeaderboardData = list;
      if (!tbody) return;
      tbody.innerHTML = '';

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--slate-500);">Belum ada kelompok yang terhubung pada sesi ini.</td></tr>';
        return;
      }

      list.forEach((row, idx) => {
        const tr = document.createElement('tr');
        const rankMedal = idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`;
        tr.innerHTML = `
          <td style="font-weight:900; text-align:center; font-size:1.05rem;">${rankMedal}</td>
          <td>
            <div style="font-weight:800; color:var(--navy);">Kelompok ${row.groupNumber}</div>
            <div style="font-size:0.75rem; color:var(--slate-600);">${row.groupName || ''}</div>
          </td>
          <td style="text-align:center;"><span class="badge-status-pill">${row.status || 'ready'}</span></td>
          <td style="font-family:monospace; text-align:center;">${row.skorQuiz || 0} / 35</td>
          <td style="font-family:monospace; text-align:center;">${row.skorMemory || 0} / 30</td>
          <td style="font-family:monospace; text-align:center;">${row.skorNumberChains || 0} / 35</td>
          <td style="font-family:monospace; font-weight:900; font-size:1.15rem; color:var(--deepblue); text-align:center;">${row.totalSkor || 0}</td>
          <td><span class="badge-predicate">${row.predicate || 'ROOKIE'}</span></td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // ==========================================================================
  // ACTIONS: START TOGETHER, PAUSE, RESUME, END, RESET
  // ==========================================================================
  async handleStartTogether() {
    if (!this.currentSessionId) {
      showToast('Buat sesi permainan terlebih dahulu!', 'error');
      return;
    }
    if (this.connectedGroupsCount === 0) {
      showToast('Minimal 1 kelompok harus terhubung di ruang tunggu sebelum memulai!', 'error');
      return;
    }

    if (confirm(`Mulai turnamen sekarang untuk seluruh ${this.connectedGroupsCount} kelompok yang terhubung?`)) {
      sounds.victory();
      const ok = await startTournamentTogether(this.currentSessionId);
      if (ok) {
        showToast('Turnamen dimulai! Seluruh HP kelompok memulai hitung mundur.', 'success');
      }
    }
  }

  async handlePauseSession() {
    if (!this.currentSessionId) return;
    sounds.click();
    await pauseTournament(this.currentSessionId);
    showToast('Turnamen dijeda (Paused).', 'info');
  }

  async handleResumeSession() {
    if (!this.currentSessionId) return;
    sounds.click();
    await resumeTournament(this.currentSessionId);
    showToast('Turnamen dilanjutkan (Resumed).', 'success');
  }

  async handleEndSession() {
    if (!this.currentSessionId) return;
    if (confirm('Akhiri turnamen ini secara resmi?')) {
      sounds.click();
      await endTournament(this.currentSessionId);
      showToast('Turnamen telah diakhiri.', 'info');
    }
  }

  async handleResetSession() {
    if (confirm('Reset sesi dan buat sesi baru? Seluruh data kelompok saat ini akan ditutup.')) {
      sounds.click();
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION_ID);
      this.currentSessionId = null;
      window.location.reload();
    }
  }

  // ==========================================================================
  // COPY CODES & EXPORT CSV
  // ==========================================================================
  copySessionCode() {
    if (!this.currentSession) return;
    sounds.click();
    navigator.clipboard.writeText(this.currentSession.sessionCode).then(() => {
      showToast(`Kode sesi ${this.currentSession.sessionCode} disalin!`, 'success');
    });
  }

  copyStudentDirectLink() {
    if (!this.currentSession) return;
    sounds.click();
    const url = new URL('index.html', window.location.href);
    url.searchParams.set('code', this.currentSession.sessionCode);
    navigator.clipboard.writeText(url.toString()).then(() => {
      showToast('Link HP siswa disalin ke clipboard! Bagikan ke WhatsApp / Classroom.', 'success');
    });
  }

  exportLeaderboardCSV() {
    if (this.latestLeaderboardData.length === 0) {
      showToast('Belum ada data untuk diekspor ke CSV!', 'error');
      return;
    }
    sounds.click();

    let csv = 'Peringkat,Nomor Kelompok,Nama Kelompok,Status,Skor Mode 1 (Quiz),Skor Mode 2 (Memory),Skor Mode 3 (Calc),Total Skor,Predikat\n';
    this.latestLeaderboardData.forEach((r, idx) => {
      csv += `${idx + 1},Kelompok ${r.groupNumber},"${(r.groupName || '').replace(/"/g, '""')}",${r.status || ''},${r.skorQuiz || 0},${r.skorMemory || 0},${r.skorNumberChains || 0},${r.totalSkor || 0},"${r.predicate || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `THERMO_CHAMPIONS_${this.currentSession?.sessionCode || 'RESULT'}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('File CSV hasil turnamen berhasil diunduh!', 'success');
  }
}

// Instantiate and expose globally
const adminApp = new AdminApp();
window.adminApp = adminApp;

document.addEventListener('DOMContentLoaded', () => {
  adminApp.init();
});
