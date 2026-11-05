/**
 * THERMO CHAMPIONS — QUESTION BANK & MATERIAL DATA
 * IPA Kelas VII SMP — Materi Suhu & Pemuaian
 */

export const QUIZ_QUESTIONS = [
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
    explanation: 'Suhu adalah ukuran derajat panas atau dinginnya suatu benda secara kuantitatif. Energi panas yang berpindah disebut kalor.'
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
    explanation: 'Lekukan kapiler (konstriksi) menahan kolom raksa agar tidak langsung turun saat dibaca oleh tenaga medis.'
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
    explanation: 'Titik tetap bawah Celsius (0°C) adalah suhu es murni yang sedang melebur pada tekanan normal 1 atm.'
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
    explanation: 'Reamur memiliki titik tetap bawah 0°R dan titik atas 80°R, sehingga rentangnya adalah 80 skala.'
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
    explanation: 'Rentang 100 : 80 : 180 : 100 jika disederhanakan dengan membagi FPB (20) menghasilkan 5 : 4 : 9 : 5.'
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
    explanation: 'Rumus: R = 4/5 × C = 4/5 × 25 = 20°R.'
  }
];

export const MEMORY_CARDS = [
  { id: 1, cat: 'Celsius', title: 'Titik Tetap Bawah', fact: '0°C', desc: 'Titik lebur es murni pada 1 atm' },
  { id: 2, cat: 'Celsius', title: 'Titik Tetap Atas', fact: '100°C', desc: 'Titik didih air murni pada 1 atm' },
  { id: 3, cat: 'Fahrenheit', title: 'Titik Tetap Bawah', fact: '32°F', desc: 'Titik lebur es murni pada 1 atm' },
  { id: 4, cat: 'Fahrenheit', title: 'Titik Tetap Atas', fact: '212°F', desc: 'Titik didih air murni pada 1 atm' },
  { id: 5, cat: 'Reamur', title: 'Titik Tetap Bawah', fact: '0°R', desc: 'Titik lebur es murni pada 1 atm' },
  { id: 6, cat: 'Reamur', title: 'Titik Tetap Atas', fact: '80°R', desc: 'Titik didih air murni pada 1 atm' },
  { id: 7, cat: 'Kelvin', title: 'Titik Tetap Bawah', fact: '273 K', desc: 'Titik lebur es (Satuan Baku SI)' },
  { id: 8, cat: 'Kelvin', title: 'Titik Tetap Atas', fact: '373 K', desc: 'Titik didih air (Satuan Baku SI)' },
  { id: 9, cat: 'Instrumen', title: 'Termometer', fact: 'Pengukur Suhu', desc: 'Alat pengukur derajat suhu baku' },
  { id: 10, cat: 'Konsep', title: 'Kesetimbangan Suhu', fact: 'Suhu Benda = Termometer', desc: 'Kondisi saat perpindahan kalor berhenti' }
];

