import React, { useState } from 'react';
import { numberChainStages } from '../data/numberChains';
import { sound } from '../utils/audio';
import { 
  Hash, Calculator, CheckCircle2, XCircle, ArrowRight, Lightbulb, 
  RotateCcw, Sparkles, BookOpen, AlertTriangle, ChevronRight, HelpCircle 
} from 'lucide-react';

export default function NumberChains({ onFinish, onBackToDashboard }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [inputs, setInputs] = useState({});
  const [stageSubmitted, setStageSubmitted] = useState(false);
  const [stageResults, setStageResults] = useState([]);
  const [showFormulaHint, setShowFormulaHint] = useState(false);
  const [modeCompleted, setModeCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const stage = numberChainStages[currentStageIdx];

  // Handle number input change
  const handleInputChange = (stepId, value) => {
    setInputs((prev) => ({
      ...prev,
      [stepId]: value
    }));
  };

  // Submit and verify current stage steps
  const handleSubmitStage = (e) => {
    e.preventDefault();
    if (stageSubmitted) return;

    let stageEarnedPoints = 0;
    let stageCorrectSteps = 0;
    const stepDetails = [];

    stage.steps.forEach((step) => {
      const userValRaw = inputs[step.id];
      const userNum = parseFloat(userValRaw);
      // Tolerance of 0.05 for floating point differences
      const isCorrect = !isNaN(userNum) && Math.abs(userNum - step.targetValue) < 0.05;

      if (isCorrect) {
        stageEarnedPoints += step.weight;
        stageCorrectSteps += 1;
      }

      stepDetails.push({
        stepId: step.id,
        label: step.label,
        userValue: userValRaw || 'Tidak diisi',
        targetValue: step.targetValue,
        unit: step.unit,
        isCorrect,
        weight: step.weight,
        solution: step.solution
      });
    });

    if (stageCorrectSteps === stage.steps.length) {
      sound.correct();
    } else if (stageCorrectSteps > 0) {
      sound.correct();
    } else {
      sound.wrong();
    }

    const currentResult = {
      stageNumber: stage.stage,
      title: stage.title,
      difficulty: stage.difficulty,
      maxPoints: stage.maxPoints,
      earnedPoints: stageEarnedPoints,
      correctSteps: stageCorrectSteps,
      totalSteps: stage.steps.length,
      stepDetails,
      fullSolution: stage.fullSolution
    };

    setStageResults((prev) => [...prev, currentResult]);
    setStageSubmitted(true);
  };

  // Go to next stage or complete
  const handleNextStage = () => {
    sound.click();
    if (currentStageIdx < numberChainStages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
      setInputs({});
      setStageSubmitted(false);
      setShowFormulaHint(false);
    } else {
      // Completed all 5 stages
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setTotalTimeSpent(elapsed);
      setModeCompleted(true);
      sound.fanfare();
    }
  };

  // Total points calculation (exact sum, max 35)
  const totalEarnedPoints = Math.min(
    35,
    Math.round(stageResults.reduce((acc, curr) => acc + curr.earnedPoints, 0) * 10) / 10
  );

  const totalCorrectSteps = stageResults.reduce((acc, curr) => acc + curr.correctSteps, 0);
  const totalPossibleSteps = numberChainStages.reduce((acc, s) => acc + s.steps.length, 0);

  // Save and exit
  const handleSaveAndExit = () => {
    sound.click();
    onFinish({
      score: totalEarnedPoints,
      stats: {
        correctSteps: totalCorrectSteps,
        totalSteps: totalPossibleSteps,
        totalTime: totalTimeSpent,
        history: stageResults
      }
    });
  };

  // Restart mode
  const handleRestart = () => {
    sound.click();
    setCurrentStageIdx(0);
    setInputs({});
    setStageSubmitted(false);
    setStageResults([]);
    setShowFormulaHint(false);
    setModeCompleted(false);
  };

  // ==========================================
  // COMPLETION SUMMARY SCREEN
  // ==========================================
  if (modeCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-thermoOrange to-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl">
            🔢
          </div>

          <span className="px-3 py-1 rounded-full bg-orange-50 text-thermoOrange text-xs font-bold uppercase tracking-wider">
            Hasil Akhir Mode 3
          </span>
          <h2 className="text-3xl font-black text-navy-950 mt-2 mb-1">
            Number Chains Selesai!
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Evaluasi ketelitian perhitungan konversi suhu berantai.
          </p>

          {/* Big Score Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-950 to-deepblue text-white max-w-sm mx-auto mb-8 shadow-glow-orange">
            <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
              Nilai Number Chains
            </span>
            <div className="text-5xl font-black font-mono text-thermoOrange my-1">
              {totalEarnedPoints}
              <span className="text-lg font-normal text-slate-300"> / 35</span>
            </div>
            <div className="text-xs text-slate-300">
              5 Tahapan Tantangan • {totalCorrectSteps} dari {totalPossibleSteps} Langkah Tepat
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Tahap Sukses</span>
              <div className="text-2xl font-black font-mono text-emerald-600">
                {stageResults.filter((r) => r.earnedPoints === r.maxPoints).length} / 5
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Langkah Benar</span>
              <div className="text-2xl font-black font-mono text-deepblue">
                {totalCorrectSteps} / {totalPossibleSteps}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Akurasi Langkah</span>
              <div className="text-2xl font-black font-mono text-thermoOrange">
                {Math.round((totalCorrectSteps / totalPossibleSteps) * 100)}%
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Waktu Hitung</span>
              <div className="text-2xl font-black font-mono text-slate-700">{totalTimeSpent} detik</div>
            </div>
          </div>

          {/* Step by step review per stage */}
          <div className="mb-8 text-left max-w-2xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-deepblue" />
              <span>Pembahasan Langkah Demi Langkah Setiap Tahapan:</span>
            </h3>

            {stageResults.map((res, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold mb-2">
                  <span className="text-navy-950 font-bold text-sm">
                    {res.title}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs ${
                    res.earnedPoints === res.maxPoints
                      ? 'bg-emerald-100 text-emerald-800'
                      : res.earnedPoints > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {res.earnedPoints} / {res.maxPoints} Poin
                  </span>
                </div>

                {/* Steps Details */}
                <div className="space-y-1.5 mb-3">
                  {res.stepDetails.map((st, j) => (
                    <div key={j} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-700">{st.label}: </span>
                        <span className="font-mono font-bold text-slate-900">{st.userValue} {st.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {st.isCorrect ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            +{st.weight} Pts
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            0 Pts (Kunci: {st.targetValue} {st.unit})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Solution derivations */}
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-700">
                  <span className="font-bold text-deepblue block mb-1">Penyelesaian Lengkap:</span>
                  <ul className="space-y-1 font-mono text-[11px]">
                    {res.fullSolution.map((line, k) => (
                      <li key={k}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleSaveAndExit}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Simpan & Kembali ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi Mode Ini</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE STAGE SCREEN
  // ==========================================
  const lastResult = stageSubmitted ? stageResults[stageResults.length - 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.click();
            onBackToDashboard();
          }}
          className="text-xs font-bold text-slate-500 hover:text-navy-950 transition-colors"
        >
          ✕ Batal & Kembali ke Dashboard
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tahap <strong className="text-navy-950 font-mono text-sm">{stage.stage}</strong> / {numberChainStages.length}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${stage.difficultyColor}`}>
            {stage.difficulty}
          </span>
        </div>
      </div>

      {/* Progress Chain Dots */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {numberChainStages.map((s, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          return (
            <div
              key={s.stage}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 ${
                isDone
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : isCurrent
                  ? 'bg-thermoOrange border-thermoOrange-hover text-white ring-4 ring-orange-200'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}
            >
              {isDone ? '✓' : s.stage}
            </div>
          );
        })}
      </div>

      {/* Stage Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-elevated">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-orange-50 text-thermoOrange border border-orange-100">
            Tantangan Konversi #{stage.stage}
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">
            Bobot Maksimal: {stage.maxPoints} Poin
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-navy-950 mb-3">
          {stage.title}
        </h2>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
          {stage.description}
        </p>

        {/* Given Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500">
            Nilai Diketahui: <strong className="text-navy-900 font-mono text-sm">{stage.given}</strong>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Satuan Target: <strong className="text-thermoOrange font-mono text-sm">{stage.targetUnit}</strong>
          </div>
        </div>

        {/* Optional Formula Hint Toggle */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setShowFormulaHint(!showFormulaHint);
            }}
            className="text-xs font-bold text-deepblue hover:text-navy-900 flex items-center gap-1.5 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{showFormulaHint ? 'Sembunyikan Petunjuk Rumus' : 'Tampilkan Petunjuk Rumus Bantuan'}</span>
          </button>

          {showFormulaHint && (
            <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-900 animate-fadeIn">
              💡 Rumus: {stage.formulaHint}
            </div>
          )}
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmitStage} className="space-y-4 mb-6">
          {stage.steps.map((step, idx) => (
            <div key={step.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {step.label}
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  ({step.weight} Poin)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  disabled={stageSubmitted}
                  required
                  placeholder="Ketik angka hasil..."
                  value={inputs[step.id] || ''}
                  onChange={(e) => handleInputChange(step.id, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-thermoOrange ${
                    stageSubmitted
                      ? 'bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-white text-navy-950 border-slate-300'
                  }`}
                />
                <span className="px-4 py-3 rounded-xl bg-slate-200 font-mono font-bold text-sm text-slate-700 shrink-0">
                  {step.unit}
                </span>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          {!stageSubmitted && (
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-thermoOrange hover:bg-thermoOrange-hover text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Periksa & Hitung Skor Tahap Ini</span>
            </button>
          )}
        </form>

        {/* Step-by-Step Solution & Feedback (Shown after submitting) */}
        {stageSubmitted && lastResult && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-fadeIn mb-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500">
                Hasil Pemeriksaan Tahap {stage.stage}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                lastResult.earnedPoints === lastResult.maxPoints
                  ? 'bg-emerald-100 text-emerald-800'
                  : lastResult.earnedPoints > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Diperoleh: {lastResult.earnedPoints} / {lastResult.maxPoints} Poin
              </span>
            </div>

            {/* Individual step results */}
            <div className="space-y-2 mb-4">
              {lastResult.stepDetails.map((st, i) => (
                <div key={i} className="text-xs p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-700">{st.label}: </span>
                    <span className="font-mono font-bold">{st.userValue} {st.unit}</span>
                  </div>
                  <div>
                    {st.isCorrect ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Tepat (+{st.weight} Pts)
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Kurang tepat (Harusnya: {st.targetValue} {st.unit})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Full derivation */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700">
              <strong className="text-deepblue block mb-1.5">Langkah Perhitungan Resmi:</strong>
              <ul className="space-y-1 font-mono text-[11px]">
                {lastResult.fullSolution.map((line, k) => (
                  <li key={k}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Next Stage Button */}
        {stageSubmitted && (
          <button
            onClick={handleNextStage}
            className="w-full py-3.5 px-6 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{currentStageIdx < numberChainStages.length - 1 ? 'Lanjut ke Tahap Berikutnya' : 'Lihat Hasil Akhir Number Chains'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );
}
