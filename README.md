# THERMO CHAMPIONS 🏆
### Media Pembelajaran IPA Kelas VII SMP — Materi Pokok Suhu
> **Tagline:** *"Master the Temperature. Become the Champion."*

Aplikasi web edukasi interaktif berbasis kompetisi antarkelompok kelas VII SMP dengan arsitektur **Multiplayer Realtime Multi-Device**. 8 kelompok siswa bertanding secara serentak dari perangkat HP/smartphone masing-masing di bawah kendali 1 Game Master / Guru melalui Dashboard Admin.

---

## 🚀 1. STACK TEKNOLOGI

- **Frontend:** HTML5, CSS3, dan Vanilla JavaScript (ES Modules).
- **Backend & Realtime:** Firebase Realtime Database & Firebase Authentication (Anonymous).
- **Validasi & Penilaian:** Firebase Cloud Functions (`functions/index.js`) & Atomic RTDB Security Rules.
- **Hosting Frontend:** Vercel (Pure static deployment via `vercel.json`).
- **Penyimpanan Lokal:** LocalStorage untuk pemulihan sesi otomatis (*session rehydration*).
- **Audio:** Web Audio API (Synthesizer murni tanpa file MP3 eksternal).
- **Efek:** HTML5 Canvas Confetti.

> **Zero Frameworks:** Tanpa React, Next.js, Vue, Angular, Supabase, MySQL/Postgres, atau server Socket.IO terpisah.

---

## 📂 2. STRUKTUR PROYEK

```
d:\suhu 2\
├── index.html                   # Halaman Klien Siswa (Mobile-First HP/Tablet/Laptop)
├── admin.html                   # Dashboard Guru / Game Master
├── style.css                    # CSS Klien Siswa (Responsive Flexbox & CSS Grid)
├── admin.css                    # CSS Dashboard Guru
├── vercel.json                  # Konfigurasi Vercel Deployment & Security Headers
├── database.rules.json          # Aturan Keamanan Firebase Realtime Database
├── firebase.json                # Konfigurasi Proyek Firebase (RTDB, Functions, Hosting)
├── .env.example                 # Contoh variabel konfigurasi Firebase
├── README.md                    # Dokumentasi lengkap proyek
├── src/
│   ├── data/
│   │   └── questions.js         # Bank soal 3 mode, opsi jawaban, & kriteria predikat
│   └── js/
│       ├── app.js               # Controller utama klien siswa (ES Modules)
│       ├── admin.js             # Controller utama admin dashboard (ES Modules)
│       ├── firebase/
│       │   ├── config.js        # Inisialisasi Firebase Web Modular SDK v10/v11
│       │   ├── auth.js          # Otentikasi anonim untuk perangkat siswa & admin
│       │   ├── database.js      # Layanan RTDB: claim slot 8 kelompok, timer sync, leaderboard
│       │   └── functions.js     # Pemanggil Cloud Functions dengan fallback client RTDB
│       ├── game/
│       │   ├── state.js         # State management & pemulihan sesi (rehydration)
│       │   ├── star-champ.js    # Mode 1: StarChamp Challenge (10 PG, 35 Poin)
│       │   ├── memory-madness.js# Mode 2: Memory Madness (Hafal 30s + Recall 10 soal, 30 Poin)
│       │   └── number-chains.js # Mode 3: Number Chains (5 Tahap Konversi Berantai, 35 Poin)
│       └── utils/
│           ├── timer.js         # Sinkronisasi timer server /.info/serverTimeOffset
│           ├── sounds.js        # Sintesis efek suara Web Audio API
│           └── ui.js            # Notifikasi Toast & Canvas Confetti
└── functions/
    ├── package.json             # Dependensi Node.js Cloud Functions
    └── index.js                 # Backend Functions: validasi kunci jawaban & anti-cheat scoring
```

---

## ⚡ 3. TIGA ARENA MODE PERMAINAN (TOTAL 100 POIN)

| Mode | Nama Arena | Mekanisme & Durasi | Bobot Skor |
| :--- | :--- | :--- | :--- |
| **Mode 1** | **StarChamp Challenge** | 10 Soal Pilihan Ganda (Konsep suhu, fungsi termometer, titik lebur/didih, kesetimbangan termal). Timer 30 detik/soal. | **35 Poin** (3,5 poin/soal) |
| **Mode 2** | **Memory Madness** | **Fase 1 (Memorize):** 30 detik menghafal 10 kartu titik tetap termometer (C, R, F, K, alat, kesetimbangan).<br>**Fase 2 (Recall):** 10 tantangan uji ingatan cepat (timer 25 detik/soal). | **30 Poin** (3 poin/soal) |
| **Mode 3** | **Number Chains** | 5 Tahap konversi suhu bertingkat:<br>• Tahap 1: C ke F (Easy)<br>• Tahap 2: C ke R (Easy)<br>• Tahap 3: C ke K (Medium)<br>• Tahap 4: F ke C (Medium)<br>• Tahap 5: Rantai Bertingkat R ke C lalu ke F (Hard) | **35 Poin** (7 poin/tahap) |
| **TOTAL** | **Akademik Suhu IPA** | **3 Arena Tantangan Kelompok** | **100 Poin Maksimal** |

### 🏆 Skala Predikat Pencapaian Resmi:
- **86 – 100 Poin:** 🏆 `THERMO CHAMPION` (Penguasaan materi tingkat master)
- **76 – 85 Poin:** 🥇 `THERMO EXPERT` (Pemahaman konsep dan konversi sangat matang)
- **66 – 75 Poin:** 🥈 `SCIENCE CHALLENGER` (Penalaran sains dan memori memuaskan)
- **56 – 65 Poin:** 🥉 `THERMO EXPLORER` (Cukup baik, perlu ketelitian hitung)
- **0 – 55 Poin:** 🌱 `TEMPERATURE ROOKIE` (Perlu mengulang modul materi suhu)

