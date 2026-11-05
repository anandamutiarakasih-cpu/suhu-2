import React, { useState } from 'react';
import { Volume2, VolumeX, Trophy, BookOpen, HelpCircle, User, LogOut, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Navbar({
  currentView,
  setCurrentView,
  player,
  totalScore,
  onOpenLeaderboard,
  onOpenHelp,
  onLogout
}) {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggleMute = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sound.click();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            sound.click();
            if (player) setCurrentView('dashboard');
            else setCurrentView('landing');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-thermoOrange to-amber-400 flex items-center justify-center shadow-glow-orange group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-navy-950 fill-navy-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-electric transition-colors">
                THERMO<span className="text-electric">CHAMPIONS</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-electric/20 text-electric border border-electric/30">
                8 Kelompok IPA VII
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block tracking-wide">
              Master the Temperature. Become the Champion.
            </p>
          </div>
        </div>

        {/* Center / Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Leaderboard Button (Individu & Kelompok) */}
          <button
            onClick={() => {
              sound.click();
              onOpenLeaderboard();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-slate-200 hover:bg-white/10 transition-colors"
            title="Papan Peringkat Individu & Kelompok"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {/* Study Material Button */}
          <button
            onClick={() => {
              sound.click();
              setCurrentView('material');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'material'
                ? 'bg-electric text-navy-950 shadow-glow-electric'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Materi</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => {
              sound.click();
              onOpenHelp();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-slate-200 hover:bg-white/10 transition-colors"
            title="Petunjuk & Aturan Game"
          >
            <HelpCircle className="w-4 h-4 text-electric" />
            <span className="hidden md:inline">Bantuan</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg transition-colors ${
              muted ? 'text-slate-400 hover:bg-white/10' : 'text-electric hover:bg-white/10'
            }`}
            title={muted ? 'Aktifkan Suara' : 'Bisukan Suara'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Active Player Chip */}
          {player ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div
                onClick={() => {
                  sound.click();
                  setCurrentView('dashboard');
                }}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-white/10 cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-electric/20 text-electric flex items-center justify-center font-bold text-xs">
                  {player.badge || '👤'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none max-w-[110px] truncate">
                    {player.nama}
                  </div>
                  <div className="text-[10px] text-electric font-mono font-bold leading-none mt-0.5">
                    {player.kelompok} (No.{player.nomorAbsen})
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.click();
                  onLogout();
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                title="Ganti Pemain / Selesai Sesi"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.click();
                setCurrentView('register');
              }}
              className="bg-thermoOrange hover:bg-thermoOrange-hover text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              Mulai Bermain
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
