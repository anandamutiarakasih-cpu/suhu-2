import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { getPredicate, addLeaderboardEntry } from '../utils/storage';
import { sound } from '../utils/audio';
import CertificateModal from './CertificateModal';
import { 
  Award, Trophy, Clock, CheckCircle2, XCircle, ArrowLeft, 
  RotateCcw, Sparkles, BookOpen, Printer, Star, TrendingUp, AlertCircle 
} from 'lucide-react';

export default function FinalEvaluation({
  player,
  scores,
  onResetAll,
  onBackToDashboard,
  onOpenLeaderboard,
  onOpenMaterial
}) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const starScore = scores.quizScore || 0;
  const memScore = scores.memoryScore || 0;
  const numScore = scores.calcScore || 0;
  const totalScore = Math.min(100, Math.round((starScore + memScore + numScore) * 10) / 10);

  const predicate = getPredicate(totalScore);

  // Aggregated Statistics
  const starCorrect = scores.quizStats?.correct || 0;
  const memCorrect = scores.memoryStats?.correct || 0;
  const calcCorrect = scores.calcStats?.correctSteps || 0;
  const totalCorrect = starCorrect + memCorrect + calcCorrect;

  const totalPossible = 10 + 10 + 6; // 10 quiz + 10 memory + 6 calc steps
  const totalWrong = Math.max(0, totalPossible - totalCorrect);
  const overallAccuracy = Math.round((totalCorrect / totalPossible) * 100);

  const totalTime = 
    (scores.quizStats?.totalTime || 0) + 
    (scores.memoryStats?.totalTime || 0) + 
    (scores.calcStats?.totalTime || 0);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Confetti effect on mount
  useEffect(() => {
    sound.fanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Catch canvas-confetti fallback
    }

    // Record into leaderboard once
    if (!hasRecorded && player?.name) {
      addLeaderboardEntry({
        name: player.name,
        className: player.className,
        score: totalScore,
        predicate: predicate.title,
        date: new Date().toISOString().split('T')[0],
        timeSpent: totalTime
      });
      setHasRecorded(true);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fadeIn">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            sound.click();
            onBackToDashboard();
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.click();
              setShowCertificate(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-thermoOrange hover:from-amber-600 hover:to-thermoOrange-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Piagam Juara</span>
          </button>
        </div>
      </div>

      {/* Hero Result Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl mb-8 text-center relative overflow-hidden">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-deepblue text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Hasil Evaluasi Akhir Kompetisi</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-navy-950 tracking-tight mb-2">
          THERMO <span className="text-deepblue">CHAMPIONS</span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm mb-6">
          Peserta: <strong className="text-navy-900">{player.name}</strong> • Kelas {player.className} 
          {player.studentNumber ? ` • No. Absen ${player.studentNumber}` : ''}
          <span className="block sm:inline sm:ml-2 text-slate-400">({currentDate}, pukul {currentTime} WIB)</span>
        </p>

        {/* Big Final Score Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-deepblue to-navy-900 text-white max-w-lg mx-auto shadow-2xl border border-electric/30 mb-8 relative">
          <div className="absolute top-4 right-4">
            <span className="text-4xl">{predicate.badge}</span>
          </div>

          <span className="text-xs uppercase font-bold text-slate-300 tracking-widest block">
            NILAI AKHIR KUMULATIF
          </span>

          <div className="text-6xl sm:text-7xl font-black font-mono text-electric my-2 flex items-baseline justify-center gap-2">
            <span>{totalScore}</span>
            <span className="text-xl font-normal text-slate-400">/ 100</span>
          </div>

          {/* Predicate Banner */}
          <div className="mt-3 inline-block">
            <span className={`px-4 py-1.5 rounded-full text-sm font-black border ${predicate.bgColor} ${predicate.color}`}>
              {predicate.title}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-sm mx-auto">
            {predicate.description}
          </p>
        </div>

        {/* 3 Modes Score Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
          
          {/* Mode 1 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-800 uppercase">Mode 1: StarChamp</span>
              <span className="text-[11px] font-mono font-semibold text-slate-500">Bobot: 35</span>
            </div>
            <div className="text-2xl font-black font-mono text-deepblue">
              {starScore} <span className="text-xs font-normal text-slate-500">/ 35 Poin</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {starCorrect} dari 10 soal konsep benar
            </p>
          </div>

          {/* Mode 2 */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-sky-800 uppercase">Mode 2: Memory</span>
              <span className="text-[11px] font-mono font-semibold text-slate-500">Bobot: 30</span>
            </div>
            <div className="text-2xl font-black font-mono text-sky-700">
              {memScore} <span className="text-xs font-normal text-slate-500">/ 30 Poin</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {memCorrect} dari 10 tantangan recall tepat
            </p>
          </div>

          {/* Mode 3 */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-thermoOrange uppercase">Mode 3: Chains</span>
              <span className="text-[11px] font-mono font-semibold text-slate-500">Bobot: 35</span>
            </div>
            <div className="text-2xl font-black font-mono text-thermoOrange">
              {numScore} <span className="text-xs font-normal text-slate-500">/ 35 Poin</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {calcCorrect} dari 6 langkah konversi tepat
            </p>
          </div>

        </div>

        {/* Global Statistics Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8 text-left">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Jawaban Tepat</span>
            <div className="text-xl font-black font-mono text-emerald-600">{totalCorrect}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Perlu Evaluasi</span>
            <div className="text-xl font-black font-mono text-red-500">{totalWrong}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Akurasi Keseluruhan</span>
            <div className="text-xl font-black font-mono text-deepblue">{overallAccuracy}%</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Waktu Kompetisi</span>
            <div className="text-xl font-black font-mono text-slate-700">{totalTime} detik</div>
          </div>
        </div>

        {/* Learning Recommendations / Analisis Pembelajaran */}
        <div className="max-w-3xl mx-auto text-left p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-deepblue" />
            <h3 className="font-bold text-navy-950 text-base">
              Rekomendasi Pembelajaran untuk Kelas VII:
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700">
            {totalScore >= 86 ? (
              <p className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed">
                🌟 <strong>Penguasaan Sangat Kuat:</strong> Kamu memiliki pemahaman teoretis yang mantap tentang konsep suhu dan prinsip termometer, serta keterampilan numerik yang presisi dalam konversi berantai. Pertahankan prestasi ini untuk materi sains lanjutan!
              </p>
            ) : totalScore >= 70 ? (
              <p className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 leading-relaxed">
                👍 <strong>Penguasaan Baik:</strong> Dasar pemahaman suhu dan sebagian besar konversi sudah kamu kuasai dengan baik. Cobalah lebih teliti saat mengerjakan konversi bersuhu Fahrenheit yang membutuhkan operasi pengurangan 32 terlebih dahulu sebelum dikalikan faktor perbandingan.
              </p>
            ) : (
              <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                📖 <strong>Area yang Perlu Diperkuat:</strong> Disarankan untuk membuka kembali modul materi suhu, terutama tabel titik tetap skala termometer (Celsius 0-100, Reamur 0-80, Fahrenheit 32-212, Kelvin 273-373) dan perbandingan dasar 5 : 4 : 9 : 5.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.click();
              setShowCertificate(true);
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-thermoOrange hover:from-amber-600 hover:to-thermoOrange-hover text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Award className="w-5 h-5" />
            <span>Buka & Cetak Piagam Prestasi</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenLeaderboard();
            }}
            className="px-5 py-3.5 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Papan Peringkat</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenMaterial();
            }}
            className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-deepblue" />
            <span>Pelajari Ulang Materi</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onResetAll();
            }}
            className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Ulang dari Awal</span>
          </button>
        </div>

      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          player={player}
          totalScore={totalScore}
          predicate={predicate}
          onClose={() => setShowCertificate(false)}
        />
      )}

    </div>
  );
}
