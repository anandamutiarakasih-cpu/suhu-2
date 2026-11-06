/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Client-Side Question Bank & Interactive Data
 * Materi Pokok: Suhu, Skala Termometer, dan Pemuaian (IPA Kelas VII SMP)
 */

export const SHUFFLE_MEMORIZE_CARDS = [
  {
    id: 'm1',
    category: 'Alat Ukur Suhu',
    term: 'Termometer Zat Cair',
    tag: 'Raksa & Alkohol',
    definition: 'Alat ukur derajat panas zat yang memanfaatkan pemuaian cairan di dalam pipa kapiler kaca.',
    example: 'Raksa mengkilap & tidak membasahi kaca; alkohol mengukur suhu sangat dingin (-114°C).',
    icon: '🌡️'
  },
  {
    id: 'm2',
    category: 'Prinsip Kalibrasi',
    term: 'Titik Acuan Tetap',
    tag: 'Titik Beku & Didih Air',
    definition: 'Dua titik patokan baku untuk menetapkan skala termometer pada tekanan 1 atmosfer.',
    example: 'Titik tetap bawah = es murni melebur (0°C); titik tetap atas = air murni mendidih (100°C).',
    icon: '🧊'
  },
  {
    id: 'm3',
    category: 'Skala Suhu',
    term: 'Skala Celsius (°C)',
    tag: 'Rentang 100 Skala',
    definition: 'Skala termometer yang membagi rentang titik beku (0°C) hingga titik didih (100°C) menjadi 100 bagian.',
    example: 'Ditetapkan oleh Anders Celsius; skala yang paling umum digunakan dalam kehidupan sehari-hari di Indonesia.',
    icon: '📊'
  },
  {
    id: 'm4',
    category: 'Skala Suhu',
    term: 'Skala Reamur (°R)',
    tag: 'Rentang 80 Skala',
    definition: 'Skala termometer dengan titik tetap bawah 0°R dan titik tetap atas air mendidih 80°R.',
    example: 'Ditetapkan oleh René de Réaumur; perbandingan angka skalanya terhadap Celsius adalah 4 : 5.',
    icon: '📐'
  },
  {
    id: 'm5',
    category: 'Skala Suhu',
    term: 'Skala Fahrenheit (°F)',
    tag: 'Rentang 180 Skala',
    definition: 'Skala termometer dengan titik beku air 32°F dan titik didih air 212°F (rentang 180 bagian).',
    example: 'Banyak digunakan di negara Amerika Serikat; rumus konversinya memakai penyesuaian angka 32.',
    icon: '🇺🇸'
  },
  {
    id: 'm6',
    category: 'Standar Internasional',
    term: 'Skala Kelvin (K)',
    tag: 'Suhu Mutlak (SI)',
    definition: 'Satuan standar internasional (SI) untuk besaran pokok suhu di mana 0 K merupakan suhu nol mutlak.',
    example: 'Ditulis tanpa simbol derajat (°); titik beku air 273 K dan air mendidih 373 K (K = °C + 273).',
    icon: '⚛️'
  },
  {
    id: 'm7',
    category: 'Rumus Konversi',
    term: 'Perbandingan Skala Suhu',
    tag: 'C : R : (F - 32) = 5 : 4 : 9',
    definition: 'Rasio matematis antar rentang skala termometer untuk menyelesaikan perhitungan konversi derajat suhu.',
    example: 'C = 5/4 × R; F = (9/5 × C) + 32; R = 4/9 × (F - 32); K = C + 273.',
    icon: '🔢'
  },
  {
    id: 'm8',
    category: 'Aplikasi Pemuaian',
    term: 'Keping Bimetal',
    tag: 'Sakelar Termostat Otomatis',
    definition: 'Dua lempeng logam berbeda koefisien muai panjang yang dikeling menyatu menjadi satu bilah.',
    example: 'Saat dipanaskan melengkung ke arah logam yang koefisien muainya lebih kecil (pada setrika & sakelar alarm).',
    icon: '🧲'
  },
  {
    id: 'm9',
    category: 'Sifat Termal Zat',
    term: 'Anomali Air',
    tag: 'Suhu 0°C – 4°C',
    definition: 'Ketidakteraturan sifat pemuaian air yang volumenya justru menyusut dan massa jenisnya membesar pada rentang 0°C sampai 4°C.',
    example: 'Menjaga air di dasar danau tetap cair pada suhu 4°C sehingga biota air tetap bertahan hidup saat musim beku.',
    icon: '🐟'
  },
  {
    id: 'm10',
    category: 'Hukum Pemuaian Padat',
    term: 'Pemuaian Panjang',
    tag: 'ΔL = L₀ · α · ΔT',
    definition: 'Pertambahan panjang benda padat berbanding lurus dengan panjang mula-mula, koefisien muai, dan kenaikan suhu.',
    example: 'Pemasangan celah ekspansi pada sambungan rel kereta api dan jembatan beton agar tidak bengkok saat siang terik.',
    icon: '🛤️'
  }
];

