/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Home View - Role & Session Gateway
 */

import { audio } from '../services/audio-service.js';
import { toast } from '../components/notification.js';
import { firebaseService } from '../services/firebase-service.js';

export function renderHomeView(container, { onJoinTeam, onOpenAdmin, onResumeSession }) {
  const isMuted = audio.isMuted();

  // Check if there is a recent saved session (within 2 hours)
  const storedSession = firebaseService.getStoredTeamSession();
  const isStoredFresh = storedSession && storedSession.savedAt && (Date.now() - storedSession.savedAt < 1000 * 60 * 60 * 2);
  const activePrevSession = (storedSession && isStoredFresh) ? storedSession : null;

  container.innerHTML = `
    <div class="tc-view tc-home-view">
      <!-- Audio Toggle Button -->
      <button class="tc-audio-btn ${isMuted ? 'muted' : ''}" id="btn-audio-toggle" title="Toggle Suara">
        <span class="tc-audio-icon">${isMuted ? '🔇' : '🔊'}</span>
      </button>

      <!-- Thermal Lab Branding -->
      <header class="tc-home-header">
        <div class="tc-badge-lab">
          <span class="tc-pulse-dot"></span>
          LABORATORIUM FISIKA TERMAL SMP
        </div>
        <h1 class="tc-main-title">
          THERMO <span class="tc-text-gradient">CHAMPIONS</span>
        </h1>
        <div class="tc-sub-title">SUHU EDITION • CLASH OF ACADEMICS</div>
        <p class="tc-home-desc">
          Kompetisi sains materi Suhu untuk 8 kelompok siswa SMP secara realtime. 
          Uji daya ingat, kecepatan susun istilah, dan kalkulasi konversi termometer laboratorium!
        </p>
      </header>

      ${activePrevSession ? `
        <!-- Optional Resume Banner for Students Who Refreshed Mid-Game -->
        <div class="tc-resume-banner" id="prev-session-banner" style="background: rgba(56, 189, 248, 0.12); border: 1.5px solid rgba(56, 189, 248, 0.35); border-radius: var(--radius-md); padding: 0.9rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div style="font-size: 0.9rem;">
            <span style="color: var(--tc-sky); font-weight: 700;">⚡ TERAKHIR TERGABUNG:</span>
            <span style="color: #f8fafc;"> Sesi <strong>${activePrevSession.sessionCode}</strong> (Kelompok ${activePrevSession.teamNumber}${activePrevSession.teamName ? ' - ' + activePrevSession.teamName : ''})</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="btn-resume-prev-session" type="button" class="tc-btn tc-btn-sm tc-btn-primary">
              Lanjutkan Sesi Ini →
            </button>
            <button id="btn-clear-prev-session" type="button" class="tc-btn tc-btn-sm tc-btn-ghost danger" title="Hapus sesi ini dan masukkan kode baru">
              ✕ Ganti Kode
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Role Selection Cards -->
      <div class="tc-role-grid">
        <!-- Student Team Card -->
        <div class="tc-card tc-role-card tc-role-student">
          <div class="tc-role-badge">PESERTA DIDIK</div>
          <div class="tc-role-icon">⚡</div>
          <h2 class="tc-role-name">Kelompok Siswa</h2>
          <p class="tc-role-info">
            Masuk bersama kelompokmu (1–8), registrasi anggota, dan bersiap mengikuti 3 babak kompetisi suhu.
          </p>

          <form id="form-quick-join" class="tc-join-form">
            <div class="tc-input-group">
              <label for="input-session-code">KODE SESI GURU</label>
              <input 
                type="text" 
                id="input-session-code" 
                class="tc-input" 
                placeholder="Contoh: TC4829" 
                maxlength="8" 
                required 
                autocomplete="off"
                autocapitalize="characters"
                autocorrect="off"
                spellcheck="false"
                enterkeyhint="go"
              />
            </div>
            <button type="submit" class="tc-btn tc-btn-primary tc-btn-block">
              <span>MASUK PERMAINAN</span>
              <span class="tc-btn-arrow">→</span>
            </button>
          </form>
        </div>

        <!-- Teacher / Admin Card -->
        <div class="tc-card tc-role-card tc-role-admin">
          <div class="tc-role-badge admin">GURU / INSTRUKTUR</div>
          <div class="tc-role-icon">🔬</div>
          <h2 class="tc-role-name">Pusat Kendali Guru</h2>
          <p class="tc-role-info">
            Buat sesi baru, pantau 8 kelompok secara live, kendalikan timer & babak permainan, serta unduh rekap skor CSV.
          </p>
          <div class="tc-admin-action-wrap">
            <button id="btn-goto-admin" class="tc-btn tc-btn-outline tc-btn-block">
              <span>LOGIN ADMIN</span>
              <span class="tc-btn-arrow">⚙️</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 3 Challenge Showcase Overview -->
      <div class="tc-preview-bar">
        <div class="tc-preview-item">
          <span class="tc-item-num">01</span>
          <div class="tc-item-content">
            <strong>Shuffle and Recall</strong>
            <span>Hafal & Cocokkan Konsep Suhu (Maks 30 Pts)</span>
          </div>
        </div>
        <div class="tc-preview-item">
          <span class="tc-item-num">02</span>
          <div class="tc-item-content">
            <strong>Word Scramble</strong>
            <span>Susun Huruf Istilah Suhu Cepat (Maks 35 Pts)</span>
          </div>
        </div>
        <div class="tc-preview-item">
          <span class="tc-item-num">03</span>
          <div class="tc-item-content">
            <strong>Extreme Addition</strong>
            <span>Kalkulasi Konversi Suhu & Pemuaian (Maks 35 Pts)</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Audio button toggle listener
  const audioBtn = container.querySelector('#btn-audio-toggle');
  audioBtn.addEventListener('click', () => {
    const muted = audio.toggleMute();
    audioBtn.classList.toggle('muted', muted);
    audioBtn.querySelector('.tc-audio-icon').textContent = muted ? '🔇' : '🔊';
    toast.info(muted ? 'Suara dinonaktifkan' : 'Suara diaktifkan');
  });

  // Resume or Forget Previous Saved Session Handlers
  if (activePrevSession) {
    const btnResume = container.querySelector('#btn-resume-prev-session');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        audio.playClick();
        if (onResumeSession) {
          onResumeSession(activePrevSession.sessionCode, activePrevSession.teamNumber);
        }
      });
    }

    const btnClearPrev = container.querySelector('#btn-clear-prev-session');
    if (btnClearPrev) {
      btnClearPrev.addEventListener('click', () => {
        audio.playClick();
        firebaseService.clearStoredTeamSession();
        const banner = container.querySelector('#prev-session-banner');
        if (banner) banner.remove();
        toast.info('Sesi lama dihapus. Masukkan kode sesi baru dari Guru.');
      });
    }
  }

  // Quick Join Form
  const formJoin = container.querySelector('#form-quick-join');
  formJoin.addEventListener('submit', (e) => {
    e.preventDefault();
    audio.playClick();
    let code = container.querySelector('#input-session-code').value.trim().toUpperCase().replace(/[-\s]/g, '');
    if (!code) {
      toast.error('Masukkan kode sesi terlebih dahulu.');
      return;
    }
    // Auto-normalize 4-digit code if user omitted TC prefix
    if (!code.startsWith('TC') && code.length === 4) {
      code = 'TC' + code;
    }

    // Entering a new session code always replaces old session
    if (activePrevSession && activePrevSession.sessionCode !== code) {
      firebaseService.clearStoredTeamSession();
    }

    if (onJoinTeam) onJoinTeam(code);
  });

  // Admin Portal Button
  const btnAdmin = container.querySelector('#btn-goto-admin');
  btnAdmin.addEventListener('click', () => {
    audio.playClick();
    if (onOpenAdmin) onOpenAdmin();
  });
}
