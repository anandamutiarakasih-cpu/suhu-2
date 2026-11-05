/**
 * THERMO CHAMPIONS — PURE VANILLA JAVASCRIPT GAME ENGINE
 * Mata Pelajaran: IPA Kelas VII SMP — Materi Suhu
 * Sistem Permainan Berkelompok (8 Kelompok, Satu Sesi per Kelompok)
 */

// ==========================================================================
// 1. WEB AUDIO API SYNTHESIZER (100% Offline & Native)
// ==========================================================================
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('thermo_muted') === 'true';
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('thermo_muted', this.muted);
    return this.muted;
  }

  click() {
    if (this.muted) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  correct() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.3);
      });
    } catch (e) {}
  }

  wrong() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  tick() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  fanfare() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 523.25, d: 0.12, t: 0.12 },
        { f: 523.25, d: 0.12, t: 0.24 },
        { f: 659.25, d: 0.35, t: 0.36 },
        { f: 587.33, d: 0.15, t: 0.72 },
        { f: 783.99, d: 0.55, t: 0.88 },
      ];
      melody.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);
        gain.gain.setValueAtTime(0.2, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + note.t);
        osc.stop(now + note.t + note.d);
      });
    } catch (e) {}
  }
}

const sound = new SoundSynthesizer();

// ==========================================================================
// 2. DATASETS (8 Kelompok, Soal Kuis, Kartu Memori, & Rantai Hitungan)
// ==========================================================================

const EIGHT_GROUPS = [
  { id: 1, name: 'Kelompok 1', badge: '🌡️', theme: 'Skala Celsius (0°C – 100°C)', color: '#0284c7' },
  { id: 2, name: 'Kelompok 2', badge: '🔥', theme: 'Skala Fahrenheit (32°F – 212°F)', color: '#ea580c' },
  { id: 3, name: 'Kelompok 3', badge: '⚗️', theme: 'Skala Reamur (0°R – 80°R)', color: '#059669' },
  { id: 4, name: 'Kelompok 4', badge: '❄️', theme: 'Skala Kelvin (Satuan SI)', color: '#7c3aed' },
  { id: 5, name: 'Kelompok 5', badge: '⚙️', theme: 'Termometer Bimetal Industri', color: '#475569' },
  { id: 6, name: 'Kelompok 6', badge: '🎯', theme: 'Termometer Pirometer Optik', color: '#e11d48' },
  { id: 7, name: 'Kelompok 7', badge: '⚡', theme: 'Termometer Termokopel Listrik', color: '#d97706' },
  { id: 8, name: 'Kelompok 8', badge: '⚖️', theme: 'Prinsip Kesetimbangan Termal', color: '#1e3a8a' }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    topic: 'Pengertian Suhu',
    question: 'Pernyataan yang paling tepat mengenai pengertian suhu adalah...',
    options: [
      { key: 'A', text: 'Banyaknya energi panas yang berpindah dari benda panas ke dingin' },
      { key: 'B', text: 'Ukuran derajat panas atau dinginnya suatu benda secara kuantitatif' },
      { key: 'C', text: 'Perubahan wujud zat akibat menerima kalor dari lingkungan' },
      { key: 'D', text: 'Pertambahan volume zat ketika dipanaskan pada ruang terbuka' }
    ],
    correctAnswer: 'B',
    explanation: 'Suhu adalah ukuran derajat panas atau dinginnya suatu benda. Energi panas yang berpindah disebut kalor.'
  },
  {
    id: 2,
    topic: 'Fungsi Termometer',
    question: 'Mengapa indra peraba (kulit manusia) tidak dapat dijadikan alat ukur suhu yang baku?',
    options: [
      { key: 'A', text: 'Kulit tidak peka terhadap perubahan suhu lingkungan' },
      { key: 'B', text: 'Kulit hanya dapat mengukur zat cair saja' },
      { key: 'C', text: 'Pengukuran kulit bersifat subjektif dan tidak menunjukkan angka pasti' },
      { key: 'D', text: 'Kulit selalu menunjukkan suhu yang lebih tinggi dari aslinya' }
    ],
    correctAnswer: 'C',
    explanation: 'Kulit hanya merasakan sensasi hangat/dingin secara kualitatif dan subjektif tanpa nilai angka pasti.'
  },
  {
    id: 3,
    topic: 'Jenis Termometer',
    question: 'Termometer klinis (badan) memiliki lekukan kapiler menyempit di atas reservoir. Tujuannya adalah...',
    options: [
      { key: 'A', text: 'Mencegah raksa turun cepat saat termometer diangkat dari tubuh pasien' },
      { key: 'B', text: 'Mempercepat pemuaian cairan raksa saat terkena panas' },
      { key: 'C', text: 'Memperluas rentang skala pengukuran suhu tubuh' },
      { key: 'D', text: 'Menghindari gelembung udara masuk ke tabung' }
    ],
    correctAnswer: 'A',
    explanation: 'Lekukan kapiler (konstriksi) menahan kolom raksa agar tidak langsung turun saat dibaca dokter/guru.'
  },
  {
    id: 4,
    topic: 'Prinsip Pengukuran Suhu',
    question: 'Prinsip kesetimbangan suhu (kesetimbangan termal) pada termometer terjadi saat...',
    options: [
      { key: 'A', text: 'Suhu termometer lebih tinggi dibanding benda yang diukur' },
      { key: 'B', text: 'Cairan termometer menguap hingga batas paling atas' },
      { key: 'C', text: 'Suhu termometer telah sama persis dengan suhu benda yang diukur' },
      { key: 'D', text: 'Terjadi aliran kalor terus menerus tanpa henti' }
    ],
    correctAnswer: 'C',
    explanation: 'Kesetimbangan termal tercapai saat perpindahan kalor berhenti karena suhu benda dan termometer sudah sama.'
  },
  {
    id: 5,
    topic: 'Skala Celsius',
    question: 'Anders Celsius menetapkan titik tetap bawah skala Celsius (0°C) berdasarkan...',
    options: [
      { key: 'A', text: 'Suhu titik beku larutan garam dapur jenuh' },
      { key: 'B', text: 'Suhu titik lebur es murni pada tekanan normal 1 atmosfer' },
      { key: 'C', text: 'Suhu rata-rata tubuh manusia normal' },
      { key: 'D', text: 'Suhu terendah yang ada di laboratorium kutub' }
    ],
    correctAnswer: 'B',
    explanation: 'Titik tetap bawah Celsius (0°C) adalah suhu es murni yang melebur pada tekanan normal 1 atm.'
  },
  {
    id: 6,
    topic: 'Skala Fahrenheit',
    question: 'Pada skala Fahrenheit, air murni mendidih pada tekanan 1 atmosfer menunjukkan angka...',
    options: [
      { key: 'A', text: '100°F' },
      { key: 'B', text: '180°F' },
      { key: 'C', text: '212°F' },
      { key: 'D', text: '273°F' }
    ],
    correctAnswer: 'C',
    explanation: 'Skala Fahrenheit memiliki titik lebur 32°F dan titik didih air 212°F.'
  },
  {
    id: 7,
    topic: 'Skala Reamur',
    question: 'Rentang jumlah skala antara titik tetap bawah dan titik tetap atas pada termometer Reamur adalah...',
    options: [
      { key: 'A', text: '80 skala' },
      { key: 'B', text: '100 skala' },
      { key: 'C', text: '180 skala' },
      { key: 'D', text: '273 skala' }
    ],
    correctAnswer: 'A',
    explanation: 'Reamur memiliki titik bawah 0°R dan titik atas 80°R, sehingga rentangnya adalah 80 skala.'
  },
  {
    id: 8,
    topic: 'Skala Kelvin',
    question: 'Skala Kelvin tidak menggunakan tanda derajat (°) dan menjadi Satuan Internasional (SI) karena...',
    options: [
      { key: 'A', text: 'Diciptakan sebelum skala Celsius dan Fahrenheit' },
      { key: 'B', text: 'Titik nol mutlaknya (0 K) adalah saat energi kinetik partikel berhenti' },
      { key: 'C', text: 'Nilai suhunya selalu berbentuk pecahan desimal' },
      { key: 'D', text: 'Hanya dapat dipakai untuk mengukur zat padat' }
    ],
    correctAnswer: 'B',
    explanation: 'Kelvin adalah skala mutlak termodinamika. 0 K adalah kondisi teoritis partikel berhenti bergerak.'
  },
  {
    id: 9,
    topic: 'Titik Tetap Suhu',
    question: 'Perbandingan rentang skala C : R : (F - 32) : (K - 273) yang paling sederhana adalah...',
    options: [
      { key: 'A', text: '5 : 4 : 9 : 5' },
      { key: 'B', text: '5 : 4 : 10 : 5' },
      { key: 'C', text: '4 : 5 : 9 : 4' },
      { key: 'D', text: '10 : 8 : 18 : 10' }
    ],
    correctAnswer: 'A',
    explanation: 'Rentang 100 : 80 : 180 : 100 jika dibagi FPB yaitu 20 menghasilkan perbandingan 5 : 4 : 9 : 5.'
  },
  {
    id: 10,
    topic: 'Konversi Suhu Sederhana',
    question: 'Suhu suatu zat cair diukur sebesar 25°C. Jika dinyatakan dalam skala Reamur, besarnya adalah...',
    options: [
      { key: 'A', text: '15°R' },
      { key: 'B', text: '20°R' },
      { key: 'C', text: '28°R' },
      { key: 'D', text: '45°R' }
    ],
    correctAnswer: 'B',
    explanation: 'Rumus: R = 4/5 × C. Maka R = 4/5 × 25 = 20°R.'
  }
];