export const RECALL_QUESTIONS = [
  { id: 1, cardId: 1, prompt: 'Berapakah nilai titik tetap bawah pada termometer Celsius?', options: ['0°C', '32°C', '100°C', '273°C'], answer: '0°C', exp: 'Titik tetap bawah Celsius adalah 0°C.' },
  { id: 2, cardId: 2, prompt: 'Berapakah nilai titik tetap atas pada termometer Celsius?', options: ['80°C', '100°C', '212°C', '373°C'], answer: '100°C', exp: 'Titik tetap atas Celsius adalah 100°C.' },
  { id: 3, cardId: 3, prompt: 'Pada skala Fahrenheit, berapakah nilai titik tetap bawahnya?', options: ['0°F', '12°F', '32°F', '80°F'], answer: '32°F', exp: 'Titik tetap bawah Fahrenheit adalah 32°F.' },
  { id: 4, cardId: 4, prompt: 'Berapakah nilai titik tetap atas skala Fahrenheit yang dihafal?', options: ['100°F', '180°F', '212°F', '273°F'], answer: '212°F', exp: 'Titik tetap atas Fahrenheit adalah 212°F.' },
  { id: 5, cardId: 5, prompt: 'Berapakah nilai titik tetap bawah skala Reamur?', options: ['-10°R', '0°R', '32°R', '80°R'], answer: '0°R', exp: 'Titik tetap bawah Reamur adalah 0°R.' },
  { id: 6, cardId: 6, prompt: 'Berapakah nilai titik tetap atas pada skala Reamur?', options: ['80°R', '100°R', '180°R', '212°R'], answer: '80°R', exp: 'Titik tetap atas Reamur adalah 80°R.' },
  { id: 7, cardId: 7, prompt: 'Berapakah nilai titik tetap bawah pada skala Kelvin?', options: ['0 K', '100 K', '273 K', '373 K'], answer: '273 K', exp: 'Titik tetap bawah Kelvin adalah 273 K.' },
  { id: 8, cardId: 8, prompt: 'Berapakah nilai titik tetap atas pada skala Kelvin?', options: ['100 K', '273 K', '312 K', '373 K'], answer: '373 K', exp: 'Titik tetap atas Kelvin adalah 373 K.' },
  { id: 9, cardId: 9, prompt: 'Berdasarkan kartu informasi, apa fungsi utama dari Termometer?', options: ['Alat pengukur derajat suhu baku', 'Alat pengukur volume air', 'Alat pengubah wujud zat', 'Alat pengukur massa jenis'], answer: 'Alat pengukur derajat suhu baku', exp: 'Termometer adalah alat pengukur suhu yang baku.' },
  { id: 10, cardId: 10, prompt: 'Apa yang dimaksud dengan kondisi kesetimbangan suhu pada kartu?', options: ['Kondisi ketika suhu benda dan termometer sudah sama', 'Kondisi air mendidih sempurna', 'Suhu cairan termometer turun mendadak', 'Perbedaan suhu maksimum kedua benda'], answer: 'Kondisi ketika suhu benda dan termometer sudah sama', exp: 'Kesetimbangan suhu adalah saat suhu benda = termometer.' }
];

export const NUMBER_CHAIN_STAGES = [
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
    desc: 'Tantangan Master! Cairan bersuhu 60°R. Hitung rantai bertingkat: pertama ubah 60°R ke Celsius, lalu ubah hasil Celsius tersebut ke Fahrenheit!',
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

export function getPredicate(score) {
  const rounded = Math.round(Number(score || 0) * 10) / 10;
  if (rounded >= 86) {
    return {
      title: 'THERMO CHAMPION',
      badge: '🏆',
      bgClass: 'predicate-champ',
      color: '#d97706',
      msg: 'Luar biasa! Seluruh anggota kelompok membuktikan penguasaan konsep suhu dan hitungan tingkat master!'
    };
  }
  if (rounded >= 76) {
    return {
      title: 'THERMO EXPERT',
      badge: '🥇',
      bgClass: 'predicate-expert',
      color: '#2563eb',
      msg: 'Sangat bagus! Kerja sama tim solid dan pemahaman skala termometer sangat matang.'
    };
  }
  if (rounded >= 66) {
    return {
      title: 'SCIENCE CHALLENGER',
      badge: '🥈',
      bgClass: 'predicate-challenger',
      color: '#059669',
      msg: 'Bagus! Kelompok mampu menyelesaikan sebagian besar tantangan konsep dan konversi dengan baik.'
    };
  }
  if (rounded >= 56) {
    return {
      title: 'THERMO EXPLORER',
      badge: '🥉',
      bgClass: 'predicate-explorer',
      color: '#7c3aed',
      msg: 'Cukup baik. Perkuat latihan konversi perbandingan skala (5:4:9) agar semakin percaya diri.'
    };
  }
  return {
    title: 'TEMPERATURE ROOKIE',
    badge: '🌱',
    bgClass: 'predicate-rookie',
    color: '#64748b',
    msg: 'Tetap semangat! Pelajari kembali materi perbandingan titik lebur dan titik didih termometer.'
  };
}
