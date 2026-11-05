// Storage & Game Logic Utilities

export const getPredicate = (score) => {
  const rounded = Math.round(score * 10) / 10;
  if (rounded >= 86) {
    return {
      title: 'Thermo Champion',
      badge: '🏆',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 border-amber-300',
      description: 'Penguasaan materi suhu luar biasa! Kamu adalah juara sejati dengan pemahaman konsep dan perhitungan sempurna.'
    };
  }
  if (rounded >= 76) {
    return {
      title: 'Thermo Expert',
      badge: '🎖️',
      color: 'text-electric',
      bgColor: 'bg-sky-50 border-sky-300',
      description: 'Sangat hebat! Pemahaman konsep dan keterampilan konversi suhu kamu sudah berada di level ahli.'
    };
  }
  if (rounded >= 66) {
    return {
      title: 'Science Challenger',
      badge: '⚡',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-300',
      description: 'Bagus sekali! Kamu memiliki potensi besar dalam penalaran suhu dan daya ingat saintifik.'
    };
  }
  if (rounded >= 56) {
    return {
      title: 'Thermo Explorer',
      badge: '🔍',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-300',
      description: 'Cukup baik. Terus tingkatkan ketelitian pada konversi angka dan titik tetap skala termometer.'
    };
  }
  return {
    title: 'Temperature Rookie',
    badge: '📘',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 border-slate-300',
    description: 'Awal yang baik! Pelajari kembali materi perbandingan skala suhu dan coba lagi tantangannya.'
  };
};

export const getPlayer = () => {
  try {
    const raw = localStorage.getItem('thermo_player');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const savePlayer = (player) => {
  localStorage.setItem('thermo_player', JSON.stringify(player));
};

export const clearPlayer = () => {
  localStorage.removeItem('thermo_player');
  localStorage.removeItem('thermo_scores');
};

const defaultScores = {
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

export const getScores = () => {
  try {
    const raw = localStorage.getItem('thermo_scores');
    return raw ? { ...defaultScores, ...JSON.parse(raw) } : { ...defaultScores };
  } catch {
    return { ...defaultScores };
  }
};

export const saveScores = (scores) => {
  localStorage.setItem('thermo_scores', JSON.stringify(scores));
};

export const getLeaderboard = () => {
  try {
    const raw = localStorage.getItem('thermo_leaderboard');
    if (!raw) {
      // Seed initial sample leaderboard for academic competition feel
      const initial = [
        { name: 'Nadia Kirana', className: '7-A', score: 96.5, predicate: 'Thermo Champion', date: '2026-11-04' },
        { name: 'Rafi Pratama', className: '7-C', score: 93.0, predicate: 'Thermo Champion', date: '2026-11-03' },
        { name: 'Aisyah Putri', className: '7-B', score: 87.5, predicate: 'Thermo Champion', date: '2026-11-04' },
        { name: 'Bima Satria', className: '7-A', score: 82.0, predicate: 'Thermo Expert', date: '2026-11-02' },
        { name: 'Chelsea Vania', className: '7-D', score: 79.5, predicate: 'Thermo Expert', date: '2026-11-01' },
      ];
      localStorage.setItem('thermo_leaderboard', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addLeaderboardEntry = (entry) => {
  const current = getLeaderboard();
  current.push(entry);
  // Sort descending by score
  current.sort((a, b) => b.score - a.score);
  // Keep top 20
  const trimmed = current.slice(0, 20);
  localStorage.setItem('thermo_leaderboard', JSON.stringify(trimmed));
  return trimmed;
};
