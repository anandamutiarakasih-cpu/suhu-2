/**
 * THERMO CHAMPIONS — STUDENT CLIENT CONTROLLER (ES MODULES)
 * HTML5 + CSS3 + Vanilla JavaScript + Firebase Realtime Database
 */

import { getFirebaseApp, getDeviceToken, STORAGE_KEYS } from "./firebase/config.js";
import { ensureAuthenticated } from "./firebase/auth.js";
import {
  getSessionByCode,
  listenToSession,
  listenToLobbyGroups,
  listenToLeaderboard,
  releaseGroupSlot,
  finishGroupGame,
  getSyncedServerNow
} from "./firebase/database.js";
import { callJoinGroup } from "./firebase/functions.js";
import { gameState } from "./game/state.js";
import { sounds } from "./utils/sounds.js";
import { showToast, launchConfetti } from "./utils/ui.js";
import { getPredicate } from "../data/questions.js";
import { StarChampGame } from "./game/star-champ.js";
import { MemoryMadnessGame } from "./game/memory-madness.js";
import { NumberChainsGame } from "./game/number-chains.js";

class StudentApp {
  constructor() {
    this.selectedGroupNumber = 1;
    this.sessionListenerUnsub = null;
    this.lobbyListenerUnsub = null;
    this.activeModeInstance = null;
    this.lobbySlotsState = {};
  }

  async init() {
    console.log('[ThermoChampions] Initializing Student Client...');
    ensureAuthenticated();

    this.bindEvents();
    this.renderGroupSelectionGrid();
    this.renderMembersDynamicList();

    // Check URL parameters for direct join: ?code=TC-XXXX
    const urlParams = new URLSearchParams(window.location.search);
    const directCode = urlParams.get('code');
    if (directCode) {
      const codeInput = document.getElementById('input-session-code');
      if (codeInput) codeInput.value = directCode.toUpperCase();
      this.checkSessionCode(directCode.toUpperCase());
    }

    // Attempt to restore saved session
    const restored = await gameState.restore();
    if (restored && restored.session && restored.group) {
      console.log('[ThermoChampions] Restored active session:', restored.session.sessionCode, 'Group:', restored.group.groupNumber);
      this.handleSessionRestored(restored.session, restored.group);
    } else {
      this.showView('landing');
    }
  }

