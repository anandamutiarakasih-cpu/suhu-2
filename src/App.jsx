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
  getPlayer, savePlayer, clearPlayer, 
  getScores, saveScores 
} from './utils/storage';
import { sound } from './utils/audio';

export default function App() {
  const [player, setPlayer] = useState(getPlayer());
  const [scores, setScores] = useState(getScores());
  const [currentView, setCurrentView] = useState(player ? 'dashboard' : 'landing');
  
  // Modals
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Compute total score (max 100)
  const totalScore = Math.min(
    100,
    Math.round(((scores.quizScore || 0) + (scores.memoryScore || 0) + (scores.calcScore || 0)) * 10) / 10
  );

  // Save scores automatically when changed
  useEffect(() => {
    saveScores(scores);
  }, [scores]);

  // Handle player registration
  const handleSavePlayer = (newPlayer) => {
    savePlayer(newPlayer);
    setPlayer(newPlayer);
    setShowPlayerModal(false);
    setCurrentView('dashboard');
  };

  // Handle player logout / change
  const handleLogout = () => {
    if (window.confirm('Apakah kamu yakin ingin berganti pemain atau keluar? Skor sesi ini tetap tersimpan.')) {
      clearPlayer();
      setPlayer(null);
      setScores(getScores());
      setCurrentView('landing');
    }
  };

  // Start a game mode
  const handleStartMode = (modeName) => {
    if (!player) {
      setShowPlayerModal(true);
      return;
    }
    setCurrentView(modeName);
  };

  // Finish Mode 1 (Quiz)
  const handleFinishQuiz = ({ score, stats }) => {
    const updated = {
      ...scores,
      quizScore: score,
      quizCompleted: true,
      quizStats: stats,
    };
    setScores(updated);
    saveScores(updated);

    // If all 3 modes completed, go to evaluation
    if (updated.memoryCompleted && updated.calcCompleted) {
      setCurrentView('evaluation');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Finish Mode 2 (Memory)
  const handleFinishMemory = ({ score, stats }) => {
    const updated = {
      ...scores,
      memoryScore: score,
      memoryCompleted: true,
      memoryStats: stats,
    };
    setScores(updated);
    saveScores(updated);

    if (updated.quizCompleted && updated.calcCompleted) {
      setCurrentView('evaluation');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Finish Mode 3 (Chains)
  const handleFinishCalc = ({ score, stats }) => {
    const updated = {
      ...scores,
      calcScore: score,
      calcCompleted: true,
      calcStats: stats,
    };
    setScores(updated);
    saveScores(updated);

    if (updated.quizCompleted && updated.memoryCompleted) {
      setCurrentView('evaluation');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Reset all game scores to play again
  const handleResetAll = () => {
    const freshScores = {
      quizScore: 0,
      quizCompleted: false,
      quizStats: null,
      memoryScore: 0,
      memoryCompleted: false,
      memoryStats: null,
      calcScore: 0,
      calcCompleted: false,
      calcStats: null,
    };
    setScores(freshScores);
    saveScores(freshScores);
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
              else setShowPlayerModal(true);
            }}
            onLearn={() => setCurrentView('material')}
          />
        )}

        {currentView === 'dashboard' && player && (
          <Dashboard
            player={player}
            scores={scores}
            onStartMode={handleStartMode}
            onViewEvaluation={() => setCurrentView('evaluation')}
            onOpenMaterial={() => setCurrentView('material')}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenHelp={() => setShowHelp(true)}
            onEditProfile={() => setShowPlayerModal(true)}
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
              else setShowPlayerModal(true);
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
            scores={scores}
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
            <span className="text-slate-500 font-normal">Media Pembelajaran IPA Kelas VII SMP</span>
          </div>
          <div>
            Kompetisi Akademik Sains 3 Mode — Suhu & Skala Termometer
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showPlayerModal && (
        <PlayerModal
          initialPlayer={player}
          onSavePlayer={handleSavePlayer}
          onCancel={player ? () => setShowPlayerModal(false) : null}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          currentPlayer={player}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showHelp && (
        <HelpModal
          onClose={() => setShowHelp(false)}
        />
      )}

    </div>
  );
}
