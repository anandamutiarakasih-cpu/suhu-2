/**
 * THERMO CHAMPIONS — GAME MASTER & ADMIN JAVASCRIPT ENGINE
 * Pure Vanilla JavaScript & Supabase Realtime
 */

class AdminManager {
  constructor() {
    this.currentSession = null;
    this.groupsData = [];
    this.realtimeChannel = null;

    this.init();
  }

  async init() {
    this.initUI();
    this.bindEvents();
    this.render8LobbyCards([]);
    await this.testConnection();

    // Load active session from storage or create/pick one
    const savedSessionId = localStorage.getItem(THERMO_CONFIG.STORAGE_KEYS.ADMIN_SESSION_ID);
    if (savedSessionId) {
      await this.loadSession(savedSessionId);
    }
  }

  initUI() {
    const { url } = getSupabaseConfig();
    const urlInput = document.getElementById('cfg-supabase-url');
    if (urlInput) urlInput.value = url || '';
  }

  bindEvents() {
    // Save Config & Test
    document.getElementById('btn-save-config').addEventListener('click', async () => {
      const urlInput = document.getElementById('cfg-supabase-url');
      setSupabaseConfig(urlInput.value.trim(), THERMO_CONFIG.DEFAULT_SUPABASE_KEY);
      resetSupabaseClient();
      await this.testConnection();
      if (this.currentSession) {
        await this.loadSession(this.currentSession.id);
      }
    });

    // Create session modal
    document.getElementById('btn-open-create-modal').addEventListener('click', () => {
      document.getElementById('modal-create-session').style.display = 'flex';
      document.getElementById('new-session-code').value = 'TC-' + Math.floor(1000 + Math.random() * 9000);
    });

    document.getElementById('btn-cancel-create').addEventListener('click', () => {
      document.getElementById('modal-create-session').style.display = 'none';
    });

    document.getElementById('btn-confirm-create').addEventListener('click', async () => {
      await this.createNewSession();
    });

    // Copy session code
    document.getElementById('btn-copy-code').addEventListener('click', () => {
      const code = document.getElementById('session-code-display').textContent;
      if (code && code !== '------') {
        navigator.clipboard.writeText(code);
        alert(`Kode Sesi "${code}" berhasil disalin ke clipboard! Bagikan kepada 8 kelompok siswa.`);
      }
    });

    // "MULAI BERSAMA" Action
    document.getElementById('btn-start-together').addEventListener('click', async () => {
      await this.startSessionTogether();
    });

    // Session controls
    document.getElementById('btn-pause-session').addEventListener('click', async () => {
      if (!this.currentSession) return;
      if (confirm('Jeda seluruh kelompok permainan sementara?')) {
        await ThermoDB.pauseSession(this.currentSession.id);
        this.addFeedItem('Admin menjeda permainan seluruh kelompok', 'join');
      }
    });

    document.getElementById('btn-resume-session').addEventListener('click', async () => {
      if (!this.currentSession) return;
      await ThermoDB.resumeSession(this.currentSession.id);
      this.addFeedItem('Admin melanjutkan permainan seluruh kelompok', 'join');
    });

    document.getElementById('btn-complete-session').addEventListener('click', async () => {
      if (!this.currentSession) return;
      if (confirm('Selesaikan turnamen sesi ini dan kunci hasil akhir?')) {
        await ThermoDB.completeSession(this.currentSession.id);
        this.addFeedItem('Turnamen resmi diselesaikan oleh Admin.', 'join');
      }
    });

    document.getElementById('btn-reset-session').addEventListener('click', async () => {
      if (!this.currentSession) return;
      if (confirm('Reset seluruh skor dan jawaban kelompok pada sesi ini? Data akan kembali ke nilai 0.')) {
        await ThermoDB.resetSession(this.currentSession.id);
        this.addFeedItem('Admin mereset sesi permainan.', 'join');
        await this.refreshData();
      }
    });

    // Refresh Leaderboard
    document.getElementById('btn-refresh-leaderboard').addEventListener('click', async () => {
      await this.refreshData();
    });
  }

