import React, { useState, useEffect, useRef } from 'react';
import { memoryCards, recallQuestions } from '../data/memoryCards';
import { sound } from '../utils/audio';
import { 
  Zap, Clock, CheckCircle2, XCircle, ArrowRight, Eye, EyeOff, 
  RotateCcw, Sparkles, BookOpen, AlertTriangle 
} from 'lucide-react';

export default function MemoryMadness({ onFinish, onBackToDashboard }) {
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'recall' | 'summary'
  const [memorizeTimeLeft, setMemorizeTimeLeft] = useState(30);
  const [recallIndex, setRecallIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRecallAnswered, setIsRecallAnswered] = useState(false);
  const [recallTimeLeft, setRecallTimeLeft] = useState(25);
  const [history, setHistory] = useState([]);
  const [totalMemorizeSpent, setTotalMemorizeSpent] = useState(0);
  const [totalRecallSpent, setTotalRecallSpent] = useState(0);
  const [recallStartTime, setRecallStartTime] = useState(0);

  const memTimerRef = useRef(null);
  const recallTimerRef = useRef(null);

  // Memorize Countdown (Phase 1)
  useEffect(() => {
    if (phase !== 'memorize') return;

    memTimerRef.current = setInterval(() => {
      setMemorizeTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(memTimerRef.current);
          startRecallPhase(30);
          return 0;
        }
        if (prev === 6) {
          sound.tick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(memTimerRef.current);
  }, [phase]);

  // Start Recall Phase
  const startRecallPhase = (timeSpent) => {
    sound.fanfare();
    setTotalMemorizeSpent(timeSpent);
    setPhase('recall');
    setRecallStartTime(Date.now());
    setRecallIndex(0);
    setRecallTimeLeft(25);
    setIsRecallAnswered(false);
    setSelectedAnswer(null);
  };

  // Skip memorization early
  const handleReadyEarly = () => {
    sound.click();
    clearInterval(memTimerRef.current);
    const timeSpent = 30 - memorizeTimeLeft;
    startRecallPhase(timeSpent);
  };

  // Current Recall Question
  const currentRecall = recallQuestions[recallIndex];

  // Recall Countdown (Phase 2)
  useEffect(() => {
    if (phase !== 'recall' || isRecallAnswered) return;

    recallTimerRef.current = setInterval(() => {
      setRecallTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(recallTimerRef.current);
          handleRecallTimeout();
          return 0;
        }
        if (prev === 5) {
          sound.tick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(recallTimerRef.current);
  }, [phase, recallIndex, isRecallAnswered]);

  // Handle Recall Timeout
  const handleRecallTimeout = () => {
    sound.wrong();
    setIsRecallAnswered(true);
    setSelectedAnswer('TIMEOUT');

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentRecall.id,
        cardId: currentRecall.cardId,
        prompt: currentRecall.prompt,
        selected: null,
        correctAnswer: currentRecall.correctAnswer,
        isCorrect: false,
        explanation: currentRecall.explanation,
        timeTaken: 25,
        isTimeout: true
      }
    ]);
  };

  // Handle Recall Answer Select
  const handleSelectRecallAnswer = (option) => {
    if (isRecallAnswered) return;
    clearInterval(recallTimerRef.current);

    const isCorrect = option === currentRecall.correctAnswer;
    if (isCorrect) {
      sound.correct();
    } else {
      sound.wrong();
    }

    setSelectedAnswer(option);
    setIsRecallAnswered(true);

    const timeSpent = 25 - recallTimeLeft;

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentRecall.id,
        cardId: currentRecall.cardId,
        prompt: currentRecall.prompt,
        selected: option,
        correctAnswer: currentRecall.correctAnswer,
        isCorrect,
        explanation: currentRecall.explanation,
        timeTaken: timeSpent,
        isTimeout: false
      }
    ]);
  };

  // Next Recall Question or Finish
  const handleNextRecall = () => {
    sound.click();
    if (recallIndex < recallQuestions.length - 1) {
      setRecallIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsRecallAnswered(false);
      setRecallTimeLeft(25);
    } else {
      // Completed all 10 recall challenges
      const elapsedRecall = Math.round((Date.now() - recallStartTime) / 1000);
      setTotalRecallSpent(elapsedRecall);
      setPhase('summary');
      sound.fanfare();
    }
  };

  // Calculate results
  const correctCount = history.filter((h) => h.isCorrect).length;
  const wrongCount = recallQuestions.length - correctCount;
  // 3 points per correct question, max 30 points
  const score = Math.min(30, correctCount * 3);
  const accuracy = Math.round((correctCount / recallQuestions.length) * 100);

  // Missed cards that need review
  const missedCardIds = new Set(history.filter((h) => !h.isCorrect).map((h) => h.cardId));
  const cardsToReview = memoryCards.filter((c) => missedCardIds.has(c.id));

  // Save and exit
  const handleSaveAndExit = () => {
    sound.click();
    onFinish({
      score,
      stats: {
        correct: correctCount,
        wrong: wrongCount,
        accuracy,
        totalTime: totalMemorizeSpent + totalRecallSpent,
        remembered: correctCount,
        reviewCards: cardsToReview
      }
    });
  };

  // Restart
  const handleRestart = () => {
    sound.click();
    setPhase('memorize');
    setMemorizeTimeLeft(30);
    setRecallIndex(0);
    setSelectedAnswer(null);
    setIsRecallAnswered(false);
    setRecallTimeLeft(25);
    setHistory([]);
  };

  // ==========================================
  // PHASE 1: MEMORIZATION SCREEN
  // ==========================================
  if (phase === 'memorize') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <button
              onClick={() => {
                sound.click();
                onBackToDashboard();
              }}
              className="text-xs font-bold text-slate-500 hover:text-navy-950 mb-1 transition-colors"
            >
              ✕ Batal & Kembali ke Dashboard
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                FASE 1: MEMORIZATION
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Bobot: 30 Poin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 mt-1">
              Hafalkan 10 Kartu Fakta Suhu
            </h1>
          </div>

          {/* Countdown & Ready Button */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-2xl border-2 flex items-center gap-2 font-mono font-bold text-sm ${
              memorizeTimeLeft <= 5
                ? 'bg-red-500 text-white border-red-600 animate-pulse-fast'
                : 'bg-white text-navy-950 border-sky-300 shadow-sm'
            }`}>
              <Clock className={`w-4 h-4 ${memorizeTimeLeft <= 5 ? 'text-white' : 'text-sky-600'}`} />
              <span>{memorizeTimeLeft} Detik Tersisa</span>
            </div>

            <button
              onClick={handleReadyEarly}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-deepblue to-blue-600 hover:from-navy-900 hover:to-deepblue text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Eye className="w-4 h-4 text-electric" />
              <span>Saya Siap Uji Ingatan!</span>
            </button>
          </div>
        </div>

        {/* 30-Second Progress Line */}
        <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-deepblue rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(memorizeTimeLeft / 30) * 100}%` }}
          ></div>
        </div>

        {/* 10 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          {memoryCards.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Kartu #{card.id}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {card.category}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-700 mb-2">
                  {card.title}
                </h3>
              </div>

              {/* Big Highlight Value */}
              <div className="my-2 p-2.5 rounded-xl bg-gradient-to-tr from-slate-50 to-blue-50 border border-blue-100 text-center">
                <span className="text-lg sm:text-xl font-black font-mono text-deepblue tracking-tight block">
                  {card.keyFact}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                {card.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs text-center font-medium">
          💡 <strong>Tips Memori:</strong> Perhatikan pasangan titik tetap bawah (0°C, 32°F, 0°R, 273 K) dan titik tetap atas (100°C, 212°F, 80°R, 373 K).
        </div>

      </div>
    );
  }

  // ==========================================
  // PHASE 2: RECALL SCREEN
  // ==========================================
  if (phase === 'recall') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              FASE 2: RECALL (UJI INGATAN)
            </div>
            <div className="text-sm font-black text-navy-950">
              Pertanyaan <span className="font-mono text-deepblue text-base">{recallIndex + 1}</span> / {recallQuestions.length}
            </div>
          </div>

          {/* 25-Second Per-Question Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs border ${
            recallTimeLeft <= 5
              ? 'bg-red-500 text-white border-red-600 animate-pulse-fast'
              : 'bg-white text-slate-700 border-slate-200'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${recallTimeLeft <= 5 ? 'text-white' : 'text-sky-600'}`} />
            <span>{recallTimeLeft}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((recallIndex + 1) / recallQuestions.length) * 100}%` }}
          ></div>
        </div>

        {/* Recall Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-elevated">
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100 flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Tantangan Ingatan #Kartu {currentRecall.cardId}</span>
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">
              3 Poin
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-navy-950 mb-6 leading-snug">
            {currentRecall.prompt}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentRecall.options.map((opt, idx) => {
              let optStyle = 'bg-slate-50/70 hover:bg-sky-50/50 border-slate-200 text-slate-800';

              if (isRecallAnswered) {
                if (opt === currentRecall.correctAnswer) {
                  optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300';
                } else if (selectedAnswer === opt) {
                  optStyle = 'bg-red-50 border-red-400 text-red-900 ring-2 ring-red-300';
                } else {
                  optStyle = 'bg-slate-50/40 border-slate-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isRecallAnswered}
                  onClick={() => handleSelectRecallAnswer(opt)}
                  className={`w-full text-left p-4 rounded-2xl border-2 font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${optStyle}`}
                >
                  <span>{opt}</span>
                  {isRecallAnswered && opt === currentRecall.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isRecallAnswered && selectedAnswer === opt && opt !== currentRecall.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isRecallAnswered && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 animate-fadeIn">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold">
                {selectedAnswer === currentRecall.correctAnswer ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ingatan Tepat! (+3 Poin)</span>
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Belum Tepat (0 Poin)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">{currentRecall.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isRecallAnswered && (
            <button
              onClick={handleNextRecall}
              className="w-full py-3.5 px-6 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{recallIndex < recallQuestions.length - 1 ? 'Lanjut ke Tantangan Berikutnya' : 'Lihat Hasil Memory Madness'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    );
  }

  // ==========================================
  // PHASE 3: SUMMARY SCREEN
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-900 to-sky-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl">
          🧠
        </div>

        <span className="px-3 py-1 rounded-full bg-sky-50 text-navy-900 text-xs font-bold uppercase tracking-wider">
          Hasil Akhir Mode 2
        </span>
        <h2 className="text-3xl font-black text-navy-950 mt-2 mb-1">
          Memory Madness Selesai!
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Evaluasi kemampuan mengingat data titik tetap dan informasi termometer.
        </p>

        {/* Big Score Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-950 to-deepblue text-white max-w-sm mx-auto mb-8 shadow-glow-electric">
          <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
            Nilai Thermo Memory
          </span>
          <div className="text-5xl font-black font-mono text-electric my-1">
            {score}
            <span className="text-lg font-normal text-slate-300"> / 30</span>
          </div>
          <div className="text-xs text-slate-300">
            Setiap jawaban recall benar = 3 Poin • Akurasi {accuracy}%
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-left">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Informasi Diingat</span>
            <div className="text-2xl font-black font-mono text-emerald-600">{correctCount} / 10</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Salah / Lupa</span>
            <div className="text-2xl font-black font-mono text-red-500">{wrongCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Akurasi</span>
            <div className="text-2xl font-black font-mono text-deepblue">{accuracy}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Waktu Hafal & Jawab</span>
            <div className="text-2xl font-black font-mono text-slate-700">{totalMemorizeSpent + totalRecallSpent}s</div>
          </div>
        </div>

        {/* Cards to Review */}
        {cardsToReview.length > 0 ? (
          <div className="mb-8 text-left max-w-2xl mx-auto">
            <h3 className="text-base font-bold text-navy-950 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Informasi Kartu yang Perlu Diingat Kembali ({cardsToReview.length} Kartu):</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {cardsToReview.map((card) => (
                <div key={card.id} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-800 mb-1">
                    <span>{card.title}</span>
                    <span className="font-mono text-deepblue bg-white px-2 py-0.5 rounded border border-amber-200">
                      {card.keyFact}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold max-w-md mx-auto">
            🎉 Daya ingat luar biasa! Semua 10 informasi berhasil diingat dengan sempurna!
          </div>
        )}

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
