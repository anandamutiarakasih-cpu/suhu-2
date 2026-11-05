// Materi Pembelajaran IPA Kelas VII SMP — SUHU

export const studyMaterials = [
  {
    id: 'pengertian',
    title: 'A. Pengertian Suhu',
    badge: 'Konsep Dasar',
    icon: 'Thermometer',
    summary: 'Suhu adalah ukuran derajat panas atau dinginnya suatu benda.',
    content: [
      {
        subtitle: '1. Hakikat Suhu',
        text: 'Suhu menunjukkan seberapa panas atau dingin suatu benda. Secara mikroskopis, suhu merupakan ukuran dari rata-rata energi kinetik partikel penyusun benda. Semakin cepat partikel bergerak atau bergetar, semakin tinggi suhu benda tersebut.'
      },
      {
        subtitle: '2. Mengapa Tangan Bukan Alat Ukur Suhu yang Tepat?',
        text: 'Kulit manusia dapat merasakan panas dan dingin, tetapi tidak dapat digunakan sebagai alat ukur suhu yang baku karena:'
      },
    ],
    bulletPoints: [
      'Bersifat subjektif: Perasaan hangat atau dingin tiap orang berbeda-beda.',
      'Hanya bersifat kualitatif: Tidak dapat memberikan angka kepastian derajat suhu.',
      'Rentang ukur sangat terbatas: Tangan tidak tahan terhadap suhu sangat dingin atau sangat panas dan bisa mengalami cedera.'
    ]
  },
  {
    id: 'termometer',
    title: 'B. Mengukur Suhu dengan Termometer',
    badge: 'Alat Ukur',
    icon: 'Activity',
    summary: 'Termometer adalah alat baku untuk mengukur suhu benda secara akurat.',
    content: [
      {
        subtitle: '1. Fungsi Termometer',
        text: 'Termometer digunakan untuk mengukur derajat panas secara kuantitatif dengan skala angka yang pasti dan dapat dipertanggungjawabkan secara ilmiah.'
      },
      {
        subtitle: '2. Prinsip Kesetimbangan Suhu (Thermal Equilibrium)',
        text: 'Ketika termometer disentuhkan pada benda yang diukur suhunya, terjadi pertukaran energi panas sampai kedua benda berada pada suhu yang sama. Keadaan ketika suhu benda dan termometer telah sama disebut kesetimbangan suhu (kesetimbangan termal). Pada saat itulah nilai skala termometer dibaca.'
      },
      {
        subtitle: '3. Jenis-Jenis Termometer',
        text: 'Terdapat berbagai macam termometer sesuai dengan fungsi dan kegunaannya:'
      }
    ],
    types: [
      {
        name: 'Termometer Klinis / Tubuh',
        range: '35°C — 42°C',
        desc: 'Digunakan khusus untuk mengukur suhu badan manusia (suhu normal ~36,5°C - 37,2°C). Memiliki bagian menyempit (lekukan kapiler) agar cairan raksa tidak cepat turun saat termometer diangkat dari tubuh.'
      },
      {
        name: 'Termometer Laboratorium',
        range: '-10°C — 110°C',
        desc: 'Digunakan untuk keperluan penelitian dan praktikum sains. Memiliki skala yang lebih panjang dan biasanya diisi raksa atau alkohol berwarna merah.'
      },
      {
        name: 'Termometer Industri & Khusus',
        range: 'Bervariasi (Hingga ribuan °C)',
        desc: 'Termasuk Termometer Bimetal (memanfaatkan perbedaan pemuaian dua logam), Pirometer / Termometer Inframerah (mengukur radiasi tanpa menyentuh benda), dan Termokopel (menggunakan sinyal listrik pada rentang suhu ekstrem).'
      }
    ]
  },
  {
    id: 'skala',
    title: 'C. Empat Skala Suhu',
    badge: 'Skala Ilmiah',
    icon: 'Layers',
    summary: 'Ada empat skala pengukuran suhu yang digunakan di dunia: Celsius, Fahrenheit, Reamur, dan Kelvin.',
    content: [
      {
        subtitle: 'Mengenal 4 Skala Utama',
        text: 'Keempat skala dinamai berdasarkan penemunya masing-masing:'
      }
    ],
    scales: [
      {
        name: 'Celsius (°C)',
        creator: 'Anders Celsius (Swedia)',
        desc: 'Paling umum digunakan di Indonesia dan kehidupan sehari-hari secara internasional.'
      },
      {
        name: 'Reamur (°R)',
        creator: 'René Antoine Ferchault de Réaumur (Prancis)',
        desc: 'Banyak digunakan di beberapa industri pengolahan pangan di Eropa pada masa lalu.'
      },
      {
        name: 'Fahrenheit (°F)',
        creator: 'Daniel Gabriel Fahrenheit (Jerman)',
        desc: 'Banyak digunakan di Amerika Serikat dan beberapa negara berbahasa Inggris.'
      },
      {
        name: 'Kelvin (K)',
        creator: 'Lord William Thomson Kelvin (Inggris)',
        desc: 'Satuan Internasional (SI) untuk besaran pokok suhu. Tidak menggunakan simbol derajat (°). 0 K adalah nol mutlak, yaitu keadaan teoretis partikel berhenti bergerak total.'
      }
    ]
  },
  {
    id: 'titik-tetap',
    title: 'D. Titik Tetap Skala Suhu',
    badge: 'Titik Acuan',
    icon: 'Target',
    summary: 'Penetapan skala termometer didasarkan pada dua titik acuan baku: Titik Tetap Bawah dan Titik Tetap Atas.',
    content: [
      {
        subtitle: 'Titik Acuan Standar',
        text: 'Titik tetap bawah didasarkan pada titik lebur es murni pada tekanan 1 atmosfer (udara normal). Titik tetap atas didasarkan pada titik didih air murni pada tekanan 1 atmosfer.'
      }
    ],
    table: [
      { scale: 'Celsius', symbol: '°C', lower: 0, upper: 100, range: 100, ratio: 5 },
      { scale: 'Reamur', symbol: '°R', lower: 0, upper: 80, range: 80, ratio: 4 },
      { scale: 'Fahrenheit', symbol: '°F', lower: 32, upper: 212, range: 180, ratio: 9 },
      { scale: 'Kelvin', symbol: 'K', lower: 273, upper: 373, range: 100, ratio: 5 }
    ]
  },
  {
    id: 'konversi',
    title: 'E. Rumus & Contoh Konversi Suhu',
    badge: 'Penalaran & Hitungan',
    icon: 'Calculator',
    summary: 'Perbandingan rentang skala menjadi dasar perhitungan konversi antarskala suhu.',
    content: [
      {
        subtitle: 'Perbandingan Skala',
        text: 'Dengan membagi rentang skala (100 : 80 : 180 : 100) dengan FPB yaitu 20, diperoleh perbandingan:\n\nC : R : (F - 32) : (K - 273) = 5 : 4 : 9 : 5'
      }
    ],
    formulas: [
      {
        target: 'Celsius ke Fahrenheit',
        formula: 'F = (9/5 × C) + 32',
        example: '30°C = (9/5 × 30) + 32 = 54 + 32 = 86°F'
      },
      {
        target: 'Celsius ke Reamur',
        formula: 'R = 4/5 × C',
        example: '40°C = 4/5 × 40 = 32°R'
      },
      {
        target: 'Celsius ke Kelvin',
        formula: 'K = C + 273',
        example: '27°C = 27 + 273 = 300 K'
      },
      {
        target: 'Fahrenheit ke Celsius',
        formula: 'C = 5/9 × (F - 32)',
        example: '212°F = 5/9 × (212 - 32) = 5/9 × 180 = 100°C'
      },
      {
        target: 'Reamur ke Celsius',
        formula: 'C = 5/4 × R',
        example: '60°R = 5/4 × 60 = 75°C'
      },
      {
        target: 'Kelvin ke Celsius',
        formula: 'C = K - 273',
        example: '350 K = 350 - 273 = 77°C'
      }
    ]
  }
];