  async testConnection() {
    const pill = document.getElementById('connection-pill');
    const text = document.getElementById('connection-text');
    const client = getSupabaseClient();

    if (!client) {
      pill.className = 'connection-status status-offline';
      text.textContent = 'Supabase Belum Dikonfigurasi';
      return false;
    }

    try {
      const { data, error } = await client.from('game_sessions').select('id').limit(1);
      if (error) throw error;
      pill.className = 'connection-status status-online';
      text.textContent = 'Database Terhubung (Online)';
      await ThermoDB.syncServerTime();
      return true;
    } catch (e) {
      console.warn('Connection test warning:', e);
      pill.className = 'connection-status status-offline';
      text.textContent = 'Koneksi Gagal (Periksa URL)';
      return false;
    }
  }

  async createNewSession() {
    const title = document.getElementById('new-session-title').value.trim() || 'Turnamen Suhu 8 Kelompok';
    const code = document.getElementById('new-session-code').value.trim().toUpperCase() || null;

    try {
      const session = await ThermoDB.createSession(title, code);
      document.getElementById('modal-create-session').style.display = 'none';
      this.currentSession = session;
      localStorage.setItem(THERMO_CONFIG.STORAGE_KEYS.ADMIN_SESSION_ID, session.id);
      this.addFeedItem(`Sesi baru dibuat: [${session.session_code}] ${session.title}`, 'join');
      await this.loadSession(session.id);
      alert(`Sesi ${session.session_code} berhasil dibuat! Bagikan kode ini ke 8 kelompok.`);
    } catch (err) {
      alert('Gagal membuat sesi: ' + (err.message || err));
    }
  }

  async loadSession(sessionId) {
    try {
      const session = await ThermoDB.getSessionById(sessionId);
      if (!session) {
        localStorage.removeItem(THERMO_CONFIG.STORAGE_KEYS.ADMIN_SESSION_ID);
        return;
      }
      this.currentSession = session;
      this.updateSessionBanner(session);
      await this.refreshData();
      this.setupRealtimeSubscription(session.id);
    } catch (e) {
      console.error('Error loading session:', e);
    }
  }

  updateSessionBanner(session) {
    document.getElementById('session-code-display').textContent = session.session_code;
    document.getElementById('session-title-display').textContent = session.title;
    
    const badge = document.getElementById('session-status-badge');
    const startBtn = document.getElementById('btn-start-together');
    const pauseBtn = document.getElementById('btn-pause-session');
    const resumeBtn = document.getElementById('btn-resume-session');
    const completeBtn = document.getElementById('btn-complete-session');
    const resetBtn = document.getElementById('btn-reset-session');

    pauseBtn.disabled = false;
    completeBtn.disabled = false;
    resetBtn.disabled = false;

    if (session.status === 'waiting') {
      badge.textContent = 'MENUNGGU DI LOBBY';
      badge.style.color = '#f59e0b';
      startBtn.style.display = 'flex';
      startBtn.disabled = this.groupsData.length === 0;
      pauseBtn.style.display = 'block';
      resumeBtn.style.display = 'none';
      document.getElementById('start-sync-hint').textContent = this.groupsData.length > 0 
        ? `${this.groupsData.length} kelompok siap di ruang tunggu. Klik tombol di atas untuk memulai serentak!`
        : 'Menunggu minimal 1 kelompok bergabung di ruang tunggu.';
    } else if (session.status === 'started') {
      badge.textContent = 'PERMAINAN BERLANGSUNG 🔴';
      badge.style.color = '#22c55e';
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
      resumeBtn.style.display = 'none';
      document.getElementById('start-sync-hint').textContent = 'Permainan sedang berlangsung. Timer tersinkronisasi di semua perangkat.';
    } else if (session.status === 'paused') {
      badge.textContent = 'DIJEDA (PAUSED) ⏸️';
      badge.style.color = '#eab308';
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'block';
      document.getElementById('start-sync-hint').textContent = 'Permainan sedang dijeda oleh Guru.';
    } else if (session.status === 'completed') {
      badge.textContent = 'SELESAI 🏁';
      badge.style.color = '#64748b';
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'none';
      document.getElementById('start-sync-hint').textContent = 'Turnamen telah selesai. Peringkat akhir telah terkunci.';
    }
  }

