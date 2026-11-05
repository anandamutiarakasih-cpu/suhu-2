import React, { useState } from 'react';
import { User, Users, Award, ArrowRight, Sparkles, BookOpen, Check } from 'lucide-react';
import { getStoredTeams } from '../data/teamData';
import { sound } from '../utils/audio';

export default function PlayerModal({ onSavePlayer, initialPlayer, onCancel, onOpenTeamsRoster }) {
  const [playMode, setPlayMode] = useState(initialPlayer?.isTeam !== false ? 'team' : 'individual'); // 'team' | 'individual'
  const teams = getStoredTeams();
  
  // Team selection state
  const [selectedTeamId, setSelectedTeamId] = useState(initialPlayer?.teamId || 1);
  const [className, setClassName] = useState(initialPlayer?.className || '7-A');
  
  // Individual selection state
  const [individualName, setIndividualName] = useState(initialPlayer?.name || '');
  const [studentNumber, setStudentNumber] = useState(initialPlayer?.studentNumber || '');
  const [error, setError] = useState('');

  const currentSelectedTeam = teams.find((t) => t.id === Number(selectedTeamId)) || teams[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (playMode === 'team') {
      sound.click();
      onSavePlayer({
        isTeam: true,
        teamId: currentSelectedTeam.id,
        name: `${currentSelectedTeam.name} (${currentSelectedTeam.teamName})`,
        teamName: currentSelectedTeam.teamName,
        groupName: currentSelectedTeam.name,
        badge: currentSelectedTeam.badge,
        className: className.trim(),
        members: currentSelectedTeam.members,
        motto: currentSelectedTeam.motto,
        studentNumber: `Absen ${currentSelectedTeam.members[0].absentNo}-${currentSelectedTeam.members[3].absentNo}`
      });
    } else {
      if (!individualName.trim()) {
        sound.wrong();
        setError('Mohon masukkan nama pemain terlebih dahulu.');
        return;
      }
      sound.click();
      onSavePlayer({
        isTeam: false,
        name: individualName.trim(),
        className: className.trim(),
        studentNumber: studentNumber.trim()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-deepblue to-electric text-white flex items-center justify-center mx-auto mb-3 shadow-glow-electric">
            {playMode === 'team' ? <Users className="w-7 h-7" /> : <User className="w-7 h-7" />}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-deepblue text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pendaftaran Peserta Kelas VII</span>
          </div>
          <h2 className="text-2xl font-black text-navy-950">
            {playMode === 'team' ? 'Pilih Tim dari 8 Kelompok' : 'Identitas Pemain Tunggal'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Format kelas 32 siswa dibagi menjadi 8 kelompok akademik (4 siswa/tim).
          </p>
        </div>

        {/* Mode Selector Toggle: Team (8 Kelompok) vs Individu */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setPlayMode('team');
              setError('');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              playMode === 'team'
                ? 'bg-deepblue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>8 Kelompok (32 Siswa)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setPlayMode('individual');
              setError('');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              playMode === 'individual'
                ? 'bg-deepblue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mode Individu</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Class Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Kelas <span className="text-red-500">*</span>
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-electric text-sm font-semibold text-slate-800 bg-slate-50/50"
            >
              <option value="7-A">Kelas 7-A (32 Siswa)</option>
              <option value="7-B">Kelas 7-B (32 Siswa)</option>
              <option value="7-C">Kelas 7-C (32 Siswa)</option>
              <option value="7-D">Kelas 7-D (32 Siswa)</option>
              <option value="7-E">Kelas 7-E (32 Siswa)</option>
              <option value="7-F">Kelas 7-F (32 Siswa)</option>
              <option value="7-G">Kelas 7-G (32 Siswa)</option>
              <option value="7-H">Kelas 7-H (32 Siswa)</option>
              <option value="VII SMP">VII SMP (Umum)</option>
            </select>
          </div>

          {/* TEAM MODE SELECTION */}
          {playMode === 'team' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Pilih Kelompok Bertanding <span className="text-red-500">*</span>
                </label>
                {onOpenTeamsRoster && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.click();
                      onOpenTeamsRoster();
                    }}
                    className="text-xs font-bold text-deepblue hover:underline"
                  >
                    Lihat Matriks Lengkap 8 Tim
                  </button>
                )}
              </div>

              {/* 8 Team Quick Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {teams.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setSelectedTeamId(t.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedTeamId === t.id
                        ? 'bg-deepblue text-white border-deepblue shadow-sm ring-2 ring-electric'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{t.badge}</span>
                      <span className={`text-[10px] font-mono font-bold ${selectedTeamId === t.id ? 'text-electric' : 'text-slate-400'}`}>
                        Tim #{t.id}
                      </span>
                    </div>
                    <div className="font-bold text-xs truncate leading-tight">
                      {t.teamName}
                    </div>
                    <div className={`text-[10px] truncate ${selectedTeamId === t.id ? 'text-slate-200' : 'text-slate-400'}`}>
                      {t.name}
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Team Members Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentSelectedTeam.badge}</span>
                    <div>
                      <h4 className="font-black text-navy-950 text-sm">
                        {currentSelectedTeam.name} — {currentSelectedTeam.teamName}
                      </h4>
                      <p className="text-[11px] text-slate-500 italic">
                        "{currentSelectedTeam.motto}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  {currentSelectedTeam.members.map((m, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-white border border-slate-200">
                      <div className="text-[9px] text-deepblue font-bold uppercase truncate">
                        {m.role}
                      </div>
                      <div className="font-bold text-slate-800 text-xs truncate">
                        {m.name} <span className="font-normal text-slate-400 font-mono">({m.absentNo})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* INDIVIDUAL MODE SELECTION */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={40}
                  placeholder="Contoh: Raditya Pratama"
                  value={individualName}
                  onChange={(e) => {
                    setIndividualName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-electric text-sm font-semibold text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                  Nomor Absen (1–32) <span className="text-slate-400 font-normal lowercase">(opsional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="32"
                  placeholder="Misal: 14"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-electric text-sm font-semibold text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-deepblue to-blue-700 hover:from-navy-900 hover:to-deepblue text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>{playMode === 'team' ? `Masuk sebagai ${currentSelectedTeam.name}` : 'Simpan & Masuk ke Dashboard'}</span>
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
