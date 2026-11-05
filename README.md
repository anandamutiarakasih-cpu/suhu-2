# THERMO CHAMPIONS 🏆
### Game Edukasi Berbasis Web — Clash of Champions Suhu 1 (IPA Kelas VII SMP)
> **Tagline:** *"Master the Temperature. Become the Champion."*

---

## 📌 Deskripsi Game
**THERMO CHAMPIONS** adalah media pembelajaran interaktif berbasis web untuk mata pelajaran Ilmu Pengetahuan Alam (IPA) Kelas VII SMP pada materi pokok **SUHU**.

Game ini mengadaptasi 3 konsep tantangan cerdas dari acara *Clash of Champions Ruangguru*, yang diformulasikan khusus dengan identitas sains dan nuansa kompetisi akademik:
1. **StarChamp Challenge** (*THERMO QUIZ*) — Bobot: **35 Poin**
2. **Memory Madness** (*THERMO MEMORY*) — Bobot: **30 Poin**
3. **Number Chains** (*THERMO CALCULATION*) — Bobot: **35 Poin**

**Total Skor Maksimal:** **100 Poin** (Penjumlahan murni tanpa pengurangan nilai).

---

## 🎯 Tujuan Pembelajaran (Capaian Pembelajaran)
1. Memahami pengertian suhu sebagai derajat panas dingin dan energi kinetik rata-rata partikel zat.
2. Memahami fungsi termometer serta alasan kulit/tangan bukan alat ukur baku.
3. Mengenal prinsip kesetimbangan suhu (*thermal equilibrium*).
4. Mengenal jenis termometer: Klinis/Badan, Laboratorium, dan Industri (Bimetal, Inframerah, Termokopel).
5. Mengenali 4 skala suhu: Celsius (°C), Reamur (°R), Fahrenheit (°F), dan Kelvin (K - Satuan Internasional).
6. Mengetahui titik tetap bawah (es lebur) dan titik tetap atas (air mendidih) setiap skala suhu.
7. Memahami hubungan dan perbandingan skala suhu: $C : R : (F - 32) : (K - 273) = 5 : 4 : 9 : 5$.
8. Menghitung konversi antarskala suhu dengan penalaran bertahap dan tepat.
9. Melatih daya ingat visual (*photographic memory*), penalaran logis, dan kecepatan hitung numerik siswa.

---

## 🎮 Struktur & Mekanisme 3 Mode Permainan

### 1. Mode 1 — StarChamp Challenge (THERMO QUIZ)
- **Format:** 10 Soal Pilihan Ganda (A, B, C, D) ditampilkan satu per satu.
- **Waktu:** 30 detik per soal.
- **Bobot Nilai:** 3,5 poin per soal benar (Maksimal **35 Poin**).
- **Fitur:** Umpan balik benar/salah instan, pembahasan ilmiah lengkap langsung di layar, perekaman durasi waktu pengerjaan.

### 2. Mode 2 — Memory Madness (THERMO MEMORY)
- **Fase 1 (Memorization):** Siswa mengamati grid 10 kartu informasi fakta titik tetap dan instrumen suhu selama 30 detik.
- **Fase 2 (Recall):** 10 tantangan uji ingatan cepat (25 detik/soal) berdasarkan kartu yang telah dihafal tanpa melihat kembali.
- **Bobot Nilai:** 3,0 poin per jawaban tepat (Maksimal **30 Poin**).
- **Fitur:** Kartu yang salah dijawab dirangkum di akhir sesi untuk dipelajari kembali.

### 3. Mode 3 — Number Chains (THERMO CALCULATION)
- **Format:** Rangkaian 5 tahapan konversi numerik berurutan dengan peningkatan kesulitan:
  - *Tahap 1 (Easy):* Konversi 30°C ke °F $\rightarrow$ **86°F**
  - *Tahap 2 (Easy):* Konversi 40°C ke °R $\rightarrow$ **32°R**
  - *Tahap 3 (Medium):* Konversi 27°C ke Kelvin (SI) $\rightarrow$ **300 K**
  - *Tahap 4 (Medium):* Konversi 212°F ke °C $\rightarrow$ **100°C**
  - *Tahap 5 (Hard - Multi-step):* Konversi berantai 60°R $\rightarrow$ **75°C** $\rightarrow$ **167°F**
- **Bobot Nilai:** 7 poin per tahapan (Maksimal **35 Poin**). Pada tahap bertingkat, nilai dialokasikan per langkah (masing-masing 3,5 poin).
- **Fitur:** Tombol opsional petunjuk rumus bantuan, validasi toleransi numerik, pembahasan langkah demi langkah resmi.

---

## 📊 Sistem Penilaian & Predikat Juara

$$\text{Nilai Akhir} = \text{Nilai StarChamp} + \text{Nilai Memory} + \text{Nilai Number Chains} \quad (\text{Maksimal } 100)$$

| Rentang Nilai | Predikat Pencapaian | Lencana | Keterangan |
| :---: | :---: | :---: | :--- |
| **86 – 100** | **Thermo Champion** | 🏆 | Penguasaan materi konsep dan perhitungan sempurna |
| **76 – 85** | **Thermo Expert** | 🎖️ | Pemahaman konsep dan konversi suhu sangat baik |
| **66 – 75** | **Science Challenger** | ⚡ | Penalaran sains dan daya ingat memuaskan |
| **56 – 65** | **Thermo Explorer** | 🔍 | Cukup baik, perlu penguatan ketelitian angka |
| **0 – 55** | **Temperature Rookie** | 📘 | Perlu mempelajari kembali modul materi suhu |

---

## ✨ Fitur Unggulan Aplikasi
1. **Simulasi Visual Termometer Interaktif 4 Skala:** Menampilkan tabung Celsius, Reamur, Fahrenheit, dan Kelvin yang bergerak paralel secara real-time saat slider digeser.
2. **Kalkulator Simulasi Konversi Rumus:** Membantu siswa memverifikasi rumus secara langsung.
3. **Piagam Penghargaan Resmi (Certificate of Achievement):** Dapat dicetak atau diunduh sebagai PDF dengan stempel resmi dan identitas siswa.
4. **Papan Peringkat Lokal (Leaderboard):** Menyimpan rekor nilai tertinggi di peramban siswa.
5. **Sintesis Efek Suara Web Audio API:** 100% offline, tanpa aset eksternal yang rentan rusak, lengkap dengan tombol bisukan/aktifkan suara.
6. **Desain Modern Academic Game Show:** Responsif untuk smartphone, tablet, laptop, dan proyektor kelas.

---

## 🚀 Panduan Menjalankan Aplikasi

### Menjalankan Mode Pengembangan (Development)
```bash
npm install
npm run dev
```
Aplikasi dapat diakses pada `http://localhost:3000`.

### Membangun Berkas Siap Pakai (Production Build)
```bash
npm run build
```
Hasil build berada di folder `dist/` dan dapat dibuka langsung atau disematkan pada hosting web sekolah (seperti GitHub Pages, Netlify, Vercel, dll).
