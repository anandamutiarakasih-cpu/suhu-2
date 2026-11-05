// Mode 3: NUMBER CHAINS (THERMO CALCULATION)
// 5 Rangkaian Tantangan, Tingkat Kesulitan Bertahap, Total Maksimal 35 Poin (7 poin per tahap)

export const numberChainStages = [
  {
    stage: 1,
    difficulty: 'Easy',
    difficultyColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    title: 'Tahap 1: Konversi Celsius ke Fahrenheit',
    description: 'Sebuah zat cair diukur suhunya menggunakan termometer skala Celsius dan terbaca sebesar 30°C. Hitunglah nilai suhunya jika dinyatakan dalam skala Fahrenheit!',
    given: 'Suhu = 30°C',
    targetUnit: '°F',
    maxPoints: 7,
    formulaHint: 'F = (9/5 × C) + 32',
    steps: [
      {
        id: 's1_step1',
        label: 'Nilai dalam skala Fahrenheit (°F)',
        prompt: 'Masukkan nilai suhu dalam °F:',
        targetValue: 86,
        unit: '°F',
        weight: 7,
        solution: 'F = (9/5 × 30) + 32 = (9 × 6) + 32 = 54 + 32 = 86°F'
      }
    ],
    fullSolution: [
      'Diketahui: C = 30°C',
      'Ditanya: F = ...?',
      'Langkah 1: Gunakan perbandingan F - 32 = 9/5 × C',
      'Langkah 2: F = (9/5 × 30) + 32',
      'Langkah 3: F = 54 + 32 = 86°F'
    ]
  },
  {
    stage: 2,
    difficulty: 'Easy',
    difficultyColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    title: 'Tahap 2: Konversi Celsius ke Reamur',
    description: 'Air di dalam wadah laboratorium bersuhu 40°C. Berapakah nilai suhu air tersebut bila diukur dengan termometer skala Reamur?',
    given: 'Suhu = 40°C',
    targetUnit: '°R',
    maxPoints: 7,
    formulaHint: 'R = 4/5 × C',
    steps: [
      {
        id: 's2_step1',
        label: 'Nilai dalam skala Reamur (°R)',
        prompt: 'Masukkan nilai suhu dalam °R:',
        targetValue: 32,
        unit: '°R',
        weight: 7,
        solution: 'R = 4/5 × 40 = 4 × 8 = 32°R'
      }
    ],
    fullSolution: [
      'Diketahui: C = 40°C',
      'Ditanya: R = ...?',
      'Langkah 1: Gunakan perbandingan R = 4/5 × C',
      'Langkah 2: R = 4/5 × 40',
      'Langkah 3: R = 4 × 8 = 32°R'
    ]
  },
  {
    stage: 3,
    difficulty: 'Medium',
    difficultyColor: 'bg-amber-100 text-amber-800 border-amber-300',
    title: 'Tahap 3: Konversi Celsius ke Kelvin (Satuan SI)',
    description: 'Suhu ruangan kelas diukur sebesar 27°C. Konversikan suhu ruangan tersebut ke dalam skala Kelvin (Satuan Internasional)!',
    given: 'Suhu = 27°C',
    targetUnit: 'K',
    maxPoints: 7,
    formulaHint: 'K = C + 273',
    steps: [
      {
        id: 's3_step1',
        label: 'Nilai dalam skala Kelvin (K)',
        prompt: 'Masukkan nilai suhu dalam Kelvin (K):',
        targetValue: 300,
        unit: 'K',
        weight: 7,
        solution: 'K = 27 + 273 = 300 K'
      }
    ],
    fullSolution: [
      'Diketahui: C = 27°C',
      'Ditanya: K = ...?',
      'Langkah 1: Gunakan rumus K = C + 273',
      'Langkah 2: K = 27 + 273 = 300 K (tanpa tanda derajat)'
    ]
  },
  {
    stage: 4,
    difficulty: 'Medium',
    difficultyColor: 'bg-amber-100 text-amber-800 border-amber-300',
    title: 'Tahap 4: Konversi Fahrenheit ke Celsius',
    description: 'Sebuah termometer Fahrenheit menunjukkan angka 212°F pada titik didih air. Hitunglah berapa nilai suhu ini dalam skala Celsius!',
    given: 'Suhu = 212°F',
    targetUnit: '°C',
    maxPoints: 7,
    formulaHint: 'C = 5/9 × (F - 32)',
    steps: [
      {
        id: 's4_step1',
        label: 'Nilai dalam skala Celsius (°C)',
        prompt: 'Masukkan nilai suhu dalam °C:',
        targetValue: 100,
        unit: '°C',
        weight: 7,
        solution: 'C = 5/9 × (212 - 32) = 5/9 × 180 = 5 × 20 = 100°C'
      }
    ],
    fullSolution: [
      'Diketahui: F = 212°F',
      'Ditanya: C = ...?',
      'Langkah 1: Kurangkan terlebih dahulu angka 32 dari skala F: (212 - 32) = 180',
      'Langkah 2: Kalikan dengan faktor 5/9: C = 5/9 × 180 = 100°C'
    ]
  },
  {
    stage: 5,
    difficulty: 'Hard',
    difficultyColor: 'bg-red-100 text-red-800 border-red-300',
    title: 'Tahap 5: Rantai Konversi Bertingkat (Reamur → Celsius → Fahrenheit)',
    description: 'Tantangan Master! Suatu cairan bersuhu 60°R. Lakukan perhitungan berantai: pertama konversikan 60°R menjadi Celsius, kemudian konversikan hasil Celsius tersebut menjadi skala Fahrenheit!',
    given: 'Suhu Awal = 60°R',
    targetUnit: '°C & °F',
    maxPoints: 7,
    formulaHint: 'Langkah A: C = 5/4 × R  |  Langkah B: F = (9/5 × C) + 32',
    steps: [
      {
        id: 's5_step1',
        label: 'Langkah A: Ubah 60°R ke Celsius (°C)',
        prompt: 'Nilai suhu dalam °C:',
        targetValue: 75,
        unit: '°C',
        weight: 3.5,
        solution: 'C = 5/4 × 60 = 5 × 15 = 75°C'
      },
      {
        id: 's5_step2',
        label: 'Langkah B: Ubah 75°C ke Fahrenheit (°F)',
        prompt: 'Nilai suhu dalam °F:',
        targetValue: 167,
        unit: '°F',
        weight: 3.5,
        solution: 'F = (9/5 × 75) + 32 = (9 × 15) + 32 = 135 + 32 = 167°F'
      }
    ],
    fullSolution: [
      'Diketahui: R = 60°R',
      'Langkah A (Konversi ke Celsius): C = 5/4 × R = 5/4 × 60 = 75°C (3,5 poin)',
      'Langkah B (Konversi ke Fahrenheit): F = (9/5 × C) + 32 = (9/5 × 75) + 32 = 135 + 32 = 167°F (3,5 poin)',
      'Hasil Akhir Rantai Perhitungan: 60°R = 75°C = 167°F'
    ]
  }
];
