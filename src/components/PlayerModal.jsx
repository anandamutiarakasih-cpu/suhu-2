import React, { useState } from 'react';
import { User, Award, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

export default function PlayerModal({ onSavePlayer, initialPlayer, onCancel }) {
  const [name, setName] = useState(initialPlayer?.name || '');
  const [className, setClassName] = useState(initialPlayer?.className || '7-A');
  const [studentNumber, setStudentNumber] = useState(initialPlayer?.studentNumber || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      sound.wrong();
      setError('Mohon masukkan nama pemain terlebih dahulu.');
      return;
    }

    sound.click();
    onSavePlayer({
      name: name.trim(),
      className: className.trim(),
      studentNumber: studentNumber.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-deepblue to-electric text-white flex items-center justify-center mx-auto mb-3 shadow-glow-electric">
            <User className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-deepblue text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Registrasi Peserta</span>
          </div>
          <h2 className="text-2xl font-black text-navy-950">Identitas Juara</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Masukkan data diri sebelum memulai kompetisi THERMO CHAMPIONS.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Nama Lengkap Pemain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={40}
              placeholder="Contoh: Raditya Pratama"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
            />
          </div>

          {/* Class Field */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent text-sm font-semibold text-slate-800 bg-slate-50/50"
              >
                <option value="7-A">Kelas 7-A</option>
                <option value="7-B">Kelas 7-B</option>
                <option value="7-C">Kelas 7-C</option>
                <option value="7-D">Kelas 7-D</option>
                <option value="7-E">Kelas 7-E</option>
                <option value="7-F">Kelas 7-F</option>
                <option value="7-G">Kelas 7-G</option>
                <option value="7-H">Kelas 7-H</option>
                <option value="VII SMP">VII SMP (Umum)</option>
              </select>
            </div>

            {/* Student Number (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                No. Absen <span className="text-slate-400 font-normal lowercase">(opsional)</span>
              </label>
              <input
                type="number"
                min="1"
                max="50"
                placeholder="Misal: 18"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            Nama akan dicantumkan pada Papan Peringkat (Leaderboard) dan Piagam Penghargaan.
          </p>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-deepblue to-blue-700 hover:from-navy-900 hover:to-deepblue text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Simpan & Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  onCancel();
                }}
                className="w-full mt-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