---

## 🛠️ 4. PANDUAN SETUP FIREBASE

### Langkah 1: Buat Proyek di Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat proyek baru (misal: `thermo-champions`).
3. Tambahkan **Web App** (klik ikon `</>` Web):
   - Masukkan App nickname: `thermo-champions-web`.
   - Salin objek `firebaseConfig`.

### Langkah 2: Aktifkan Firebase Authentication
1. Pada menu sebelah kiri, buka **Build** → **Authentication**.
2. Klik tab **Sign-in method**.
3. Aktifkan penyedia **Anonymous (Anonim)**, lalu simpan.

### Langkah 3: Aktifkan Firebase Realtime Database
1. Pada menu sebelah kiri, buka **Build** → **Realtime Database**.
2. Klik **Create Database**, pilih lokasi server (disarankan `asia-southeast1` Singapura untuk latensi terendah di Indonesia).
3. Pilih opsi **Start in locked mode**.
4. Buka tab **Rules**, lalu salin isi file `database.rules.json` dari proyek ini dan klik **Publish**.

### Langkah 4: Masukkan Konfigurasi ke Aplikasi
Anda dapat memasukkan URL Realtime Database langsung melalui antarmuka web:
1. Buka `admin.html` di browser Anda.
2. Pada bilah konfigurasi di bagian atas:
   - Masukkan `Firebase RTDB URL` (misal: `https://thermo-champions-default-rtdb.asia-southeast1.firebasedatabase.app`).
   - Klik **Simpan & Uji**.
   - Lampu indikator akan berubah menjadi hijau: `Firebase Realtime Terhubung`.

---

## 📱 5. PANDUAN PENGGUNAAN DI KELAS

### A. Alur Guru (Game Master Admin):
1. Buka `admin.html` di laptop Guru (dapat diproyeksikan ke layar proyektor kelas).
2. Klik **➕ Buat Sesi Baru**, isi nama sesi (misal: *Turnamen Suhu VII-A*), lalu klik **Buat Sesi**.
3. Guru mendapatkan **Kode Sesi 6 Karakter** (misal: `TC-7929`) atau dapat mengklik tombol **🔗 Salin Link HP Siswa**.
4. Guru memantau **Status 8 Kelompok** di ruang tunggu secara live.
5. Saat ke-8 kelompok telah masuk dan siap di ruang tunggu, Guru menekan tombol hero besar:
   🚀 **"MULAI BERSAMA SELURUH KELOMPOK"**
6. Seluruh HP siswa secara serentak menghitung mundur **3... 2... 1... MULAI!** dan masuk ke arena pertandingan.
7. Guru dapat memantau pergerakan nilai secara langsung di tabel **Papan Peringkat Real-Time** dan mengunduh rekap hasil akhir dengan tombol **📊 Unduh CSV**.

### B. Alur Kelompok Siswa:
1. Satu perwakilan kelompok membuka `index.html` di HP/smartphone mereka.
2. Masukkan **Kode Sesi** dari Guru (atau buka link langsung dari Guru).
3. Pilih nomor kelompok (Kelompok 1 sampai 8). Sistem atomic locking otomatis mencegah 2 kelompok mengambil nomor yang sama.
4. Masukkan **Nama Kelompok** dan daftar **Anggota Tim beserta nomor absen**.
5. Klik **Konfirmasi dan Mulai**. Perangkat masuk ke **Ruang Tunggu (Lobby)**.
6. Tunggu sinyal mulai dari Guru di depan kelas.
7. Kerjakan ketiga mode tantangan bersama-sama hingga tuntas.
8. Lihat hasil akhir nilai kumulatif, predikat, piagam penghargaan, dan peringkat kelas!

---

## 🌐 6. DEPLOYMENT KE VERCEL

Proyek ini telah dikonfigurasi secara lengkap untuk Vercel melalui `vercel.json`:
1. Push repositori ke GitHub / GitLab / Bitbucket.
2. Buka [Vercel Dashboard](https://vercel.com/) dan impor repositori.
3. Karena proyek menggunakan Vanilla HTML/CSS/JS murni:
   - **Framework Preset:** `Other`.
   - **Build Command:** (kosongkan).
   - **Output Directory:** `.` (root).
4. Klik **Deploy**.
5. Website siap diakses secara online oleh seluruh siswa di kelas!

---

## 🔒 7. KEAMANAN & ANTI-CHEAT

1. **Atomic Group Slot Claim:** Menggunakan `runTransaction` pada node `/sessionGroups/{sessionId}/group{N}` untuk menjamin hanya 1 perangkat yang dapat mengklaim satu nomor kelompok.
2. **Anti-Replay Submissions:** Setiap nomor soal memiliki kunci unik di `/submissions/{sessionId}/group{N}/{mode}_{id}` sehingga kelompok tidak dapat mengirim jawaban ganda atau memanipulasi nilai.
3. **Timer Drift Compensation:** Waktu timer dikalibrasi secara otomatis menggunakan patokan waktu server Firebase (`/.info/serverTimeOffset`) sehingga perhitungan detik sama persis di seluruh variasi tipe HP siswa.
4. **Offline & Refresh Resilience:** Jika HP siswa tidak sengaja ter-refresh atau sinyal terputus sesaat, state disimpan di `localStorage` dan langsung direhidrasi otomatis dari Firebase tanpa kehilangan progres yang telah dijawab.