export const SHUFFLE_CHALLENGES = [
  {
    id: 'sc1',
    prompt: 'Pasangkan skala termometer dengan rentang titik bekunya:',
    leftItem: 'Skala Reamur (°R)',
    category: 'Skala Termometer',
    options: [
      'Titik beku 0°R dan titik didih air 80°R',
      'Titik beku 0°C dan titik didih air 100°C',
      'Titik beku 32°F dan titik didih air 212°F',
      'Titik beku 273 K dan titik didih air 373 K'
    ],
    correctAnswer: 'Titik beku 0°R dan titik didih air 80°R'
  },
  {
    id: 'sc2',
    prompt: 'Pasangkan jenis skala dengan status standarnya:',
    leftItem: 'Skala Kelvin (K)',
    category: 'Satuan SI',
    options: [
      'Satuan suhu mutlak internasional (SI) tanpa tanda derajat',
      'Skala suhu dengan rentang 180 bagian',
      'Skala suhu yang hanya berlaku untuk zat cair',
      'Satuan turunan untuk mengukur kalor laten'
    ],
    correctAnswer: 'Satuan suhu mutlak internasional (SI) tanpa tanda derajat'
  },
  {
    id: 'sc3',
    prompt: 'Pasangkan alat aplikasi fisika dengan prinsip kerjanya:',
    leftItem: 'Keping Bimetal',
    category: 'Aplikasi Pemuaian',
    options: [
      'Dua lempeng logam berbeda pemuaian melengkung saat terkena panas',
      'Pipa kaca berisi cairan raksa yang menguap saat mendidih',
      'Celah pemisah rel kereta api yang menyempit pada malam hari',
      'Air yang menyusut volumenya saat dipanaskan dari 0°C ke 4°C'
    ],
    correctAnswer: 'Dua lempeng logam berbeda pemuaian melengkung saat terkena panas'
  },
  {
    id: 'sc4',
    prompt: 'Pasangkan fenomena alam termal dengan definisinya:',
    leftItem: 'Anomali Air',
    category: 'Sifat Termal Zat',
    options: [
      'Volume air menyusut dan massa jenisnya maksimum pada suhu 4°C',
      'Air membeku menjadi es pada suhu 100°C di bawah tekanan rendah',
      'Partikel air berhenti bergerak secara total pada suhu 0°C',
      'Pertambahan panjang logam yang dipanaskan di dalam air mendidih'
    ],
    correctAnswer: 'Volume air menyusut dan massa jenisnya maksimum pada suhu 4°C'
  },
  {
    id: 'sc5',
    prompt: 'Pasangkan zat pengisi termometer dengan karakteristik fisiknya:',
    leftItem: 'Cairan Raksa (Merkuri)',
    category: 'Zat Termometrik',
    options: [
      'Warna perak mengkilap, memuai teratur, dan tidak membasahi dinding kaca',
      'Berwarna merah transparan dan mampu mengukur suhu di bawah -114°C',
      'Air murni yang tidak berwarna dan membasahi dinding pipa kapiler',
      'Minyak kelapa yang membeku pada suhu ruang 25°C'
    ],
    correctAnswer: 'Warna perak mengkilap, memuai teratur, dan tidak membasahi dinding kaca'
  },
  {
    id: 'sc6',
    prompt: 'Pasangkan skala termometer dengan titik tetap acuannya:',
    leftItem: 'Skala Fahrenheit (°F)',
    category: 'Skala Termometer',
    options: [
      'Titik beku air murni 32°F dan titik didih air 212°F',
      'Titik beku 0°F dan titik didih 100°F',
      'Titik tetap bawah 4°F dan titik didih 80°F',
      'Titik lebur es 273°F dan titik uap air 373°F'
    ],
    correctAnswer: 'Titik beku air murni 32°F dan titik didih air 212°F'
  },
  {
    id: 'sc7',
    prompt: 'Pasangkan rentang perbandingan skala termometer standar:',
    leftItem: 'Perbandingan C : R : (F - 32)',
    category: 'Rumus Konversi',
    options: [
      '5 : 4 : 9',
      '4 : 5 : 9',
      '9 : 5 : 4',
      '5 : 9 : 4'
    ],
    correctAnswer: '5 : 4 : 9'
  },
  {
    id: 'sc8',
    prompt: 'Pasangkan rumus fisika pemuaian panjang dengan keterangannya:',
    leftItem: 'ΔL = L₀ × α × ΔT',
    category: 'Hukum Pemuaian',
    options: [
      'Pertambahan panjang = panjang awal × koefisien muai × kenaikan suhu',
      'Pertambahan volume gas pada tekanan tetap menurut Boyle',
      'Kalor yang diserap benda saat mengalami kenaikan suhu',
      'Kapasitas kalor benda padat pada suhu nol mutlak'
    ],
    correctAnswer: 'Pertambahan panjang = panjang awal × koefisien muai × kenaikan suhu'
  },
  {
    id: 'sc9',
    prompt: 'Pasangkan konsep batas suhu termodinamika terendah:',
    leftItem: 'Nol Mutlak (0 Kelvin / -273°C)',
    category: 'Suhu Mutlak',
    options: [
      'Keadaan saat energi kinetik dan gerakan translasi partikel terhenti',
      'Titik saat air murni mulai membentuk kristal es pertama',
      'Suhu rata-rata permukaan air di kutub utara Bumi',
      'Suhu saat zat cair termometer mulai menyusut volumenya'
    ],
    correctAnswer: 'Keadaan saat energi kinetik dan gerakan translasi partikel terhenti'
  },
  {
    id: 'sc10',
    prompt: 'Pasangkan proses penetapan titik acuan pada termometer:',
    leftItem: 'Kalibrasi Termometer',
    category: 'Prinsip Kalibrasi',
    options: [
      'Penetapan titik beku es dan titik uap air murni pada pipa kapiler kosong',
      'Pengukuran kalor jenis logam menggunakan bejana kalorimeter',
      'Pemanasan batang bimetal hingga mencapai kelengkungan maksimum',
      'Pendinginan gas ideal sampai mencapai volume nol mutlak'
    ],
    correctAnswer: 'Penetapan titik beku es dan titik uap air murni pada pipa kapiler kosong'
  }
];

