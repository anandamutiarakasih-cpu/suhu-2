import React from 'react';
import { HelpCircle, X, Brain, Zap, Hash, Award, CheckCircle2, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-deepblue to-navy-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-electric/20 text-electric flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5 text-electric" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Panduan Resmi Kompetisi
              </span>
              <h2 className="text-lg sm:text-xl font-black">Petunjuk & Aturan Main</h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs sm:text-sm text-slate-700">
          
          {/* General Overview */}
          <div>
            <h3 className="font-bold text-navy-950 text-base mb-2">
              Tentang THERMO CHAMPIONS
            </h3>
            <p className="text-slate-600 leading-relaxed">
              THERMO CHAMPIONS adalah media game edukasi interaktif untuk mata pelajaran IPA Kelas VII SMP materi <strong>SUHU</strong>. Game ini mengadaptasi mekanisme kompetisi akademik Ruangguru Clash of Champions melalui tiga arena tantangan cerdas.
            </p>
          </div>

          {/* 3 Modes Explanation */}
          <div className="space-y-3">
            <h3 className="font-bold text-navy-950 text-base">
              Mekanisme 3 Arena Tantangan:
            </h3>

            {/* Mode 1 */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
              <div className="flex items-center justify-between font-bold text-deepblue mb-1">
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-electric" />
                  Mode 1: StarChamp Challenge (THERMO QUIZ)
                </span>
                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-blue-200">
                  Maks. 35 Poin
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs mt-2">
                <li>Terdiri dari 10 soal pilihan ganda konsep suhu & termometer.</li>
                <li>Waktu pengerjaan 30 detik per soal.</li>
                <li>Setiap jawaban benar bernilai 3,5 poin. Jawaban salah bernilai 0 (tidak ada pengurangan nilai).</li>
                <li>Terdapat pembahasan langsung setelah kamu menjawab.</li>
              </ul>
            </div>

            {/* Mode 2 */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200">
              <div className="flex items-center justify-between font-bold text-navy-900 mb-1">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Mode 2: Memory Madness (THERMO MEMORY)
                </span>
                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-sky-200">
                  Maks. 30 Poin
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs mt-2">
                <li><strong>Fase 1 (Memorization):</strong> Kamu memiliki 30 detik untuk mengamati dan menghafal 10 kartu fakta titik tetap skala termometer.</li>
                <li><strong>Fase 2 (Recall):</strong> Jawab 10 pertanyaan uji ingatan cepat tanpa melihat kartu.</li>
                <li>Setiap jawaban benar bernilai 3 poin (Total 30 poin). Tidak ada pengurangan nilai.</li>
              </ul>
            </div>

            {/* Mode 3 */}
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
              <div className="flex items-center justify-between font-bold text-thermoOrange mb-1">
                <span className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-thermoOrange" />
                  Mode 3: Number Chains (THERMO CALCULATION)
                </span>
                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-orange-200">
                  Maks. 35 Poin
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs mt-2">
                <li>5 tahapan perhitungan konversi suhu berurutan dengan kesulitan bertahap (Easy hingga Hard).</li>
                <li>Setiap tahapan bernilai 7 poin. Untuk soal bertahap (multi-step), nilai dialokasikan per langkah yang benar.</li>
                <li>Tersedia tombol petunjuk rumus bantuan bila kamu memerlukan panduan rumus.</li>
              </ul>
            </div>
          </div>

          {/* Predicate Table */}
          <div>
            <h3 className="font-bold text-navy-950 text-base mb-2">
              Sistem Penilaian & Predikat Juara (Total 100 Poin)
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5">Rentang Nilai</th>
                    <th className="p-2.5">Predikat</th>
                    <th className="p-2.5">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-amber-50/40">
                    <td className="p-2.5 font-bold font-mono text-amber-700">86 – 100</td>
                    <td className="p-2.5 font-bold text-amber-800">🏆 Thermo Champion</td>
                    <td className="p-2.5 text-slate-600">Penguasaan materi & perhitungan sempurna</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-sky-700">76 – 85</td>
                    <td className="p-2.5 font-bold text-sky-800">🎖️ Thermo Expert</td>
                    <td className="p-2.5 text-slate-600">Pemahaman konsep & konversi sangat baik</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-indigo-700">66 – 75</td>
                    <td className="p-2.5 font-bold text-indigo-800">⚡ Science Challenger</td>
                    <td className="p-2.5 text-slate-600">Memiliki penalaran dan daya ingat baik</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-emerald-700">56 – 65</td>
                    <td className="p-2.5 font-bold text-emerald-800">🔍 Thermo Explorer</td>
                    <td className="p-2.5 text-slate-600">Cukup baik, perlu ketelitian hitung</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-slate-600">0 – 55</td>
                    <td className="p-2.5 font-bold text-slate-700">📘 Temperature Rookie</td>
                    <td className="p-2.5 text-slate-600">Perlu mempelajari modul materi suhu kembali</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Rules */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-600">
            <span className="font-bold text-navy-950 block mb-1">Ketentuan Sistem 8 Kelompok & Penilaian:</span>
            <p>• <strong>8 Kelompok Resmi:</strong> Pemain memilih salah satu dari Kelompok 1 s.d. Kelompok 8, lalu mengetik nama lengkap dan nomor absen sendiri.</p>
            <p>• <strong>Nilai Kumulatif Individu:</strong> StarChamp (35) + Memory (30) + Number Chains (35) = <strong>Maksimal 100 Poin</strong>.</p>
            <p>• <strong>Penilaian & Peringkat Kelompok:</strong> Rata-rata Kelompok dihitung dari <em>Total Nilai Anggota Selesai / Jumlah Anggota yang Sudah Menyelesaikan Permainan</em>. Anggota yang belum selesai tidak dihitung 0 agar tidak merugikan kelompok.</p>
            <p>• Skor setiap pemain tersimpan mandiri di peramban dan tidak menimpa catatan pemain lain.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-deepblue hover:bg-navy-900 text-white font-bold text-xs shadow-sm transition-all"
          >
            Mengerti, Siap Bertanding!
          </button>
        </div>

      </div>
    </div>
  );
}
