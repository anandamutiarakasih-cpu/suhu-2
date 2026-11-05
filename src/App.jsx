import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PlayerModal from './components/PlayerModal';
import Dashboard from './components/Dashboard';
import MaterialPage from './components/MaterialPage';
import StarChampQuiz from './components/StarChampQuiz';
import MemoryMadness from './components/MemoryMadness';
import NumberChains from './components/NumberChains';
import FinalEvaluation from './components/FinalEvaluation';
import LeaderboardModal from './components/LeaderboardModal';
import HelpModal from './components/HelpModal';
import { 
  getCurrentPlayer, savePlayerRecord, clearCurrentPlayer, 
  getPredicate 
} from './utils/storage';
import { sound } from './utils/audio';

export default function App() {
  const [player, setPlayer] = useState(getCurrentPlayer());
  const [currentView, setCurrentView] = useState(player ? 'dashboard' : 'landing');
  
  // Modals
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Compute total score (max 100)
  const starScore = Number(player?.skorStarChamp) || 0;
  const memScore = Number(player?.skorMemoryMadness) || 0;
  const calcScore = Number(player?.skorNumberChains) || 0;
  const totalScore = Math.min(
    100,
    Math.round((starScore + memScore + calcScore) * 10) / 10
  );

  // Handle player registration / confirmation
  const handleSavePlayer = (newPlayer) => {
    savePlayerRecord(newPlayer);
    setPlayer(newPlayer);
    setShowPlayerModal(false);
    setCurrentView('dashboard');
  };

  // Start a new player session (doesn't wipe previous player's records)
  const handleNewPlayer = () => {
    clearCurrentPlayer();
    setPlayer(null);
    setCurrentView('register');
  };

  // Handle player logout / change
  const handleLogout = () => {
    if (window.confirm('Selesaikan sesi pemain saat ini? Rekor nilaimu tersimpan aman di sistem leaderboard.')) {
      clearCurrentPlayer();
      setPlayer(null);
      setCurrentView('landing');
    }
  };

  // Start a game mode
  const handleStartMode = (modeName) => {
    if (!player) {
      setCurrentView('register');
      return;
    }
    setCurrentView(modeName);
  };

  // Finish Mode 1 (StarChamp Quiz)
  const handleFinishQuiz = ({ score, stats }) => {
    const updatedStar = score;
    const currentMem = Number(player.skorMemoryMadness) || 0;
    const currentCalc = Number(player.skorNumberChains) || 0;
    const newTotal = Math.min(100, Math.round((updatedStar + currentMem + currentCalc) * 10) / 10);
    const pred = getPredicate(newTotal);

    const isNowAllCompleted = Boolean(player.modesCompleted?.memory && player.modesCompleted?.calc);

    const updatedPlayer = {
      ...player,
      skorStarChamp: updatedStar,
      nilaiAkhir: newTotal,
      predikat: pred.title,
      completed: isNowAllCompleted,
      modesCompleted: {
        ...(player.modesCompleted || {}),
        quiz: true
      },
      stats: {
        ...(player.stats || {}),
        quiz: stats
      }
    };

    savePlayerRecord(updatedPlayer);
    setPlayer(updatedPlayer);

    if (isNowAllCompleted) {
      setCurrentView('evaluation');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Finish Mode 2 (Memory Madness)
  const handleFinishMemory = ({ score, stats }) => {
    const currentStar = Number(player.skorStarChamp) || 0;
    const updatedMem = score;
    const currentCalc = Number(player.skorNumberChains) || 0;
    const newTotal = Math.min(100, Math.round((currentStar + updatedMem + currentCalc) * 10) / 10);
    const pred = getPredicate(newTotal);

    const isNowAllCompleted = Boolean(player.modesCompleted?.quiz && player.modesCompleted?.calc);

    const updatedPlayer = {
      ...player,
      skorMemoryMadness: updatedMem,
      nilaiAkhir: newTotal,
      predikat: pred.title,
      completed: isNowAllCompleted,
      modesCompleted: {
        ...(player.modesCompleted || {}),
        memory: true
      },
      stats: {
        ...(player.stats || {}),
        memory: stats
      }
    };

    savePlayerRecord(updatedPlayer);
    setPlayer(updatedPlayer);

    if (isNowAllCompleted) {
      setCurrentView('evaluation');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Finish Mode 3 (Number Chains)
  const handleFinishCalc = ({ score, stats }) => {
    const currentStar = Number(player.skorStarChamp) || 0;
    const currentMem = Number(player.skorMemoryMadness) || 0;
    const updatedCalc = score;
    const newTotal = Math.min(100, Math.round((currentStar + currentMem + updatedCalc) * 10) / 10);
    const pred = getPredicate(newTotal);

    const isNowAllCompleted = Boolean(player.modesCompleted?.quiz && player.modesCompleted?.memory);

    const updatedPlayer = {
      ...player,
      skorNumberChains: updatedCalc,
      nilaiAkhir: newTotal,
      predikat: pred.title,
      completed: isNowAllCompleted,
      modesCompleted: {
        ...(player.modesCompleted || {}),
        calc: true
      },
      stats: {
        ...(player.stats || {}),
        calc: stats
      }
    };

    savePlayerRecord(updatedPlayer);
    setPlayer(updatedPlayer);

    if (isNowAllCompleted) {
      setCurrentView('evaluation');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Reset player scores to re-play all 3 modes
  const handleResetAll = () => {
    const resetPlayer = {
      ...player,
      skorStarChamp: 0,
      skorMemoryMadness: 0,
      skorNumberChains: 0,
      nilaiAkhir: 0,
      predikat: 'Temperature Rookie',
      completed: false,
      modesCompleted: {
        quiz: false,
        memory: false,
        calc: false
      },
      stats: {
        quiz: null,
        memory: null,
        calc: null
      }
    };

    savePlayerRecord(resetPlayer);
    setPlayer(resetPlayer);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-lightBg font-sans text-slate-800 selection:bg-electric selection:text-navy-950">
      
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        player={player}
        totalScore={totalScore}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenHelp={() => setShowHelp(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            player={player}
            onStart={() => {
              if (player) setCurrentView('dashboard');
              else setCurrentView('register');
            }}
            onLearn={() => setCurrentView('material')}
          />
        )}

        {currentView === 'register' && (
          <PlayerModal
            isPage={true}
            initialPlayer={player}
            onSavePlayer={handleSavePlayer}
            onCancel={() => setCurrentView(player ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'dashboard' && player && (
          <Dashboard
            player={player}
            onStartMode={handleStartMode}
            onViewEvaluation={() => setCurrentView('evaluation')}
            onOpenMaterial={() => setCurrentView('material')}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenHelp={() => setShowHelp(true)}
            onNewPlayer={handleNewPlayer}
          />
        )}

        {currentView === 'material' && (
          <MaterialPage
            onBack={() => {
              if (player) setCurrentView('dashboard');
              else setCurrentView('landing');
            }}
            onStartPractice={() => {
              if (player) handleStartMode('quiz');
              else setCurrentView('register');
            }}
          />
        )}

        {currentView === 'quiz' && (
          <StarChampQuiz
            onFinish={handleFinishQuiz}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'memory' && (
          <MemoryMadness
            onFinish={handleFinishMemory}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'calc' && (
          <NumberChains
            onFinish={handleFinishCalc}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'evaluation' && player && (
          <FinalEvaluation
            player={player}
            onResetAll={handleResetAll}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenMaterial={() => setCurrentView('material')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-navy-950">
            <span>THERMO CHAMPIONS</span>
            <span>•</span>
            <span className="text-slate-500 font-normal">Media Pembelajaran IPA Kelas VII SMP — 8 Kelompok</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="text-deepblue hover:underline font-bold"
            >
              Leaderboard Individu & Kelompok
            </button>
            <span>•</span>
            <span>Materi Pokok: Suhu & Termometer</span>
          </div>
        </div>
      </footer>

      {/* Modal Overlay if opened from other views */}
      {showPlayerModal && (
        <PlayerModal
          isPage={false}
          initialPlayer={player}
          onSavePlayer={handleSavePlayer}
          onCancel={() => setShowPlayerModal(false)}
        />
      )}

      {/* Leaderboard Modal (Individu & 8 Kelompok) */}
      {showLeaderboard && (
        <LeaderboardModal
          currentPlayer={player}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Help / Rules Modal */}
      {showHelp && (
        <HelpModal
          onClose={() => setShowHelp(false)}
        />
      )}

    </div>
  );
}