const MEMORY_CARDS = [
  { id: 1, cat: 'Celsius', title: 'Titik Tetap Bawah', fact: '0°C', desc: 'Titik lebur es murni' },
  { id: 2, cat: 'Celsius', title: 'Titik Tetap Atas', fact: '100°C', desc: 'Titik didih air murni' },
  { id: 3, cat: 'Fahrenheit', title: 'Titik Tetap Bawah', fact: '32°F', desc: 'Titik lebur es murni' },
  { id: 4, cat: 'Fahrenheit', title: 'Titik Tetap Atas', fact: '212°F', desc: 'Titik didih air murni' },
  { id: 5, cat: 'Reamur', title: 'Titik Tetap Bawah', fact: '0°R', desc: 'Titik lebur es murni' },
  { id: 6, cat: 'Reamur', title: 'Titik Tetap Atas', fact: '80°R', desc: 'Titik didih air murni' },
  { id: 7, cat: 'Kelvin', title: 'Titik Tetap Bawah', fact: '273 K', desc: 'Titik lebur es (Satuan SI)' },
  { id: 8, cat: 'Kelvin', title: 'Titik Tetap Atas', fact: '373 K', desc: 'Titik didih air (Satuan SI)' },
  { id: 9, cat: 'Instrumen', title: 'Termometer', fact: 'Pengukur Suhu', desc: 'Alat pengukur derajat suhu baku' },
  { id: 10, cat: 'Konsep', title: 'Kesetimbangan Suhu', fact: 'Suhu Benda = Termometer', desc: 'Kondisi kedua suhu telah sama' }
];

const RECALL_QUESTIONS = [
  { id: 1, cardId: 1, prompt: 'Berapakah nilai titik tetap bawah pada termometer Celsius?', options: ['0°C', '32°C', '100°C', '273°C'], answer: '0°C', exp: 'Kartu 1: Titik tetap bawah Celsius adalah 0°C.' },
  { id: 2, cardId: 2, prompt: 'Berapakah nilai titik tetap atas pada termometer Celsius?', options: ['80°C', '100°C', '212°C', '373°C'], answer: '100°C', exp: 'Kartu 2: Titik tetap atas Celsius adalah 100°C.' },
  { id: 3, cardId: 3, prompt: 'Pada skala Fahrenheit, berapakah nilai titik tetap bawahnya?', options: ['0°F', '12°F', '32°F', '80°F'], answer: '32°F', exp: 'Kartu 3: Titik tetap bawah Fahrenheit adalah 32°F.' },
  { id: 4, cardId: 4, prompt: 'Berapakah nilai titik tetap atas skala Fahrenheit yang dihafal?', options: ['100°F', '180°F', '212°F', '273°F'], answer: '212°F', exp: 'Kartu 4: Titik tetap atas Fahrenheit adalah 212°F.' },
  { id: 5, cardId: 5, prompt: 'Berapakah nilai titik tetap bawah skala Reamur?', options: ['-10°R', '0°R', '32°R', '80°R'], answer: '0°R', exp: 'Kartu 5: Titik tetap bawah Reamur adalah 0°R.' },
  { id: 6, cardId: 6, prompt: 'Berapakah nilai titik tetap atas pada skala Reamur?', options: ['80°R', '100°R', '180°R', '212°R'], answer: '80°R', exp: 'Kartu 6: Titik tetap atas Reamur adalah 80°R.' },
  { id: 7, cardId: 7, prompt: 'Berapakah nilai titik tetap bawah pada skala Kelvin?', options: ['0 K', '100 K', '273 K', '373 K'], answer: '273 K', exp: 'Kartu 7: Titik tetap bawah Kelvin adalah 273 K.' },
  { id: 8, cardId: 8, prompt: 'Berapakah nilai titik tetap atas pada skala Kelvin?', options: ['100 K', '273 K', '312 K', '373 K'], answer: '373 K', exp: 'Kartu 8: Titik tetap atas Kelvin adalah 373 K.' },
  { id: 9, cardId: 9, prompt: 'Berdasarkan kartu informasi, apa fungsi utama dari Termometer?', options: ['Alat pengukur derajat suhu baku', 'Alat pengukur volume air', 'Alat pengubah wujud zat', 'Alat pengukur massa jenis'], answer: 'Alat pengukur derajat suhu baku', exp: 'Kartu 9: Termometer adalah alat pengukur suhu.' },
  { id: 10, cardId: 10, prompt: 'Apa yang dimaksud dengan kondisi kesetimbangan suhu pada kartu?', options: ['Kondisi ketika suhu benda dan termometer sudah sama', 'Kondisi air mendidih sempurna', 'Suhu cairan termometer turun mendadak', 'Perbedaan suhu maksimum kedua benda'], answer: 'Kondisi ketika suhu benda dan termometer sudah sama', exp: 'Kartu 10: Kesetimbangan suhu adalah saat suhu benda = termometer.' }
];

const NUMBER_CHAIN_STAGES = [
  {
    stage: 1,
    difficulty: 'Easy',
    title: 'Tahap 1: Konversi Celsius ke Fahrenheit',
    desc: 'Suhu suatu zat cair terukur sebesar 30°C. Hitunglah nilai suhu tersebut jika dinyatakan dalam skala Fahrenheit!',
    given: '30°C',
    targetUnit: '°F',
    maxPoints: 7,
    formula: 'F = (9/5 × C) + 32',
    steps: [
      { id: 's1', label: 'Hasil dalam skala Fahrenheit (°F)', target: 86, unit: '°F', weight: 7, solution: 'F = (9/5 × 30) + 32 = 54 + 32 = 86°F' }
    ]
  },
  {
    stage: 2,
    difficulty: 'Easy',
    title: 'Tahap 2: Konversi Celsius ke Reamur',
    desc: 'Air di dalam lab bersuhu 40°C. Berapakah nilai suhunya jika dinyatakan dalam skala Reamur?',
    given: '40°C',
    targetUnit: '°R',
    maxPoints: 7,
    formula: 'R = 4/5 × C',
    steps: [
      { id: 's2', label: 'Hasil dalam skala Reamur (°R)', target: 32, unit: '°R', weight: 7, solution: 'R = 4/5 × 40 = 4 × 8 = 32°R' }
    ]
  },
  {
    stage: 3,
    difficulty: 'Medium',
    title: 'Tahap 3: Konversi Celsius ke Kelvin (Satuan SI)',
    desc: 'Suhu ruangan kelas terbaca sebesar 27°C. Konversikan nilai suhu tersebut ke dalam skala Kelvin (Satuan Internasional)!',
    given: '27°C',
    targetUnit: 'K',
    maxPoints: 7,
    formula: 'K = C + 273',
    steps: [
      { id: 's3', label: 'Hasil dalam Kelvin (K)', target: 300, unit: 'K', weight: 7, solution: 'K = 27 + 273 = 300 K' }
    ]
  },
  {
    stage: 4,
    difficulty: 'Medium',
    title: 'Tahap 4: Konversi Fahrenheit ke Celsius',
    desc: 'Sebuah termometer Fahrenheit menunjukkan angka 212°F pada titik didih air. Hitunglah nilai suhunya dalam Celsius!',
    given: '212°F',
    targetUnit: '°C',
    maxPoints: 7,
    formula: 'C = 5/9 × (F - 32)',
    steps: [
      { id: 's4', label: 'Hasil dalam skala Celsius (°C)', target: 100, unit: '°C', weight: 7, solution: 'C = 5/9 × (212 - 32) = 5/9 × 180 = 100°C' }
    ]
  },
  {
    stage: 5,
    difficulty: 'Hard',
    title: 'Tahap 5: Rantai Bertingkat (Reamur → Celsius → Fahrenheit)',
    desc: 'Tantangan Master! Cairan bersuhu 60°R. Hitung rantai: pertama ubah 60°R ke Celsius, lalu ubah hasil Celsius tersebut ke Fahrenheit!',
    given: '60°R',
    targetUnit: '°C & °F',
    maxPoints: 7,
    formula: 'Langkah A: C = 5/4 × R  |  Langkah B: F = (9/5 × C) + 32',
    steps: [
      { id: 's5_a', label: 'Langkah A: Ubah 60°R ke Celsius (°C)', target: 75, unit: '°C', weight: 3.5, solution: 'C = 5/4 × 60 = 75°C' },
      { id: 's5_b', label: 'Langkah B: Ubah 75°C ke Fahrenheit (°F)', target: 167, unit: '°F', weight: 3.5, solution: 'F = (9/5 × 75) + 32 = 135 + 32 = 167°F' }
    ]
  }
];

// Predikat pencapaian resmi
function getPredicateInfo(score) {
  const rounded = Math.round(score * 10) / 10;
  if (rounded >= 86) {
    return {
      title: 'THERMO CHAMPION',
      badge: '🏆',
      bgClass: 'predicate-champ',
      msg: 'Luar biasa! Seluruh anggota kelompok membuktikan penguasaan konsep suhu dan hitungan tingkat master!'
    };
  }
  if (rounded >= 76) {
    return {
      title: 'THERMO EXPERT',
      badge: '🎖️',
      bgClass: 'predicate-expert',
      msg: 'Hebat sekali! Kerjasama kelompok sangat solid dengan pemahaman konsep dan konversi yang tinggi.'
    };
  }
  if (rounded >= 66) {
    return {
      title: 'SCIENCE CHALLENGER',
      badge: '⚡',
      bgClass: 'predicate-challenger',
      msg: 'Kerja tim yang baik! Kelompok memiliki potensi sains yang menjanjikan dalam penalaran numerik.'
    };
  }
  if (rounded >= 56) {
    return {
      title: 'THERMO EXPLORER',
      badge: '🔍',
      bgClass: 'predicate-explorer',
      msg: 'Cukup baik. Tingkatkan lagi ketelitian diskusi pada langkah konversi bersuhu Fahrenheit.'
    };
  }
  return {
    title: 'TEMPERATURE ROOKIE',
    badge: '📘',
    bgClass: 'predicate-rookie',
    msg: 'Awal yang baik. Pelajari kembali materi perbandingan skala suhu bersama dan coba lagi!'
  };
}

// ==========================================================================
// 3. STORAGE SYSTEM (Satu Sesi & Rekor Per Kelompok)
// ==========================================================================

