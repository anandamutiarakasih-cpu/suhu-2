/**
 * THERMO CHAMPIONS — MODE 1: STARCHAMP CHALLENGE
 * 10 Soal Pilihan Ganda Cepat — Maksimal 35 Poin
 */

import { QUIZ_QUESTIONS } from "../../data/questions.js";
import { sounds } from "../utils/sounds.js";
import { SyncTimer } from "../utils/timer.js";
import { gameState } from "./state.js";
import { callSubmitAnswer } from "../firebase/functions.js";
import { markModeCompleted } from "../firebase/database.js";

export class StarChampGame {
  constructor({ onComplete, onUpdateScore }) {
    this.onComplete = onComplete;
    this.onUpdateScore = onUpdateScore;
    this.currentIndex = 0;
    this.timer = null;
    this.questionStartTime = 0;
    this.hasAnswered = false;
  }

  init() {
    this.currentIndex = 0;
    this.renderQuestion();
  }

  renderQuestion() {
    if (this.currentIndex >= QUIZ_QUESTIONS.length) {
      this.finish();
      return;
    }

    this.hasAnswered = false;
    const q = QUIZ_QUESTIONS[this.currentIndex];

    // DOM Elements matching index.html
    const topicEl = document.getElementById('quiz-topic-badge');
    const counterEl = document.getElementById('quiz-counter');
    const textEl = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-quiz-next');
    const progressFill = document.getElementById('quiz-progress-fill');

    if (topicEl) topicEl.textContent = q.topic;
    if (counterEl) counterEl.textContent = `Soal ${this.currentIndex + 1} / ${QUIZ_QUESTIONS.length}`;
    if (textEl) textEl.textContent = q.question;
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.innerHTML = '';
    }
    if (nextBtn) nextBtn.style.display = 'none';

    if (progressFill) {
      const pct = ((this.currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;
      progressFill.style.width = `${pct}%`;
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt-card';
        btn.dataset.key = opt.key;
        btn.innerHTML = `
          <div class="opt-key">${opt.key}</div>
          <div class="opt-text">${opt.text}</div>
        `;
        btn.addEventListener('click', () => this.handleAnswer(opt.key, btn));
        optionsContainer.appendChild(btn);
      });
    }

    // Start 30-second timer
    this.startTimer();
  }

  startTimer() {
    if (this.timer) this.timer.stop();
    this.questionStartTime = Date.now();

    const timerNumEl = document.getElementById('quiz-timer-num');

    this.timer = new SyncTimer({
      durationSeconds: 30,
      onTick: (sec) => {
        if (timerNumEl) timerNumEl.textContent = `${sec}s`;
        if (sec <= 5) {
          sounds.tick();
          if (timerNumEl) timerNumEl.style.color = '#ef4444';
        } else {
          if (timerNumEl) timerNumEl.style.color = 'inherit';
        }
      },
      onComplete: () => {
        if (!this.hasAnswered) {
          this.handleTimeout();
        }
      }
    });

    this.timer.start();
  }

  async handleAnswer(selectedKey, clickedBtn) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;
    if (this.timer) this.timer.stop();

    const q = QUIZ_QUESTIONS[this.currentIndex];
    const timeSpent = Math.max(1, Math.round((Date.now() - this.questionStartTime) / 1000));
    const isCorrectFallback = (selectedKey === q.correctAnswer);

    // Disable all option buttons
    const allBtns = document.querySelectorAll('#quiz-options-container .opt-card');
    allBtns.forEach(b => {
      b.disabled = true;
      if (b.dataset.key === q.correctAnswer) {
        b.classList.add('correct');
      } else if (b === clickedBtn && !isCorrectFallback) {
        b.classList.add('wrong');
      }
    });

    if (isCorrectFallback) {
      sounds.correct();
    } else {
      sounds.wrong();
    }

    // Submit to Firebase
    const sess = gameState.session;
    const grp = gameState.group;
    if (sess && grp) {
      try {
        const sId = sess.code || sess.sessionCode || sess.id;
        const res = await callSubmitAnswer(
          sId,
          grp.groupNumber,
          gameState.deviceToken,
          'quiz',
          q.id,
          selectedKey,
          isCorrectFallback,
          3.5, // 35 points / 10 questions = 3.5 pts each
          timeSpent
        );
        if (res && res.scores) {
          gameState.updateScores(res.scores);
          if (this.onUpdateScore) this.onUpdateScore(res.scores);
        }
      } catch (err) {
        console.error('Submit quiz answer error:', err);
      }
    }

    // Show feedback explanation
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-quiz-next');

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = isCorrectFallback ? 'feedback-card correct' : 'feedback-card wrong';
      feedbackBox.innerHTML = `
        <div style="font-weight:900; font-size:1.05rem; margin-bottom:0.25rem;">
          ${isCorrectFallback ? '🎉 JAWABAN BENAR! (+3,5 Poin)' : '✗ JAWABAN KURANG TEPAT'}
        </div>
        <div style="font-size:0.85rem; line-height:1.5;">${q.explanation}</div>
      `;
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = (this.currentIndex < QUIZ_QUESTIONS.length - 1)
        ? 'Lanjut ke Soal Berikutnya →'
        : 'Selesai Mode 1 & Lihat Hasil';
      nextBtn.onclick = () => {
        sounds.click();
        this.currentIndex++;
        this.renderQuestion();
      };
    }
  }

  handleTimeout() {
    this.hasAnswered = true;
    sounds.wrong();

    const q = QUIZ_QUESTIONS[this.currentIndex];
    const allBtns = document.querySelectorAll('#quiz-options-container .opt-card');
    allBtns.forEach(b => {
      b.disabled = true;
      if (b.dataset.key === q.correctAnswer) b.classList.add('correct');
    });

    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-quiz-next');

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = 'feedback-card wrong';
      feedbackBox.innerHTML = `
        <div style="font-weight:900; font-size:1.05rem; margin-bottom:0.25rem;">⏱ WAKTU HABIS!</div>
        <div style="font-size:0.85rem; line-height:1.5;">${q.explanation}</div>
      `;
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = (this.currentIndex < QUIZ_QUESTIONS.length - 1)
        ? 'Lanjut ke Soal Berikutnya →'
        : 'Selesai Mode 1 & Simpan';
      nextBtn.onclick = () => {
        sounds.click();
        this.currentIndex++;
        this.renderQuestion();
      };
    }
  }

  async finish() {
    if (this.timer) this.timer.stop();
    const sess = gameState.session;
    const grp = gameState.group;
    if (sess && grp) {
      const sId = sess.code || sess.sessionCode || sess.id;
      await markModeCompleted(sId, grp.groupNumber, 'quiz');
      gameState.markModeDone('quiz');
    }

    if (this.onComplete) {
      this.onComplete();
    }
  }
}
