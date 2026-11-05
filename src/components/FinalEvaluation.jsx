import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { getPredicate, savePlayerRecord, getGroupRecap } from '../utils/storage';
import { sound } from '../utils/audio';
import CertificateModal from './CertificateModal';
import { 
  Award, Trophy, Clock, CheckCircle2, XCircle, ArrowLeft, 
  RotateCcw, Sparkles, BookOpen, Printer, Star, TrendingUp, Users, ArrowRight 
} from 'lucide-react';

export default function FinalEvaluation({
  player,
  onResetAll,
  onBackToDashboard,
  onOpenLeaderboard,
  onOpenMaterial
}) {
  const [showCertificate, setShowCertificate] = useState(false);

  const starScore = Number(player.skorStarChamp) || 0;
  const memScore = Number(player.skorMemoryMadness) || 0;
  const numScore = Number(player.skorNumberChains) || 0;
  const totalScore = Math.min(100, Math.round((starScore + memScore + numScore) * 10) / 10);
  const predicate = getPredicate(totalScore);

  // Group recap for this player's group
  const groupRecaps = getGroupRecap();
  const playerGroupInfo = groupRecaps.find((g) => g.groupName === player.kelompok);

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

  // Confetti on mount and ensure player record is saved as completed
  useEffect(() => {
    sound.fanfare();
    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }

    // Save/update player state as completed
    const updatedPlayer = {
      ...player,
      nilaiAkhir: totalScore,
      predikat: predicate.title,
      completed: true,
      tanggalPermainan: player.tanggalPermainan || new Date().toISOString()
    };
    savePlayerRecord(updatedPlayer);
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
            <span>Lihat Piagam Prestasi</span>
          </button>
        </div>
      </div>

      {/* Main Results Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl mb-8 text-center relative overflow-hidden">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-deepblue text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Laporan Resmi Hasil Evaluasi</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-navy-950 tracking-tight mb-2">
          THERMO <span className="text-deepblue">CHAMPIONS</span>
        </h1>

        {/* 1. Identity Display: Nama, Nomor Absen, Kelompok */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-xl mx-auto mb-8 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Pemain</span>
              <strong className="text-navy-950 text-sm font-bold truncate block">{player.nama}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Absen</span>
              <strong className="text-navy-950 text-sm font-mono font-bold block">No. {player.nomorAbsen}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kelompok</span>
              <strong className="text-deepblue text-sm font-bold flex items-center gap-1">
                <span>{player.badge || '🌡️'}</span>
                <span>{player.kelompok}</span>
              </strong>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
            <span>Selesai: {currentDate}, {currentTime} WIB</span>
            <span className="font-semibold text-deepblue">Status: Terverifikasi</span>
          </div>
        </div>

        {/* 2. Big Final Cumulative Score Card */}
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

        {/* 3. Breakdown Nilai 3 Mode: StarChamp, Memory Madness, Number Chains */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
          
          {/* Mode 1 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-800 uppercase">StarChamp Challenge</span>
              <span className="text-[10px] font-mono font-semibold text-slate-500">Maks. 35</span>
            </div>
            <div className="text-2xl font-black font-mono text-deepblue">
              {starScore} <span className="text-xs font-normal text-slate-500">/ 35</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {player.stats?.quiz?.correct || Math.round(starScore / 3.5)} dari 10 soal konsep benar
            </p>
          </div>

          {/* Mode 2 */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-sky-800 uppercase">Memory Madness</span>
              <span className="text-[10px] font-mono font-semibold text-slate-500">Maks. 30</span>
            </div>
            <div className="text-2xl font-black font-mono text-sky-700">
              {memScore} <span className="text-xs font-normal text-slate-500">/ 30</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {player.stats?.memory?.correct || Math.round(memScore / 3)} dari 10 fakta ingatan tepat
            </p>
          </div>

          {/* Mode 3 */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-thermoOrange uppercase">Number Chains</span>
              <span className="text-[10px] font-mono font-semibold text-slate-500">Maks. 35</span>
            </div>
            <div className="text-2xl font-black font-mono text-thermoOrange">
              {numScore} <span className="text-xs font-normal text-slate-500">/ 35</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {player.stats?.calc?.correctSteps || 'Selesai'} langkah perhitungan tepat
            </p>
          </div>

        </div>

        {/* 4. Rekap Dampak ke Nilai Kelompok */}
        {playerGroupInfo && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border border-blue-200 max-w-3xl mx-auto mb-8 text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-deepblue" />
                <h4 className="font-bold text-navy-950 text-sm">
                  Kontribusi Nilai ke {player.kelompok}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-deepblue bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                Peringkat #{groupRecaps.findIndex(g => g.groupName === player.kelompok) + 1}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Nilai akhirmu sebesar <strong>{totalScore} poin</strong> telah berhasil masuk ke dalam rekapitulasi rata-rata kelompok.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-center">
              <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Anggota Selesai</span>
                <span className="font-mono font-black text-navy-950 text-base">{playerGroupInfo.completedCount} Siswa</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Nilai Kelompok</span>
                <span className="font-mono font-black text-navy-950 text-base">{playerGroupInfo.totalScore} Pts</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-blue-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Rata-Rata Kelompok</span>
                <span className="font-mono font-black text-electric text-base">{playerGroupInfo.averageScore || totalScore} Pts</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.click();
              setShowCertificate(true);
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-thermoOrange hover:from-amber-600 hover:to-thermoOrange-hover text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Award className="w-5 h-5" />
            <span>Cetak Piagam Prestasi</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenLeaderboard();
            }}
            className="px-5 py-3.5 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Lihat Leaderboard (Individu & Kelompok)</span>
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
            <span>Main Ulang 3 Mode</span>
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