function getSavedGroups() {
  try {
    const raw = localStorage.getItem('thermo_groups_records');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveGroupRecordToStorage(record) {
  const records = getSavedGroups();
  const idx = records.findIndex(r => r.nomorKelompok === record.nomorKelompok);
  if (idx !== -1) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem('thermo_groups_records', JSON.stringify(records));
  localStorage.setItem('thermo_active_group', JSON.stringify(record));
}

function getActiveGroup() {
  try {
    const raw = localStorage.getItem('thermo_active_group');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearActiveGroup() {
  localStorage.removeItem('thermo_active_group');
}

// Leaderboard kelompok resmi diurutkan:
// 1. Nilai akhir tertinggi
// 2. Jika sama: Akurasi tertinggi
// 3. Jika sama: Waktu tercepat
function getGroupLeaderboardData() {
  const records = getSavedGroups();
  const finished = records.filter(r => r.statusPermainan === 'selesai');
  finished.sort((a, b) => {
    if (b.nilaiAkhir !== a.nilaiAkhir) {
      return b.nilaiAkhir - a.nilaiAkhir;
    }
    if ((b.akurasi || 0) !== (a.akurasi || 0)) {
      return (b.akurasi || 0) - (a.akurasi || 0);
    }
    return (a.waktuPenyelesaian || 99999) - (b.waktuPenyelesaian || 99999);
  });
  return finished;
}

// ==========================================================================
// 4. EMBEDDED CONFETTI CANVAS ENGINE (100% Offline)
// ==========================================================================
function launchConfetti() {
  try {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#38BDF8', '#F97316', '#22C55E', '#F59E0B', '#6366F1', '#EC4899'];
    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velY: Math.random() * 3 + 2,
        velX: (Math.random() - 0.5) * 4,
        rot: Math.random() * 360
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.velY;
        p.x += p.velX;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      frame++;
      if (frame < 120) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(render);
  } catch (e) {}
}

// ==========================================================================
// 5. APPLICATION CONTROLLER
// ==========================================================================

class ThermoChampionsApp {
  constructor() {
    this.currentGroup = getActiveGroup();
    this.selectedGroupId = 1;
    this.membersList = [
      { nama: '', nomorAbsen: '' },
      { nama: '', nomorAbsen: '' },
      { nama: '', nomorAbsen: '' },
      { nama: '', nomorAbsen: '' }
    ];

    // Multiplayer Online State (Supabase Realtime)
    this.onlineSession = null;
    this.onlineGroups = [];
    this.realtimeChannel = null;
    this.heartbeatTimer = null;

    // Mode 1 state
    this.quizIndex = 0;
    this.quizSelected = null;
    this.quizAnswered = false;
    this.quizTimer = 30;
    this.quizInterval = null;
    this.quizHistory = [];
    this.quizStartTime = 0;

    // Mode 2 state
    this.memPhase = 'memorize'; // 'memorize' | 'recall'
    this.memTimer = 30;
    this.memInterval = null;
    this.recallIndex = 0;
    this.recallSelected = null;
    this.recallAnswered = false;
    this.recallTimer = 25;
    this.recallInterval = null;
    this.recallHistory = [];
    this.memStartTime = 0;

    // Mode 3 state
    this.calcStageIdx = 0;
    this.calcSubmitted = false;
    this.calcResults = [];
    this.calcStartTime = 0;
    this.calcShowHint = false;

    // Total gameplay timer
    this.totalTimerStart = 0;

    this.init();
  }

  async init() {
    this.render8GroupButtons();
    this.renderDynamicMembersRows();
    this.updateSummaryBox();
    this.setupEventListeners();
    this.setupThermometerSimulator();
    this.setupFormulaCalculator();

    // Check active group & online session restoration
    await this.restoreSessionState();

    if (this.currentGroup) {
      this.updateNavbarGroupChip();
      if (this.currentGroup.statusPermainan === 'in_lobby' && this.onlineSession && this.onlineSession.status === 'waiting') {
        this.showView('lobby');
        this.renderLobbyView();
      } else {
        this.showView('dashboard');
        this.renderDashboard();
      }
    } else {
      this.showView('landing');
    }
  }

  async restoreSessionState() {
    const savedCode = localStorage.getItem('thermo_online_session_code');
    if (savedCode) {
      try {
        const session = await ThermoDB.getSessionByCode(savedCode);
        if (session) {
          this.onlineSession = session;
          this.updateNavbarSessionPill(session.session_code);
          await this.syncSessionGroups();
          this.setupRealtimeListeners(session.id);
          if (this.currentGroup) {
            this.startHeartbeat();
          }
        }
      } catch (e) {
        console.warn('Could not restore online session state:', e);
      }
    }
  }

  async checkSessionCode(inputCode) {
    const codeInput = document.getElementById('input-session-code');
    const code = (inputCode || (codeInput ? codeInput.value : '') || '').trim().toUpperCase();
    const fb = document.getElementById('session-code-feedback');
    const tag = document.getElementById('session-status-tag');
    if (!code) {
      if (fb) fb.textContent = 'Masukkan kode sesi dari Guru/Admin (misal: TC-8899).';
      return false;
    }

    try {
      if (fb) fb.textContent = 'Memeriksa kode sesi ke database...';
      const session = await ThermoDB.getSessionByCode(code);
      if (!session) {
        if (fb) fb.innerHTML = `<span style="color:var(--error);">Kode sesi "${code}" tidak ditemukan! Periksa kembali atau tanyakan Guru.</span>`;
        if (tag) tag.textContent = 'TIDAK DITEMUKAN';
        sound.wrong();
        return false;
      }

      this.onlineSession = session;
      localStorage.setItem('thermo_online_session_code', session.session_code);
      this.updateNavbarSessionPill(session.session_code);
      if (fb) fb.innerHTML = `<span style="color:var(--success); font-weight:700;">✓ Sesi Terhubung: "${session.title}" (${session.status.toUpperCase()})</span>`;
      if (tag) {
        tag.textContent = `TERHUBUNG [${session.session_code}]`;
        tag.style.background = '#dcfce7';
        tag.style.color = '#15803d';
      }
      sound.correct();

      await this.syncSessionGroups();
      this.render8GroupButtons();
      return true;
    } catch (err) {
      if (err.code === 'PGRST205' || err.message?.includes('schema cache') || err.message?.includes('not find the table')) {
        if (fb) fb.innerHTML = '<span style="color:var(--error); font-weight:700;">⚠️ Tabel database belum siap di Supabase. Guru perlu menjalankan file schema.sql di Supabase SQL Editor.</span>';
      } else {
        if (fb) fb.textContent = 'Gagal memeriksa sesi: ' + (err.message || err);
      }
      return false;
    }
  }

  async syncSessionGroups() {
    if (!this.onlineSession) return;
    try {
      const groups = await ThermoDB.getGroups(this.onlineSession.id);
      this.onlineGroups = groups;
    } catch (e) {
      console.warn('Error syncing session groups:', e);
    }
  }

  updateNavbarSessionPill(code) {
    const pill = document.getElementById('nav-session-pill');
    const text = document.getElementById('nav-session-code');
    if (pill && text) {
      if (code) {
        pill.style.display = 'inline-flex';
        text.textContent = `SESI: ${code}`;
      } else {
        pill.style.display = 'none';
      }
    }
  }

  showView(viewName) {
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  updateNavbarGroupChip() {
    const pill = document.getElementById('nav-group-pill');
    const guestBtn = document.getElementById('nav-guest-btn');
    if (!pill || !guestBtn) return;

    if (this.currentGroup) {
      pill.style.display = 'flex';
      guestBtn.style.display = 'none';
      document.getElementById('nav-chip-icon').textContent = this.currentGroup.badge || '👥';
      document.getElementById('nav-chip-name').textContent = this.currentGroup.namaKelompok;
      document.getElementById('nav-chip-nomor').textContent = this.currentGroup.nomorKelompok;
      document.getElementById('nav-chip-score').textContent = `${this.currentGroup.nilaiAkhir || 0} / 100 Pts`;
    } else {
      pill.style.display = 'none';
      guestBtn.style.display = 'inline-flex';
    }
  }

  // ========================================================================
  // SELECTION OF 8 GROUPS (Grid 2 Kolom x 4 Baris)
  // ========================================================================
  render8GroupButtons() {
    const container = document.getElementById('groups-grid-container');
    if (!container) return;
    container.innerHTML = '';

    const myToken = typeof getDeviceToken === 'function' ? getDeviceToken() : '';
    const occupiedMap = {};
    if (this.onlineGroups && this.onlineGroups.length > 0) {
      this.onlineGroups.forEach(g => {
        occupiedMap[g.group_number] = g;
      });
    }

    EIGHT_GROUPS.forEach(grp => {
      const isSelected = this.selectedGroupId === grp.id;
      const occupiedBy = occupiedMap[grp.id];
      const isOccupiedByOther = occupiedBy && occupiedBy.device_token !== myToken;

      const btn = document.createElement('div');
      btn.className = `group-card-btn ${isSelected ? 'selected' : ''} ${isOccupiedByOther ? 'occupied' : ''}`;

      let subtitle = grp.theme;
      if (isOccupiedByOther) {
        subtitle = `⚠️ Sudah diambil device lain: "${occupiedBy.group_name}"`;
      } else if (occupiedBy && occupiedBy.device_token === myToken) {
        subtitle = `✓ Perangkat Anda terdaftar: "${occupiedBy.group_name}"`;
      }

      btn.innerHTML = `
        <div class="group-card-content">
          <div class="group-card-icon">${grp.badge}</div>
          <div>
            <div class="group-card-title">${grp.name.toUpperCase()} ${isOccupiedByOther ? '(TERPAKAI)' : ''}</div>
            <div class="group-card-subtitle">${subtitle}</div>
          </div>
        </div>
        <div class="group-card-check">${isSelected ? '✓' : ''}</div>
      `;

      btn.addEventListener('click', () => {
        if (isOccupiedByOther) {
          sound.wrong();
          alert(`Kelompok ${grp.id} sudah diambil oleh perangkat lain pada sesi ini! Silakan pilih nomor kelompok yang masih kosong.`);
          return;
        }
        sound.click();
        this.selectedGroupId = grp.id;
        this.render8GroupButtons();
        this.updateSummaryBox();
      });

      container.appendChild(btn);
    });

    const activeGrp = EIGHT_GROUPS.find(g => g.id === this.selectedGroupId);
    const selectedBanner = document.getElementById('selected-group-banner-text');
    if (selectedBanner && activeGrp) {
      selectedBanner.textContent = `Kelompok yang dipilih: ${activeGrp.name}`;
      document.getElementById('selected-group-banner-icon').textContent = activeGrp.badge;
    }
  }

  // ========================================================================
  // FORM IDENTITAS KELOMPOK (+ Tambah Anggota)
  // ========================================================================
  renderDynamicMembersRows() {
    const list = document.getElementById('members-dynamic-list');
    if (!list) return;
    list.innerHTML = '';

    this.membersList.forEach((m, idx) => {
      const row = document.createElement('div');
      row.className = 'member-row';
      row.innerHTML = `
        <input type="text" class="form-input member-name-input" placeholder="Nama Lengkap Anggota ${idx + 1}" value="${m.nama || ''}" data-idx="${idx}" />
        <input type="number" min="1" max="100" class="form-input member-absen-input" placeholder="No. Absen" value="${m.nomorAbsen || ''}" data-idx="${idx}" />
        <button type="button" class="btn-delete-member" data-idx="${idx}" title="Hapus Anggota" ${this.membersList.length <= 1 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>✕</button>
      `;
      list.appendChild(row);
    });

    // Listeners for inputs
    list.querySelectorAll('.member-name-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.target.dataset.idx);
        this.membersList[idx].nama = e.target.value;
        this.updateSummaryBox();
      });
    });

    list.querySelectorAll('.member-absen-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.target.dataset.idx);
        this.membersList[idx].nomorAbsen = e.target.value;
        this.updateSummaryBox();
      });
    });

    list.querySelectorAll('.btn-delete-member').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.click();
        const idx = Number(e.currentTarget.dataset.idx);
        if (this.membersList.length > 1) {
          this.membersList.splice(idx, 1);
          this.renderDynamicMembersRows();
          this.updateSummaryBox();
        }
      });
    });
  }

  addMemberRow() {
    sound.click();
    this.membersList.push({ nama: '', nomorAbsen: '' });
    this.renderDynamicMembersRows();
    this.updateSummaryBox();
  }

  updateSummaryBox() {
    const activeGrp = EIGHT_GROUPS.find(g => g.id === this.selectedGroupId) || EIGHT_GROUPS[0];
    const namaKelompokInput = document.getElementById('input-nama-kelompok');
    const namaKelompokVal = (namaKelompokInput ? namaKelompokInput.value.trim() : '') || '[Ketik Nama Kelompok]';

    const validMembers = this.membersList.filter(m => m.nama.trim() !== '');

    document.getElementById('sum-nomor-kelompok').textContent = activeGrp.name;
    document.getElementById('sum-nama-kelompok').textContent = namaKelompokVal;
    document.getElementById('sum-total-anggota').textContent = `${validMembers.length} Orang Terdaftar`;

    const membersUl = document.getElementById('sum-members-preview');
    if (membersUl) {
      if (validMembers.length === 0) {
        membersUl.innerHTML = '<li class="text-slate-400 italic">Belum ada anggota diisi</li>';
      } else {
        membersUl.innerHTML = validMembers.map(m => `
          <li><strong>${m.nama}</strong> ${m.nomorAbsen ? `(Absen ${m.nomorAbsen})` : ''}</li>
        `).join('');
      }
    }
  }

  async confirmAndStartGroup() {
    const namaKelompokInput = document.getElementById('input-nama-kelompok');
    const namaKelompok = namaKelompokInput ? namaKelompokInput.value.trim() : '';

    if (!namaKelompok) {
      sound.wrong();
      alert('Mohon isi Nama Kelompok terlebih dahulu!');
      if (namaKelompokInput) namaKelompokInput.focus();
      return;
    }

    // Validasi agar minimal 1 anggota terisi dan nomor absen hanya berupa angka positif
    for (let i = 0; i < this.membersList.length; i++) {
      const m = this.membersList[i];
      if (m.nama.trim() !== '') {
        const num = parseInt(m.nomorAbsen, 10);
        if (isNaN(num) || num <= 0) {
          sound.wrong();
          alert(`Nomor absen untuk "${m.nama.trim()}" harus berupa angka positif!`);
          return;
        }
      }
    }

    const validMembers = this.membersList
      .filter(m => m.nama.trim() !== '')
      .map(m => ({
        nama: m.nama.trim(),
        nomorAbsen: parseInt(m.nomorAbsen, 10)
      }));

    if (validMembers.length === 0) {
      sound.wrong();
      alert('Mohon masukkan minimal 1 nama anggota kelompok beserta nomor absennya!');
      return;
    }

    const selectedGroupDef = EIGHT_GROUPS.find(g => g.id === this.selectedGroupId) || EIGHT_GROUPS[0];

    // Check if session code was typed
    const sessionCodeInput = document.getElementById('input-session-code');
    const sessionCode = sessionCodeInput ? sessionCodeInput.value.trim().toUpperCase() : '';
    if (sessionCode && !this.onlineSession) {
      const ok = await this.checkSessionCode(sessionCode);
      if (!ok) return;
    }

    // Buat data kelompok sesuai struktur Section 8
    const groupRecord = {
      groupId: `tc_kelompok_${selectedGroupDef.id}`,
      nomorKelompok: selectedGroupDef.name,
      nomorKelompokInt: selectedGroupDef.id,
      namaKelompok: namaKelompok,
      badge: selectedGroupDef.badge,
      theme: selectedGroupDef.theme,
      anggota: validMembers,
      skorStarChamp: 0,
      skorMemoryMadness: 0,
      skorNumberChains: 0,
      nilaiAkhir: 0,
      predikat: 'TEMPERATURE ROOKIE',
      akurasi: 0,
      waktuPenyelesaian: 0,
      statusPermainan: 'in_lobby',
      tanggalPermainan: new Date().toISOString(),
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

    // Online Multiplayer Join via Supabase
    if (this.onlineSession) {
      try {
        const joined = await ThermoDB.joinGroup(
          this.onlineSession.id,
          selectedGroupDef.id,
          namaKelompok,
          validMembers,
          selectedGroupDef.badge,
          selectedGroupDef.theme
        );
        groupRecord.dbId = joined.id;
        this.currentGroup = groupRecord;
        saveGroupRecordToStorage(groupRecord);
        localStorage.setItem('thermo_online_session_code', this.onlineSession.session_code);
        this.updateNavbarGroupChip();
        this.setupRealtimeListeners(this.onlineSession.id);
        this.startHeartbeat();

        if (this.onlineSession.status === 'started') {
          this.totalTimerStart = this.onlineSession.started_at ? new Date(this.onlineSession.started_at).getTime() : Date.now();
          sound.fanfare();
          this.showView('dashboard');
          this.renderDashboard();
        } else {
          sound.click();
          this.showView('lobby');
          this.renderLobbyView();
        }
        return;
      } catch (err) {
        sound.wrong();
        alert('Gagal bergabung ke sesi turnamen: ' + (err.message || err));
        return;
      }
    }

    // Offline / Local Practice Mode fallback
    groupRecord.statusPermainan = 'sedang_bermain';
    saveGroupRecordToStorage(groupRecord);
    this.currentGroup = groupRecord;
    this.totalTimerStart = Date.now();

    sound.fanfare();
    this.updateNavbarGroupChip();
    this.showView('dashboard');
    this.renderDashboard();
  }

  renderLobbyView() {
    if (!this.onlineSession || !this.currentGroup) return;

    document.getElementById('lobby-session-code').textContent = this.onlineSession.session_code;
    document.getElementById('lobby-team-name').textContent = `${this.currentGroup.nomorKelompok} (${this.currentGroup.namaKelompok})`;

    const membersContainer = document.getElementById('lobby-members-list');
    if (membersContainer) {
      membersContainer.innerHTML = this.currentGroup.anggota.map(m => `
        <span style="background:#e0f2fe; color:var(--deepblue); padding:0.2rem 0.5rem; border-radius:0.25rem; font-size:0.75rem; font-weight:700;">
          ${m.nama} (No. ${m.nomorAbsen})
        </span>
      `).join('');
    }

    this.renderLobbySlots();
  }

  renderLobbySlots() {
    const container = document.getElementById('lobby-slots-display');
    if (!container) return;
    container.innerHTML = '';

    const groupMap = {};
    if (this.onlineGroups) {
      this.onlineGroups.forEach(g => { groupMap[g.group_number] = g; });
    }

    for (let i = 1; i <= 8; i++) {
      const g = groupMap[i];
      const isTaken = Boolean(g);
      const isSelf = this.currentGroup && (this.currentGroup.nomorKelompokInt === i || this.currentGroup.nomorKelompok === `Kelompok ${i}`);

      const slot = document.createElement('div');
      slot.className = `lobby-slot-card ${isSelf ? 'self' : (isTaken ? 'taken' : '')}`;
      slot.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>Kelompok ${i}</strong>
          <span class="slot-tag" style="${isSelf ? 'background:var(--electric); color:var(--navy);' : (isTaken ? 'background:#dcfce7; color:#15803d;' : 'background:#f1f5f9; color:#94a3b8;')}">
            ${isSelf ? 'TIM ANDA' : (isTaken ? 'TERHUBUNG' : 'KOSONG')}
          </span>
        </div>
        <div style="font-size:0.75rem; color:${isTaken ? 'var(--deepblue)' : 'var(--slate-400)'}; font-weight:700; margin-top:0.25rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${isTaken ? g.group_name : 'Menunggu device...'}
        </div>
      `;
      container.appendChild(slot);
    }
  }

  setupRealtimeListeners(sessionId) {
    if (this.realtimeChannel) {
      ThermoDB.unsubscribe(this.realtimeChannel);
    }

    this.realtimeChannel = ThermoDB.subscribeToSession(
      sessionId,
      (sessionUpdate) => {
        if (!sessionUpdate) return;
        this.onlineSession = { ...this.onlineSession, ...sessionUpdate };

        // Check if Admin pressed "Mulai Bersama"
        if (sessionUpdate.status === 'started') {
          sound.fanfare();
          launchConfetti();
          if (this.currentGroup) {
            this.currentGroup.statusPermainan = 'playing';
            this.totalTimerStart = sessionUpdate.started_at ? new Date(sessionUpdate.started_at).getTime() : Date.now();
            this.showView('dashboard');
            this.renderDashboard();
          }
        } else if (sessionUpdate.status === 'paused') {
          alert('Guru menjeda permainan seluruh kelompok sementara.');
        } else if (sessionUpdate.status === 'completed') {
          alert('Turnamen resmi diselesaikan oleh Guru.');
        }
      },
      () => {
        this.syncSessionGroups().then(() => {
          this.renderLobbySlots();
          this.render8GroupButtons();
        });
      }
    );
  }

  startHeartbeat() {
    this.stopHeartbeat();
    const sendPulse = () => {
      if (this.onlineSession && this.currentGroup) {
        const gNum = this.currentGroup.nomorKelompokInt || parseInt(String(this.currentGroup.nomorKelompok).replace(/\D/g, ''), 10);
        if (gNum) {
          ThermoDB.sendHeartbeat(this.onlineSession.id, gNum);
        }
      }
    };
    sendPulse();
    this.heartbeatTimer = setInterval(sendPulse, 15000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // ========================================================================
  // DASHBOARD KELOMPOK
  // ========================================================================
  renderDashboard() {
    if (!this.currentGroup) return;

    document.getElementById('dash-team-badge').textContent = this.currentGroup.badge || '👥';
    document.getElementById('dash-team-nomor').textContent = this.currentGroup.nomorKelompok;
    document.getElementById('dash-team-title').textContent = this.currentGroup.namaKelompok;
    document.getElementById('dash-team-theme').textContent = this.currentGroup.theme || '';

    // Members Chips
    const chipsContainer = document.getElementById('dash-members-chips');
    if (chipsContainer) {
      chipsContainer.innerHTML = this.currentGroup.anggota.map(m => `
        <div class="member-chip">
          <strong>${m.nama}</strong> <span>(No. ${m.nomorAbsen})</span>
        </div>
      `).join('');
    }

    // Score widget
    const star = Number(this.currentGroup.skorStarChamp) || 0;
    const mem = Number(this.currentGroup.skorMemoryMadness) || 0;
    const calc = Number(this.currentGroup.skorNumberChains) || 0;
    const total = Math.min(100, Math.round((star + mem + calc) * 10) / 10);
    this.currentGroup.nilaiAkhir = total;

    document.getElementById('dash-total-score').innerHTML = `${total} <span>/ 100</span>`;
    const predInfo = getPredicateInfo(total);
    const predBadge = document.getElementById('dash-predicate-badge');
    predBadge.textContent = `${predInfo.badge} ${predInfo.title}`;

    // Mode Completion statuses
    const quizDone = Boolean(this.currentGroup.modesCompleted?.quiz);
    const memDone = Boolean(this.currentGroup.modesCompleted?.memory);
    const calcDone = Boolean(this.currentGroup.modesCompleted?.calc);

    document.getElementById('status-mode-quiz').innerHTML = quizDone
      ? `<span style="color:var(--success);">✓ Selesai (${this.currentGroup.skorStarChamp}/35 Pts)</span>`
      : 'Belum Dimainkan';
    document.getElementById('btn-mode-quiz-label').textContent = quizDone ? 'Main Ulang StarChamp' : 'Mulai Bersama (Mode 1)';

    document.getElementById('status-mode-memory').innerHTML = memDone
      ? `<span style="color:var(--success);">✓ Selesai (${this.currentGroup.skorMemoryMadness}/30 Pts)</span>`
      : 'Belum Dimainkan';
    document.getElementById('btn-mode-memory-label').textContent = memDone ? 'Main Ulang Memory' : 'Mulai Bersama (Mode 2)';

    document.getElementById('status-mode-calc').innerHTML = calcDone
      ? `<span style="color:var(--success);">✓ Selesai (${this.currentGroup.skorNumberChains}/35 Pts)</span>`
      : 'Belum Dimainkan';
    document.getElementById('btn-mode-calc-label').textContent = calcDone ? 'Main Ulang Number Chains' : 'Mulai Bersama (Mode 3)';

    // All finished banner
    const allDone = quizDone && memDone && calcDone;
    const banner = document.getElementById('dash-all-completed-banner');
    if (banner) {
      if (allDone) {
        banner.style.display = 'flex';
        document.getElementById('dash-all-done-score').textContent = `${total}/100 Poin (${predInfo.title})`;
      } else {
        banner.style.display = 'none';
      }
    }
  }

  // ========================================================================
  // MODE 1: STARCHAMP CHALLENGE (THERMO QUIZ - 35 Poin)
  // ========================================================================
  startQuizMode() {
    this.quizIndex = 0;
    this.quizSelected = null;
    this.quizAnswered = false;
    this.quizTimer = 30;
    this.quizHistory = [];
    this.quizStartTime = Date.now();

    this.showView('quiz');
    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    clearInterval(this.quizInterval);
    this.quizSelected = null;
    this.quizAnswered = false;
    this.quizTimer = 30;

    const q = QUIZ_QUESTIONS[this.quizIndex];
    document.getElementById('quiz-counter').textContent = `Soal ${this.quizIndex + 1} / ${QUIZ_QUESTIONS.length}`;
    document.getElementById('quiz-topic-badge').textContent = q.topic;
    document.getElementById('quiz-question-text').textContent = q.question;
    document.getElementById('quiz-progress-fill').style.width = `${((this.quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;
    document.getElementById('quiz-timer-num').textContent = `${this.quizTimer}s`;

    const timerPill = document.getElementById('quiz-timer-pill');
    timerPill.classList.remove('warning');

    const optionsContainer = document.getElementById('quiz-options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="key">${opt.key}</span> <span>${opt.text}</span>`;
      btn.addEventListener('click', () => this.handleQuizAnswer(opt.key));
      optionsContainer.appendChild(btn);
    });

    document.getElementById('quiz-feedback-box').style.display = 'none';
    document.getElementById('btn-quiz-next').style.display = 'none';

    // Start 30s countdown
    this.quizInterval = setInterval(() => {
      this.quizTimer--;
      document.getElementById('quiz-timer-num').textContent = `${this.quizTimer}s`;
      if (this.quizTimer <= 5) {
        timerPill.classList.add('warning');
        sound.tick();
      }
      if (this.quizTimer <= 0) {
        clearInterval(this.quizInterval);
        this.handleQuizAnswer('TIMEOUT');
      }
    }, 1000);
  }

  handleQuizAnswer(key) {
    if (this.quizAnswered) return;
    clearInterval(this.quizInterval);
    this.quizAnswered = true;
    this.quizSelected = key;

    const q = QUIZ_QUESTIONS[this.quizIndex];
    const isCorrect = key === q.correctAnswer;
    const isTimeout = key === 'TIMEOUT';

    if (isCorrect) {
      sound.correct();
    } else {
      sound.wrong();
    }

    this.quizHistory.push({
      questionId: q.id,
      selected: key,
      correct: q.correctAnswer,
      isCorrect,
      isTimeout
    });

    // Multiplayer Online: Submit Answer to Supabase (Anti-Duplicate Protected)
    if (this.onlineSession && this.currentGroup) {
      const pts = isCorrect ? 3.5 : 0;
      ThermoDB.submitAnswer(
        this.onlineSession.id,
        this.currentGroup.nomorKelompokInt || this.selectedGroupId,
        'quiz',
        q.id,
        key || 'TIMEOUT',
        isCorrect,
        pts
      );
    }

    // Style buttons
    const btns = document.querySelectorAll('#quiz-options-container .option-btn');
    btns.forEach(b => {
      b.disabled = true;
      const k = b.querySelector('.key').textContent;
      if (k === q.correctAnswer) {
        b.classList.add('correct');
      } else if (k === key && !isCorrect) {
        b.classList.add('wrong');
      }
    });

    // Feedback
    const fbBox = document.getElementById('quiz-feedback-box');
    fbBox.style.display = 'block';
    if (isCorrect) {
      fbBox.innerHTML = `
        <div style="color:var(--success); font-weight:800; margin-bottom:0.35rem;">✓ Jawaban Tepat! (+3,5 Poin)</div>
        <p style="color:var(--slate-700);"><strong>Pembahasan:</strong> ${q.explanation}</p>
      `;
    } else if (isTimeout) {
      fbBox.innerHTML = `
        <div style="color:var(--error); font-weight:800; margin-bottom:0.35rem;">⏱ Waktu Diskusi Habis! (0 Poin)</div>
        <p style="color:var(--slate-700);"><strong>Kunci Jawaban: ${q.correctAnswer}</strong> — ${q.explanation}</p>
      `;
    } else {
      fbBox.innerHTML = `
        <div style="color:var(--error); font-weight:800; margin-bottom:0.35rem;">✕ Jawaban Kelompok Kurang Tepat (0 Poin)</div>
        <p style="color:var(--slate-700);"><strong>Kunci Jawaban: ${q.correctAnswer}</strong> — ${q.explanation}</p>
      `;
    }

    const nextBtn = document.getElementById('btn-quiz-next');
    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = this.quizIndex < QUIZ_QUESTIONS.length - 1 ? 'Lanjut ke Soal Berikutnya →' : 'Selesai & Simpan Skor Mode 1';
  }

  nextQuizQuestion() {
    sound.click();
    if (this.quizIndex < QUIZ_QUESTIONS.length - 1) {
      this.quizIndex++;
      this.renderQuizQuestion();
    } else {
      // Finish Quiz
      const correctCount = this.quizHistory.filter(h => h.isCorrect).length;
      const score = Math.min(35, Math.round(correctCount * 3.5 * 10) / 10);
      const elapsed = Math.round((Date.now() - this.quizStartTime) / 1000);

      this.currentGroup.skorStarChamp = score;
      this.currentGroup.modesCompleted.quiz = true;
      this.currentGroup.stats.quiz = {
        correct: correctCount,
        wrong: QUIZ_QUESTIONS.length - correctCount,
        time: elapsed
      };

      this.evaluateGroupProgress();
    }
  }

  // ========================================================================
  // MODE 2: MEMORY MADNESS (THERMO MEMORY - 30 Poin)
  // ========================================================================
  startMemoryMode() {
    this.memPhase = 'memorize';
    this.memTimer = 30;
    this.recallIndex = 0;
    this.recallSelected = null;
    this.recallAnswered = false;
    this.recallHistory = [];
    this.memStartTime = Date.now();

    this.showView('memory');
    this.renderMemoryPhase();
  }

  renderMemoryPhase() {
    clearInterval(this.memInterval);
    clearInterval(this.recallInterval);

    if (this.memPhase === 'memorize') {
      document.getElementById('mem-phase-memorize').style.display = 'block';
      document.getElementById('mem-phase-recall').style.display = 'none';

      const grid = document.getElementById('memory-cards-grid');
      grid.innerHTML = MEMORY_CARDS.map(c => `
        <div class="memory-fact-card">
          <div class="cat">#${c.id} • ${c.cat}</div>
          <div class="fact">${c.fact}</div>
          <div class="desc">${c.title}: ${c.desc}</div>
        </div>
      `).join('');

      this.memTimer = 30;
      document.getElementById('mem-timer-num').textContent = `${this.memTimer}s`;

      this.memInterval = setInterval(() => {
        this.memTimer--;
        document.getElementById('mem-timer-num').textContent = `${this.memTimer}s`;
        if (this.memTimer <= 5) sound.tick();
        if (this.memTimer <= 0) {
          clearInterval(this.memInterval);
          this.startRecallPhase();
        }
      }, 1000);
    } else {
      document.getElementById('mem-phase-memorize').style.display = 'none';
      document.getElementById('mem-phase-recall').style.display = 'block';
      this.renderRecallQuestion();
    }
  }

  startRecallPhase() {
    sound.fanfare();
    clearInterval(this.memInterval);
    this.memPhase = 'recall';
    this.renderMemoryPhase();
  }

  renderRecallQuestion() {
    clearInterval(this.recallInterval);
    this.recallSelected = null;
    this.recallAnswered = false;
    this.recallTimer = 25;

    const rq = RECALL_QUESTIONS[this.recallIndex];
    document.getElementById('recall-counter').textContent = `Tantangan Recall ${this.recallIndex + 1} / ${RECALL_QUESTIONS.length}`;
    document.getElementById('recall-prompt-text').textContent = rq.prompt;
    document.getElementById('recall-timer-num').textContent = `${this.recallTimer}s`;

    const timerPill = document.getElementById('recall-timer-pill');
    timerPill.classList.remove('warning');

    const optionsContainer = document.getElementById('recall-options-container');
    optionsContainer.innerHTML = '';

    rq.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="key">${idx + 1}</span> <span>${opt}</span>`;
      btn.addEventListener('click', () => this.handleRecallAnswer(opt));
      optionsContainer.appendChild(btn);
    });

    document.getElementById('recall-feedback-box').style.display = 'none';
    document.getElementById('btn-recall-next').style.display = 'none';

    this.recallInterval = setInterval(() => {
      this.recallTimer--;
      document.getElementById('recall-timer-num').textContent = `${this.recallTimer}s`;
      if (this.recallTimer <= 5) {
        timerPill.classList.add('warning');
        sound.tick();
      }
      if (this.recallTimer <= 0) {
        clearInterval(this.recallInterval);
        this.handleRecallAnswer('TIMEOUT');
      }
    }, 1000);
  }

  handleRecallAnswer(ans) {
    if (this.recallAnswered) return;
    clearInterval(this.recallInterval);
    this.recallAnswered = true;
    this.recallSelected = ans;

    const rq = RECALL_QUESTIONS[this.recallIndex];
    const isCorrect = ans === rq.answer;
    const isTimeout = ans === 'TIMEOUT';

    if (isCorrect) sound.correct();
    else sound.wrong();

    this.recallHistory.push({
      questionId: rq.id,
      selected: ans,
      answer: rq.answer,
      isCorrect
    });

    // Multiplayer Online: Submit Recall Answer to Supabase (Anti-Duplicate Protected)
    if (this.onlineSession && this.currentGroup) {
      const pts = isCorrect ? 3 : 0;
      ThermoDB.submitAnswer(
        this.onlineSession.id,
        this.currentGroup.nomorKelompokInt || this.selectedGroupId,
        'memory',
        rq.id,
        ans || 'TIMEOUT',
        isCorrect,
        pts
      );
    }

    const btns = document.querySelectorAll('#recall-options-container .option-btn');
    btns.forEach(b => {
      b.disabled = true;
      const txt = b.querySelector('span:last-child').textContent;
      if (txt === rq.answer) b.classList.add('correct');
      else if (txt === ans && !isCorrect) b.classList.add('wrong');
    });

    const fb = document.getElementById('recall-feedback-box');
    fb.style.display = 'block';
    if (isCorrect) {
      fb.innerHTML = `<div style="color:var(--success);font-weight:800;">✓ Ingatan Kelompok Tepat! (+3 Poin)</div><p style="color:var(--slate-600);">${rq.exp}</p>`;
    } else {
      fb.innerHTML = `<div style="color:var(--error);font-weight:800;">✕ Belum Tepat (0 Poin)</div><p style="color:var(--slate-600);">${rq.exp}</p>`;
    }

    const nextBtn = document.getElementById('btn-recall-next');
    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = this.recallIndex < RECALL_QUESTIONS.length - 1 ? 'Tantangan Berikutnya →' : 'Selesai & Simpan Skor Mode 2';
  }

  nextRecallQuestion() {
    sound.click();
    if (this.recallIndex < RECALL_QUESTIONS.length - 1) {
      this.recallIndex++;
      this.renderRecallQuestion();
    } else {
      const correctCount = this.recallHistory.filter(h => h.isCorrect).length;
      const score = Math.min(30, correctCount * 3);
      const elapsed = Math.round((Date.now() - this.memStartTime) / 1000);

      this.currentGroup.skorMemoryMadness = score;
      this.currentGroup.modesCompleted.memory = true;
      this.currentGroup.stats.memory = {
        correct: correctCount,
        wrong: RECALL_QUESTIONS.length - correctCount,
        time: elapsed
      };

      this.evaluateGroupProgress();
    }
  }

  // ========================================================================
  // MODE 3: NUMBER CHAINS (THERMO CALCULATION - 35 Poin)
  // ========================================================================
  startCalcMode() {
    this.calcStageIdx = 0;
    this.calcSubmitted = false;
    this.calcResults = [];
    this.calcStartTime = Date.now();
    this.calcShowHint = false;

    this.showView('calc');
    this.renderCalcStage();
  }

  renderCalcStage() {
    this.calcSubmitted = false;
    this.calcShowHint = false;

    const st = NUMBER_CHAIN_STAGES[this.calcStageIdx];
    document.getElementById('calc-stage-counter').textContent = `Tahap ${st.stage} / ${NUMBER_CHAIN_STAGES.length}`;
    document.getElementById('calc-difficulty-badge').textContent = st.difficulty;
    document.getElementById('calc-stage-title').textContent = st.title;
    document.getElementById('calc-stage-desc').textContent = st.desc;
    document.getElementById('calc-given-val').textContent = st.given;
    document.getElementById('calc-target-unit').textContent = st.targetUnit;
    document.getElementById('calc-formula-text').textContent = st.formula;
    document.getElementById('calc-formula-box').style.display = 'none';

    const inputsBox = document.getElementById('calc-inputs-container');
    inputsBox.innerHTML = '';

    st.steps.forEach(step => {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.style.marginBottom = '1rem';
      div.innerHTML = `
        <label class="form-label">${step.label} (${step.weight} Poin):</label>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <input type="number" step="any" class="form-input calc-num-input" placeholder="Ketik angka hasil kelompok..." data-stepid="${step.id}" />
          <span style="font-weight:900; font-family:monospace; padding:0.65rem 1rem; background:var(--slate-200); border-radius:0.75rem;">${step.unit}</span>
        </div>
      `;
      inputsBox.appendChild(div);
    });

    document.getElementById('calc-solution-box').style.display = 'none';
    document.getElementById('btn-calc-submit').style.display = 'inline-flex';
    document.getElementById('btn-calc-next').style.display = 'none';
  }

  toggleCalcFormulaHint() {
    sound.click();
    this.calcShowHint = !this.calcShowHint;
    document.getElementById('calc-formula-box').style.display = this.calcShowHint ? 'block' : 'none';
  }

  submitCalcStage() {
    if (this.calcSubmitted) return;
    const st = NUMBER_CHAIN_STAGES[this.calcStageIdx];
    let stageEarned = 0;
    let correctSteps = 0;
    const details = [];

    const inputs = document.querySelectorAll('#calc-inputs-container .calc-num-input');
    inputs.forEach(inp => {
      const stepId = inp.dataset.stepid;
      const stepDef = st.steps.find(s => s.id === stepId);
      const val = parseFloat(inp.value);
      const isCorrect = !isNaN(val) && Math.abs(val - stepDef.target) < 0.05;

      if (isCorrect) {
        stageEarned += stepDef.weight;
        correctSteps++;
      }
      details.push({
        label: stepDef.label,
        userVal: inp.value,
        target: stepDef.target,
        unit: stepDef.unit,
        isCorrect,
        solution: stepDef.solution,
        weight: stepDef.weight
      });
    });

    if (correctSteps === st.steps.length) sound.correct();
    else if (correctSteps > 0) sound.correct();
    else sound.wrong();

    this.calcSubmitted = true;
    this.calcResults.push({
      stage: st.stage,
      earned: stageEarned,
      max: st.maxPoints,
      details
    });

    // Multiplayer Online: Submit Calculation Steps to Supabase (Anti-Duplicate Protected)
    if (this.onlineSession && this.currentGroup) {
      details.forEach((d, idx) => {
        const pts = d.isCorrect ? d.weight : 0;
        ThermoDB.submitAnswer(
          this.onlineSession.id,
          this.currentGroup.nomorKelompokInt || this.selectedGroupId,
          'calc',
          `stage_${st.stage}_step_${idx}`,
          String(d.userVal || 'EMPTY'),
          d.isCorrect,
          pts
        );
      });
    }

    // Render solution
    const solBox = document.getElementById('calc-solution-box');
    solBox.style.display = 'block';
    solBox.innerHTML = `
      <div style="font-weight:900; color:var(--deepblue); margin-bottom:0.5rem;">Hasil Pemeriksaan Tahap ${st.stage}: Diperoleh ${stageEarned} / ${st.maxPoints} Poin</div>
      <div style="font-size:0.8rem; line-height:1.5;">
        ${details.map(d => `
          <div>${d.label}: <strong>${d.userVal || 'Kosong'} ${d.unit}</strong> — ${d.isCorrect ? '<span style="color:var(--success);">✓ Tepat</span>' : `<span style="color:var(--error);">✕ Kurang tepat (Harusnya: ${d.target} ${d.unit})</span>`}</div>
          <div style="color:var(--slate-500); font-family:monospace; font-size:0.75rem; margin-bottom:0.35rem;">↳ ${d.solution}</div>
        `).join('')}
      </div>
    `;

    document.getElementById('btn-calc-submit').style.display = 'none';
    const nextBtn = document.getElementById('btn-calc-next');
    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = this.calcStageIdx < NUMBER_CHAIN_STAGES.length - 1 ? 'Lanjut ke Tahap Berikutnya →' : 'Selesai & Simpan Skor Mode 3';
  }

  nextCalcStage() {
    sound.click();
    if (this.calcStageIdx < NUMBER_CHAIN_STAGES.length - 1) {
      this.calcStageIdx++;
      this.renderCalcStage();
    } else {
      const totalEarned = Math.min(35, Math.round(this.calcResults.reduce((sum, r) => sum + r.earned, 0) * 10) / 10);
      const elapsed = Math.round((Date.now() - this.calcStartTime) / 1000);

      this.currentGroup.skorNumberChains = totalEarned;
      this.currentGroup.modesCompleted.calc = true;
      this.currentGroup.stats.calc = {
        earned: totalEarned,
        time: elapsed
      };

      this.evaluateGroupProgress();
    }
  }

  // ========================================================================
  // EVALUATION & FINAL COMPLETION
  // ========================================================================
  evaluateGroupProgress() {
    const star = Number(this.currentGroup.skorStarChamp) || 0;
    const mem = Number(this.currentGroup.skorMemoryMadness) || 0;
    const calc = Number(this.currentGroup.skorNumberChains) || 0;
    const totalScore = Math.min(100, Math.round((star + mem + calc) * 10) / 10);
    const predInfo = getPredicateInfo(totalScore);

    this.currentGroup.nilaiAkhir = totalScore;
    this.currentGroup.predikat = predInfo.title;

    const allFinished = Boolean(
      this.currentGroup.modesCompleted.quiz &&
      this.currentGroup.modesCompleted.memory &&
      this.currentGroup.modesCompleted.calc
    );

    if (allFinished) {
      this.currentGroup.statusPermainan = 'selesai';
      const totalTimeElapsed = Math.round((Date.now() - (this.totalTimerStart || Date.now() - 300000)) / 1000);
      this.currentGroup.waktuPenyelesaian = totalTimeElapsed > 0 ? totalTimeElapsed : 240;

      // Hitung akurasi kumulatif
      const quizCorrect = this.currentGroup.stats?.quiz?.correct || 0;
      const memCorrect = this.currentGroup.stats?.memory?.correct || 0;
      const calcScore = this.currentGroup.skorNumberChains || 0;
      const calcNormalized = Math.round((calcScore / 35) * 6);
      const totalCorrect = quizCorrect + memCorrect + calcNormalized;
      const totalQuestions = 10 + 10 + 6;
      this.currentGroup.akurasi = Math.round((totalCorrect / totalQuestions) * 100);

      saveGroupRecordToStorage(this.currentGroup);
      this.updateNavbarGroupChip();

      // Multiplayer Online: Update Final Results in Supabase
      if (this.onlineSession && this.currentGroup) {
        ThermoDB.updateGroupProgress(
          this.onlineSession.id,
          this.currentGroup.nomorKelompokInt || this.selectedGroupId,
          {
            score_quiz: this.currentGroup.skorStarChamp,
            score_memory: this.currentGroup.skorMemoryMadness,
            score_calc: this.currentGroup.skorNumberChains,
            final_score: this.currentGroup.nilaiAkhir,
            accuracy: this.currentGroup.akurasi,
            duration_seconds: this.currentGroup.waktuPenyelesaian,
            predicate: this.currentGroup.predikat,
            status: 'finished'
          }
        );
      }

      this.showResultsView();
    } else {
      saveGroupRecordToStorage(this.currentGroup);
      this.updateNavbarGroupChip();

      // Multiplayer Online: Update Intermediate Score in Supabase
      if (this.onlineSession && this.currentGroup) {
        ThermoDB.updateGroupProgress(
          this.onlineSession.id,
          this.currentGroup.nomorKelompokInt || this.selectedGroupId,
          {
            score_quiz: this.currentGroup.skorStarChamp,
            score_memory: this.currentGroup.skorMemoryMadness,
            score_calc: this.currentGroup.skorNumberChains,
            final_score: this.currentGroup.nilaiAkhir,
            predicate: this.currentGroup.predikat,
            status: 'playing'
          }
        );
      }

      this.showView('dashboard');
      this.renderDashboard();
    }
  }

  // ========================================================================
  // HALAMAN HASIL KELOMPOK
  // ========================================================================
  showResultsView() {
    if (!this.currentGroup) return;

    sound.fanfare();
    launchConfetti();
    this.showView('results');

    const total = this.currentGroup.nilaiAkhir || 0;
    const predInfo = getPredicateInfo(total);

    document.getElementById('res-team-nomor').textContent = this.currentGroup.nomorKelompok;
    document.getElementById('res-team-nama').textContent = this.currentGroup.namaKelompok;
    document.getElementById('res-final-score').textContent = total;
    document.getElementById('res-predicate-badge').textContent = `${predInfo.badge} ${predInfo.title}`;
    document.getElementById('res-appreciation-msg').textContent = predInfo.msg;

    // Scores
    document.getElementById('res-score-star').textContent = `${this.currentGroup.skorStarChamp} / 35`;
    document.getElementById('res-score-mem').textContent = `${this.currentGroup.skorMemoryMadness} / 30`;
    document.getElementById('res-score-calc').textContent = `${this.currentGroup.skorNumberChains} / 35`;

    // Stats
    const mins = Math.floor((this.currentGroup.waktuPenyelesaian || 0) / 60);
    const secs = (this.currentGroup.waktuPenyelesaian || 0) % 60;
    document.getElementById('res-time-spent').textContent = `${mins}m ${secs}s`;
    document.getElementById('res-accuracy-percent').textContent = `${this.currentGroup.akurasi || 0}%`;

    const quizCorrect = this.currentGroup.stats?.quiz?.correct || 0;
    const memCorrect = this.currentGroup.stats?.memory?.correct || 0;
    const calcScore = this.currentGroup.skorNumberChains || 0;
    const calcNormalized = Math.round((calcScore / 35) * 6);
    const totalCorrect = quizCorrect + memCorrect + calcNormalized;
    const totalQuestions = 10 + 10 + 6;
    const totalWrong = Math.max(0, totalQuestions - totalCorrect);

    const correctElem = document.getElementById('res-total-correct');
    if (correctElem) correctElem.textContent = `${totalCorrect} Soal`;
    const wrongElem = document.getElementById('res-total-wrong');
    if (wrongElem) wrongElem.textContent = `${totalWrong} Soal`;

    // Members list
    const membersList = document.getElementById('res-members-list');
    membersList.innerHTML = this.currentGroup.anggota.map(m => `
      <div style="background:var(--slate-50); padding:0.5rem 0.85rem; border-radius:0.5rem; border:1px solid var(--slate-200); font-size:0.8rem;">
        <strong>${m.nama}</strong> (Absen ${m.nomorAbsen})
      </div>
    `).join('');
  }

  // ========================================================================
  // LEADERBOARD KELOMPOK (Murni Hasil 8 Kelompok)
  // ========================================================================
  async openLeaderboardModal() {
    sound.click();
    const tbody = document.getElementById('leaderboard-tbody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--slate-400);">Memuat peringkat terbaru...</td></tr>';
    document.getElementById('modal-leaderboard').classList.add('active');

    let data = [];
    if (this.onlineSession) {
      try {
        const groups = await ThermoDB.getLeaderboard(this.onlineSession.id);
        data = groups.map(g => ({
          nomorKelompok: `Kelompok ${g.group_number}`,
          namaKelompok: g.group_name,
          nilaiAkhir: g.final_score,
          akurasi: g.accuracy,
          waktuPenyelesaian: g.duration_seconds,
          predikat: g.predicate,
          status: g.status,
          rank: g.rank
        }));
      } catch (e) {
        data = getGroupLeaderboardData();
      }
    } else {
      data = getGroupLeaderboardData();
    }

    tbody.innerHTML = '';
    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2rem; color:var(--slate-400);">
            Belum ada kelompok yang mencatat rekor pada sesi ini. Mulailah bertanding untuk meraih peringkat!
          </td>
        </tr>
      `;
    } else {
      let currentRank = 1;
      data.forEach((grp, idx) => {
        if (idx > 0) {
          const prev = data[idx - 1];
          const isTie = prev.nilaiAkhir === grp.nilaiAkhir && (prev.waktuPenyelesaian || 0) === (grp.waktuPenyelesaian || 0);
          if (!isTie) {
            currentRank = idx + 1;
          }
        }
        const rankNum = grp.rank || currentRank;
        const rankMedal = rankNum === 1 ? '🥇 1' : rankNum === 2 ? '🥈 2' : rankNum === 3 ? '🥉 3' : `${rankNum}`;

        const isCurrent = this.currentGroup && (this.currentGroup.nomorKelompok === grp.nomorKelompok || (this.currentGroup.nomorKelompokInt && grp.nomorKelompok === `Kelompok ${this.currentGroup.nomorKelompokInt}`));
        const mins = Math.floor((grp.waktuPenyelesaian || 0) / 60);
        const secs = (grp.waktuPenyelesaian || 0) % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        const predInfo = getPredicateInfo(grp.nilaiAkhir);

        const tr = document.createElement('tr');
        if (isCurrent) tr.style.backgroundColor = '#eff6ff';
        tr.innerHTML = `
          <td style="font-weight:900; font-family:monospace; font-size:1.05rem;">${rankMedal}</td>
          <td>
            <strong>${grp.namaKelompok}</strong>
            ${isCurrent ? '<span style="font-size:0.65rem; background:var(--electric); color:var(--navy); padding:0.15rem 0.4rem; border-radius:0.25rem; margin-left:0.35rem; font-weight:800;">KELOMPOKMU</span>' : ''}
          </td>
          <td><span style="font-weight:700; color:var(--deepblue);">${grp.nomorKelompok}</span></td>
          <td style="font-weight:900; font-family:monospace; color:var(--orange); font-size:1.1rem;">${grp.nilaiAkhir}</td>
          <td><span style="font-size:0.75rem; font-weight:800;">${predInfo.badge} ${predInfo.title}</span></td>
          <td style="font-family:monospace; color:var(--slate-600); font-weight:600;">⏱️ ${timeStr}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // ========================================================================
  // CETAK PIAGAM PENGHARGAAN KELOMPOK
  // ========================================================================
  openCertificateModal() {
    if (!this.currentGroup) return;
    sound.click();

    const grp = this.currentGroup;
    const total = grp.nilaiAkhir || 0;
    const predInfo = getPredicateInfo(total);

    document.getElementById('cert-team-nomor').textContent = grp.nomorKelompok;
    document.getElementById('cert-team-nama').textContent = grp.namaKelompok;
    document.getElementById('cert-final-score').textContent = total;
    document.getElementById('cert-predicate-text').textContent = `${predInfo.badge} ${predInfo.title}`;
    document.getElementById('cert-date').textContent = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const membersBox = document.getElementById('cert-members-list');
    membersBox.innerHTML = grp.anggota.map(m => `
      <div style="background:var(--slate-50); padding:0.5rem; border-radius:0.5rem; border:1px solid #e2e8f0; font-size:0.8rem; text-align:center;">
        <strong>${m.nama}</strong><br><span style="color:#64748b; font-size:0.75rem;">Absen ${m.nomorAbsen}</span>
      </div>
    `).join('');

    document.getElementById('modal-certificate').classList.add('active');
  }

  // ========================================================================
  // INTERACTIVE THERMOMETER & FORMULA SIMULATORS
  // ========================================================================
  setupThermometerSimulator() {
    const slider = document.getElementById('sim-celsius-slider');
    if (!slider) return;

    const updateColumns = (val) => {
      const c = parseFloat(val);
      const r = Math.round((c * 4 / 5) * 10) / 10;
      const f = Math.round(((c * 9 / 5) + 32) * 10) / 10;
      const k = Math.round((c + 273.15) * 10) / 10;

      document.getElementById('sim-val-c').textContent = `${c}°C`;
      document.getElementById('sim-val-r').textContent = `${r}°R`;
      document.getElementById('sim-val-f').textContent = `${f}°F`;
      document.getElementById('sim-val-k').textContent = `${k} K`;

      // Heights: 0°C -> 15%, 100°C -> 85%
      const hPercent = Math.max(12, Math.min(88, 15 + (c / 100) * 70));
      document.getElementById('sim-col-c').style.height = `${hPercent}%`;
      document.getElementById('sim-col-r').style.height = `${hPercent}%`;
      document.getElementById('sim-col-f').style.height = `${hPercent}%`;
      document.getElementById('sim-col-k').style.height = `${hPercent}%`;
    };

    slider.addEventListener('input', (e) => updateColumns(e.target.value));

    // Preset buttons
    document.querySelectorAll('.btn-sim-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.click();
        const t = e.target.dataset.temp;
        slider.value = t;
        updateColumns(t);
      });
    });

    updateColumns(slider.value || 37);
  }

  setupFormulaCalculator() {
    const inputVal = document.getElementById('calc-sim-val');
    const selectUnit = document.getElementById('calc-sim-unit');
    if (!inputVal || !selectUnit) return;

    const compute = () => {
      const val = parseFloat(inputVal.value) || 0;
      const u = selectUnit.value;
      let c = 0;
      if (u === 'C') c = val;
      else if (u === 'R') c = (5 / 4) * val;
      else if (u === 'F') c = (5 / 9) * (val - 32);
      else if (u === 'K') c = val - 273.15;

      document.getElementById('sim-out-c').textContent = `${Math.round(c * 100) / 100}°C`;
      document.getElementById('sim-out-r').textContent = `${Math.round((4 / 5 * c) * 100) / 100}°R`;
      document.getElementById('sim-out-f').textContent = `${Math.round(((9 / 5 * c) + 32) * 100) / 100}°F`;
      document.getElementById('sim-out-k').textContent = `${Math.round((c + 273.15) * 100) / 100} K`;
    };

    inputVal.addEventListener('input', compute);
    selectUnit.addEventListener('change', compute);
    compute();
  }

  // ========================================================================
  // EVENT LISTENERS & NAVIGATION
  // ========================================================================
  setupEventListeners() {
    // Brand click
    document.querySelector('.brand').addEventListener('click', () => {
      sound.click();
      if (this.currentGroup) this.showView('dashboard');
      else this.showView('landing');
    });

    // Landing "MULAI BERMAIN"
    document.querySelectorAll('.btn-trigger-start').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.click();
        this.showView('group-select');
        this.render8GroupButtons();
      });
    });

    // Check Session Code Button & Enter key
    const btnCheckCode = document.getElementById('btn-check-session-code');
    if (btnCheckCode) {
      btnCheckCode.addEventListener('click', () => {
        sound.click();
        this.checkSessionCode();
      });
    }

    const inputSessionCode = document.getElementById('input-session-code');
    if (inputSessionCode) {
      inputSessionCode.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sound.click();
          this.checkSessionCode();
        }
      });
    }

    // Leave Lobby Button
    const btnLeaveLobby = document.getElementById('btn-leave-lobby');
    if (btnLeaveLobby) {
      btnLeaveLobby.addEventListener('click', () => {
        sound.click();
        this.showView('group-select');
        this.render8GroupButtons();
      });
    }

    // Ganti Kelompok button
    document.getElementById('btn-change-group-choice').addEventListener('click', () => {
      sound.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Nama kelompok input change listener
    const namaKelompokInput = document.getElementById('input-nama-kelompok');
    if (namaKelompokInput) {
      namaKelompokInput.addEventListener('input', () => this.updateSummaryBox());
    }

    // + Tambah Anggota
    document.getElementById('btn-add-member-row').addEventListener('click', () => this.addMemberRow());

    // KONFIRMASI DAN MULAI
    document.getElementById('btn-confirm-start-group').addEventListener('click', () => this.confirmAndStartGroup());

    // Audio Mute toggle
    document.getElementById('btn-toggle-sound').addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      document.getElementById('sound-icon').textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) sound.click();
    });

    // Navbar buttons
    document.getElementById('btn-nav-leaderboard').addEventListener('click', () => this.openLeaderboardModal());
    document.getElementById('btn-nav-material').addEventListener('click', () => {
      sound.click();
      this.showView('material');
    });
    document.getElementById('btn-nav-help').addEventListener('click', () => {
      sound.click();
      document.getElementById('modal-help').classList.add('active');
    });
    document.getElementById('btn-nav-logout').addEventListener('click', () => {
      if (confirm('Keluar dari sesi kelompok saat ini? Hasil kelompok yang sudah selesai tersimpan aman.')) {
        sound.click();
        clearActiveGroup();
        this.currentGroup = null;
        this.updateNavbarGroupChip();
        this.showView('landing');
      }
    });

    // Close Modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.click();
        const targetModal = e.target.closest('.modal-overlay');
        if (targetModal) targetModal.classList.remove('active');
      });
    });

    // Mode Buttons on Dashboard
    document.getElementById('btn-start-quiz').addEventListener('click', () => {
      sound.click();
      this.startQuizMode();
    });
    document.getElementById('btn-start-memory').addEventListener('click', () => {
      sound.click();
      this.startMemoryMode();
    });
    document.getElementById('btn-start-calc').addEventListener('click', () => {
      sound.click();
      this.startCalcMode();
    });

    // In-game buttons
    document.getElementById('btn-quiz-next').addEventListener('click', () => this.nextQuizQuestion());
    document.getElementById('btn-mem-ready-early').addEventListener('click', () => this.startRecallPhase());
    document.getElementById('btn-recall-next').addEventListener('click', () => this.nextRecallQuestion());
    document.getElementById('btn-calc-toggle-hint').addEventListener('click', () => this.toggleCalcFormulaHint());
    document.getElementById('btn-calc-submit').addEventListener('click', () => this.submitCalcStage());
    document.getElementById('btn-calc-next').addEventListener('click', () => this.nextCalcStage());

    // Back to dashboard buttons
    document.querySelectorAll('.btn-back-dashboard').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.click();
        if (this.quizInterval) clearInterval(this.quizInterval);
        if (this.memInterval) clearInterval(this.memInterval);
        if (this.recallInterval) clearInterval(this.recallInterval);
        this.showView('dashboard');
        this.renderDashboard();
      });
    });

    // Results Page Actions
    document.getElementById('btn-res-certificate').addEventListener('click', () => this.openCertificateModal());
    document.getElementById('btn-res-leaderboard').addEventListener('click', () => this.openLeaderboardModal());
    document.getElementById('btn-res-dashboard').addEventListener('click', () => {
      sound.click();
      this.showView('dashboard');
      this.renderDashboard();
    });
    document.getElementById('btn-res-new-game').addEventListener('click', () => {
      if (confirm('Mulai sesi permainan kelompok baru? Kelompok saat ini telah tercatat di Leaderboard.')) {
        sound.click();
        clearActiveGroup();
        this.currentGroup = null;
        this.updateNavbarGroupChip();
        this.showView('group-select');
        this.render8GroupButtons();
      }
    });

    // Print certificate
    document.getElementById('btn-print-cert').addEventListener('click', () => {
      sound.click();
      window.print();
    });
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ThermoChampionsApp();
});
