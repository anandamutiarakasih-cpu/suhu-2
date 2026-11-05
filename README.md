# THERMO CHAMPIONS 🏆
### Game Edukasi Berbasis Web Multiplayer Real-Time — Clash of Champions Suhu (IPA Kelas VII SMP)
> **Tagline:** *"Master the Temperature. Become the Champion."*

---

## 📌 Deskripsi Sistem Multiplayer
**THERMO CHAMPIONS** adalah media pembelajaran interaktif berbasis web untuk mata pelajaran Ilmu Pengetahuan Alam (IPA) Kelas VII SMP pada materi pokok **SUHU** (tidak mencakup kalor atau pemuaian).

Sistem kini mendukung **Turnamen Multiplayer Online Real-Time** yang dapat dimainkan oleh **8 kelompok secara bersamaan menggunakan 8 perangkat berbeda** (laptop/tablet/smartphone siswa) dengan 1 dashboard kontrol Guru (**Game Master Admin**):
- **Teknologi Frontend:** Murni **HTML5, CSS3, dan Vanilla JavaScript** (Zero dependency, tanpa framework React/Vue/Laravel).
- **Database & Sinkronisasi:** **Supabase PostgreSQL** & **Supabase Realtime** (`postgres_changes` websocket channel).
- **Hosting Frontend:** Siap di-*deploy* langsung ke **Vercel** (`vercel.json` sudah tersedia).
- **Keamanan:** Menerapkan **Row Level Security (RLS)** dan hanya menggunakan **Publishable API Key** (`sb_publishable_...`) di frontend (Service Role Key dirahasiakan dan tidak pernah disimpan di sisi klien).
- **Anti-Curang & Anti-Duplikasi:** Constraint unik database mencegah pengiriman jawaban/skor ganda dan mencegah pembajakan nomor kelompok oleh perangkat lain.
- **Sinkronisasi Timer:** Waktu permainan disinkronkan menggunakan waktu server (`started_at`).
- **Pemulihan Otomatis:** Jika perangkat di-*refresh* atau koneksi terputus sesaat, progres dan jawaban langsung dipulihkan dari database.

---

## 👥 Dua Peran Pengguna

### 1. Guru / Game Master (`admin.html`)
- Membuka halaman **Admin** untuk membuat sesi turnamen baru (menghasilkan kode sesi 6 karakter unik, misal: `TC-8899` atau `SUHU01`).
- Memantau **8 slot kelompok** di ruang tunggu (*Lobby*) secara *real-time*: melihat perangkat mana saja yang sudah bergabung, nama tim, dan daftar anggotanya.
- Menekan tombol besar **"MULAI BERSAMA SELURUH KELOMPOK"**:
  - Mengirim sinyal *realtime broadcast* ke seluruh perangkat siswa.
  - Memulai permainan di ke-8 perangkat siswa secara serentak.
- Melihat **Live Leaderboard** yang otomatis naik-turun peringkatnya setiap kali kelompok berhasil menjawab soal.
- Kontrol pertandingan: Jeda (*Pause*), Lanjutkan (*Resume*), Selesaikan (*Complete*), dan *Reset*.

### 2. Kelompok Siswa (`index.html`)
- Menggunakan perangkat masing-masing (1 perangkat per kelompok).
- Memasukkan **Kode Sesi** dari Guru dan memilih salah satu dari **8 Kelompok** (slot yang sudah diambil perangkat lain akan ditandai dan dicegah untuk diambil ganda).
- Mengetik **Nama Kelompok** dan daftar **Anggota Tim (+ Tambah Anggota)**.
- Masuk ke **Ruang Tunggu (Lobby)** dengan animasi radar: menunggu Guru menekan *"Mulai Bersama"*.
- Begitu Guru menekan *"Mulai Bersama"*, layar kelompok otomatis berpindah serentak ke arena kompetisi!
- Mengerjakan 3 mode tantangan:
  1. **StarChamp Challenge** (*10 Soal MCQ*, 35 Poin, 30s/soal)
  2. **Memory Madness** (*Fase Memorize 30s + 10 Soal Recall 25s*, 30 Poin)
  3. **Number Chains** (*5 Tahap Konversi Suhu Rantai*, 35 Poin)
- Total Skor Maksimal: **100 Poin**.

---

## ⚙️ Panduan Setup Supabase (Database Online)

