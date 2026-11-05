// Storage & Evaluation System for THERMO CHAMPIONS
// Mendukung penyimpanan multi-pemain mandiri dan rekapitulasi penilaian 8 kelompok

import { EIGHT_GROUPS } from '../data/teamData';

// Predikat pencapaian resmi
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

// Buat ID unik pemain baru
export const createPlayerId = () => {
  return `tc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
};

// Ambil sesi pemain aktif saat ini
export const getCurrentPlayer = () => {
  try {
    const raw = localStorage.getItem('thermo_current_player');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Simpan sesi pemain aktif saat ini
export const setCurrentPlayer = (player) => {
  localStorage.setItem('thermo_current_player', JSON.stringify(player));
};

// Hapus sesi pemain aktif
export const clearCurrentPlayer = () => {
  localStorage.removeItem('thermo_current_player');
};

// Ambil seluruh rekor data pemain dari localStorage
export const getAllPlayers = () => {
  try {
    const raw = localStorage.getItem('thermo_players_records');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Simpan atau perbarui rekor pemain spesifik ke dalam daftar pemain
export const savePlayerRecord = (player) => {
  if (!player || !player.playerId) return;

  const allPlayers = getAllPlayers();
  const existingIndex = allPlayers.findIndex((p) => p.playerId === player.playerId);

  if (existingIndex !== -1) {
    allPlayers[existingIndex] = { ...allPlayers[existingIndex], ...player };
  } else {
    allPlayers.push(player);
  }

  localStorage.setItem('thermo_players_records', JSON.stringify(allPlayers));
  setCurrentPlayer(player);
};

// Rekapitulasi Leaderboard Individu:
// Hanya pemain yang sudah menyelesaikan seluruh 3 mode permainan, diurutkan nilai tertinggi
export const getIndividualLeaderboard = () => {
  const allPlayers = getAllPlayers();
  const completed = allPlayers.filter((p) => p.completed);

  // Urutkan nilai tertinggi (descending)
  completed.sort((a, b) => {
    if (b.nilaiAkhir !== a.nilaiAkhir) {
      return b.nilaiAkhir - a.nilaiAkhir;
    }
    // Jika nilai sama, prioritaskan nomor absen atau waktu pengerjaan
    return (a.nomorAbsen || 0) - (b.nomorAbsen || 0);
  });

  return completed;
};

// Rekapitulasi Penilaian 8 Kelompok:
// Rumus: Rata-rata Kelompok = Total Nilai Akhir Seluruh Anggota Selesai / Jumlah Anggota yang Sudah Menyelesaikan Permainan
// Pemain yang belum menyelesaikan ketiga mode TIDAK dihitung sebagai 0 dan TIDAK dimasukkan ke rata-rata
export const getGroupRecap = () => {
  const allPlayers = getAllPlayers();

  const recap = EIGHT_GROUPS.map((grp) => {
    // Semua pemain terdaftar di kelompok ini
    const members = allPlayers.filter((p) => p.kelompok === grp.name);
    
    // Hanya anggota yang sudah menyelesaikan seluruh 3 mode
    const completedMembers = members.filter((p) => p.completed);
    const completedCount = completedMembers.length;
    const totalRegisteredCount = members.length;

    const totalScore = completedMembers.reduce((sum, m) => sum + (Number(m.nilaiAkhir) || 0), 0);
    const averageScore = completedCount > 0 
      ? Math.round((totalScore / completedCount) * 10) / 10 
      : null;

    return {
      groupId: grp.id,
      groupName: grp.name,
      themeName: grp.themeName,
      badge: grp.badge,
      description: grp.description,
      totalRegisteredCount,
      completedCount,
      totalScore: Math.round(totalScore * 10) / 10,
      averageScore,
      completedMembers,
      allMembers: members
    };
  });

  // Urutkan peringkat kelompok:
  // 1. Kelompok dengan rata-rata tertinggi berada di urutan atas
  // 2. Kelompok yang belum memiliki anggota selesai ditempatkan di bawah
  recap.sort((a, b) => {
    if (a.averageScore !== null && b.averageScore !== null) {
      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore;
      }
      return b.completedCount - a.completedCount;
    }
    if (a.averageScore !== null && b.averageScore === null) return -1;
    if (a.averageScore === null && b.averageScore !== null) return 1;
    return a.groupId - b.groupId;
  });

  return recap;
};
