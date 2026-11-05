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

## 👥 Sistem 8 Kelompok & Identitas Pemain (Revisi Terbaru)

### 1. Pembagian 8 Kelompok Resmi
Game menyediakan tepat **8 Kelompok** dalam bentuk kartu visual yang menarik:
- **Kelompok 1** (*Tim Celsius* 🌡️) — Skala 0°C – 100°C
- **Kelompok 2** (*Tim Fahrenheit* 🔥) — Skala 32°F – 212°F
- **Kelompok 3** (*Tim Reamur* ⚗️) — Rasio skala 4 dan batas 80°R
- **Kelompok 4** (*Tim Kelvin* ❄️) — Standar Satuan Internasional (SI)
- **Kelompok 5** (*Tim Bimetal* ⚙️) — Pemuaian logam instrumen industri
- **Kelompok 6** (*Tim Pirometer* 🎯) — Pengukuran radiasi termal optik
- **Kelompok 7** (*Tim Termokopel* ⚡) — Deteksi sinyal tegangan termal ekstrem
- **Kelompok 8** (*Tim Kesetimbangan Termal* ⚖️) — Prinsip kesamaan suhu termometer dan benda

Setiap kelompok dapat dipilih oleh beberapa pemain (siswa) tanpa batasan kuota.

### 2. Pengisian Identitas Mandiri
- **Nama Lengkap:** Diketik sendiri oleh siswa (wajib, tidak ada pengisian otomatis).
- **Nomor Absen:** Diketik sendiri oleh siswa (wajib, validasi angka positif minimal 1).
- **Tidak ada daftar nama bawaan atau data contoh tiruan.**

### 3. Alur Masuk Permainan
1. Pemain membuka Landing Page dan menekan tombol **"Mulai Bermain"**.
2. Pemain memilih salah satu dari **8 Kelompok** pada kartu kelompok.
3. Pemain mengetik **Nama Lengkap** sendiri.
4. Pemain mengetik **Nomor Absen** sendiri.
5. Sistem menampilkan kotak **Ringkasan Konfirmasi** (Kelompok, Nama Lengkap, Nomor Absen).
6. Pemain menekan tombol **"Konfirmasi dan Mulai"**.
7. Pemain masuk ke Dashboard Permainan dan dapat memulai tantangan.

---

## 📊 Sistem Penilaian Individu & Rekapitulasi Kelompok

### A. Penyimpanan Data Pemain
Setiap pemain memiliki catatan permainan mandiri di `localStorage` dengan struktur:
```json
{
  "playerId": "tc_1730000000000_abc12",
  "nama": "Nama Siswa",
  "nomorAbsen": 12,
  "kelompok": "Kelompok 1",
  "skorStarChamp": 35,
  "skorMemoryMadness": 30,
  "skorNumberChains": 35,
  "nilaiAkhir": 100,
  "predikat": "Thermo Champion",
  "tanggalPermainan": "2026-11-05T14:50:00.000Z",
  "completed": true
}
```
*Catatan pemain sebelumnya tidak akan tertimpa saat pemain baru mendaftar.*

### B. Rumus Penilaian Kelompok
Peringkat kelompok ditentukan berdasarkan **Rata-Rata Nilai Akhir Anggota Tertinggi**:

$$\text{Rata-rata Kelompok} = \frac{\text{Total Nilai Akhir Seluruh Anggota Selesai}}{\text{Jumlah Anggota yang Sudah Menyelesaikan Permainan}}$$

- **Ketentuan Penting:** Hanya anggota yang telah menyelesaikan seluruh 3 mode yang dimasukkan ke dalam perhitungan rata-rata. Pemain yang belum selesai **tidak dianggap bernilai 0** sehingga tidak merugikan rata-rata kelompoknya.

### C. Leaderboard Dua Kategori
Papan peringkat (*Leaderboard*) menyediakan dua tab:
1. **Leaderboard Kelompok (8 Kelompok):** Peringkat 8 kelompok berdasarkan rata-rata nilai, total nilai, dan jumlah anggota yang sudah selesai (lengkap dengan daftar nama anggota yang berkontribusi).
2. **Leaderboard Individu:** Peringkat perorangan berdasarkan nilai akhir kumulatif tertinggi (maksimal 100).

---

## 🎯 Tiga Arena Tantangan

1. **Mode 1 — StarChamp Challenge (`THERMO QUIZ` - 35 Poin):**
   - 10 Soal Pilihan Ganda (A, B, C, D) konsep suhu & jenis termometer.
   - Timer 30 detik per soal, pembahasan ilmiah seketika, 3,5 poin per jawaban benar.
2. **Mode 2 — Memory Madness (`THERMO MEMORY` - 30 Poin):**
   - *Fase 1 (Memorization):* 30 detik menghafal 10 kartu titik tetap termometer.
   - *Fase 2 (Recall):* 10 tantangan ingatan cepat (25 detik/soal), 3,0 poin per jawaban tepat.
3. **Mode 3 — Number Chains (`THERMO CALCULATION` - 35 Poin):**
   - 5 tahapan konversi suhu berurutan bertingkat (7 poin per tahap).
   - Dilengkapi tombol petunjuk rumus bantuan dan kunci pembahasan resmi langkah demi langkah.

---

## 🏅 Predikat Pencapaian

| Rentang Nilai | Predikat | Lencana | Kategori Kompetensi |
| :---: | :---: | :---: | :--- |
| **86 – 100** | **Thermo Champion** | 🏆 | Penguasaan materi konsep dan perhitungan sempurna |
| **76 – 85** | **Thermo Expert** | 🎖️ | Pemahaman konsep dan konversi suhu sangat baik |
| **66 – 75** | **Science Challenger** | ⚡ | Penalaran sains dan daya ingat memuaskan |
| **56 – 65** | **Thermo Explorer** | 🔍 | Cukup baik, perlu penguatan ketelitian angka |
| **0 – 55** | **Temperature Rookie** | 📘 | Perlu mempelajari kembali modul materi suhu |

---

## 🚀 Panduan Menjalankan

```powershell
# Jalankan mode pengembangan
npm run dev

# Kompilasi berkas siap pakai (production build di folder dist/)
npm run build
```
Akses di peramban pada `http://localhost:3000`.