export const WORD_SCRAMBLE_ITEMS = [
  {
    id: 'ws1',
    difficulty: 'EASY',
    scrambled: 'S I L U E C S',
    answer: 'CELSIUS',
    clue: 'Skala termometer dengan titik beku air 0° dan titik didih 100° (7 huruf)',
    category: 'Skala Suhu',
    timeLimit: 18,
    points: 3
  },
  {
    id: 'ws2',
    difficulty: 'EASY',
    scrambled: 'M U R E R A',
    answer: 'REAMUR',
    clue: 'Skala termometer dengan perbandingan angka skala 4 (6 huruf)',
    category: 'Skala Suhu',
    timeLimit: 18,
    points: 3
  },
  {
    id: 'ws3',
    difficulty: 'EASY',
    scrambled: 'U H U S',
    answer: 'SUHU',
    clue: 'Derajat panas atau dinginnya suatu benda yang diukur termometer (4 huruf)',
    category: 'Besaran Pokok',
    timeLimit: 18,
    points: 3
  },
  {
    id: 'ws4',
    difficulty: 'MEDIUM',
    scrambled: 'V I N E L K',
    answer: 'KELVIN',
    clue: 'Satuan standar internasional (SI) untuk besaran pokok suhu (6 huruf)',
    category: 'Satuan SI',
    timeLimit: 20,
    points: 3.5
  },
  {
    id: 'ws5',
    difficulty: 'MEDIUM',
    scrambled: 'M E L A B I T',
    answer: 'BIMETAL',
    clue: 'Dua lempeng logam berbeda pemuaian yang dikeling untuk sakelar otomatis (7 huruf)',
    category: 'Aplikasi Pemuaian',
    timeLimit: 20,
    points: 3.5
  },
  {
    id: 'ws6',
    difficulty: 'MEDIUM',
    scrambled: 'L I O M A N A',
    answer: 'ANOMALI',
    clue: 'Keanehan sifat pemuaian air pada rentang suhu 0°C sampai 4°C (7 huruf)',
    category: 'Sifat Termal Zat',
    timeLimit: 20,
    points: 3.5
  },
  {
    id: 'ws7',
    difficulty: 'MEDIUM',
    scrambled: 'A R K S A',
    answer: 'RAKSA',
    clue: 'Logam cair perak mengkilap pengisi pipa kapiler termometer (5 huruf)',
    category: 'Zat Termometrik',
    timeLimit: 20,
    points: 3.5
  },
  {
    id: 'ws8',
    difficulty: 'EXTREME',
    scrambled: 'M E P A I U N A',
    answer: 'PEMUAIAN',
    clue: 'Pertambahan dimensi ukuran benda saat menerima kenaikan panas suhu (8 huruf)',
    category: 'Pemuaian Fisika',
    timeLimit: 20,
    points: 4
  },
  {
    id: 'ws9',
    difficulty: 'EXTREME',
    scrambled: 'B I L A R I S A K',
    answer: 'KALIBRASI',
    clue: 'Proses penentuan titik patokan acuan tetap pada termometer baru (9 huruf)',
    category: 'Metrologi Suhu',
    timeLimit: 20,
    points: 4
  },
  {
    id: 'ws10',
    difficulty: 'EXTREME',
    scrambled: 'H A F E N R T I E',
    answer: 'FAHRENHEIT',
    clue: 'Skala termometer dengan titik beku air 32° dan titik didih 212° (10 huruf)',
    category: 'Skala Suhu',
    timeLimit: 20,
    points: 4.5
  }
];

