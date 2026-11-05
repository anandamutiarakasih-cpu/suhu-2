import React, { useState } from 'react';
import { studyMaterials } from '../data/materials';
import ThermometerVisualizer from './ThermometerVisualizer';
import { 
  ArrowLeft, BookOpen, Layers, Target, Calculator, Activity, 
  Thermometer, CheckCircle, ChevronRight, HelpCircle 
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function MaterialPage({ onBack, onStartPractice }) {
  const [activeTab, setActiveTab] = useState('pengertian');
  
  // Interactive mini calculator for practicing conversions
  const [calcInput, setCalcInput] = useState(25);
  const [calcUnit, setCalcUnit] = useState('C');

  // Compute conversions dynamically based on input
  const getConvertedValues = (val, unit) => {
    let c = 0;
    if (unit === 'C') c = val;
    else if (unit === 'R') c = (5 / 4) * val;
    else if (unit === 'F') c = (5 / 9) * (val - 32);
    else if (unit === 'K') c = val - 273.15;

    const resC = Math.round(c * 100) / 100;
    const resR = Math.round((4 / 5 * c) * 100) / 100;
    const resF = Math.round(((9 / 5 * c) + 32) * 100) / 100;
    const resK = Math.round((c + 273.15) * 100) / 100;

    return { C: resC, R: resR, F: resF, K: resK };
  };

  const converted = getConvertedValues(Number(calcInput) || 0, calcUnit);

  const icons = {
    pengertian: Thermometer,
    termometer: Activity,
    skala: Layers,
    'titik-tetap': Target,
    konversi: Calculator,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => {
              sound.click();
              onBack();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-950 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-electric/20 text-deepblue flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-deepblue" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
                Pusat Materi: Suhu & Skala Termometer
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                Buku Pembelajaran IPA Kelas VII SMP — Terstandarisasi & Mudah Dipahami
              </p>
            </div>
          </div>
        </div>

        {onStartPractice && (
          <button
            onClick={() => {
              sound.click();
              onStartPractice();
            }}
            className="px-5 py-2.5 rounded-xl bg-thermoOrange hover:bg-thermoOrange-hover text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Mulai Uji Pemahaman</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Interactive Thermometer Visualizer Hero */}
      <div className="mb-10">
        <ThermometerVisualizer />
      </div>

      {/* Material Sections Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {studyMaterials.map((mat) => {
          const IconComponent = icons[mat.id] || BookOpen;
          const isActive = activeTab === mat.id;
          return (
            <button
              key={mat.id}
              onClick={() => {
                sound.click();
                setActiveTab(mat.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-deepblue text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-electric' : 'text-slate-400'}`} />
              <span>{mat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Material Section Card */}
      {studyMaterials
        .filter((mat) => mat.id === activeTab)
        .map((mat) => (
          <div key={mat.id} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm animate-fadeIn">
            
            {/* Title & Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-deepblue text-xs font-bold uppercase tracking-wider">
                {mat.badge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mb-3">
              {mat.title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium mb-8 p-4 bg-slate-50 rounded-2xl border-l-4 border-deepblue">
              {mat.summary}
            </p>

            {/* General Content paragraphs */}
            {mat.content?.map((item, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  {item.subtitle}
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {item.text}
                </p>
              </div>
            ))}

            {/* Bullet Points (Section A) */}
            {mat.bulletPoints && (
              <div className="mb-8 grid sm:grid-cols-3 gap-3">
                {mat.bulletPoints.map((pt, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-slate-700">
                    <span className="font-bold text-amber-800 block mb-1">Poin {i + 1}</span>
                    {pt}
                  </div>
                ))}
              </div>
            )}

            {/* Thermometer Types (Section B) */}
            {mat.types && (
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {mat.types.map((type, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-electric uppercase mb-1">
                        Rentang: {type.range}
                      </div>
                      <h4 className="font-bold text-navy-950 text-base mb-2">
                        {type.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {type.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4 Scales Description (Section C) */}
            {mat.scales && (
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {mat.scales.map((sc, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-navy-950 text-base">{sc.name}</h4>
                      <span className="text-[11px] font-mono font-semibold text-slate-400">Penemu: {sc.creator}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">{sc.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Fixed Points Table (Section D) */}
            {mat.table && (
              <div className="overflow-x-auto mb-8 rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-navy-950 text-white uppercase text-[11px] tracking-wider font-bold">
                    <tr>
                      <th className="p-3.5">Skala Termometer</th>
                      <th className="p-3.5 text-center">Simbol</th>
                      <th className="p-3.5 text-center">Titik Tetap Bawah (Es Lebur)</th>
                      <th className="p-3.5 text-center">Titik Tetap Atas (Air Didih)</th>
                      <th className="p-3.5 text-center">Jumlah Skala</th>
                      <th className="p-3.5 text-center">Perbandingan (Rasio)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {mat.table.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="p-3.5 font-bold text-navy-950">{row.scale}</td>
                        <td className="p-3.5 text-center font-mono font-bold text-electric">{row.symbol}</td>
                        <td className="p-3.5 text-center font-mono font-bold text-blue-600">{row.lower}{row.symbol}</td>
                        <td className="p-3.5 text-center font-mono font-bold text-red-600">{row.upper}{row.symbol}</td>
                        <td className="p-3.5 text-center font-mono text-slate-600">{row.range} skala</td>
                        <td className="p-3.5 text-center font-mono font-bold text-thermoOrange">{row.ratio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Conversion Formulas & Sandbox (Section E) */}
            {mat.formulas && (
              <div className="space-y-6 mb-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  {mat.formulas.map((f, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                      <div className="text-xs font-bold text-deepblue uppercase mb-1">{f.target}</div>
                      <div className="text-sm sm:text-base font-black font-mono text-navy-950 bg-white px-3 py-2 rounded-xl border border-blue-200 mb-2">
                        {f.formula}
                      </div>
                      <div className="text-xs text-slate-600 font-mono">
                        <strong className="text-slate-800">Contoh: </strong> {f.example}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Sandbox Calculator */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-tr from-navy-950 to-deepblue text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-electric" />
                    <h4 className="text-base font-bold">Kalkulator Simulasi Rumus Konversi Cepat</h4>
                  </div>
                  <p className="text-xs text-slate-300 mb-4">
                    Masukkan nilai suhu apa saja untuk membuktikan kebenaran perhitungan rumus secara otomatis:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
                    <div className="w-full sm:w-1/2">
                      <label className="text-[11px] text-slate-300 font-bold uppercase block mb-1">
                        Nilai Suhu:
                      </label>
                      <input
                        type="number"
                        value={calcInput}
                        onChange={(e) => setCalcInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-electric"
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="text-[11px] text-slate-300 font-bold uppercase block mb-1">
                        Satuan Asal:
                      </label>
                      <select
                        value={calcUnit}
                        onChange={(e) => setCalcUnit(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/20 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-electric"
                      >
                        <option value="C">Celsius (°C)</option>
                        <option value="R">Reamur (°R)</option>
                        <option value="F">Fahrenheit (°F)</option>
                        <option value="K">Kelvin (K)</option>
                      </select>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Celsius</div>
                      <div className="text-xl font-mono font-black text-electric">{converted.C}°C</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Reamur</div>
                      <div className="text-xl font-mono font-black text-emerald-300">{converted.R}°R</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Fahrenheit</div>
                      <div className="text-xl font-mono font-black text-amber-300">{converted.F}°F</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Kelvin</div>
                      <div className="text-xl font-mono font-black text-purple-300">{converted.K} K</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        ))}
    </div>
  );
}