### Langkah 1: Jalankan Skrip SQL di Supabase
1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Buat proyek baru atau buka proyek yang sudah ada.
3. Buka menu **SQL Editor** pada bilah sisi kiri.
4. Salin seluruh isi berkas [schema.sql](file:///d:/suhu%202/schema.sql) dan tempelkan ke SQL Editor, lalu klik **Run**.
5. Skrip akan membuat:
   - Tabel `public.game_sessions`
   - Tabel `public.session_groups` (dengan constraint unik per nomor kelompok)
   - Tabel `public.group_submissions` (dengan constraint anti-duplikasi jawaban)
   - Realtime publication `supabase_realtime`
   - Kebijakan Row Level Security (RLS)
   - Fungsi RPC `get_server_time()` untuk sinkronisasi waktu server
   - Fungsi RPC `submit_group_answer(...)` untuk validasi jawaban di sisi server & anti-cheat
   - Fungsi RPC `get_session_leaderboard(...)` untuk kalkulasi peringkat tie-break otomatis (skor tertinggi -> durasi tercepat -> peringkat sama jika identik)

### Langkah 2: Konfigurasi Supabase URL
Publishable key sudah terpasang:
`sb_publishable__xFEKpJLEyceeRzqdcceXw_o_wUh_zz`

Tinggal masukkan **Project URL** Anda (misalnya `https://abcdefghijklm.supabase.co`):
- **Opsi A (Paling Mudah):** Buka halaman `admin.html`, ketikkan URL Supabase Anda pada kolom atas, lalu klik **"Simpan & Uji"**. Pengaturan ini akan tersimpan otomatis.
- **Opsi B:** Buka berkas [config.js](file:///d:/suhu%202/config.js) dan isi variabel `DEFAULT_SUPABASE_URL`:
  ```javascript
  DEFAULT_SUPABASE_URL: 'https://abcdefghijklm.supabase.co',
  ```

---

## 🧪 Cara Menguji Menggunakan 8 Perangkat (atau 8 Tab Browser)

Anda dapat menguji alur multiplayer ini secara langsung di 1 komputer dengan membuka beberapa jendela peramban:

1. **Buka Game Master Admin:**
   - Buka `admin.html` di satu tab.
   - Buat sesi turnamen baru (misal kode: `SUHU01`).
2. **Buka 8 Tab Siswa (atau 8 Perangkat di Jaringan yang Sama):**
   - Buka `index.html` pada 8 jendela/tab berbeda (bisa menggunakan mode *Incognito* atau perangkat HP/laptop berbeda).
   - Pada Tab 1: Masukkan kode `SUHU01`, pilih **Kelompok 1**, isi nama tim & anggota, klik konfirmasi. Tab 1 masuk ke Ruang Tunggu.
   - Pada Tab 2 s/d 8: Masukkan kode `SUHU01`, pilih **Kelompok 2 s/d 8**, isi data tim masing-masing.
   - Perhatikan pada tab Admin: Ke-8 kartu kelompok otomatis berubah status menjadi **"SIAP / TERHUBUNG"** secara *real-time*!
3. **Mulai Serentak:**
   - Pada tab Admin, klik tombol **"MULAI BERSAMA SELURUH KELOMPOK"**.
   - Seketika ke-8 tab siswa akan berpindah ke *Dashboard Permainan* secara bersamaan!
4. **Coba Jawab Soal:**
   - Saat salah satu kelompok menjawab soal, perhatikan pada tab Admin dan *Leaderboard*: Skor kelompok tersebut langsung terbarui seketika (*live update*).

---

## 🚀 Panduan Publikasi ke Vercel

Proyek ini telah dilengkapi [vercel.json](file:///d:/suhu%202/vercel.json) sehingga dapat langsung di-*deploy* ke Vercel dalam 1 menit:

### Cara 1: Menggunakan Vercel CLI
```powershell
# Instal vercel cli jika belum ada
npm i -g vercel

# Di dalam direktori d:\suhu 2, jalankan:
vercel --prod
```

### Cara 2: Hubungkan Repositori Git ke Vercel Dashboard
1. Unggah kode ke GitHub/GitLab.
2. Masuk ke [Vercel Dashboard](https://vercel.com/dashboard) -> klik **Add New Project**.
3. Pilih repositori **thermo-champions**.
4. Biarkan konfigurasi Framework Preset sebagai **Other**.
5. Klik **Deploy**! Vercel akan memberikan link web publik yang dapat langsung diakses oleh guru dan siswa dari ponsel atau laptop manapun.

---

## 🔒 Keamanan & Integritas Data
- **Row Level Security (RLS):** Seluruh query dibatasi oleh RLS policy Supabase.
- **Kunci Rahasia Terlindungi:** Kunci `service_role` **TIDAK PERNAH** disimpan di frontend. Hanya kunci publik `sb_publishable_...` yang digunakan.
- **Anti-Cheat Jawaban Ganda:** Constraint database `UNIQUE(session_id, group_number, mode, item_id)` menolak secara tegas upaya pengiriman skor ganda dari kelompok yang sama.
- **Anti-Tabrakan Kelompok:** Perangkat lain tidak dapat memilih nomor kelompok yang sudah diambil di sesi yang sama.
