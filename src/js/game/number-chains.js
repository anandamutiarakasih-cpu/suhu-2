/**
 * THERMO CHAMPIONS — MODE 3: NUMBER CHAINS
 * 5 Tahap Konversi Berantai (Easy s/d Hard) — Maksimal 35 Poin
 */

import { NUMBER_CHAIN_STAGES } from "../../data/questions.js";
import { sounds } from "../utils/sounds.js";
import { gameState } from "./state.js";
import { callSubmitAnswer } from "../firebase/functions.js";
import { markModeCompleted } from "../firebase/database.js";

export class NumberChainsGame {
  constructor({ onComplete, onUpdateScore }) {
    this.onComplete = onComplete;
    this.onUpdateScore = onUpdateScore;
    this.stageIndex = 0;
    this.stageStartTime = 0;
    this.hasSubmittedStage = false;
  }

  init() {
    this.stageIndex = 0;

    // Hint toggle listener
    const hintBtn = document.getElementById('btn-calc-toggle-hint');
    const hintBox = document.getElementById('calc-formula-box');
    if (hintBtn && hintBox) {
      hintBtn.onclick = () => {
        sounds.click();
        const isHidden = (hintBox.style.display === 'none' || !hintBox.style.display);
        hintBox.style.display = isHidden ? 'block' : 'none';
        hintBtn.textContent = isHidden ? '🙈 Sembunyikan Petunjuk Rumus' : '💡 Tampilkan Petunjuk Rumus Bantuan';
      };
    }

    this.renderStage();
  }

  renderStage() {
    if (this.stageIndex >= NUMBER_CHAIN_STAGES.length) {
      this.finish();
      return;
    }

    this.hasSubmittedStage = false;
    this.stageStartTime = Date.now();
    const st = NUMBER_CHAIN_STAGES[this.stageIndex];

    const counterEl = document.getElementById('calc-stage-counter');
    const badgeEl = document.getElementById('calc-difficulty-badge');
    const titleEl = document.getElementById('calc-stage-title');
    const descEl = document.getElementById('calc-stage-desc');
    const givenEl = document.getElementById('calc-given-val');
    const unitEl = document.getElementById('calc-target-unit');
    const formulaText = document.getElementById('calc-formula-text');
    const hintBox = document.getElementById('calc-formula-box');
    const inputsContainer = document.getElementById('calc-inputs-container');
    const solutionBox = document.getElementById('calc-solution-box');
    const submitBtn = document.getElementById('btn-calc-submit');
    const nextBtn = document.getElementById('btn-calc-next');

    if (counterEl) counterEl.textContent = `Tahap ${st.stage} / ${NUMBER_CHAIN_STAGES.length}`;
    if (badgeEl) {
      badgeEl.textContent = st.difficulty;
      badgeEl.style.background = st.difficulty === 'Easy' ? '#f0fdf4' : st.difficulty === 'Medium' ? '#fef3c7' : '#fee2e2';
      badgeEl.style.color = st.difficulty === 'Easy' ? '#15803d' : st.difficulty === 'Medium' ? '#92400e' : '#b91c1c';
    }
    if (titleEl) titleEl.textContent = st.title;
    if (descEl) descEl.textContent = st.desc;
    if (givenEl) givenEl.textContent = st.given;
    if (unitEl) unitEl.textContent = st.targetUnit;
    if (formulaText) formulaText.textContent = st.formula;
    if (hintBox) hintBox.style.display = 'none';

    if (solutionBox) {
      solutionBox.style.display = 'none';
      solutionBox.innerHTML = '';
    }
    if (nextBtn) nextBtn.style.display = 'none';
    if (submitBtn) {
      submitBtn.style.display = 'inline-flex';
      submitBtn.disabled = false;
      submitBtn.onclick = () => this.handleSubmit();
    }

    // Render input fields
    if (inputsContainer) {
      inputsContainer.innerHTML = '';
      st.steps.forEach(step => {
        const row = document.createElement('div');
        row.className = 'calc-step-row';
        row.style.marginBottom = '1rem';
        row.innerHTML = `
          <div style="font-size:0.85rem; font-weight:800; color:var(--navy); margin-bottom:0.35rem;">
            ${step.label} <span style="font-size:0.75rem; color:var(--slate-500);">(Bobot: ${step.weight} Poin)</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <input type="number" step="any" inputmode="decimal" class="form-input calc-input" id="input_step_${step.id}" placeholder="Ketik angka hasil..." style="font-size:1.15rem; font-family:monospace; font-weight:900;" />
            <span style="font-weight:900; color:var(--orange); font-size:1.1rem; padding:0 0.5rem;">${step.unit}</span>
          </div>
        `;
        inputsContainer.appendChild(row);
      });
    }
  }

