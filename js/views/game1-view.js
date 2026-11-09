/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Game 1 - Shuffle and Recall View (1A: Memorize -> 1B: Recall & Match)
 */

import { SHUFFLE_MEMORIZE_CARDS, SHUFFLE_CHALLENGES } from '../data/questions-bank.js';
import { SyncTimer } from '../components/timer.js';
import { firebaseService } from '../services/firebase-service.js';
import { audio } from '../services/audio-service.js';
import { toast } from '../components/notification.js';

export function renderGame1View(container, { sessionCode, teamNumber, isMemorizePhase, onGameCompleted, onPhaseChange }) {
  let timerInstance = null;
  let sessionUnsubscribe = null;
  let userAnswers = {};
  let isSubmitted = false;
  let currentLocalPhase = isMemorizePhase ? 'MEMORIZE' : 'PLAY';
  let unsubNet = null;

  function updateNetBadge(status) {
    const netBadge = container.querySelector('#g1-net-badge');
    if (!netBadge) return;
    const dot = netBadge.querySelector('.tc-net-dot');
    const txt = netBadge.querySelector('.tc-net-text');
    if (!dot || !txt) return;

    netBadge.className = `tc-hud-net-badge ${status.status.toLowerCase()}`;
    if (status.status === 'ONLINE' || status.status === 'RECOVERED') {
      dot.className = 'tc-net-dot online';
      txt.textContent = 'Live';
    } else if (status.status === 'LAG') {
      dot.className = 'tc-net-dot lag';
      txt.textContent = 'Lag';
    } else if (status.status === 'OFFLINE') {
      dot.className = 'tc-net-dot offline';
      txt.textContent = 'Offline';
    }
  }

  if (firebaseService.onConnectionChange) {
    unsubNet = firebaseService.onConnectionChange(updateNetBadge);
  }

  // Check initial team progress from server
  firebaseService.getSession(sessionCode).then((session) => {
    const team = session?.teams?.[`team_${teamNumber}`];
    if (team?.progress?.game1Submitted) {
      isSubmitted = true;
      currentLocalPhase = 'FINISHED';
      renderFinishedMode(team.scores?.game1 || 0);
      return;
    }

    if (isMemorizePhase) {
      renderMemorizeMode();
    } else {
      renderPlayMode();
    }
  });

  // Realtime Session listener to detect phase change from Admin
  sessionUnsubscribe = firebaseService.listenToSession(sessionCode, (session) => {
    if (!session) return;
    const phase = session.currentPhase;

    // Transition from 1A (Memorize) to 1B (Play)
    if (phase === 'GAME1_PLAY' && currentLocalPhase !== 'PLAY' && currentLocalPhase !== 'FINISHED') {
      currentLocalPhase = 'PLAY';
      renderPlayMode();
      return;
    }

    // Transition back to 1A (Memorize) if Admin moved phase back
    if (phase === 'GAME1_MEMORIZE' && currentLocalPhase !== 'MEMORIZE') {
      currentLocalPhase = 'MEMORIZE';
      renderMemorizeMode();
      return;
    }

    // Phase moved outside Game 1 (GAME2, GAME3, LOBBY, FINISHED)
    if (phase && phase !== 'GAME1_MEMORIZE' && phase !== 'GAME1_PLAY') {
      if (currentLocalPhase === 'PLAY' && !isSubmitted) {
        // Auto-save currently answered items so points are not lost
        firebaseService.submitGame1(sessionCode, teamNumber, userAnswers).catch(() => {});
      }
      cleanup();
      if (phase === 'LOBBY') {
        toast.warning('⚠️ Sesi telah di-reset oleh Guru. Permainan kembali ke Lobi persiapan.');
      }
      if (onPhaseChange) onPhaseChange(phase, session);
    }
  });

  // ==========================================
  // FASE 1A: MEMORIZE (MENGHAFAL KARTU MATERI)
  // Waktu: 35 Detik. Nilai: 0 (Murni hafalan)
  // ==========================================
  function renderMemorizeMode() {
    currentLocalPhase = 'MEMORIZE';
    if (timerInstance) timerInstance.destroy();

    container.innerHTML = `
      <div class="tc-view tc-game1-view tc-g1-memorize">
        <!-- Top HUD -->
        <div class="tc-game-hud">
          <div class="tc-hud-badge">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="tc-badge-lab">GAME 1 • FASE 1A DARI 3</span>
              <div class="tc-hud-net-badge" id="g1-net-badge"><span class="tc-net-dot online"></span><span class="tc-net-text">Live</span></div>
            </div>
            <h2 class="tc-hud-title">SHUFFLE AND RECALL: FASE HAFALAN</h2>
          </div>

          <div class="tc-hud-center">
            <div id="g1-mem-timer-container"></div>
          </div>

          <div class="tc-hud-team">
            <span class="tc-hud-team-tag">KELOMPOK ${teamNumber}</span>
            <span class="tc-hud-score-tag">STATUS: MENGAMATI MATERI (0 PTS)</span>
          </div>
        </div>

        <div class="tc-banner-instruction">
          <span class="tc-fire-icon">🔥</span>
          <span>Amati dan hafalkan konsep, rumus skala termometer, dan contoh pemuaian di bawah ini sebelum waktu habis! (Babak penilaian di Fase 1B)</span>
        </div>

        <!-- 10 Memorize Cards Grid -->
        <div class="tc-memorize-grid">
          ${SHUFFLE_MEMORIZE_CARDS.map((card, idx) => `
            <div class="tc-mem-card" style="animation-delay: ${idx * 0.05}s">
              <div class="tc-mem-card-top">
                <span class="tc-mem-cat">${card.category}</span>
                <span class="tc-mem-icon">${card.icon}</span>
              </div>
              <h3 class="tc-mem-term">${card.term}</h3>
              <div class="tc-mem-tag">${card.tag}</div>
              <p class="tc-mem-def">${card.definition}</p>
              <div class="tc-mem-example">
                <strong>Contoh / Rumus:</strong>
                <span>${card.example}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Start 35s Synchronized Timer
    const timerBox = container.querySelector('#g1-mem-timer-container');
    firebaseService.getSession(sessionCode).then((session) => {
      const startTime = session?.phaseStartTime || firebaseService.getServerTime();
      const duration = session?.settings?.game1MemorizeTime || 35;

      timerInstance = new SyncTimer({
        container: timerBox,
        durationSec: duration,
        startTimeMs: startTime,
        getServerTime: () => firebaseService.getServerTime(),
        onComplete: () => {
          toast.info('Waktu menghafal selesai! Kartu konsep telah ditutup.');
          audio.playPhaseTransition();
          renderMemorizeStandby();
        }
      });
    });
  }

  // ==========================================
  // STANDBY STATE: Menghafal Selesai, Menunggu Guru Membuka 1B
  // ==========================================
  function renderMemorizeStandby() {
    if (timerInstance) timerInstance.destroy();

    container.innerHTML = `
      <div class="tc-view tc-game1-view tc-g1-standby">
        <!-- Top HUD -->
        <div class="tc-game-hud">
          <div class="tc-hud-badge">
            <span class="tc-badge-lab">GAME 1 • FASE 1A SELESAI</span>
            <h2 class="tc-hud-title">WAKTU MENGHAFAL TELAH HABIS</h2>
          </div>

          <div class="tc-hud-team">
            <span class="tc-hud-team-tag">KELOMPOK ${teamNumber}</span>
            <span class="tc-hud-score-tag">TARGET BERIKUTNYA: 30 PTS</span>
          </div>
        </div>

        <div class="tc-card tc-standby-card" style="text-align: center; padding: 3rem 1.5rem; margin-top: 1.5rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem; animation: tcBounce 1.5s infinite;">🧠</div>
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.75rem;">Kartu Konsep Telah Ditutup!</h2>
          <p style="color: #94a3b8; max-width: 540px; margin: 0 auto 1.75rem; line-height: 1.6; font-size: 1.05rem;">
            Kerja bagus! Seluruh informasi materi suhu & pemuaian telah disimpan dalam ingatanmu.
            Bersiaplah mencocokkan 10 pasangan konsep pada <strong>Fase 1B: Uji Daya Ingat</strong>.
          </p>
          <div class="tc-radar-spinner" style="margin: 0 auto 1.25rem;"></div>
          <p style="color: #38bdf8; font-weight: 700; font-size: 1rem; margin-bottom: 1.5rem;">
            <span class="tc-pulse-dot"></span> Menunggu Guru mengaktifkan Fase 1B di layar utama...
          </p>
          <button id="btn-g1-standby-leave" class="tc-btn tc-btn-sm tc-btn-ghost danger" style="margin: 0 auto;">
            🚪 Keluar / Ganti Sesi Baru
          </button>
        </div>
      </div>
    `;

    const btnLeave = container.querySelector('#btn-g1-standby-leave');
    if (btnLeave) {
      btnLeave.addEventListener('click', () => {
        audio.playClick();
        if (confirm('⚠️ PERINGATAN:\n\nJika keluar dari sesi ini, seluruh progres permainan di perangkat ini akan di-reset total ke awal dan Anda akan kembali ke menu masukkan kode.\n\nApakah Anda yakin ingin keluar?')) {
          cleanup();
          firebaseService.clearStoredTeamSession();
          window.location.href = '/';
        }
      });
    }
  }

  // ==========================================
  // FASE 1B: PLAY / RECALL & MATCH (MENGINGAT)
  // Waktu: 75 Detik. Nilai: 0 - 30 Poin
  // ==========================================
  function renderPlayMode() {
    currentLocalPhase = 'PLAY';
    if (timerInstance) timerInstance.destroy();
    userAnswers = {};
    isSubmitted = false;

    // Shuffle questions order for fairness
    const shuffledChallenges = [...SHUFFLE_CHALLENGES].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="tc-view tc-game1-view tc-g1-play">
        <!-- Top HUD -->
        <div class="tc-game-hud">
          <div class="tc-hud-badge">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="tc-badge-lab">GAME 1 • FASE 1B: MENYUSUN & MENGINGAT</span>
              <div class="tc-hud-net-badge" id="g1-net-badge"><span class="tc-net-dot online"></span><span class="tc-net-text">Live</span></div>
            </div>
            <h2 class="tc-hud-title">SHUFFLE & RECALL: UJI DAYA INGAT</h2>
          </div>

          <div class="tc-hud-center">
            <div id="g1-play-timer-container"></div>
          </div>

          <div class="tc-hud-team">
            <span class="tc-hud-team-tag">KELOMPOK ${teamNumber}</span>
            <div class="tc-progress-counter" id="g1-progress-counter">0 / 10 Terjawab</div>
          </div>
        </div>

        <div class="tc-banner-instruction pulse">
          <span>🧠</span>
          <span>Cocokkan setiap istilah skala suhu, alat ukur, atau rumus pemuaian dengan pasangan yang tepat! (Maks 30 Poin)</span>
        </div>

        <!-- Challenges Interactive List -->
        <div class="tc-challenges-list" id="g1-challenges-container">
          ${shuffledChallenges.map((item, index) => {
            const opts = [...item.options].sort(() => Math.random() - 0.5);
            return `
              <div class="tc-card tc-challenge-card" data-id="${item.id}">
                <div class="tc-ch-header">
                  <span class="tc-ch-num">TANTANGAN ${index + 1}</span>
                  <span class="tc-ch-cat">${item.category}</span>
                </div>
                
                <p class="tc-ch-prompt">${item.prompt}</p>
                <div class="tc-ch-target-box">
                  <span class="tc-target-icon">🎯</span>
                  <strong class="tc-ch-target-text">${item.leftItem}</strong>
                </div>

                <div class="tc-ch-options-grid">
                  ${opts.map((opt) => `
                    <button type="button" class="tc-opt-btn" data-val="${opt.replace(/"/g, '&quot;')}">
                      <span class="tc-opt-indicator"></span>
                      <span class="tc-opt-text">${opt}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Sticky Submit Bar -->
        <div class="tc-sticky-submit-bar">
          <div class="tc-submit-info">
            <span id="g1-unanswered-notice">Pastikan seluruh 10 tantangan sudah dipilih!</span>
          </div>
          <button type="button" id="btn-submit-g1" class="tc-btn tc-btn-primary tc-btn-large">
            <span>KIRIM JAWABAN GAME 1</span>
            <span>⚡</span>
          </button>
        </div>
      </div>
    `;

    const challengesContainer = container.querySelector('#g1-challenges-container');
    const counterEl = container.querySelector('#g1-progress-counter');
    const submitBtn = container.querySelector('#btn-submit-g1');

    // Option Selection Handler
    challengesContainer.addEventListener('click', (e) => {
      if (isSubmitted) return;
      const optBtn = e.target.closest('.tc-opt-btn');
      if (!optBtn) return;
      audio.playClick();

      const card = optBtn.closest('.tc-challenge-card');
      const qId = card.dataset.id;
      const val = optBtn.dataset.val;

      // Deselect siblings
      card.querySelectorAll('.tc-opt-btn').forEach((b) => b.classList.remove('selected'));
      optBtn.classList.add('selected');

      userAnswers[qId] = val;

      // Update counter
      const answeredCount = Object.keys(userAnswers).length;
      counterEl.textContent = `${answeredCount} / 10 Terjawab`;
      if (answeredCount === 10) {
        counterEl.classList.add('complete');
      }
    });

    // Start 75s Synchronized Timer from 1B Phase Start
    const timerBox = container.querySelector('#g1-play-timer-container');
    firebaseService.getSession(sessionCode).then((session) => {
      const startTime = session?.phaseStartTime || firebaseService.getServerTime();
      const duration = session?.settings?.game1PlayTime || 75;

      timerInstance = new SyncTimer({
        container: timerBox,
        durationSec: duration,
        startTimeMs: startTime,
        getServerTime: () => firebaseService.getServerTime(),
        onComplete: () => {
          if (!isSubmitted) {
            toast.warning('Waktu Game 1 habis! Mengirimkan jawaban secara otomatis...');
            doSubmit();
          }
        }
      });
    });

    // Submit Button
    submitBtn.addEventListener('click', () => {
      if (isSubmitted) return;
      audio.playClick();
      const count = Object.keys(userAnswers).length;
      if (count < 10) {
        if (!confirm(`Kamu baru menjawab ${count} dari 10 soal. Yakin ingin mengirim sekarang?`)) {
          return;
        }
      }
      doSubmit();
    });

    async function doSubmit() {
      if (isSubmitted) return;
      isSubmitted = true;
      if (timerInstance) timerInstance.stop();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Memvalidasi jawaban...';

      try {
        const res = await firebaseService.submitGame1(sessionCode, teamNumber, userAnswers);
        if (res.isPerfect) {
          audio.playFanfare();
          toast.success(`SEMPURNA! 10/10 Benar! Bonus +5 pts (Total: ${res.score} pts)`);
        } else if (res.score > 0) {
          audio.playCorrect();
          toast.success(`Jawaban Game 1 terkirim! Skor: ${res.score} pts (${res.correctCount}/10 Benar)`);
        } else {
          audio.playWrong();
          toast.warning(`Jawaban Game 1 selesai diperiksa.`);
        }

        renderFinishedMode(res.score);

        if (onGameCompleted) {
          onGameCompleted(res);
        }
      } catch (err) {
        toast.error('Gagal mengirimkan jawaban: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Coba Kirim Ulang';
        isSubmitted = false;
      }
    }
  }

  // ==========================================
  // FINISHED STATE: Jawaban Game 1 Terkirim
  // ==========================================
  function renderFinishedMode(score) {
    currentLocalPhase = 'FINISHED';
    if (timerInstance) timerInstance.destroy();

    container.innerHTML = `
      <div class="tc-view tc-game1-view tc-g1-finished">
        <!-- Top HUD -->
        <div class="tc-game-hud">
          <div class="tc-hud-badge">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="tc-badge-lab">GAME 1 SELESAI</span>
              <div class="tc-hud-net-badge" id="g1-net-badge"><span class="tc-net-dot online"></span><span class="tc-net-text">Live</span></div>
            </div>
            <h2 class="tc-hud-title">SHUFFLE & RECALL TUNTAS</h2>
          </div>

          <div class="tc-hud-team">
            <span class="tc-hud-team-tag">KELOMPOK ${teamNumber}</span>
            <div class="tc-progress-counter complete">10 / 10 Selesai</div>
          </div>
        </div>

        <div class="tc-card tc-finish-card">
          <div class="tc-badge-lab">SKOR RESMI FASE 1B</div>
          <div class="tc-finish-trophy">⚡</div>
          <h2 class="tc-finish-title">Uji Daya Ingat Selesai!</h2>
          <div class="tc-finish-score-box">
            <span>Skor Game 1 Kelompokmu:</span>
            <strong>${score} / 30 Poin</strong>
          </div>
          <p class="tc-finish-desc">
            Hebat! Jawaban Game 1 telah tersimpan secara permanen di server. 
            Menunggu instruksi Guru untuk melanjutkan ke <strong>Game 2: Word Scramble</strong>...
          </p>
          <div class="tc-radar-spinner" style="margin-bottom: 1.5rem;"></div>

          <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
            <button id="btn-g1-finish-leave" class="tc-btn tc-btn-sm tc-btn-ghost danger">
              🚪 Keluar / Masukkan Kode Baru
            </button>
          </div>
        </div>
      </div>
    `;

    const btnLeave = container.querySelector('#btn-g1-finish-leave');
    if (btnLeave) {
      btnLeave.addEventListener('click', () => {
        audio.playClick();
        if (confirm('⚠️ PERINGATAN:\n\nJika keluar dari sesi ini, seluruh progres permainan di perangkat ini akan di-reset total ke awal dan Anda akan kembali ke menu masukkan kode.\n\nApakah Anda yakin ingin keluar?')) {
          cleanup();
          firebaseService.clearStoredTeamSession();
          window.location.href = '/';
        }
      });
    }
  }

  function cleanup() {
    if (timerInstance) timerInstance.destroy();
    if (sessionUnsubscribe) sessionUnsubscribe();
    if (unsubNet) unsubNet();
  }

  return {
    destroy: cleanup
  };
}
