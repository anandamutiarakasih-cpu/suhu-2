/**
 * THERMO CHAMPIONS — MODE 2: MEMORY MADNESS
 * Fase 1: Hafalkan 10 kartu titik tetap termometer (30 detik).
 * Fase 2: Tantangan Recall Ingatan (10 soal × 3 poin = 30 Poin).
 */

import { MEMORY_CARDS, RECALL_QUESTIONS } from "../../data/questions.js";
import { sounds } from "../utils/sounds.js";
import { SyncTimer } from "../utils/timer.js";
import { gameState } from "./state.js";
import { callSubmitAnswer } from "../firebase/functions.js";
import { markModeCompleted } from "../firebase/database.js";

export class MemoryMadnessGame {
  constructor({ onComplete, onUpdateScore }) {
    this.onComplete = onComplete;
    this.onUpdateScore = onUpdateScore;
    this.phase = 'memorize'; // memorize | recall | done
    this.memoTimer = null;
    this.recallTimer = null;
    this.recallIndex = 0;
    this.hasAnsweredRecall = false;
    this.questionStartTime = 0;
  }

  init() {
    this.phase = 'memorize';
    this.recallIndex = 0;
    this.renderMemorizePhase();
  }

  renderMemorizePhase() {
    const memoSection = document.getElementById('mem-phase-memorize');
    const recallSection = document.getElementById('mem-phase-recall');
    const memoTimerEl = document.getElementById('mem-timer-num');
    const cardsGrid = document.getElementById('memory-cards-grid');
    const skipBtn = document.getElementById('btn-mem-ready-early');

    if (memoSection) memoSection.style.display = 'block';
    if (recallSection) recallSection.style.display = 'none';

    // Render cards
    if (cardsGrid) {
      cardsGrid.innerHTML = '';
      MEMORY_CARDS.forEach((card) => {
        const cEl = document.createElement('div');
        cEl.className = 'memo-card is-flipped';
        cEl.innerHTML = `
          <div class="memo-card-inner">
            <div class="memo-card-front">
              <span class="m-cat">${card.cat}</span>
              <span class="m-title">${card.title}</span>
              <span class="m-fact">${card.fact}</span>
              <span class="m-desc">${card.desc}</span>
            </div>
            <div class="memo-card-back">
              <span>❓</span>
              <span style="font-size:0.75rem; font-weight:700;">Hafalkan!</span>
            </div>
          </div>
        `;
        cEl.addEventListener('click', () => {
          sounds.cardFlip();
          cEl.classList.toggle('is-flipped');
        });
        cardsGrid.appendChild(cEl);
      });
    }

    if (skipBtn) {
      skipBtn.onclick = () => {
        sounds.click();
        this.startRecallPhase();
      };
    }

    // 30 seconds countdown
    if (this.memoTimer) this.memoTimer.stop();
    this.memoTimer = new SyncTimer({
      durationSeconds: 30,
      onTick: (sec) => {
        if (memoTimerEl) memoTimerEl.textContent = `${sec}s`;
        if (sec <= 5) sounds.tick();
      },
      onComplete: () => {
        this.startRecallPhase();
      }
    });

    this.memoTimer.start();
  }

  startRecallPhase() {
    if (this.memoTimer) this.memoTimer.stop();
    this.phase = 'recall';

    const memoSection = document.getElementById('mem-phase-memorize');
    const recallSection = document.getElementById('mem-phase-recall');

    if (memoSection) memoSection.style.display = 'none';
    if (recallSection) recallSection.style.display = 'block';

    this.recallIndex = 0;
    this.renderRecallQuestion();
  }

