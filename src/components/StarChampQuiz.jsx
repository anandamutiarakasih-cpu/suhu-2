import React, { useState, useEffect, useRef } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { sound } from '../utils/audio';
import { 
  Clock, CheckCircle2, XCircle, ArrowRight, Brain, RotateCcw, 
  HelpCircle, Sparkles, Award, AlertTriangle 
} from 'lucide-react';

export default function StarChampQuiz({ onFinish, onBackToDashboard }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [history, setHistory] = useState([]);
  const [modeCompleted, setModeCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const timerRef = useRef(null);
  const currentQ = quizQuestions[currentIndex];

  // Timer effect
  useEffect(() => {
    if (isAnswered || modeCompleted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev === 6) {
          sound.tick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isAnswered, modeCompleted]);

  // Handle timeout
  const handleTimeOut = () => {
    sound.wrong();
    setIsAnswered(true);
    setSelectedOption('TIMEOUT');
    
    setHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        question: currentQ.question,
        selected: null,
        correctAnswer: currentQ.correctAnswer,
        isCorrect: false,
        timeTaken: 30,
        explanation: currentQ.explanation,
        topic: currentQ.topic,
        isTimeout: true
      }
    ]);
  };

  // Handle user picking an answer
  const handleSelectOption = (key) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);

    const isCorrect = key === currentQ.correctAnswer;
    if (isCorrect) {
      sound.correct();
    } else {
      sound.wrong();
    }

    setSelectedOption(key);
    setIsAnswered(true);

    const timeSpentOnQuestion = 30 - timeLeft;

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        question: currentQ.question,
        selected: key,
        correctAnswer: currentQ.correctAnswer,
        isCorrect,
        timeTaken: timeSpentOnQuestion,
        explanation: currentQ.explanation,
        topic: currentQ.topic,
        isTimeout: false
      }
    ]);
  };

  // Proceed to next question or end mode
  const handleNext = () => {
    sound.click();
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      // Completed all 10 questions
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setTotalTimeSpent(elapsed);
      setModeCompleted(true);
      sound.fanfare();
    }
  };

  // Calculate results
  const correctCount = history.filter((h) => h.isCorrect).length;
  const wrongCount = quizQuestions.length - correctCount;
  // 3.5 points per correct answer, rounded strictly to 1 decimal place, max 35
  const score = Math.min(35, Math.round(correctCount * 3.5 * 10) / 10);
  const accuracy = Math.round((correctCount / quizQuestions.length) * 100);

  // When player clicks "Selesai & Simpan Skor"
  const handleSaveAndExit = () => {
    sound.click();
    onFinish({
      score,
      stats: {
        correct: correctCount,
        wrong: wrongCount,
        accuracy,
        totalTime: totalTimeSpent,
        history
      }
    });
  };

  // Restart mode
  const handleRestart = () => {
    sound.click();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setHistory([]);
    setModeCompleted(false);
  };

  // Render Completion Summary Screen
  if (modeCompleted) {
    const wrongAnswers = history.filter((h) => !h.isCorrect);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center">
          
          {/* Header Trophy */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-deepblue to-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl">
            🏆
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 text-deepblue text-xs font-bold uppercase tracking-wider">
            Hasil Akhir Mode 1
          </span>
          <h2 className="text-3xl font-black text-navy-950 mt-2 mb-1">
            StarChamp Challenge Selesai!
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Berikut ringkasan performa dan akurasi jawabanmu pada THERMO QUIZ.
          </p>

          {/* Big Score Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-950 to-deepblue text-white max-w-sm mx-auto mb-8 shadow-glow-electric">
            <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
              Nilai StarChamp
            </span>
            <div className="text-5xl font-black font-mono text-electric my-1">
              {score}
              <span className="text-lg font-normal text-slate-300"> / 35</span>
            </div>
            <div className="text-xs text-slate-300">
              Setiap soal bernilai 3,5 Poin • Akurasi {accuracy}%
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Jawaban Benar</span>
              <div className="text-2xl font-black font-mono text-emerald-600">{correctCount}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Jawaban Salah</span>
              <div className="text-2xl font-black font-mono text-red-500">{wrongCount}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Akurasi</span>
              <div className="text-2xl font-black font-mono text-deepblue">{accuracy}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Waktu</span>
              <div className="text-2xl font-black font-mono text-slate-700">{totalTimeSpent} detik</div>
            </div>
          </div>

          {/* Review of wrong questions (Pembahasan soal salah) */}
          {wrongAnswers.length > 0 ? (
            <div className="mb-8 text-left max-w-2xl mx-auto">
              <h3 className="text-base font-bold text-navy-950 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Pembahasan Soal yang Perlu Dipelajari Kembali ({wrongAnswers.length} Soal):</span>
              </h3>
              <div className="space-y-3">
                {wrongAnswers.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-xs text-slate-700">
                    <div className="flex items-center justify-between font-bold text-red-700 mb-1">
                      <span>Soal #{item.questionId}: {item.topic}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-100">
                        {item.isTimeout ? 'Waktu Habis' : `Jawabanmu: ${item.selected}`}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 mb-2">{item.question}</p>
                    <div className="p-2.5 rounded-lg bg-white border border-red-200 text-slate-700">
                      <strong className="text-emerald-700">Kunci Jawaban: {item.correctAnswer}</strong>
                      <p className="mt-1 text-slate-600">{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold max-w-md mx-auto">
              🎉 Sempurna! Kamu menjawab semua 10 soal dengan benar!
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

  // Active Question Screen (1 question per screen)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
      
      {/* Top Bar: Progress, Timer, Back */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.click();
            onBackToDashboard();
          }}
          className="text-xs font-bold text-slate-500 hover:text-navy-950 transition-colors"
        >
          ✕ Keluar ke Dashboard
        </button>

        <div className="flex items-center gap-4">
          {/* Question counter */}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Soal <strong className="text-navy-950 font-mono text-sm">{currentIndex + 1}</strong> / {quizQuestions.length}
          </span>

          {/* 30-Second Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs border ${
            timeLeft <= 5 
              ? 'bg-red-500 text-white border-red-600 animate-pulse-fast' 
              : 'bg-white text-slate-700 border-slate-200'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-white' : 'text-deepblue'}`} />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-deepblue to-electric rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-elevated">
        
        {/* Topic Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-deepblue border border-blue-100">
            {currentQ.topic}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">
            Bobot: 3,5 Poin
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-navy-950 mb-6 leading-snug">
          {currentQ.question}
        </h2>

        {/* 4 Options Grid */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((opt) => {
            let optionStyle = 'bg-slate-50/70 hover:bg-blue-50/50 border-slate-200 text-slate-800';

            if (isAnswered) {
              if (opt.key === currentQ.correctAnswer) {
                optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300';
              } else if (selectedOption === opt.key) {
                optionStyle = 'bg-red-50 border-red-400 text-red-900 ring-2 ring-red-300';
              } else {
                optionStyle = 'bg-slate-50/40 border-slate-100 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={opt.key}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt.key)}
                className={`w-full text-left p-4 rounded-2xl border-2 font-semibold text-xs sm:text-sm transition-all flex items-start gap-3.5 ${optionStyle}`}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isAnswered && opt.key === currentQ.correctAnswer
                    ? 'bg-emerald-600 text-white'
                    : isAnswered && selectedOption === opt.key
                    ? 'bg-red-500 text-white'
                    : 'bg-white border border-slate-200 text-navy-900'
                }`}>
                  {opt.key}
                </span>
                <span className="mt-0.5 leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Discussion Box (Appears after answer or timeout) */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-fadeIn mb-6">
            <div className="flex items-center gap-2 mb-1.5 font-bold text-xs">
              {selectedOption === currentQ.correctAnswer ? (
                <div className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Jawaban Tepat! (+3,5 Poin)</span>
                </div>
              ) : selectedOption === 'TIMEOUT' ? (
                <div className="text-red-600 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>Waktu Habis! (0 Poin)</span>
                </div>
              ) : (
                <div className="text-red-600 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Jawaban Kurang Tepat (0 Poin)</span>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-navy-950">Pembahasan: </strong>
              {currentQ.explanation}
            </div>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{currentIndex < quizQuestions.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil StarChamp'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );
}
