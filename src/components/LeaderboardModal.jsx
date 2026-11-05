import React, { useState } from 'react';
import { Trophy, X, Medal, Sparkles, User, Users, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { getIndividualLeaderboard, getGroupRecap } from '../utils/storage';
import { sound } from '../utils/audio';

export default function LeaderboardModal({ currentPlayer, onClose }) {
  const [activeTab, setActiveTab] = useState('group'); // 'group' | 'individual'
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const individualLeaderboard = getIndividualLeaderboard();
  const groupRecap = getGroupRecap();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-navy-950 via-deepblue to-navy-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-navy-950 flex items-center justify-center font-black shadow-glow-orange">
              <Trophy className="w-5 h-5 fill-navy-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Papan Peringkat Turnamen</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">Leaderboard THERMO CHAMPIONS</h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Category Tabs: Leaderboard Kelompok & Leaderboard Individu */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          
          <button
            onClick={() => {
              sound.click();
              setActiveTab('group');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'group'
                ? 'bg-deepblue text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>B. Leaderboard Kelompok (8 Kelompok)</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              setActiveTab('individual');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'individual'
                ? 'bg-deepblue text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4 text-electric" />
            <span>A. Leaderboard Individu</span>
          </button>

        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* ========================================================
              TAB B: LEADERBOARD KELOMPOK (REKAP 8 KELOMPOK)
             ======================================================== */}
          {activeTab === 'group' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-600">
                <strong className="text-deepblue block mb-1">Ketentuan Penilaian Kelompok:</strong>
                <p>• Peringkat kelompok ditentukan berdasarkan <strong>rata-rata nilai akhir anggota tertinggi</strong>.</p>
                <p>• <strong>Rata-rata Kelompok = Total Nilai Anggota Selesai / Jumlah Anggota yang Sudah Menyelesaikan Permainan</strong>.</p>
                <p>• Hanya pemain yang telah menyelesaikan ketiga mode permainan yang dimasukkan ke perhitungan rata-rata.</p>
              </div>

              {groupRecap.map((grp, idx) => {
                const isTop1 = idx === 0 && grp.averageScore !== null;
                const isTop2 = idx === 1 && grp.averageScore !== null;
                const isTop3 = idx === 2 && grp.averageScore !== null;
                const isExpanded = expandedGroupId === grp.groupId;
                const isPlayerGroup = currentPlayer?.kelompok === grp.groupName;

                return (
                  <div
                    key={grp.groupId}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isPlayerGroup
                        ? 'border-electric ring-2 ring-electric/30 bg-white'
                        : isTop1
                        ? 'bg-amber-50/60 border-amber-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Group Main Row */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 font-mono ${
                          isTop1
                            ? 'bg-amber-400 text-navy-950 shadow-sm'
                            : isTop2
                            ? 'bg-slate-300 text-navy-950'
                            : isTop3
                            ? 'bg-amber-600 text-white'
                            : grp.averageScore !== null
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-slate-50 text-slate-400 border border-dashed border-slate-300'
                        }`}>
                          {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : grp.averageScore !== null ? `#${idx + 1}` : '-'}
                        </div>

                        {/* Group Name & Theme */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{grp.badge}</span>
                            <span className="font-black text-navy-950 text-sm sm:text-base truncate">
                              {grp.groupName}
                            </span>
                            <span className="text-xs font-bold text-deepblue hidden sm:inline">
                              ({grp.themeName})
                            </span>
                            {isPlayerGroup && (
                              <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-electric text-navy-950">
                                Kelompokmu
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {grp.completedCount} anggota selesai dari {grp.totalRegisteredCount} terdaftar
                          </div>
                        </div>
                      </div>

                      {/* Score Metrics */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Total Nilai
                          </span>
                          <span className="font-mono font-bold text-slate-700 text-sm">
                            {grp.completedCount > 0 ? `${grp.totalScore} Pts` : '-'}
                          </span>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Rata-Rata
                          </span>
                          {grp.averageScore !== null ? (
                            <div className="text-xl font-black font-mono text-deepblue leading-none">
                              {grp.averageScore}
                              <span className="text-[11px] font-normal text-slate-400"> Pts</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium italic">
                              Belum selesai
                            </span>
                          )}
                        </div>

                        {/* Accordion toggle button */}
                        {grp.completedMembers.length > 0 && (
                          <button
                            onClick={() => setExpandedGroupId(isExpanded ? null : grp.groupId)}
                            className="p-1.5 text-slate-400 hover:text-navy-950 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Tampilkan daftar anggota"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        )}

                      </div>

                    </div>

                    {/* Expanded Members Breakdown */}
                    {isExpanded && grp.completedMembers.length > 0 && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/70 text-xs">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Daftar Anggota yang Berkontribusi ({grp.completedMembers.length} Siswa):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {grp.completedMembers.map((m, mIdx) => (
                            <div key={mIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-navy-950 block">{m.nama}</span>
                                <span className="text-[10px] text-slate-400 font-mono">No. Absen {m.nomorAbsen}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-black text-deepblue">{m.nilaiAkhir} Pts</span>
                                <span className="text-[10px] text-amber-600 block">{m.predikat}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================
              TAB A: LEADERBOARD INDIVIDU
             ======================================================== */}
          {activeTab === 'individual' && (
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-600">
                Peringkat individu berdasarkan nilai akhir kumulatif dari tiga mode (StarChamp, Memory Madness, Number Chains).
              </div>

              {individualLeaderboard.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-600 mb-1">Belum Ada Pemain yang Menyelesaikan Permainan</p>
                  <p>Selesaikan ketiga mode permainan untuk mencatatkan namamu di Leaderboard Individu!</p>
                </div>
              ) : (
                individualLeaderboard.map((item, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;
                  const isMe = currentPlayer && currentPlayer.playerId === item.playerId;

                  return (
                    <div
                      key={item.playerId || idx}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isMe
                          ? 'bg-blue-50 border-electric shadow-sm ring-2 ring-electric/30'
                          : isTop1
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {/* Rank & Player Info */}
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 font-mono ${
                          isTop1
                            ? 'bg-amber-400 text-navy-950 shadow-sm'
                            : isTop2
                            ? 'bg-slate-300 text-navy-950'
                            : isTop3
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : idx + 1}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-navy-950 text-sm truncate">
                              {item.nama}
                            </span>
                            {isMe && (
                              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-electric text-navy-950">
                                Kamu
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-bold text-deepblue">{item.kelompok}</span>
                            <span>•</span>
                            <span className="font-mono">Absen {item.nomorAbsen}</span>
                            <span>•</span>
                            <span className="text-amber-700 font-semibold">{item.predikat}</span>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right shrink-0">
                        <div className="text-lg sm:text-xl font-black font-mono text-navy-950">
                          {item.nilaiAkhir}
                          <span className="text-[11px] font-normal text-slate-400"> Pts</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.tanggalPermainan ? new Date(item.tanggalPermainan).toLocaleDateString('id-ID') : 'Selesai'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-xs text-slate-500">
            {activeTab === 'group'
              ? 'Tepat 8 kelompok resmi • Rata-rata hanya menghitung anggota yang telah selesai'
              : 'Peringkat diperbarui secara otomatis setelah menyelesaikan ketiga mode'}
          </p>
        </div>

      </div>
    </div>
  );
}
