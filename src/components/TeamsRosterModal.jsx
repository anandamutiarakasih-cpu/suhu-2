import React, { useState } from 'react';
import { Users, X, Printer, Edit2, Check, RotateCcw, PlayCircle, Shield, Sparkles } from 'lucide-react';
import { getStoredTeams, saveStoredTeams, defaultTeams } from '../data/teamData';
import { sound } from '../utils/audio';

export default function TeamsRosterModal({ onClose, onSelectTeamToPlay }) {
  const [teams, setTeams] = useState(getStoredTeams());
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [tempMembers, setTempMembers] = useState([]);

  const handleStartEdit = (team) => {
    sound.click();
    setEditingTeamId(team.id);
    setTempMembers([...team.members]);
  };

  const handleMemberNameChange = (idx, newName) => {
    const updated = [...tempMembers];
    updated[idx] = { ...updated[idx], name: newName };
    setTempMembers(updated);
  };

  const handleSaveEdit = (teamId) => {
    sound.click();
    const updatedTeams = teams.map((t) => {
      if (t.id === teamId) {
        return { ...t, members: tempMembers };
      }
      return t;
    });
    setTeams(updatedTeams);
    saveStoredTeams(updatedTeams);
    setEditingTeamId(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset daftar 32 siswa ke susunan default?')) {
      sound.click();
      setTeams(defaultTeams);
      saveStoredTeams(defaultTeams);
      setEditingTeamId(null);
    }
  };

  const handlePrint = () => {
    sound.click();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-navy-950 via-deepblue to-navy-900 text-white gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-electric/20 text-electric flex items-center justify-center font-black shadow-glow-electric">
              <Users className="w-6 h-6 text-electric" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format Kelas: 8 Kelompok • 32 Siswa (4 Siswa/Kelompok)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Matriks Pembagian 8 Tim THERMO CHAMPIONS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-electric" />
              <span>Cetak Roster</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Reset ke susunan default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Team Matrix Roster Area */}
        <div id="certificate-print-area" className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Header Banner for Print and Screen */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-navy-950 text-sm sm:text-base">
                Struktur Kompetisi Akademik 8 Kelompok (Total 32 Siswa)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Setiap kelompok terdiri dari 4 siswa dengan pembagian peran spesialisasi pada 3 mode permainan.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-deepblue shrink-0">
              <span className="px-3 py-1 bg-white rounded-lg border border-blue-200">8 Tim</span>
              <span className="px-3 py-1 bg-white rounded-lg border border-blue-200">32 Siswa</span>
              <span className="px-3 py-1 bg-white rounded-lg border border-blue-200">4 Siswa / Tim</span>
            </div>
          </div>

          {/* 8 Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teams.map((team) => {
              const isEditing = editingTeamId === team.id;

              return (
                <div
                  key={team.id}
                  className={`rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                    team.bgLight
                  } ${team.borderColor} shadow-sm hover:shadow-md`}
                >
                  <div>
                    {/* Team Header */}
                    <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{team.badge}</span>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            {team.name}
                          </div>
                          <h4 className="font-black text-navy-950 text-base leading-tight">
                            {team.teamName}
                          </h4>
                        </div>
                      </div>

                      {/* Edit or Save Button */}
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEdit(team)}
                          className="p-1 text-slate-400 hover:text-deepblue rounded-lg hover:bg-white transition-colors no-print"
                          title="Ubah nama anggota"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveEdit(team.id)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 bg-emerald-100 rounded-lg transition-colors no-print"
                          title="Simpan perubahan"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 italic mb-3">
                      "{team.motto}"
                    </p>

                    {/* 4 Members List */}
                    <div className="space-y-2 mb-4">
                      {team.members.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-white border border-slate-200/80 text-xs shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span className="font-semibold text-deepblue truncate max-w-[120px]">
                              {m.role}
                            </span>
                            <span className="font-mono">Absen {m.absentNo}</span>
                          </div>

                          {isEditing ? (
                            <input
                              type="text"
                              value={tempMembers[idx]?.name || ''}
                              onChange={(e) => handleMemberNameChange(idx, e.target.value)}
                              className="w-full px-2 py-1 text-xs font-bold rounded border border-electric focus:outline-none"
                            />
                          ) : (
                            <div className="font-bold text-navy-950 text-xs truncate">
                              {m.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Play with this team button */}
                  {onSelectTeamToPlay && (
                    <button
                      onClick={() => {
                        sound.click();
                        onSelectTeamToPlay(team);
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-deepblue hover:bg-navy-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm no-print mt-2"
                    >
                      <PlayCircle className="w-4 h-4 text-electric" />
                      <span>Mainkan Tim Ini</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Strategy & Role Explanation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-navy-950 block mb-1">
              Panduan Peran Tim dalam Clash of Champions Suhu:
            </span>
            <p>• <strong>Kapten & Strategi:</strong> Memimpin musyawarah tim dan mengatur urutan pengerjaan tantangan.</p>
            <p>• <strong>Spesialis StarChamp Quiz:</strong> Menjadi penanggung jawab jawaban 10 soal pemahaman konsep.</p>
            <p>• <strong>Spesialis Memory Madness:</strong> Mengamati dan mengingat 10 kartu titik tetap termometer pada fase 30 detik.</p>
            <p>• <strong>Spesialis Number Chains:</strong> Melakukan perhitungan konversi angka bertingkat dan memeriksa ketelitian rumus.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
