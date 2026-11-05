import React, { useState } from 'react';
import { Trophy, X, Medal, Sparkles, User, Users } from 'lucide-react';
import { getLeaderboard } from '../utils/storage';
import { sound } from '../utils/audio';

export default function LeaderboardModal({ currentPlayer, onClose }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'teams'
  const leaderboard = getLeaderboard();

  const filteredList = filter === 'teams' 
    ? leaderboard.filter((item) => item.isTeam) 
    : leaderboard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-navy-950 to-deepblue text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-navy-950 flex items-center justify-center font-black shadow-glow-orange">
              <Trophy className="w-5 h-5 fill-navy-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-electric">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Papan Peringkat Juara</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">Klasemen THERMO CHAMPIONS</h2>
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

        {/* Filter Toggle: Semua vs 8 Kelompok */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <button
            onClick={() => {
              sound.click();
              setFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-deepblue text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Semua Klasemen
          </button>
          <button
            onClick={() => {
              sound.click();
              setFilter('teams');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'teams'
                ? 'bg-deepblue text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Peringkat 8 Kelompok</span>
          </button>
        </div>

        {/* List of Leaders */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-2.5">
          {filteredList.map((item, idx) => {
            const isTop1 = idx === 0;
            const isTop2 = idx === 1;
            const isTop3 = idx === 2;
            const isMe = currentPlayer && currentPlayer.name === item.name;

            return (
              <div
                key={idx}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isMe
                    ? 'bg-blue-50 border-electric shadow-sm ring-2 ring-electric/30'
                    : isTop1
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                {/* Rank & Identity */}
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
                        {item.name}
                      </span>
                      {item.isTeam && (
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-deepblue">
                          Tim
                        </span>
                      )}
                      {isMe && (
                        <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-electric text-navy-950">
                          Kamu
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Kelas {item.className}</span>
                      <span>•</span>
                      <span className="text-deepblue font-medium">{item.predicate}</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="text-lg sm:text-xl font-black font-mono text-navy-950">
                    {item.score}
                    <span className="text-[11px] font-normal text-slate-400"> Pts</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.date || 'Terbaru'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-xs text-slate-500">
            Klasemen dihitung otomatis dari akumulasi 3 mode (StarChamp, Memory Madness, Number Chains).
          </p>
        </div>

      </div>
    </div>
  );
}