  async startSessionTogether() {
    if (!this.currentSession) return;
    if (this.groupsData.length === 0) {
      alert('Belum ada kelompok yang bergabung! Tunggu siswa bergabung terlebih dahulu.');
      return;
    }

    if (confirm(`Mulai permainan serentak untuk ${this.groupsData.length} kelompok yang telah terhubung?`)) {
      try {
        const updated = await ThermoDB.startSession(this.currentSession.id);
        this.currentSession = updated;
        this.updateSessionBanner(updated);
        this.addFeedItem('Admin menekan "Mulai Bersama"! Seluruh kelompok mulai bertanding sekarang!', 'join');
      } catch (e) {
        alert('Gagal memulai sesi bersama: ' + (e.message || e));
      }
    }
  }

  async refreshData() {
    if (!this.currentSession) return;
    const groups = await ThermoDB.getGroups(this.currentSession.id);
    this.groupsData = groups;
    this.render8LobbyCards(groups);
    this.renderLeaderboardTable(groups);
    this.updateSessionBanner(this.currentSession);
  }

  setupRealtimeSubscription(sessionId) {
    if (this.realtimeChannel) {
      ThermoDB.unsubscribe(this.realtimeChannel);
    }

    this.realtimeChannel = ThermoDB.subscribeToSession(
      sessionId,
      (sessionUpdate) => {
        if (sessionUpdate && sessionUpdate.id === this.currentSession.id) {
          this.currentSession = { ...this.currentSession, ...sessionUpdate };
          this.updateSessionBanner(this.currentSession);
        }
      },
      (groupUpdate, eventType) => {
        this.refreshData();
        if (eventType === 'INSERT') {
          this.addFeedItem(`Kelompok ${groupUpdate.group_number} (${groupUpdate.group_name}) bergabung ke sesi!`, 'join');
        } else if (eventType === 'UPDATE') {
          if (groupUpdate.status === 'finished') {
            this.addFeedItem(`🏆 Kelompok ${groupUpdate.group_number} (${groupUpdate.group_name}) telah menyelesaikan seluruh tantangan! Nilai: ${groupUpdate.final_score}`, 'correct');
          }
        }
      },
      (submission) => {
        const icon = submission.is_correct ? '✅' : '❌';
        const pts = submission.points_earned > 0 ? ` (+${submission.points_earned} Pts)` : '';
        this.addFeedItem(`${icon} Kelompok ${submission.group_number} menjawab ${submission.mode.toUpperCase()} [${submission.item_id}]${pts}`, submission.is_correct ? 'correct' : '');
      }
    );
  }

