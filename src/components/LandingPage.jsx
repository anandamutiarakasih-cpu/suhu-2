import React from 'react';
import { Flame, Sparkles, BookOpen, Brain, Zap, Hash, Award, ArrowRight, ShieldCheck, Thermometer } from 'lucide-react';
import { sound } from '../utils/audio';

export default function LandingPage({ onStart, onLearn, player }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-deepblue/20 via-electric/5 to-transparent pointer-events-none -z-10 blur-3xl"></div>

      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        
        {/* Academic Game Show Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900 border border-electric/30 text-electric text-xs sm:text-sm font-bold shadow-glow-electric mb-8 animate-bounce-gentle">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>KOMPETISI AKADEMIK IPA KELAS VII SMP</span>
          <span className="w-1.5 h-1.5 rounded-full bg-electric"></span>
          <span className="text-white">EDISI SUHU</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-navy-950 tracking-tight leading-[1.1] mb-6">
          THERMO <span className="bg-gradient-to-r from-deepblue via-blue-600 to-electric bg-clip-text text-transparent">CHAMPIONS</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl font-bold text-slate-700 tracking-wide mb-4">
          "Master the Temperature. Become the Champion."
        </p>

        {/* Short Description */}
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Uji ketajaman pemahaman konsep, daya ingat skala termometer, dan keahlian konversi suhu dalam 
          tiga arena tantangan sains berstandar juara. Siapkah kamu meraih gelar <strong className="text-navy-900">Thermo Champion</strong>?
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => {
              sound.click();
              onStart();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-thermoOrange to-amber-500 hover:from-thermoOrange-hover hover:to-amber-600 text-white font-extrabold text-base shadow-glow-orange hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <span>Mulai Bermain</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              sound.click();
              onLearn();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-navy-900 border-2 border-slate-200 hover:border-deepblue/30 font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-deepblue" />
            <span>Pelajari Materi</span>
          </button>
        </div>

        {/* Core Rules & Points Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto text-left bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-16">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">Mata Pelajaran</div>
            <div className="text-sm font-bold text-navy-900">IPA Kelas VII SMP</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">Fokus Materi</div>
            <div className="text-sm font-bold text-navy-900">Konsep & Skala Suhu</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">Total Skor</div>
            <div className="text-sm font-bold text-electric">Maksimal 100 Poin</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">Gelar Tertinggi</div>
            <div className="text-sm font-bold text-amber-500 flex items-center gap-1">
              <span>Thermo Champion</span>
            </div>
          </div>
        </div>

      </section>

      {/* 3 Modes Presentation Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-deepblue mb-2">
              Arena Tantangan
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-navy-950">
              Tiga Mode Permainan Menuju Juara
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Setiap mode menguji aspek kompetensi yang berbeda dengan bobot penilaian terstandarisasi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Mode 1 Card */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-b from-blue-50/50 to-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-deepblue text-white flex items-center justify-center shadow-md">
                    <Brain className="w-6 h-6 text-electric" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-deepblue text-xs font-black">
                    35 POIN
                  </span>
                </div>
                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Mode 1 — StarChamp Challenge
                </div>
                <h3 className="text-xl font-bold text-navy-950 mb-2">THERMO QUIZ</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Tantangan 10 soal pilihan ganda cepat dengan batas waktu 30 detik per soal. Menguji pemahaman konsep suhu, jenis termometer, dan prinsip kesetimbangan termal.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-4 border-t border-blue-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  10 Soal Pilihan Ganda (3,5 poin/soal)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Pembahasan instan langsung
                </li>
              </ul>
            </div>

            {/* Mode 2 Card */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-b from-sky-50/50 to-white border border-sky-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center shadow-md">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-navy-900 text-xs font-black">
                    30 POIN
                  </span>
                </div>
                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Mode 2 — Memory Madness
                </div>
                <h3 className="text-xl font-bold text-navy-950 mb-2">THERMO MEMORY</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Uji ketajaman ingatan fotogenik! Amati kartu titik tetap dan fakta termometer selama 30 detik pada Fase Memorization, lalu jawab 10 tantangan recall tanpa bantuan.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-4 border-t border-sky-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  Fase 1: 30 detik menghafal grid kartu
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  Fase 2: 10 tantangan ingatan (3 poin/soal)
                </li>
              </ul>
            </div>

            {/* Mode 3 Card */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-b from-orange-50/50 to-white border border-orange-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-thermoOrange text-white flex items-center justify-center shadow-md">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-thermoOrange text-xs font-black">
                    35 POIN
                  </span>
                </div>
                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Mode 3 — Number Chains
                </div>
                <h3 className="text-xl font-bold text-navy-950 mb-2">THERMO CALCULATION</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Rangkaian 5 tahap perhitungan konversi suhu dengan tingkat kesulitan bertahap, mulai dari Easy (C ke F/R) hingga rantai bertingkat Hard (R ke C lalu ke F).
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-4 border-t border-orange-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  5 Tahapan berurutan (7 poin/tahap)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Tersedia petunjuk rumus opsional
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Educational Guarantee / Academic Standards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-deepblue text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Sesuai Kurikulum IPA Kelas VII SMP</span>
        </div>
        <h3 className="text-2xl font-bold text-navy-950 mb-4">
          Bebas Distraksi, Fokus Penuh pada Pembelajaran Bermakna
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          Game ini dirancang khusus dengan metodologi pembelajaran aktif yang mengintegrasikan pemahaman konsep, daya ingat, dan pemecahan masalah numerik secara terarah tanpa materi luar konteks.
        </p>
        <button
          onClick={() => {
            sound.click();
            onStart();
          }}
          className="px-6 py-3 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Mulai Bermain</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