export const HEAT_CALCULATION_ITEMS = [
  {
    id: 'hc1',
    level: 'EASY',
    type: 'Konversi Skala Suhu',
    badge: 'R = 4/5 × C',
    story: 'Secangkir teh hangat di laboratorium IPA suhunya terukur 60°C. Berapakah suhu teh tersebut jika diukur menggunakan termometer Reamur (°R)?',
    given: [
      { label: 'Suhu Celsius (C)', value: '60°C' },
      { label: 'Rasio Perbandingan', value: 'R/C = 4/5' }
    ],
    formulaHint: 'R = (4/5) × C',
    unit: '°R',
    correctAnswer: 48,
    tolerance: 0.01,
    explanation: 'R = (4/5) × 60 = 4 × 12 = 48°R.',
    points: 3
  },
  {
    id: 'hc2',
    level: 'EASY',
    type: 'Konversi Skala Suhu',
    badge: 'F = (9/5 × C) + 32',
    story: 'Termometer dinding laboratorium menunjukkan angka 45°C. Berapakah nilai suhu ruangan tersebut jika dinyatakan dalam skala Fahrenheit (°F)?',
    given: [
      { label: 'Suhu Celsius (C)', value: '45°C' },
      { label: 'Rasio Perbandingan', value: 'F = (9/5 × C) + 32' }
    ],
    formulaHint: 'F = (9/5 × C) + 32',
    unit: '°F',
    correctAnswer: 113,
    tolerance: 0.01,
    explanation: 'F = (9/5 × 45) + 32 = 81 + 32 = 113°F.',
    points: 3
  },
  {
    id: 'hc3',
    level: 'EASY',
    type: 'Satuan Suhu Mutlak (SI)',
    badge: 'K = C + 273',
    story: 'Suhu sebongkah es kering tercatat -23°C. Berapakah nilai suhu es tersebut jika dinyatakan dalam satuan standar internasional Kelvin (K)?',
    given: [
      { label: 'Suhu Celsius (C)', value: '-23°C' },
      { label: 'Titik Nol Mutlak', value: '0 K = -273°C' }
    ],
    formulaHint: 'K = C + 273',
    unit: 'Kelvin (K)',
    correctAnswer: 250,
    tolerance: 0.01,
    explanation: 'K = -23 + 273 = 250 K.',
    points: 3
  },
  {
    id: 'hc4',
    level: 'MEDIUM',
    type: 'Konversi Skala Suhu',
    badge: 'C = 5/4 × R',
    story: 'Termometer Reamur mencatat suhu air kolam sebesar 36°R. Berapakah suhu air tersebut jika diukur dengan termometer Celsius (°C)?',
    given: [
      { label: 'Suhu Reamur (R)', value: '36°R' },
      { label: 'Rasio Perbandingan', value: 'C/R = 5/4' }
    ],
    formulaHint: 'C = (5/4) × R',
    unit: '°C',
    correctAnswer: 45,
    tolerance: 0.01,
    explanation: 'C = (5/4) × 36 = 5 × 9 = 45°C.',
    points: 3.5
  },
  {
    id: 'hc5',
    level: 'MEDIUM',
    type: 'Konversi Skala Suhu',
    badge: 'C = 5/9 × (F - 32)',
    story: 'Suhu badan seorang siswa saat diperiksa termometer klinis Fahrenheit mencapai 104°F. Berapakah suhu siswa tersebut dalam derajat Celsius (°C)?',
    given: [
      { label: 'Suhu Fahrenheit (F)', value: '104°F' },
      { label: 'Titik Beku Fahrenheit', value: '32°F' }
    ],
    formulaHint: 'C = (5/9) × (F - 32)',
    unit: '°C',
    correctAnswer: 40,
    tolerance: 0.01,
    explanation: 'C = (5/9) × (104 - 32) = (5/9) × 72 = 40°C.',
    points: 3.5
  },
  {
    id: 'hc6',
    level: 'MEDIUM',
    type: 'Konversi Skala Suhu',
    badge: 'F = (9/4 × R) + 32',
    story: 'Larutan kimia di bejana pemanas suhunya 40°R. Tentukan suhu larutan kimia tersebut jika dinyatakan dalam skala Fahrenheit (°F)!',
    given: [
      { label: 'Suhu Reamur (R)', value: '40°R' },
      { label: 'Rasio Perbandingan', value: 'F = (9/4 × R) + 32' }
    ],
    formulaHint: 'F = (9/4 × R) + 32',
    unit: '°F',
    correctAnswer: 122,
    tolerance: 0.01,
    explanation: 'F = (9/4 × 40) + 32 = 90 + 32 = 122°F.',
    points: 3.5
  },
  {
    id: 'hc7',
    level: 'MEDIUM',
    type: 'Konversi Skala Suhu',
    badge: 'C = K - 273',
    story: 'Gas hidrogen dalam tabung eksperimen memiliki temperatur 323 K. Berapakah nilai suhu gas tersebut jika dinyatakan dalam derajat Celsius (°C)?',
    given: [
      { label: 'Suhu Kelvin (K)', value: '323 K' },
      { label: 'Tetapan Konversi', value: 'C = K - 273' }
    ],
    formulaHint: 'C = K - 273',
    unit: '°C',
    correctAnswer: 50,
    tolerance: 0.01,
    explanation: 'C = 323 - 273 = 50°C.',
    points: 3.5
  },
  {
    id: 'hc8',
    level: 'EXTREME',
    type: 'Termometer Tak Berskala (X)',
    badge: '(X - X_b) / (X_a - X_b) = C / 100',
    story: 'Sebuah termometer X buatan laboratorium memiliki titik beku es -10°X dan titik didih air 110°X. Jika termometer Celsius menunjukkan angka 50°C, berapakah angka yang ditunjukkan oleh termometer X (°X)?',
    given: [
      { label: 'Titik Tetap Bawah (X_b)', value: '-10°X' },
      { label: 'Titik Tetap Atas (X_a)', value: '110°X' },
      { label: 'Suhu Celsius (C)', value: '50°C' }
    ],
    formulaHint: '(X - X_b) / (X_a - X_b) = C / 100',
    unit: '°X',
    correctAnswer: 50,
    tolerance: 0.01,
    explanation: '(X - (-10)) / (110 - (-10)) = 50 / 100 => (X + 10) / 120 = 0,5 => X + 10 = 60 => X = 50°X.',
    points: 4
  },
  {
    id: 'hc9',
    level: 'EXTREME',
    type: 'Pemuaian Panjang Logam',
    badge: 'ΔL = L₀ × α × ΔT',
    story: 'Batang aluminium dengan panjang mula-mula 100 cm dipanaskan sehingga suhunya naik sebesar 50°C. Jika koefisien muai panjang aluminium α = 0,000024 /°C, hitunglah pertambahan panjang batang (ΔL) dalam satuan cm!',
    given: [
      { label: 'Panjang Awal (L₀)', value: '100 cm' },
      { label: 'Kenaikan Suhu (ΔT)', value: '50°C' },
      { label: 'Koefisien Muai (α)', value: '0,000024 /°C' }
    ],
    formulaHint: 'ΔL = L₀ × α × ΔT',
    unit: 'cm',
    correctAnswer: 0.12,
    tolerance: 0.02,
    explanation: 'ΔL = 100 cm × 0,000024 /°C × 50°C = 0,12 cm.',
    points: 4
  },
  {
    id: 'hc10',
    level: 'EXTREME',
    type: 'Panjang Akhir Pemuaian',
    badge: 'L_t = L₀ + ΔL',
    story: 'Sebatang rel kereta baja panjang awalnya 10 meter pada suhu 20°C dipanaskan oleh terik matahari hingga suhunya mencapai 70°C (ΔT = 50°C). Jika koefisien muai baja α = 0,000012 /°C, berapakah PANJANG AKHIR rel tersebut (L_t) dalam satuan meter?',
    given: [
      { label: 'Panjang Awal (L₀)', value: '10 meter' },
      { label: 'Perubahan Suhu (ΔT)', value: '50°C (20°C ke 70°C)' },
      { label: 'Koefisien Muai Baja (α)', value: '0,000012 /°C' }
    ],
    formulaHint: 'ΔL = L₀ × α × ΔT, lalu L_t = L₀ + ΔL',
    unit: 'meter',
    correctAnswer: 10.006,
    tolerance: 0.001,
    points: 4.5,
    explanation: 'ΔL = 10 m × 0,000012 /°C × 50°C = 0,006 m. Maka L_t = 10 + 0,006 = 10,006 meter.',
  }
];
