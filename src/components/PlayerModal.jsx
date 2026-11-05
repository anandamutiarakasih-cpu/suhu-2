import React, { useState } from 'react';
import { EIGHT_GROUPS } from '../data/teamData';
import { createPlayerId } from '../utils/storage';
import { sound } from '../utils/audio';
import { Flame, CheckCircle2, User, Hash, ArrowRight, X, Sparkles } from 'lucide-react';

export default function PlayerModal({ onSavePlayer, initialPlayer, onCancel, isPage = false }) {
  // 1. Group Selection (Kelompok 1 - 8)
  const [selectedGroupId, setSelectedGroupId] = useState(
    initialPlayer?.kelompok 
      ? EIGHT_GROUPS.find(g => g.name === initialPlayer.kelompok)?.id || 1 
      : 1
  );

  // 2. Identity Inputs - Blank by default, NO auto-fill, typed manually
  const [namaLengkap, setNamaLengkap] = useState(initialPlayer?.nama || '');
  const [nomorAbsen, setNomorAbsen] = useState(
    initialPlayer?.nomorAbsen !== undefined ? String(initialPlayer.nomorAbsen) : ''
  );
  
  // Validation state
  const [errors, setErrors] = useState({});

  const selectedGroup = EIGHT_GROUPS.find((g) => g.id === selectedGroupId) || EIGHT_GROUPS[0];

  const handleSelectGroup = (id) => {
    sound.click();
    setSelectedGroupId(id);
    if (errors.kelompok) {
      setErrors((prev) => ({ ...prev, kelompok: null }));
    }
  };

  const handleValidationAndSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Nama Lengkap
    const trimmedNama = namaLengkap.trim();
    if (!trimmedNama) {
      newErrors.nama = 'Nama lengkap wajib diisi sendiri oleh pemain.';
    } else if (trimmedNama.length < 2) {
      newErrors.nama = 'Nama lengkap minimal 2 karakter.';
    }

    // Validate Nomor Absen: Must be a positive integer
    const parsedAbsen = parseInt(nomorAbsen, 10);
    if (!nomorAbsen || isNaN(parsedAbsen)) {
      newErrors.absen = 'Nomor absen wajib diisi dengan angka.';
    } else if (parsedAbsen <= 0) {
      newErrors.absen = 'Nomor absen harus merupakan angka positif (minimal 1).';
    }

    if (Object.keys(newErrors).length > 0) {
      sound.wrong();
      setErrors(newErrors);
      return;
    }

    sound.click();

    // Create unique player record matching specification:
    // playerId, nama, nomorAbsen, kelompok, skorStarChamp, skorMemoryMadness, skorNumberChains, nilaiAkhir, predikat, tanggalPermainan
    const newPlayer = {
      playerId: initialPlayer?.playerId || createPlayerId(),
      nama: trimmedNama,
      nomorAbsen: parsedAbsen,
      kelompok: selectedGroup.name,
      themeName: selectedGroup.themeName,
      badge: selectedGroup.badge,
      skorStarChamp: initialPlayer?.skorStarChamp || 0,
      skorMemoryMadness: initialPlayer?.skorMemoryMadness || 0,
      skorNumberChains: initialPlayer?.skorNumberChains || 0,
      nilaiAkhir: initialPlayer?.nilaiAkhir || 0,
      predikat: initialPlayer?.predikat || 'Temperature Rookie',
      tanggalPermainan: initialPlayer?.tanggalPermainan || new Date().toISOString(),
      completed: initialPlayer?.completed || false,
      modesCompleted: initialPlayer?.modesCompleted || {
        quiz: false,
        memory: false,
        calc: false
      },
      stats: initialPlayer?.stats || {
        quiz: null,
        memory: null,
        calc: null
      }
    };

    onSavePlayer(newPlayer);
  };

  const cardContent = (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col my-auto">
      
      {/* Header */}
      <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100 bg-gradient-to-r from-navy-950 via-deepblue to-navy-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-thermoOrange to-amber-400 flex items-center justify-center shadow-glow-orange shrink-0">
            <Flame className="w-6 h-6 text-navy-950 fill-navy-950" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kompetisi Sains IPA Kelas VII</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">THERMO CHAMPIONS</h2>
          </div>
        </div>

        {onCancel && !isPage && (
          <button
            onClick={() => {
              sound.click();
              onCancel();
            }}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleValidationAndSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
        
        {/* Step 1: Pilih Kelompok (Tepat 8 Kelompok) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <span>Pilih Kelompok:</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-semibold text-slate-500">
              Tepat 8 Kelompok Tersedia
            </span>
          </div>

          {/* 8 Kelompok Cards Grid: [ Kelompok 1 ] ... [ Kelompok 8 ] */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {EIGHT_GROUPS.map((grp) => {
              const isSelected = selectedGroupId === grp.id;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => handleSelectGroup(grp.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-deepblue text-white border-deepblue shadow-md ring-2 ring-electric'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  {/* Active Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-electric">
                      <CheckCircle2 className="w-4 h-4 fill-electric text-deepblue" />
                    </div>
                  )}

                  <div>
                    <div className="text-2xl mb-1.5">{grp.badge}</div>
                    <div className={`font-black text-sm leading-tight ${isSelected ? 'text-white' : 'text-navy-950'}`}>
                      {grp.name}
                    </div>
                    <div className={`text-[10px] font-semibold truncate mt-0.5 ${isSelected ? 'text-electric' : 'text-slate-500'}`}>
                      {grp.themeName}
                    </div>
                  </div>

                  <div className={`text-[9px] mt-2 pt-1 border-t truncate ${isSelected ? 'border-white/20 text-slate-200' : 'border-slate-200 text-slate-400'}`}>
                    {grp.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Identitas Pemain (Nama Lengkap & Nomor Absen diketik sendiri) */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-black uppercase text-slate-800 tracking-wider">
            Identitas Pemain:
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap: <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                maxLength={50}
                placeholder="[Ketik nama sendiri]"
                value={namaLengkap}
                onChange={(e) => {
                  setNamaLengkap(e.target.value);
                  if (errors.nama) setErrors((prev) => ({ ...prev, nama: null }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-semibold bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.nama
                    ? 'border-red-400 focus:ring-red-200 text-red-900'
                    : 'border-slate-300 focus:ring-electric focus:border-transparent text-slate-800'
                }`}
              />
            </div>
            {errors.nama && (
              <p className="mt-1 text-[11px] font-bold text-red-500">{errors.nama}</p>
            )}
          </div>

          {/* Nomor Absen */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nomor Absen: <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="number"
                required
                min="1"
                max="100"
                placeholder="[Ketik nomor absen]"
                value={nomorAbsen}
                onChange={(e) => {
                  setNomorAbsen(e.target.value);
                  if (errors.absen) setErrors((prev) => ({ ...prev, absen: null }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-semibold bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.absen
                    ? 'border-red-400 focus:ring-red-200 text-red-900'
                    : 'border-slate-300 focus:ring-electric focus:border-transparent text-slate-800'
                }`}
              />
            </div>
            {errors.absen && (
              <p className="mt-1 text-[11px] font-bold text-red-500">{errors.absen}</p>
            )}
          </div>
        </div>

        {/* Step 3: Ringkasan Konfirmasi Identitas & Kelompok Terpilih */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-deepblue mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Konfirmasi Kelompok dan Identitas:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Kelompok</span>
              <strong className="text-navy-950 font-black text-sm flex items-center gap-1.5 mt-0.5">
                <span>{selectedGroup.badge}</span>
                <span>{selectedGroup.name}</span>
              </strong>
            </div>

            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Nama Lengkap</span>
              <strong className="text-navy-950 font-bold text-xs truncate block mt-0.5">
                {namaLengkap.trim() || <span className="text-slate-400 font-normal italic">[Ketik nama sendiri]</span>}
              </strong>
            </div>

            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Nomor Absen</span>
              <strong className="text-navy-950 font-mono font-bold text-sm block mt-0.5">
                {nomorAbsen ? `No. ${nomorAbsen}` : <span className="text-slate-400 font-normal italic font-sans">[Ketik nomor absen]</span>}
              </strong>
            </div>
          </div>
        </div>

        {/* Step 4: Tombol [ Konfirmasi dan Mulai ] */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-deepblue via-blue-700 to-electric hover:from-navy-900 hover:to-deepblue text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Konfirmasi dan Mulai</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-2.5 italic">
            Setiap pemain memiliki data permainan mandiri dan tidak akan menimpa skor pemain lain.
          </p>
        </div>

      </form>

    </div>
  );

  // If rendered as a full-page view
  if (isPage) {
    return (
      <div className="min-h-[85vh] py-8 px-4 sm:px-6 flex items-center justify-center animate-fadeIn">
        {cardContent}
      </div>
    );
  }

  // If rendered as modal overlay
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      {cardContent}
    </div>
  );
}
