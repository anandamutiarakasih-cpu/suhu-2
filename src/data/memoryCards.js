// Mode 2: MEMORY MADNESS (THERMO MEMORY)
// Fase 1: 10 Kartu Fakta (30 detik menghafal)
// Fase 2: 10 Pertanyaan Recall (3 poin per soal, total 30 poin)

export const memoryCards = [
  {
    id: 1,
    category: 'Skala Celsius',
    title: 'Celsius Titik Bawah',
    keyFact: '0°C',
    detail: 'Titik tetap bawah skala Celsius (titik lebur es murni).',
    color: 'from-blue-600 to-cyan-500'
  },
  {
    id: 2,
    category: 'Skala Celsius',
    title: 'Celsius Titik Atas',
    keyFact: '100°C',
    detail: 'Titik tetap atas skala Celsius (titik didih air murni).',
    color: 'from-blue-700 to-indigo-600'
  },
  {
    id: 3,
    category: 'Skala Fahrenheit',
    title: 'Fahrenheit Titik Bawah',
    keyFact: '32°F',
    detail: 'Titik tetap bawah skala Fahrenheit.',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 4,
    category: 'Skala Fahrenheit',
    title: 'Fahrenheit Titik Atas',
    keyFact: '212°F',
    detail: 'Titik tetap atas skala Fahrenheit.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 5,
    category: 'Skala Reamur',
    title: 'Reamur Titik Bawah',
    keyFact: '0°R',
    detail: 'Titik tetap bawah skala Reamur.',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    id: 6,
    category: 'Skala Reamur',
    title: 'Reamur Titik Atas',
    keyFact: '80°R',
    detail: 'Titik tetap atas skala Reamur.',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 7,
    category: 'Skala Kelvin',
    title: 'Kelvin Titik Bawah',
    keyFact: '273 K',
    detail: 'Titik tetap bawah skala Kelvin (titik lebur es).',
    color: 'from-purple-600 to-indigo-700'
  },
  {
    id: 8,
    category: 'Skala Kelvin',
    title: 'Kelvin Titik Atas',
    keyFact: '373 K',
    detail: 'Titik tetap atas skala Kelvin (titik didih air).',
    color: 'from-pink-600 to-purple-700'
  },
  {
    id: 9,
    category: 'Instrumen',
    title: 'Termometer',
    keyFact: 'Alat Pengukur Suhu',
    detail: 'Alat baku untuk mengukur suhu secara kuantitatif.',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 10,
    category: 'Prinsip Fisika',
    title: 'Kesetimbangan Suhu',
    keyFact: 'Suhu Benda = Termometer',
    detail: 'Keadaan ketika suhu benda dan termometer sudah sama.',
    color: 'from-blue-800 to-navy-950'
  }
];

export const recallQuestions = [
  {
    id: 1,
    cardId: 1,
    prompt: 'Berapakah nilai titik tetap bawah pada termometer Celsius?',
    options: ['0°C', '32°C', '100°C', '273°C'],
    correctAnswer: '0°C',
    explanation: 'Sesuai Kartu 1: Titik tetap bawah skala Celsius adalah 0°C.'
  },
  {
    id: 2,
    cardId: 2,
    prompt: 'Berapakah nilai titik tetap atas pada termometer Celsius?',
    options: ['80°C', '100°C', '212°C', '373°C'],
    correctAnswer: '100°C',
    explanation: 'Sesuai Kartu 2: Titik tetap atas skala Celsius adalah 100°C.'
  },
  {
    id: 3,
    cardId: 3,
    prompt: 'Pada skala Fahrenheit, berapakah nilai titik tetap bawahnya?',
    options: ['0°F', '12°F', '32°F', '80°F'],
    correctAnswer: '32°F',
    explanation: 'Sesuai Kartu 3: Titik tetap bawah Fahrenheit adalah 32°F.'
  },
  {
    id: 4,
    cardId: 4,
    prompt: 'Berapakah nilai titik tetap atas skala Fahrenheit yang telah kamu hafal?',
    options: ['100°F', '180°F', '212°F', '273°F'],
    correctAnswer: '212°F',
    explanation: 'Sesuai Kartu 4: Titik tetap atas skala Fahrenheit adalah 212°F.'
  },
  {
    id: 5,
    cardId: 5,
    prompt: 'Berapakah nilai titik tetap bawah skala Reamur?',
    options: ['-10°R', '0°R', '32°R', '80°R'],
    correctAnswer: '0°R',
    explanation: 'Sesuai Kartu 5: Titik tetap bawah skala Reamur adalah 0°R.'
  },
  {
    id: 6,
    cardId: 6,
    prompt: 'Berapakah nilai titik tetap atas pada skala Reamur?',
    options: ['80°R', '100°R', '180°R', '212°R'],
    correctAnswer: '80°R',
    explanation: 'Sesuai Kartu 6: Titik tetap atas Reamur adalah 80°R.'
  },
  {
    id: 7,
    cardId: 7,
    prompt: 'Berapakah nilai titik tetap bawah pada skala Kelvin?',
    options: ['0 K', '100 K', '273 K', '373 K'],
    correctAnswer: '273 K',
    explanation: 'Sesuai Kartu 7: Titik tetap bawah skala Kelvin adalah 273 K.'
  },
  {
    id: 8,
    cardId: 8,
    prompt: 'Berapakah nilai titik tetap atas pada skala Kelvin?',
    options: ['100 K', '273 K', '312 K', '373 K'],
    correctAnswer: '373 K',
    explanation: 'Sesuai Kartu 8: Titik tetap atas skala Kelvin adalah 373 K.'
  },
  {
    id: 9,
    cardId: 9,
    prompt: 'Berdasarkan kartu informasi, apa fungsi utama dari Termometer?',
    options: [
      'Alat untuk menghasilkan energi kalor',
      'Alat untuk mengukur suhu',
      'Alat untuk menaikkan titik didih air',
      'Alat untuk mengukur massa jenis cairan'
    ],
    correctAnswer: 'Alat untuk mengukur suhu',
    explanation: 'Sesuai Kartu 9: Termometer adalah alat untuk mengukur suhu.'
  },
  {
    id: 10,
    cardId: 10,
    prompt: 'Apa yang dimaksud dengan kondisi kesetimbangan suhu pada kartu memori?',
    options: [
      'Keadaan ketika suhu benda dan termometer sudah sama',
      'Keadaan ketika suhu zat mencapai 0°C',
      'Kondisi cairan termometer memuai melebihi pipa kapiler',
      'Perbedaan suhu maksimum antara dua zat yang bercampur'
    ],
    correctAnswer: 'Keadaan ketika suhu benda dan termometer sudah sama',
    explanation: 'Sesuai Kartu 10: Kesetimbangan suhu adalah keadaan ketika suhu benda dan termometer sudah sama.'
  }
];
