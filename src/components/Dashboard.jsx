import React from 'react';
import { 
  Trophy, BookOpen, HelpCircle, Brain, Zap, Hash, CheckCircle2, 
  ArrowRight, RotateCcw, Award, Sparkles, AlertCircle, PlayCircle, Users 
} from 'lucide-react';
import { getPredicate } from '../utils/storage';
import { sound } from '../utils/audio';

export default function Dashboard({
  player,
  scores,
  onStartMode,
  onViewEvaluation,
  onOpenMaterial,
  onOpenLeaderboard,
  onOpenHelp,
  onEditProfile,
  onOpenTeamsRoster
}) {
  const totalScore = Math.round((scores.quizScore + scores.memoryScore + scores.calcScore) * 10) / 10;
  const predicate = getPredicate(totalScore);

  const completedCount = 
    (scores.quizCompleted ? 1 : 0) + 
    (scores.memoryCompleted ? 1 : 0) + 
    (scores.calcCompleted ? 1 : 0);

  const allCompleted = completedCount === 3;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-950 via-deepblue to-navy-900 p-6 sm:p-10 text-white shadow-xl border border-electric/20 mb-8">
        {/* Glow circle */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-electric/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-electric text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {player.isTeam ? `Kompetisi Antar-Kelompok (8 Tim • 32 Siswa)` : `Dashboard Kompetisi`}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              {player.isTeam && (
                <span className="text-3xl sm:text-4xl">{player.badge || '🌡️'}</span>
              )}
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {player.isTeam ? (
                  <span>
                    {player.groupName} — <span className="text-electric">{player.teamName}</span>
                  </span>
                ) : (
                  <span>
                    Selamat Bertanding, <span className="text-electric">{player.name}</span>!
                  </span>
                )}
              </h1>
            </div>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Kelas {player.className} {player.studentNumber ? `• ${player.studentNumber}` : ''}
              {player.motto && <span className="block text-amber-300 italic text-xs mt-1">"{player.motto}"</span>}
            </p>

            {/* If Team Mode: Show 4 Members Chips */}
            {player.isTeam && player.members && (
              <div className="mt-4 flex flex-wrap gap-2">
                {player.members.map((m, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] backdrop-blur-sm">
                    <span className="text-slate-300 text-[10px] block">{m.role}:</span>
                    <strong className="text-white">{m.name}</strong> <span className="text-electric font-mono">({m.absentNo})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Player Score & Predicate Widget */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between bg-white/10 p-4 sm:p-5 rounded-2xl border border-white/15 backdrop-blur-md min-w-[200px] shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                Total Nilai {player.isTeam ? 'Tim' : 'Saat Ini'}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white flex items-baseline sm:justify-end gap-1">
                <span>{totalScore}</span>
                <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="mt-2 text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${predicate.bgColor} ${predicate.color}`}>
                <span>{predicate.badge}</span>
                <span>{predicate.title}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar towards completion */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>Progress Tantangan:</span>
              <strong className="text-electric">{completedCount} dari 3 Mode Diselesaikan</strong>
            </span>
            <span className="text-slate-400 font-mono">
              {Math.round((completedCount / 3) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-electric to-thermoOrange rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Completion Banner (When all 3 modes done) */}
      {allCompleted && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulseGlow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
              🏆
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-navy-950">
                Luar Biasa! Seluruh Rangkaian 3 Mode Berhasil Diselesaikan!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Nilai Akhir: <strong className="text-navy-950 font-mono">{totalScore}/100</strong> dengan predikat <strong className="text-amber-600">{predicate.title}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.fanfare();
              onViewEvaluation();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-950 hover:bg-deepblue text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <span>Lihat Evaluasi & Piagam Juara</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
          <span>Pilih Arena Tantangan</span>
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTeamsRoster && (
            <button
              onClick={() => {
                sound.click();
                onOpenTeamsRoster();
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-deepblue text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Users className="w-4 h-4 text-deepblue" />
              <span>Matriks 8 Kelompok (32 Siswa)</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.click();
              onOpenMaterial();
            }}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <BookOpen className="w-4 h-4 text-deepblue" />
            <span>Materi Suhu</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenHelp();
            }}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-electric" />
            <span>Petunjuk</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenLeaderboard();
            }}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Peringkat</span>
          </button>
        </div>
      </div>

      {/* 3 Game Mode Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        
        {/* CARD 1: StarChamp Challenge */}
        <div className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
          scores.quizCompleted 
            ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' 
            : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-lg'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-deepblue to-blue-600 text-white flex items-center justify-center shadow-md">
                <Brain className="w-6 h-6 text-electric" />
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bobot</span>
                <span className="text-sm font-black font-mono text-deepblue">35 POIN</span>
              </div>
            </div>

            <div className="text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
              Mode 1 — StarChamp Challenge
            </div>
            <h3 className="text-2xl font-black text-navy-950 mb-2">THERMO QUIZ</h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              Tantangan 10 soal pemahaman konsep suhu, jenis termometer klinis/laboratorium, dan prinsip kesetimbangan termal dengan timer 30 detik per soal.
            </p>
          </div>

          <div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Status:</span>
              {scores.quizCompleted ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Selesai ({scores.quizScore}/35 Pts)
                </span>
              ) : (
                <span className="font-bold text-slate-500">Belum Dimainkan</span>
              )}
            </div>

            <button
              onClick={() => {
                sound.click();
                onStartMode('quiz');
              }}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                scores.quizCompleted
                  ? 'bg-blue-50 text-deepblue hover:bg-blue-100 border border-blue-200'
                  : 'bg-deepblue hover:bg-navy-950 text-white shadow-md'
              }`}
            >
              {scores.quizCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Main Ulang Mode 1</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Mulai StarChamp Quiz</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD 2: Memory Madness */}
        <div className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
          scores.memoryCompleted 
            ? 'bg-white border-sky-200 shadow-md ring-1 ring-sky-100' 
            : 'bg-white border-slate-200 hover:border-sky-400 shadow-sm hover:shadow-lg'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-navy-900 to-sky-700 text-white flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bobot</span>
                <span className="text-sm font-black font-mono text-sky-700">30 POIN</span>
              </div>
            </div>

            <div className="text-xs font-extrabold text-sky-600 uppercase tracking-wider mb-1">
              Mode 2 — Memory Madness
            </div>
            <h3 className="text-2xl font-black text-navy-950 mb-2">THERMO MEMORY</h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              Dua fase seru: Hafalkan 10 kartu titik tetap skala termometer dalam 30 detik (Fase Memorization), lalu jawab 10 pertanyaan ingatan cepat (Fase Recall).
            </p>
          </div>

          <div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Status:</span>
              {scores.memoryCompleted ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Selesai ({scores.memoryScore}/30 Pts)
                </span>
              ) : (
                <span className="font-bold text-slate-500">Belum Dimainkan</span>
              )}
            </div>

            <button
              onClick={() => {
                sound.click();
                onStartMode('memory');
              }}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                scores.memoryCompleted
                  ? 'bg-sky-50 text-navy-900 hover:bg-sky-100 border border-sky-200'
                  : 'bg-navy-900 hover:bg-navy-950 text-white shadow-md'
              }`}
            >
              {scores.memoryCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Main Ulang Mode 2</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Mulai Memory Madness</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD 3: Number Chains */}
        <div className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
          scores.calcCompleted 
            ? 'bg-white border-orange-200 shadow-md ring-1 ring-orange-100' 
            : 'bg-white border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-lg'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-thermoOrange to-amber-500 text-white flex items-center justify-center shadow-md">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bobot</span>
                <span className="text-sm font-black font-mono text-thermoOrange">35 POIN</span>
              </div>
            </div>

            <div className="text-xs font-extrabold text-orange-600 uppercase tracking-wider mb-1">
              Mode 3 — Number Chains
            </div>
            <h3 className="text-2xl font-black text-navy-950 mb-2">THERMO CALCULATION</h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              Tantangan 5 tahapan konversi suhu berurutan dengan kenaikan tingkat kesulitan dari Celsius ke F/R/K hingga rantai bertingkat (Reamur ke Celsius lalu ke Fahrenheit).
            </p>
          </div>

          <div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Status:</span>
              {scores.calcCompleted ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Selesai ({scores.calcScore}/35 Pts)
                </span>
              ) : (
                <span className="font-bold text-slate-500">Belum Dimainkan</span>
              )}
            </div>

            <button
              onClick={() => {
                sound.click();
                onStartMode('calc');
              }}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                scores.calcCompleted
                  ? 'bg-orange-50 text-thermoOrange-hover hover:bg-orange-100 border border-orange-200'
                  : 'bg-thermoOrange hover:bg-thermoOrange-hover text-white shadow-md'
              }`}
            >
              {scores.calcCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Main Ulang Mode 3</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Mulai Number Chains</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