  renderRecallQuestion() {
    if (this.recallIndex >= RECALL_QUESTIONS.length) {
      this.finish();
      return;
    }

    this.hasAnsweredRecall = false;
    const q = RECALL_QUESTIONS[this.recallIndex];

    const counterEl = document.getElementById('recall-counter');
    const promptEl = document.getElementById('recall-prompt-text');
    const optionsContainer = document.getElementById('recall-options-container');
    const feedbackBox = document.getElementById('recall-feedback-box');
    const nextBtn = document.getElementById('btn-recall-next');

    if (counterEl) counterEl.textContent = `Recall ${this.recallIndex + 1} / ${RECALL_QUESTIONS.length}`;
    if (promptEl) promptEl.textContent = q.prompt;
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.innerHTML = '';
    }
    if (nextBtn) nextBtn.style.display = 'none';

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach((optText) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt-card';
        btn.innerHTML = `<div class="opt-text" style="text-align:center; width:100%; font-weight:800;">${optText}</div>`;
        btn.addEventListener('click', () => this.handleRecallAnswer(optText, btn));
        optionsContainer.appendChild(btn);
      });
    }

    // 25-second timer for recall
    this.startRecallTimer();
  }

  startRecallTimer() {
    if (this.recallTimer) this.recallTimer.stop();
    this.questionStartTime = Date.now();

    const timerEl = document.getElementById('recall-timer-num');

    this.recallTimer = new SyncTimer({
      durationSeconds: 25,
      onTick: (sec) => {
        if (timerEl) timerEl.textContent = `${sec}s`;
        if (sec <= 5) sounds.tick();
      },
      onComplete: () => {
        if (!this.hasAnsweredRecall) {
          this.handleRecallTimeout();
        }
      }
    });

    this.recallTimer.start();
  }

  async handleRecallAnswer(selectedText, clickedBtn) {
    if (this.hasAnsweredRecall) return;
    this.hasAnsweredRecall = true;
    if (this.recallTimer) this.recallTimer.stop();

    const q = RECALL_QUESTIONS[this.recallIndex];
    const timeSpent = Math.max(1, Math.round((Date.now() - this.questionStartTime) / 1000));
    const isCorrectFallback = (selectedText === q.answer);

    const allBtns = document.querySelectorAll('#recall-options-container .opt-card');
    allBtns.forEach(b => {
      b.disabled = true;
      if (b.textContent.trim() === q.answer) {
        b.classList.add('correct');
      } else if (b === clickedBtn && !isCorrectFallback) {
        b.classList.add('wrong');
      }
    });

    if (isCorrectFallback) sounds.correct();
    else sounds.wrong();

    // Submit to Firebase
    const sess = gameState.session;
    const grp = gameState.group;
    if (sess && grp) {
      try {
        const res = await callSubmitAnswer(
          sess.id,
          grp.groupNumber,
          gameState.deviceToken,
          'memory',
          q.id,
          selectedText,
          isCorrectFallback,
          3.0, // 30 points / 10 questions = 3.0 pts each
          timeSpent
        );
        if (res && res.scores) {
          gameState.updateScores(res.scores);
          if (this.onUpdateScore) this.onUpdateScore(res.scores);
        }
      } catch (err) {
        console.error('Submit memory answer error:', err);
      }
    }

    const feedbackBox = document.getElementById('recall-feedback-box');
    const nextBtn = document.getElementById('btn-recall-next');

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = isCorrectFallback ? 'feedback-card correct' : 'feedback-card wrong';
      feedbackBox.innerHTML = `
        <div style="font-weight:900; font-size:1.05rem; margin-bottom:0.25rem;">
          ${isCorrectFallback ? '🎉 INGATAN TEPAT! (+3 Poin)' : '✗ INGATAN KURANG TEPAT'}
        </div>
        <div style="font-size:0.85rem; line-height:1.5;">${q.exp}</div>
      `;
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = (this.recallIndex < RECALL_QUESTIONS.length - 1)
        ? 'Lanjut Recall Berikutnya →'
        : 'Selesai Mode 2 & Simpan Skor';
      nextBtn.onclick = () => {
        sounds.click();
        this.recallIndex++;
        this.renderRecallQuestion();
      };
    }
  }

  handleRecallTimeout() {
    this.hasAnsweredRecall = true;
    sounds.wrong();

    const q = RECALL_QUESTIONS[this.recallIndex];
    const allBtns = document.querySelectorAll('#recall-options-container .opt-card');
    allBtns.forEach(b => {
      b.disabled = true;
      if (b.textContent.trim() === q.answer) b.classList.add('correct');
    });

    const feedbackBox = document.getElementById('recall-feedback-box');
    const nextBtn = document.getElementById('btn-recall-next');

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = 'feedback-card wrong';
      feedbackBox.innerHTML = `
        <div style="font-weight:900; font-size:1.05rem; margin-bottom:0.25rem;">⏱ WAKTU HABIS!</div>
        <div style="font-size:0.85rem; line-height:1.5;">${q.exp}</div>
      `;
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = (this.recallIndex < RECALL_QUESTIONS.length - 1)
        ? 'Lanjut Recall Berikutnya →'
        : 'Selesai Mode 2';
      nextBtn.onclick = () => {
        sounds.click();
        this.recallIndex++;
        this.renderRecallQuestion();
      };
    }
  }

  async finish() {
    if (this.recallTimer) this.recallTimer.stop();
    if (this.memoTimer) this.memoTimer.stop();

    const sess = gameState.session;
    const grp = gameState.group;
    if (sess && grp) {
      await markModeCompleted(sess.id, grp.groupNumber, 'memory');
      gameState.markModeDone('memory');
    }

    if (this.onComplete) {
      this.onComplete();
    }
  }
}