  bindEvents() {
    // Sound button toggle
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = sounds.toggleMute();
        const icon = document.getElementById('sound-icon');
        if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
        showToast(isMuted ? 'Suara dinonaktifkan' : 'Suara diaktifkan', 'info');
      });
    }

    // Hero buttons: Mulai Bermain
    document.querySelectorAll('.btn-trigger-start').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.click();
        this.showView('group-select');
      });
    });

    // Check session code button & input listeners
    const btnCheckCode = document.getElementById('btn-check-session-code');
    const inputCode = document.getElementById('input-session-code');

    if (btnCheckCode) {
      btnCheckCode.addEventListener('click', () => {
        sounds.click();
        const input = document.getElementById('input-session-code');
        if (input) this.checkSessionCode(input.value);
      });
    }

    if (inputCode) {
      inputCode.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sounds.click();
          this.checkSessionCode(inputCode.value);
        }
      });
      let checkDebounce = null;
      inputCode.addEventListener('input', () => {
        const val = (inputCode.value || '').trim();
        if (val.length >= 3) {
          clearTimeout(checkDebounce);
          checkDebounce = setTimeout(() => {
            this.checkSessionCode(val);
          }, 450);
        }
      });
    }

    // Dynamic members add button
    const btnAddMember = document.getElementById('btn-add-member-row');
    if (btnAddMember) {
      btnAddMember.addEventListener('click', () => {
        sounds.click();
        this.addMemberRow();
      });
    }

    // Confirm & Start Group button
    const btnConfirmGroup = document.getElementById('btn-confirm-start-group');
    if (btnConfirmGroup) {
      btnConfirmGroup.addEventListener('click', () => this.handleConfirmGroup());
    }

    // Leave lobby button
    const btnLeaveLobby = document.getElementById('btn-leave-lobby');
    if (btnLeaveLobby) {
      btnLeaveLobby.addEventListener('click', () => this.handleLeaveLobby());
    }

    // Change group button
    const btnChange = document.getElementById('btn-change-group-choice');
    if (btnChange) {
      btnChange.addEventListener('click', () => {
        sounds.click();
        this.showView('group-select');
      });
    }

    // Nav items
    const btnNavLeaderboard = document.getElementById('btn-nav-leaderboard');
    if (btnNavLeaderboard) {
      btnNavLeaderboard.addEventListener('click', () => {
        sounds.click();
        this.openLeaderboardModal();
      });
    }

    const btnNavMaterial = document.getElementById('btn-nav-material');
    if (btnNavMaterial) {
      btnNavMaterial.addEventListener('click', () => {
        sounds.click();
        this.showView('material');
      });
    }

    const btnNavHelp = document.getElementById('btn-nav-help');
    if (btnNavHelp) {
      btnNavHelp.addEventListener('click', () => {
        sounds.click();
        this.openModal('modal-help');
      });
    }

    const btnNavLogout = document.getElementById('btn-nav-logout');
    if (btnNavLogout) {
      btnNavLogout.addEventListener('click', () => {
        if (confirm('Keluar dari kelompok dan kembali ke menu utama?')) {
          sounds.click();
          gameState.clear();
          window.location.reload();
        }
      });
    }

    // Mode launch buttons in Dashboard Arena
    const btnStartMode1 = document.getElementById('btn-start-quiz') || document.getElementById('btn-start-mode-1');
    if (btnStartMode1) {
      btnStartMode1.addEventListener('click', () => this.startMode(1));
    }
    const btnStartMode2 = document.getElementById('btn-start-memory') || document.getElementById('btn-start-mode-2');
    if (btnStartMode2) {
      btnStartMode2.addEventListener('click', () => this.startMode(2));
    }
    const btnStartMode3 = document.getElementById('btn-start-calc') || document.getElementById('btn-start-mode-3');
    if (btnStartMode3) {
      btnStartMode3.addEventListener('click', () => this.startMode(3));
    }

    // Back to dashboard buttons
    document.querySelectorAll('.btn-back-dashboard').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.click();
        this.showView('dashboard');
        this.updateDashboardUI();
      });
    });

    // Close modal buttons
    document.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        }
      });
    });
  }

  showView(viewName) {
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.style.display = 'flex';
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.style.display = 'none';
  }

  // ==========================================================================
  // STEP 1: CHECK SESSION CODE
  // ==========================================================================
  async checkSessionCode(rawCode) {
    const code = (rawCode || '').trim().toUpperCase();
    const feedback = document.getElementById('session-code-feedback');
    const statusTag = document.getElementById('session-status-tag');

    if (!code) {
      if (feedback) feedback.textContent = 'Silakan masukkan kode sesi turnamen.';
      return null;
    }

    if (feedback) feedback.textContent = 'Memeriksa sesi turnamen...';

    const result = await getSessionByCode(code);
    if (!result || !result.session) {
      if (feedback) {
        feedback.innerHTML = '<span style="color:#ef4444; font-weight:700;">✗ Kode sesi tidak ditemukan. Pastikan kode benar dari Guru.</span>';
      }
      return null;
    }

    const session = result.session;
    gameState.setSession(session);

    if (feedback) {
      feedback.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ Terhubung ke: ${session.title} (${session.sessionCode})</span>`;
    }
    if (statusTag) {
      statusTag.textContent = session.status.toUpperCase();
      statusTag.style.background = '#dcfce7';
      statusTag.style.color = '#15803d';
    }

    // Subscribe to lobby slots for this session to mark taken groups
    this.listenToLobbySlots(session.code || session.sessionCode || session.id);
    return session;
  }

  // ==========================================================================
  // STEP 2: GROUP SELECTION (KELOMPOK 1 s/d 8)
  // ==========================================================================
  renderGroupSelectionGrid() {
    const container = document.getElementById('groups-grid-container');
    if (!container) return;

    container.innerHTML = '';
    const icons = ['🌡️', '⚡', '🔥', '❄️', '🎯', '🚀', '🌟', '🏆'];

    for (let i = 1; i <= 8; i++) {
      const card = document.createElement('button');
      card.type = 'button';
      card.id = `group-select-btn-${i}`;
      card.className = `group-btn-card ${i === this.selectedGroupNumber ? 'selected' : ''}`;
      card.innerHTML = `
        <span class="g-icon">${icons[i - 1]}</span>
        <span class="g-title">KELOMPOK ${i}</span>
        <span class="g-status-sub" id="g-slot-status-${i}">Tersedia</span>
      `;

      card.addEventListener('click', () => {
        sounds.click();
        this.selectGroupNumber(i);
      });

      container.appendChild(card);
    }

    this.updateSelectedGroupBanner();
  }

  selectGroupNumber(num) {
    this.selectedGroupNumber = num;
    document.querySelectorAll('.group-btn-card').forEach((card, idx) => {
      card.classList.toggle('selected', (idx + 1) === num);
    });
    this.updateSelectedGroupBanner();
  }

  updateSelectedGroupBanner() {
    const bannerText = document.getElementById('selected-group-banner-text');
    const sumGroup = document.getElementById('sum-nomor-kelompok');
    if (bannerText) bannerText.textContent = `Kelompok yang dipilih: Kelompok ${this.selectedGroupNumber}`;
    if (sumGroup) sumGroup.textContent = `Kelompok ${this.selectedGroupNumber}`;
  }

  listenToLobbySlots(sessionId) {
    if (this.lobbyListenerUnsub) this.lobbyListenerUnsub();
    this.lobbyListenerUnsub = listenToLobbyGroups(sessionId, (groups) => {
      this.lobbySlotsState = groups || {};
      for (let i = 1; i <= 8; i++) {
        const slot = this.lobbySlotsState[`group${i}`];
        const statusEl = document.getElementById(`g-slot-status-${i}`);
        const cardBtn = document.getElementById(`group-select-btn-${i}`);

        if (slot) {
          const isMyDevice = slot.deviceToken === gameState.deviceToken;
          if (statusEl) {
            statusEl.textContent = isMyDevice ? 'Perangkat Anda' : (slot.groupName || 'Terisi');
            statusEl.style.color = isMyDevice ? '#2563eb' : '#dc2626';
          }
          if (cardBtn && !isMyDevice) {
            cardBtn.classList.add('occupied');
          } else if (cardBtn) {
            cardBtn.classList.remove('occupied');
          }
        } else {
          if (statusEl) {
            statusEl.textContent = 'Tersedia';
            statusEl.style.color = '#059669';
          }
          if (cardBtn) cardBtn.classList.remove('occupied');
        }
      }
    });
  }

  // Dynamic members list
  renderMembersDynamicList() {
    const container = document.getElementById('members-dynamic-list');
    if (!container) return;
    container.innerHTML = '';
    // Start with 2 member rows by default
    this.addMemberRow();
    this.addMemberRow();
  }

  addMemberRow() {
    const container = document.getElementById('members-dynamic-list');
    if (!container) return;

    const rowIdx = container.children.length + 1;
    const row = document.createElement('div');
    row.className = 'member-input-row';
    row.innerHTML = `
      <span class="m-num">${rowIdx}.</span>
      <input type="text" class="form-input member-name" placeholder="Nama Lengkap Siswa" maxlength="30" />
      <input type="number" class="form-input member-absen" placeholder="No. Absen" min="1" max="45" style="max-width:110px;" />
      <button type="button" class="btn-del-member" title="Hapus Anggota">✕</button>
    `;

    const delBtn = row.querySelector('.btn-del-member');
    delBtn.addEventListener('click', () => {
      sounds.click();
      if (container.children.length > 1) {
        row.remove();
        this.updateMemberRowIndices();
        this.updateMembersSummary();
      } else {
        showToast('Minimal harus ada 1 anggota dalam kelompok.', 'error');
      }
    });

    const inputs = row.querySelectorAll('input');
    inputs.forEach(inp => {
      inp.addEventListener('input', () => this.updateMembersSummary());
    });

    container.appendChild(row);
    this.updateMembersSummary();
  }

  updateMemberRowIndices() {
    const container = document.getElementById('members-dynamic-list');
    if (!container) return;
    Array.from(container.children).forEach((row, idx) => {
      const numSpan = row.querySelector('.m-num');
      if (numSpan) numSpan.textContent = `${idx + 1}.`;
    });
  }

  updateMembersSummary() {
    const members = this.getEnteredMembers();
    const sumName = document.getElementById('sum-nama-kelompok');
    const sumTotal = document.getElementById('sum-total-anggota');
    const sumPreview = document.getElementById('sum-members-preview');
    const inputTeamName = document.getElementById('input-nama-kelompok');

    if (sumName && inputTeamName) {
      sumName.textContent = inputTeamName.value.trim() || '[Belum diisi]';
    }
    if (sumTotal) {
      sumTotal.textContent = `${members.length} Orang Terdaftar`;
    }
    if (sumPreview) {
      if (members.length === 0) {
        sumPreview.innerHTML = '<li class="text-slate-400 italic">Belum ada anggota diisi</li>';
      } else {
        sumPreview.innerHTML = members.map(m => `<li><strong>${m.name}</strong> (Absen: ${m.absen || '-'})</li>`).join('');
      }
    }
  }

  getEnteredMembers() {
    const list = [];
    const rows = document.querySelectorAll('#members-dynamic-list .member-input-row');
    rows.forEach(r => {
      const name = (r.querySelector('.member-name')?.value || '').trim();
      const absen = (r.querySelector('.member-absen')?.value || '').trim();
      if (name) {
        list.push({ name, absen });
      }
    });
    return list;
  }

  // ==========================================================================
  // STEP 3: CONFIRM & JOIN LOBBY
  // ==========================================================================
  async handleConfirmGroup() {
    sounds.click();

    let sess = gameState.session;
    if (!sess) {
      const codeInput = document.getElementById('input-session-code');
      const code = (codeInput?.value || '').trim();
      if (!code) {
        showToast('Masukkan kode sesi turnamen dari Guru terlebih dahulu!', 'error');
        codeInput?.focus();
        return;
      }
      sess = await this.checkSessionCode(code);
      if (!sess) return;
    }

    const teamNameInput = document.getElementById('input-nama-kelompok');
    const teamName = (teamNameInput?.value || '').trim();
    if (!teamName) {
      showToast('Ketik Nama Kelompok kalian terlebih dahulu!', 'error');
      teamNameInput?.focus();
      return;
    }

    const members = this.getEnteredMembers();
    if (members.length === 0) {
      showToast('Masukkan minimal 1 nama anggota kelompok!', 'error');
      return;
    }

    const btnConfirm = document.getElementById('btn-confirm-start-group');
    if (btnConfirm) {
      btnConfirm.disabled = true;
      btnConfirm.innerHTML = '<span>Mendaftarkan Kelompok...</span>';
    }

    try {
      const sId = sess.code || sess.sessionCode || sess.id;
      const res = await callJoinGroup(
        sId,
        this.selectedGroupNumber,
        teamName,
        members,
        gameState.deviceToken
      );

      if (!res || !res.success) {
        showToast(res?.message || 'Nomor kelompok sudah terisi oleh perangkat lain. Pilih nomor lain!', 'error');
        if (btnConfirm) {
          btnConfirm.disabled = false;
          btnConfirm.innerHTML = '<span>KONFIRMASI DAN MULAI</span><span>→</span>';
        }
        return;
      }

      // Claim successful
      gameState.setGroup(res.group);
      showToast(`Berhasil bergabung sebagai Kelompok ${this.selectedGroupNumber}!`, 'success');

      // Enter waiting lobby
      this.enterLobby(sess, res.group);
    } catch (err) {
      console.error('Error joining group:', err);
      showToast('Terjadi kesalahan koneksi database. Silakan coba lagi.', 'error');
      if (btnConfirm) {
        btnConfirm.disabled = false;
        btnConfirm.innerHTML = '<span>KONFIRMASI DAN MULAI</span><span>→</span>';
      }
    }
  }

  // ==========================================================================
  // STEP 4: WAITING ROOM (LOBBY MULTIPLAYER)
  // ==========================================================================
  enterLobby(session, group) {
    this.showView('lobby');

    // Update lobby UI
    const codeEl = document.getElementById('lobby-session-code');
    const teamEl = document.getElementById('lobby-team-name');
    const membersListEl = document.getElementById('lobby-members-list');

    if (codeEl) codeEl.textContent = session.sessionCode;
    if (teamEl) teamEl.textContent = `Kelompok ${group.groupNumber} (${group.groupName})`;

    if (membersListEl && group.members) {
      membersListEl.innerHTML = group.members.map(m => `
        <span class="member-pill">👤 ${m.name} (${m.absen || '-'})</span>
      `).join('');
    }

    // Update Navbar group pill
    this.updateNavPill(group);

    const sId = session.code || session.sessionCode || session.id;

    // Listen to session status changes: triggers "MULAI BERSAMA"
    if (this.sessionListenerUnsub) this.sessionListenerUnsub();
    this.sessionListenerUnsub = listenToSession(sId, (updatedSession) => {
      if (!updatedSession) return;
      gameState.setSession(updatedSession);

      if (updatedSession.status === 'started') {
        this.launchSynchronizedStartCountdown();
      }
    });

    // Listen to 8 lobby slots
    this.listenToLobbyDisplay(sId);
  }

  listenToLobbyDisplay(sessionId) {
    const container = document.getElementById('lobby-slots-display');
    if (!container) return;

    listenToLobbyGroups(sessionId, (groups) => {
      container.innerHTML = '';
      for (let i = 1; i <= 8; i++) {
        const slot = groups[`group${i}`];
        const isReady = Boolean(slot);
        const isMe = slot && slot.deviceToken === gameState.deviceToken;

        const slotCard = document.createElement('div');
        slotCard.className = `lobby-slot-card ${isReady ? 'ready' : 'empty'} ${isMe ? 'mine' : ''}`;
        slotCard.innerHTML = `
          <div class="l-slot-num">KELOMPOK ${i}</div>
          <div class="l-slot-status">${isReady ? '✓ ' + (slot.groupName || 'Siap') : 'Menunggu...'}</div>
          ${isMe ? '<div class="l-slot-badge">Perangkat Ini</div>' : ''}
        `;
        container.appendChild(slotCard);
      }
    });
  }

  async handleLeaveLobby() {
    if (confirm('Batalkan dan keluar dari ruang tunggu?')) {
      sounds.click();
      const sess = gameState.session;
      const grp = gameState.group;
      if (sess && grp) {
        const sId = sess.code || sess.sessionCode || sess.id;
        await releaseGroupSlot(sId, grp.groupNumber, gameState.deviceToken);
      }
      gameState.clear();
      this.showView('group-select');
    }
  }

  // ==========================================================================
  // STEP 5: SYNCHRONIZED START COUNTDOWN (3 - 2 - 1 - MULAI!)
  // ==========================================================================
  launchSynchronizedStartCountdown() {
    // Show countdown overlay
    let overlay = document.getElementById('sync-countdown-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sync-countdown-overlay';
      overlay.className = 'sync-start-overlay';
      overlay.innerHTML = `
        <div class="sync-start-box">
          <div class="sync-start-title">MULAI BERSAMA SELURUH KELOMPOK!</div>
          <div id="sync-countdown-num" class="sync-countdown-giant">3</div>
          <div class="sync-start-sub">Bersiaplah bersama rekan kelompok kalian!</div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    overlay.style.display = 'flex';
    const numEl = document.getElementById('sync-countdown-num');

    let count = 3;
    sounds.tick();

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        if (numEl) numEl.textContent = count;
        sounds.tick();
      } else if (count === 0) {
        if (numEl) numEl.textContent = 'MULAI!';
        sounds.victory();
      } else {
        clearInterval(interval);
        overlay.style.display = 'none';
        this.enterDashboard();
      }
    }, 1000);
  }

  // ==========================================================================
  // STEP 6: DASHBOARD ARENA
  // ==========================================================================
  enterDashboard() {
    this.showView('dashboard');
    this.updateDashboardUI();
  }

  updateDashboardUI() {
    const grp = gameState.group;
    if (!grp) return;

    const scores = grp.scores || { quiz: 0, memory: 0, calc: 0, total: 0 };
    const modes = grp.completedModes || {};
    const pred = getPredicate(scores.total);

    const teamNomorEl = document.getElementById('dash-team-nomor');
    const teamTitleEl = document.getElementById('dash-team-title');
    const teamThemeEl = document.getElementById('dash-team-theme');
    const membersChipsEl = document.getElementById('dash-members-chips');
    const totalScoreEl = document.getElementById('dash-total-score');
    const predicateBadgeEl = document.getElementById('dash-predicate-badge');

    if (teamNomorEl) teamNomorEl.textContent = `Kelompok ${grp.groupNumber}`;
    if (teamTitleEl) teamTitleEl.textContent = grp.groupName || `Kelompok ${grp.groupNumber}`;
    if (teamThemeEl) teamThemeEl.textContent = 'Materi Suhu & Pemuaian IPA Kelas VII SMP';

    if (membersChipsEl && grp.members) {
      membersChipsEl.innerHTML = grp.members.map(m => `
        <span class="member-chip">👤 ${m.name} (${m.absen || '-'})</span>
      `).join('');
    }

    if (totalScoreEl) {
      totalScoreEl.innerHTML = `${scores.total || 0} <span>/ 100</span>`;
    }

    if (predicateBadgeEl) {
      predicateBadgeEl.textContent = pred.title;
      predicateBadgeEl.className = `predicate-pill ${pred.bgClass || ''}`;
    }

    // Mode 1: StarChamp Quiz
    const statusM1 = document.getElementById('status-mode-quiz') || document.getElementById('dash-status-mode1');
    const btnM1Label = document.getElementById('btn-mode-quiz-label');
    if (statusM1) {
      statusM1.textContent = modes.quiz ? `✓ Selesai (${scores.quiz || 0} Pts)` : 'Belum Dimainkan';
      statusM1.style.color = modes.quiz ? '#15803d' : 'var(--slate-500)';
    }
    if (btnM1Label) {
      btnM1Label.textContent = modes.quiz ? 'Tinjau Mode 1' : 'Mulai Bersama (Mode 1)';
    }

    // Mode 2: Memory Madness
    const statusM2 = document.getElementById('status-mode-memory') || document.getElementById('dash-status-mode2');
    const btnM2Label = document.getElementById('btn-mode-memory-label');
    if (statusM2) {
      statusM2.textContent = modes.memory ? `✓ Selesai (${scores.memory || 0} Pts)` : 'Belum Dimainkan';
      statusM2.style.color = modes.memory ? '#15803d' : 'var(--slate-500)';
    }
    if (btnM2Label) {
      btnM2Label.textContent = modes.memory ? 'Tinjau Mode 2' : 'Mulai Bersama (Mode 2)';
    }

    // Mode 3: Number Chains
    const statusM3 = document.getElementById('status-mode-calc') || document.getElementById('dash-status-mode3');
    const btnM3Label = document.getElementById('btn-mode-calc-label');
    if (statusM3) {
      statusM3.textContent = modes.calc ? `✓ Selesai (${scores.calc || 0} Pts)` : 'Belum Dimainkan';
      statusM3.style.color = modes.calc ? '#15803d' : 'var(--slate-500)';
    }
    if (btnM3Label) {
      btnM3Label.textContent = modes.calc ? 'Tinjau Mode 3' : 'Mulai Bersama (Mode 3)';
    }

    this.updateNavPill(grp);

    // If all 3 modes completed, display completion banner and allow viewing results
    const allDoneBanner = document.getElementById('dash-all-completed-banner');
    const allDoneScore = document.getElementById('dash-all-done-score');
    if (modes.quiz && modes.memory && modes.calc) {
      if (allDoneBanner) allDoneBanner.style.display = 'flex';
      if (allDoneScore) allDoneScore.textContent = `${scores.total || 0} / 100 Poin (${pred.title})`;
    } else {
      if (allDoneBanner) allDoneBanner.style.display = 'none';
    }
  }

  updateNavPill(group) {
    const navPill = document.getElementById('nav-group-pill');
    const navName = document.getElementById('nav-chip-name');
    const navScore = document.getElementById('nav-chip-score');
    const navNomor = document.getElementById('nav-chip-nomor');
    const guestBtn = document.getElementById('nav-guest-btn');

    if (group && navPill) {
      navPill.style.display = 'flex';
      if (guestBtn) guestBtn.style.display = 'none';
      if (navName) navName.textContent = group.groupName || `Kelompok ${group.groupNumber}`;
      if (navScore) navScore.textContent = `${group.scores?.total || 0} / 100 Pts`;
      if (navNomor) navNomor.textContent = `K-${group.groupNumber}`;
    }
  }

  startMode(modeNumber) {
    sounds.click();
    if (modeNumber === 1) {
      this.showView('quiz');
      this.activeModeInstance = new StarChampGame({
        onComplete: () => {
          this.showView('dashboard');
          this.updateDashboardUI();
        },
        onUpdateScore: (scores) => {
          this.updateDashboardUI();
        }
      });
      this.activeModeInstance.init();
    } else if (modeNumber === 2) {
      this.showView('memory');
      this.activeModeInstance = new MemoryMadnessGame({
        onComplete: () => {
          this.showView('dashboard');
          this.updateDashboardUI();
        },
        onUpdateScore: (scores) => {
          this.updateDashboardUI();
        }
      });
      this.activeModeInstance.init();
    } else if (modeNumber === 3) {
      this.showView('calc');
      this.activeModeInstance = new NumberChainsGame({
        onComplete: () => {
          this.showView('dashboard');
          this.updateDashboardUI();
        },
        onUpdateScore: (scores) => {
          this.updateDashboardUI();
        }
      });
      this.activeModeInstance.init();
    }
  }

  showResultsView() {
    this.showView('results');
    this.renderResults();
  }

  async finishAllModes() {
    const sess = gameState.session;
    const grp = gameState.group;
    if (sess && grp) {
      const sId = sess.code || sess.sessionCode || sess.id;
      await finishGroupGame(sId, grp.groupNumber);
    }

    launchConfetti();
    sounds.victory();
    this.showView('results');
    this.renderResults();
  }

  renderResults() {
    const grp = gameState.group;
    if (!grp) return;

    const scores = grp.scores || { quiz: 0, memory: 0, calc: 0, total: 0 };
    const pred = getPredicate(scores.total);

    const teamNomorEl = document.getElementById('res-team-nomor');
    const teamNamaEl = document.getElementById('res-team-nama');
    const finalScoreEl = document.getElementById('res-final-score');
    const predicateBadgeEl = document.getElementById('res-predicate-badge');
    const msgEl = document.getElementById('res-appreciation-msg');

    if (teamNomorEl) teamNomorEl.textContent = `Kelompok ${grp.groupNumber}`;
    if (teamNamaEl) teamNamaEl.textContent = grp.groupName || `Kelompok ${grp.groupNumber}`;
    if (finalScoreEl) finalScoreEl.textContent = `${scores.total || 0}`;

    if (predicateBadgeEl) {
      predicateBadgeEl.textContent = `${pred.badge} ${pred.title}`;
      predicateBadgeEl.className = `predicate-pill ${pred.bgClass || ''}`;
    }

    if (msgEl) msgEl.textContent = pred.msg;

    const sStar = document.getElementById('res-score-star');
    const sMem = document.getElementById('res-score-mem');
    const sCalc = document.getElementById('res-score-calc');

    if (sStar) sStar.textContent = `${scores.quiz || 0} / 35`;
    if (sMem) sMem.textContent = `${scores.memory || 0} / 30`;
    if (sCalc) sCalc.textContent = `${scores.calc || 0} / 35`;

    const membersListEl = document.getElementById('res-members-list');
    if (membersListEl && grp.members) {
      membersListEl.innerHTML = grp.members.map(m => `
        <div style="background:var(--slate-50); border:1px solid var(--slate-200); padding:0.5rem 0.75rem; border-radius:0.5rem; font-size:0.8rem;">
          <strong>${m.name}</strong> <span style="color:var(--slate-500);">(Absen ${m.absen || '-'})</span>
        </div>
      `).join('');
    }

    // Results buttons
    const btnResCert = document.getElementById('btn-res-certificate');
    if (btnResCert) {
      btnResCert.onclick = () => {
        sounds.click();
        this.openCertificateModal();
      };
    }

    const btnResLb = document.getElementById('btn-res-leaderboard');
    if (btnResLb) {
      btnResLb.onclick = () => {
        sounds.click();
        this.openLeaderboardModal();
      };
    }

    const btnResDash = document.getElementById('btn-res-dashboard');
    if (btnResDash) {
      btnResDash.onclick = () => {
        sounds.click();
        this.showView('dashboard');
        this.updateDashboardUI();
      };
    }

    const btnResNew = document.getElementById('btn-res-new-game');
    if (btnResNew) {
      btnResNew.onclick = () => {
        if (confirm('Mulai sesi kelompok baru? Data sesi ini akan direset dari perangkat ini.')) {
          sounds.click();
          gameState.clear();
          window.location.reload();
        }
      };
    }
  }

  openCertificateModal() {
    const m = document.getElementById('modal-certificate');
    if (!m) return;
    const grp = gameState.group;
    if (!grp) return;

    const scores = grp.scores || { quiz: 0, memory: 0, calc: 0, total: 0 };
    const pred = getPredicate(scores.total);

    const certTeam = document.getElementById('cert-team-name');
    const certScore = document.getElementById('cert-score-display');
    const certPred = document.getElementById('cert-predicate-text');
    const certMembers = document.getElementById('cert-members-list');
    const certDate = document.getElementById('cert-date-text');

    if (certTeam) certTeam.textContent = `Kelompok ${grp.groupNumber}: ${grp.groupName}`;
    if (certScore) certScore.textContent = `${scores.total || 0} / 100 Poin`;
    if (certPred) certPred.textContent = `${pred.badge} ${pred.title}`;
    if (certDate) certDate.textContent = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    if (certMembers && grp.members) {
      certMembers.textContent = grp.members.map(m => `${m.name} (${m.absen || '-'})`).join(', ');
    }

    m.style.display = 'flex';
  }

  openLeaderboardModal() {
    this.openModal('modal-leaderboard');
    const sess = gameState.session;
    if (!sess) return;

    const sId = sess.code || sess.sessionCode || sess.id;
    const tbody = document.getElementById('leaderboard-tbody');
    listenToLeaderboard(sId, (rankList) => {
      if (!tbody) return;
      tbody.innerHTML = '';
      rankList.forEach((row, idx) => {
        const isMyGroup = row.groupNumber === gameState.group?.groupNumber;
        const tr = document.createElement('tr');
        if (isMyGroup) tr.style.background = '#eff6ff';
        tr.innerHTML = `
          <td style="font-weight:900; text-align:center;">${idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : (idx + 1)}</td>
          <td>
            <strong>Kelompok ${row.groupNumber}</strong>
            <div style="font-size:0.75rem; color:var(--slate-500);">${row.groupName || ''}</div>
          </td>
          <td style="font-family:monospace; font-weight:800; color:var(--deepblue); font-size:1.05rem;">${row.totalSkor || 0}</td>
          <td><span class="badge-predicate">${row.predicate || 'ROOKIE'}</span></td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  handleSessionRestored(session, group) {
    if (session.status === 'started') {
      this.enterDashboard();
    } else {
      this.enterLobby(session, group);
    }
  }
}

// Instantiate and expose globally
const app = new StudentApp();
window.app = app;

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
