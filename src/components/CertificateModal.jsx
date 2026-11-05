import React from 'react';
import { Award, Printer, X, Flame, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

export default function CertificateModal({ player, totalScore, predicate, onClose }) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    sound.click();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8">
        
        {/* Modal Controls (Not printed) */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-t-3xl border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-navy-950 text-sm sm:text-base">
              Piagam Penghargaan Resmi — THERMO CHAMPIONS
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-deepblue hover:bg-navy-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas Area */}
        <div
          id="certificate-print-area"
          className="bg-white p-8 sm:p-12 rounded-b-3xl sm:rounded-3xl border-8 border-double border-amber-400/80 shadow-2xl relative overflow-hidden text-center text-slate-800"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-16 h-16 border-t-4 border-l-4 border-amber-500 pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-16 h-16 border-t-4 border-r-4 border-amber-500 pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-16 h-16 border-b-4 border-l-4 border-amber-500 pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-16 h-16 border-b-4 border-r-4 border-amber-500 pointer-events-none"></div>

          {/* Watermark Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Flame className="w-96 h-96 text-navy-900" />
          </div>

          {/* Certificate Header */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 text-amber-600 text-xs font-black tracking-widest uppercase mb-1">
              <span>★ PIAGAM PENGHARGAAN KOMPETISI SAINS ★</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-navy-950 tracking-wider">
              THERMO CHAMPIONS
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mt-1">
              Media Pembelajaran IPA Interaktif Kelas VII SMP • Materi Pokok: Suhu
            </p>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-thermoOrange to-amber-500 mx-auto my-3 rounded-full"></div>

          {/* Certificate Body */}
          <p className="text-xs sm:text-sm text-slate-600 italic mb-2">
            Dengan bangga dan apresiasi tinggi dianugerahkan kepada:
          </p>

          {/* Recipient Full Name */}
          <div className="my-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 font-serif tracking-tight underline decoration-amber-400 decoration-2 underline-offset-8">
              {player?.nama || 'Peserta Didik'}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-3 mb-2">
              Nomor Absen: <strong className="font-mono text-navy-950">{player?.nomorAbsen || '-'}</strong> • Anggota: <strong className="text-deepblue">{player?.kelompok || 'Kelompok 1'}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
            Telah berhasil menyelesaikan seluruh rangkaian tantangan kompetisi akademik tiga mode:
            <strong> StarChamp Challenge</strong>, <strong>Memory Madness</strong>, dan <strong>Number Chains</strong>, serta membuktikan pemahaman konsep dan keterampilan konversi suhu secara mandiri.
          </p>

          {/* Score & Predicate Highlight Badge */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50 border-2 border-amber-300 shadow-sm mx-auto mb-8">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Total Nilai Akhir
              </span>
              <span className="text-3xl font-black font-mono text-navy-950">
                {totalScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Predikat Capaian
              </span>
              <span className="text-lg font-black text-amber-700 flex items-center gap-1.5 justify-center sm:justify-start">
                <span>{predicate.badge}</span>
                <span>{predicate.title}</span>
              </span>
            </div>
          </div>

          {/* Certificate Footer: Date, Seals, Signature */}
          <div className="grid grid-cols-3 items-end pt-6 border-t border-slate-200 mt-6 text-xs text-slate-600">
            {/* Left: Verification */}
            <div className="text-left space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Terverifikasi Sah</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                ID: TC-{player?.playerId ? player.playerId.slice(-8) : Date.now().toString().slice(-6)}
              </div>
              <div className="text-[10px] text-slate-400">
                Tanggal: {currentDate}
              </div>
            </div>

            {/* Center: Official Seal Stamp */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500/80 bg-amber-50/50 flex flex-col items-center justify-center text-amber-700 p-1 shadow-inner rotate-[-5deg]">
                <Flame className="w-6 h-6 text-thermoOrange fill-thermoOrange" />
                <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">OFFICIAL SEAL</span>
                <span className="text-[7px] font-bold">THERMO CHAMPIONS</span>
              </div>
            </div>

            {/* Right: Signature */}
            <div className="text-right space-y-1">
              <div className="text-[11px] font-serif italic text-slate-500">
                Guru Mata Pelajaran IPA
              </div>
              <div className="w-28 h-px bg-slate-400 ml-auto my-1"></div>
              <div className="text-[10px] font-bold text-navy-950 uppercase">
                Pendidik Sains SMP
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
