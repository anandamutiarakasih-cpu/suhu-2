// Mode 1: STARCHAMP CHALLENGE (THERMO QUIZ)
// 10 Soal Pilihan Ganda, 30 detik per soal, 3,5 poin per soal (Total 35 poin)

export const quizQuestions = [
  {
    id: 1,
    topic: 'Pengertian Suhu',
    question: 'Pernyataan yang paling tepat mengenai pengertian suhu adalah...',
    options: [
      { key: 'A', text: 'Banyaknya energi panas yang berpindah dari benda panas ke benda dingin' },
      { key: 'B', text: 'Ukuran derajat panas atau dinginnya suatu benda secara kuantitatif' },
      { key: 'C', text: 'Perubahan wujud zat akibat menerima energi kalor dari lingkungan' },
      { key: 'D', text: 'Pertambahan panjang atau volume suatu zat ketika dipanaskan' }
    ],
    correctAnswer: 'B',
    explanation: 'Suhu adalah ukuran derajat panas atau dinginnya suatu benda. Energi panas yang berpindah disebut kalor, bukan suhu.'
  },
  {
    id: 2,
    topic: 'Fungsi Termometer',
    question: 'Mengapa indra peraba (kulit manusia) tidak dapat dijadikan alat ukur suhu yang baku?',
    options: [
      { key: 'A', text: 'Kulit tidak peka terhadap perubahan suhu di sekitarnya' },
      { key: 'B', text: 'Kulit hanya dapat mengukur suhu benda cair saja' },
      { key: 'C', text: 'Pengukuran kulit bersifat subjektif dan tidak menunjukkan angka pasti' },
      { key: 'D', text: 'Kulit selalu menunjukkan suhu yang lebih tinggi dari benda aslinya' }
    ],
    correctAnswer: 'C',
    explanation: 'Kulit hanya mampu merasakan sensasi hangat/dingin secara subjektif (kualitatif) tanpa menghasilkan nilai terukur (kuantitatif) yang dapat diandalkan secara ilmiah.'
  },
  {
    id: 3,
    topic: 'Jenis Termometer',
    question: 'Termometer klinis (badan) memiliki lekukan atau pipa kapiler yang menyempit di atas reservoir. Fungsi lekukan tersebut adalah...',
    options: [
      { key: 'A', text: 'Mencegah cairan raksa kembali turun saat termometer dikeluarkan dari tubuh' },
      { key: 'B', text: 'Mempercepat pemuaian zat cair saat menerima panas tubuh' },
      { key: 'C', text: 'Memperluas rentang skala pengukuran suhu tubuh' },
      { key: 'D', text: 'Menghindari gelembung udara masuk ke tabung termometer' }
    ],
    correctAnswer: 'A',
    explanation: 'Lekukan kapiler (konstriksi) pada termometer klinis menahan kolom raksa agar tidak turun dengan cepat saat dibaca setelah dilepaskan dari ketiak atau mulut pasien.'
  },
  {
    id: 4,
    topic: 'Prinsip Pengukuran Suhu',
    question: 'Prinsip kesetimbangan suhu (kesetimbangan termal) pada pengukuran suhu terjadi ketika...',
    options: [
      { key: 'A', text: 'Suhu termometer lebih tinggi dibanding suhu zat yang diukur' },
      { key: 'B', text: 'Semua cairan dalam termometer menguap hingga batas atas pipa' },
      { key: 'C', text: 'Suhu termometer telah sama persis dengan suhu benda yang diukur' },
      { key: 'D', text: 'Terjadi aliran kalor terus menerus tanpa henti ke lingkungan' }
    ],
    correctAnswer: 'C',
    explanation: 'Kesetimbangan termal terjadi saat terjadi perpindahan kalor sampai suhu benda dan termometer menjadi sama, sehingga ketinggian cairan termometer berhenti bergerak dan siap dibaca.'
  },
  {
    id: 5,
    topic: 'Skala Celsius',
    question: 'Anders Celsius menetapkan titik tetap bawah skala Celsius (0°C) berdasarkan...',
    options: [
      { key: 'A', text: 'Suhu titik beku larutan garam dapur jenuh' },
      { key: 'B', text: 'Suhu titik lebur es murni pada tekanan normal 1 atmosfer' },
      { key: 'C', text: 'Suhu rata-rata tubuh manusia sehat' },
      { key: 'D', text: 'Suhu terendah yang mungkin dicapai di alam semesta' }
    ],
    correctAnswer: 'B',
    explanation: 'Titik tetap bawah skala Celsius (0°C) ditetapkan berdasarkan suhu es murni yang sedang melebur pada tekanan normal (1 atmosfer).'
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
    explanation: 'Skala Fahrenheit memiliki titik tetap bawah 32°F (es melebur) dan titik tetap atas 212°F (air mendidih).'
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
    explanation: 'Skala Reamur memiliki titik tetap bawah 0°R dan titik tetap atas 80°R, sehingga rentang skalanya adalah 80 - 0 = 80 skala.'
  },
  {
    id: 8,
    topic: 'Skala Kelvin',
    question: 'Skala Kelvin tidak menggunakan tanda derajat (°) dan menjadi Satuan Internasional (SI) karena...',
    options: [
      { key: 'A', text: 'Diciptakan sebelum skala Celsius dan Fahrenheit ditemukan' },
      { key: 'B', text: 'Titik nolnya (0 K) adalah suhu mutlak saat energi kinetik partikel berhenti' },
      { key: 'C', text: 'Nilai suhunya selalu berbentuk bilangan desimal' },
      { key: 'D', text: 'Hanya dapat digunakan untuk mengukur gas di laboratorium' }
    ],
    correctAnswer: 'B',
    explanation: 'Kelvin adalah skala suhu mutlak (termodinamika). 0 K adalah titik nol mutlak di mana molekul tidak lagi memiliki energi kinetik gerak.'
  },
  {
    id: 9,
    topic: 'Titik Tetap Suhu',
    question: 'Perhatikan perbandingan angka skala berikut: C : R : (F - 32) : (K - 273). Nilai perbandingan paling sederhana yang benar adalah...',
    options: [
      { key: 'A', text: '100 : 80 : 180 : 100 yang disederhanakan menjadi 5 : 4 : 9 : 5' },
      { key: 'B', text: '100 : 80 : 212 : 273 yang disederhanakan menjadi 5 : 4 : 10 : 12' },
      { key: 'C', text: '100 : 90 : 180 : 100 yang disederhanakan menjadi 5 : 4 : 8 : 5' },
      { key: 'D', text: '80 : 100 : 180 : 100 yang disederhanakan menjadi 4 : 5 : 9 : 5' }
    ],
    correctAnswer: 'A',
    explanation: 'Rentang skala adalah 100 : 80 : 180 : 100. Jika dibagi 20 diperoleh perbandingan sederhana 5 : 4 : 9 : 5.'
  },
  {
    id: 10,
    topic: 'Konversi Suhu Sederhana',
    question: 'Suhu suatu ruangan diukur dengan termometer Celsius menunjukkan angka 25°C. Jika dinyatakan dalam skala Reamur, besarnya adalah...',
    options: [
      { key: 'A', text: '15°R' },
      { key: 'B', text: '20°R' },
      { key: 'C', text: '28°R' },
      { key: 'D', text: '45°R' }
    ],
    correctAnswer: 'B',
    explanation: 'Rumus konversi: R = 4/5 × C. Maka R = 4/5 × 25 = 20°R.'
  }
];