  render8LobbyCards(groups) {
    const container = document.getElementById('lobby-grid-container');
    if (!container) return;
    container.innerHTML = '';

    const groupMap = {};
    groups.forEach(g => { groupMap[g.group_number] = g; });

    let connectedCount = 0;

    for (let num = 1; num <= 8; num++) {
      const g = groupMap[num];
      const isConnected = Boolean(g);
      if (isConnected) connectedCount++;

      const card = document.createElement('div');
      card.className = `group-status-card ${isConnected ? (g.status === 'finished' ? 'finished' : (g.status === 'playing' ? 'playing' : 'connected')) : ''}`;

      let membersText = 'Belum terhubung';
      if (isConnected && Array.isArray(g.members)) {
        membersText = `${g.members.length} Anggota (${g.members.map(m => m.nama).slice(0, 2).join(', ')}${g.members.length > 2 ? '...' : ''})`;
      }

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div class="g-badge">${g?.badge || '🌡️'}</div>
          <span style="font-size:0.65rem; font-weight:800; padding:0.15rem 0.4rem; border-radius:0.25rem; ${isConnected ? 'background:#dcfce7; color:#15803d;' : 'background:#f1f5f9; color:#94a3b8;'}">
            ${isConnected ? (g.status === 'finished' ? 'SELESAI' : (g.status === 'playing' ? 'MAIN' : 'SIAP')) : 'KOSONG'}
          </span>
        </div>
        <div class="g-num" style="margin-top:0.4rem;">KELOMPOK ${num}</div>
        <div class="g-name" title="${g ? g.group_name : ''}">${g ? g.group_name : '<span style="color:#94a3b8; font-weight:normal;">Menunggu Device</span>'}</div>
        <div class="g-members">${membersText}</div>
        <div class="g-score">${isConnected ? (g.final_score || 0) : '0'} <span style="font-size:0.65rem; color:#94a3b8;">/ 100</span></div>
      `;
      container.appendChild(card);
    }

    document.getElementById('connected-count-badge').textContent = `${connectedCount} / 8 Kelompok Terhubung`;
  }

  renderLeaderboardTable(groups) {
    const tbody = document.getElementById('admin-leaderboard-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (groups.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center; padding:2rem; color:var(--slate-400);">
            Menunggu kelompok bergabung dan mulai bertanding...
          </td>
        </tr>
      `;
      return;
    }

    // Sort by: 1. Final score DESC, 2. Accuracy DESC, 3. Duration ASC
    const sorted = [...groups].sort((a, b) => {
      if (b.final_score !== a.final_score) return b.final_score - a.final_score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return (a.duration_seconds || 99999) - (b.duration_seconds || 99999);
    });

    sorted.forEach((grp, idx) => {
      const tr = document.createElement('tr');
      const mins = Math.floor((grp.duration_seconds || 0) / 60);
      const secs = (grp.duration_seconds || 0) % 60;
      const membersCount = Array.isArray(grp.members) ? grp.members.length : 0;

      tr.innerHTML = `
        <td style="font-weight:900; font-family:monospace;">
          ${idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
        </td>
        <td><strong>Kelompok ${grp.group_number}</strong></td>
        <td style="font-weight:700; color:var(--deepblue);">${grp.group_name}</td>
        <td><span style="font-size:0.75rem; color:var(--slate-500);">${membersCount} Orang</span></td>
        <td style="font-family:monospace; color:var(--navy); font-weight:700;">${grp.score_quiz || 0}</td>
        <td style="font-family:monospace; color:var(--navy); font-weight:700;">${grp.score_memory || 0}</td>
        <td style="font-family:monospace; color:var(--navy); font-weight:700;">${grp.score_calc || 0}</td>
        <td style="font-weight:900; font-family:monospace; font-size:1.1rem; color:var(--orange);">${grp.final_score || 0}</td>
        <td><span style="font-size:0.75rem; font-weight:800;">${grp.predicate || 'TEMPERATURE ROOKIE'}</span></td>
        <td>
          <span style="font-size:0.7rem; font-weight:800; padding:0.15rem 0.45rem; border-radius:0.25rem; ${grp.status === 'finished' ? 'background:#faf5ff; color:#7e22ce;' : (grp.status === 'playing' ? 'background:#eff6ff; color:#1d4ed8;' : 'background:#f0fdf4; color:#15803d;')}">
            ${grp.status === 'finished' ? 'Selesai' : (grp.status === 'playing' ? 'Sedang Main' : 'Di Lobby')}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  addFeedItem(text, type = '') {
    const container = document.getElementById('live-feed-container');
    if (!container) return;

    if (container.children.length === 1 && container.children[0].textContent.includes('Belum ada')) {
      container.innerHTML = '';
    }

    const item = document.createElement('div');
    item.className = `feed-item ${type}`;
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    item.innerHTML = `<span style="font-size:0.65rem; color:#64748b; font-family:monospace; display:block;">${time}</span>${text}`;
    container.insertBefore(item, container.firstChild);

    // Keep max 40 items
    while (container.children.length > 40) {
      container.removeChild(container.lastChild);
    }
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.admin = new AdminManager();
});