  async handleSubmit() {
    if (this.hasSubmittedStage) return;
    const st = NUMBER_CHAIN_STAGES[this.stageIndex];
    const timeSpent = Math.max(1, Math.round((Date.now() - this.stageStartTime) / 1000));

    let allCorrect = true;
    let solutionsHtml = '';

    const submitBtn = document.getElementById('btn-calc-submit');
    if (submitBtn) submitBtn.disabled = true;

    for (const step of st.steps) {
      const inputEl = document.getElementById(`input_step_${step.id}`);
      const val = parseFloat(inputEl ? inputEl.value : NaN);
      const isCorrectFallback = (!isNaN(val) && Math.abs(val - step.target) <= 0.1);

      if (isCorrectFallback) {
        if (inputEl) {
          inputEl.style.borderColor = '#10b981';
          inputEl.style.backgroundColor = '#ecfdf5';
        }
      } else {
        allCorrect = false;
        if (inputEl) {
          inputEl.style.borderColor = '#ef4444';
          inputEl.style.backgroundColor = '#fef2f2';
        }
      }

      solutionsHtml += `<div style="margin-top:0.35rem; font-size:0.85rem;">
        <strong>${step.label}:</strong> ${step.solution}
        ${isCorrectFallback ? '<span style="color:#10b981; font-weight:800;"> ✓ Benar</span>' : '<span style="color:#ef4444; font-weight:800;"> ✗ Kurang Tepat</span>'}
      </div>`;

      // Submit each step to Firebase
      const sess = gameState.session;
      const grp = gameState.group;
      if (sess && grp) {
        try {
          const res = await callSubmitAnswer(
            sess.id,
            grp.groupNumber,
            gameState.deviceToken,
            'calc',
            st.stage,
            val,
            isCorrectFallback,
            step.weight,
            timeSpent,
            step.id
          );
          if (res && res.scores) {
            gameState.updateScores(res.scores);
            if (this.onUpdateScore) this.onUpdateScore(res.scores);
          }
        } catch (e) {
          console.error('Submit calc error:', e);
        }
      }
    }

    this.hasSubmittedStage = true;

    if (allCorrect) {
      sounds.correct();
    } else {
      sounds.wrong();
    }

    const solutionBox = document.getElementById('calc-solution-box');
    const nextBtn = document.getElementById('btn-calc-next');

    if (solutionBox) {
      solutionBox.style.display = 'block';
      solutionBox.className = allCorrect ? 'feedback-card correct' : 'feedback-card wrong';
      solutionBox.innerHTML = `
        <div style="font-weight:900; font-size:1.05rem; margin-bottom:0.35rem; color:${allCorrect ? '#065f46' : '#991b1b'};">
          ${allCorrect ? `🎉 Sempurna! Tahap ${st.stage} Tuntas (+${st.maxPoints} Poin)` : `Pembahasan Perhitungan Tahap ${st.stage}:`}
        </div>
        ${solutionsHtml}
      `;
    }

    if (submitBtn) submitBtn.style.display = 'none';

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = (this.stageIndex < NUMBER_CHAIN_STAGES.length - 1)
        ? 'Lanjut ke Tahap Berikutnya →'
        : 'Selesai Mode 3 & Simpan Skor';
      nextBtn.onclick = () => {
        sounds.click();
        this.stageIndex++;
        this.renderStage();
      };
    }
  }

  async finish() {
    const sess = gameState.session;
    const grp = gameState.group;
    if (sess && grp) {
      await markModeCompleted(sess.id, grp.groupNumber, 'calc');
      gameState.markModeDone('calc');
    }

    if (this.onComplete) {
      this.onComplete();
    }
  }
}
