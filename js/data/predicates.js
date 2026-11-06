/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Predicate and Scoring Tiers
 */

export const PREDICATES = [
  {
    min: 86,
    max: 100,
    title: 'Thermo Champion',
    badge: '🏆',
    color: '#FACC15',
    glow: 'rgba(250, 204, 21, 0.4)',
    desc: 'Penguasaan luar biasa materi suhu dan pemuaian SMP! Memiliki kecepatan, ketelitian, dan kalkulasi konversi termometer tingkat master.'
  },
  {
    min: 76,
    max: 85,
    title: 'Thermo Expert',
    badge: '⚡',
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.4)',
    desc: 'Pemahaman konsep skala suhu dan daya hitung pemuaian yang sangat baik. Mampu menuntaskan tantangan fisika dengan tangguh.'
  },
  {
    min: 66,
    max: 75,
    title: 'Science Challenger',
    badge: '🔬',
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.4)',
    desc: 'Kompetensi sains solid. Berhasil mengingat konsep termometer dan menyelesaikan perhitungan konversi suhu dengan baik.'
  },
  {
    min: 56,
    max: 65,
    title: 'Thermo Explorer',
    badge: '🧭',
    color: '#F97316',
    glow: 'rgba(249, 115, 22, 0.4)',
    desc: 'Mulai memahami konsep skala suhu dan pemuaian bimetal, perlu memperdalam ketelitian rumus fisika.'
  },
  {
    min: 0,
    max: 55,
    title: 'Temperature Rookie',
    badge: '🧪',
    color: '#94A3B8',
    glow: 'rgba(148, 163, 184, 0.3)',
    desc: 'Terus berlatih! Pahami kembali konsep dasar skala Celsius, Reamur, Fahrenheit, Kelvin, dan rumus pemuaian.'
  }
];

export function getPredicate(score) {
  const rounded = Math.round(Number(score) || 0);
  for (const p of PREDICATES) {
    if (rounded >= p.min && rounded <= p.max) {
      return p;
    }
  }
  return PREDICATES[PREDICATES.length - 1];
}

export const GAME_MAX_SCORES = {
  game1: 30, // Shuffle and Recall (Suhu & Termometer)
  game2: 35, // Word Scramble (Istilah Suhu)
  game3: 35  // Extreme Addition: Temperature & Expansion Calculation
};
