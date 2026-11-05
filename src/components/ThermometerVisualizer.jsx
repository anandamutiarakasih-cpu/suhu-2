import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function ThermometerVisualizer() {
  const [celsius, setCelsius] = useState(37); // Default to human body temp

  const reamur = Math.round((celsius * 4 / 5) * 10) / 10;
  const fahrenheit = Math.round(((celsius * 9 / 5) + 32) * 10) / 10;
  const kelvin = Math.round((celsius + 273.15) * 10) / 10;

  // Percentage height for liquid column: 0°C -> 15%, 100°C -> 85%
  const clampedC = Math.max(-10, Math.min(110, celsius));
  const heightPercent = Math.max(10, Math.min(90, 15 + (clampedC / 100) * 70));

  const presets = [
    { label: 'Es Melebur', temp: 0, desc: 'Titik Tetap Bawah C & R' },
    { label: 'Suhu Kamar', temp: 25, desc: 'Kondisi Nyaman (298 K)' },
    { label: 'Suhu Tubuh', temp: 37, desc: 'Suhu Normal Manusia (98,6°F)' },
    { label: 'Air Hangat', temp: 60, desc: '48°R | 140°F' },
    { label: 'Air Mendidih', temp: 100, desc: 'Titik Tetap Atas C (212°F)' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card-elevated border border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 text-deepblue text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-electric animate-ping"></span>
            Simulasi Interaktif
          </div>
          <h3 className="text-xl font-bold text-navy-950">Visualisasi Komparasi 4 Skala Suhu</h3>
          <p className="text-sm text-slate-500">
            Geser slider atau pilih preset untuk melihat kesetaraan tinggi kolom suhu secara bersamaan.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                sound.click();
                setCelsius(p.temp);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                celsius === p.temp
                  ? 'bg-deepblue text-white shadow-sm ring-2 ring-electric'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label} ({p.temp}°C)
            </button>
          ))}
        </div>
      </div>

      {/* Main slider */}
      <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="temp-slider" className="text-sm font-bold text-slate-700">
            Atur Suhu Acuan (°C):
          </label>
          <span className="text-2xl font-black font-mono text-thermoOrange">
            {celsius}°C
          </span>
        </div>
        <input
          id="temp-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value={celsius}
          onChange={(e) => {
            setCelsius(Number(e.target.value));
          }}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-thermoOrange focus:outline-none"
        />
        <div className="flex justify-between text-xs text-slate-400 font-mono mt-1">
          <span>0°C (Titik Beku)</span>
          <span>50°C</span>
          <span>100°C (Titik Didih)</span>
        </div>
      </div>

      {/* 4 Parallel Thermometer Tubes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Celsius */}
        <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-100 flex flex-col items-center">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">Celsius</span>
          <div className="text-2xl font-black font-mono text-sky-700 mb-3">{celsius}°C</div>
          
          {/* Thermometer Tube Graphic */}
          <div className="relative w-12 h-48 bg-white rounded-full border-2 border-sky-300 p-1 flex flex-col justify-end items-center overflow-hidden shadow-inner">
            {/* Tick marks */}
            <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-4 text-[9px] font-mono text-slate-400 select-none">
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            {/* Liquid column */}
            <div
              className="w-4 bg-gradient-to-t from-sky-600 to-sky-400 rounded-full transition-all duration-200 ease-out"
              style={{ height: `${heightPercent}%` }}
            ></div>
            {/* Bulb */}
            <div className="absolute -bottom-2 w-8 h-8 rounded-full bg-sky-600 border-2 border-sky-300"></div>
          </div>
          
          <div className="mt-4 text-center text-xs space-y-0.5 text-slate-600">
            <div>Atas: <strong className="text-slate-800">100°C</strong></div>
            <div>Bawah: <strong className="text-slate-800">0°C</strong></div>
            <div className="text-[11px] text-sky-600 font-bold">Rasio: 5</div>
          </div>
        </div>

        {/* Reamur */}
        <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 flex flex-col items-center">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Reamur</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mb-3">{reamur}°R</div>

          <div className="relative w-12 h-48 bg-white rounded-full border-2 border-emerald-300 p-1 flex flex-col justify-end items-center overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-4 text-[9px] font-mono text-slate-400 select-none">
              <span>80</span>
              <span>40</span>
              <span>0</span>
            </div>
            <div
              className="w-4 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full transition-all duration-200 ease-out"
              style={{ height: `${heightPercent}%` }}
            ></div>
            <div className="absolute -bottom-2 w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-300"></div>
          </div>

          <div className="mt-4 text-center text-xs space-y-0.5 text-slate-600">
            <div>Atas: <strong className="text-slate-800">80°R</strong></div>
            <div>Bawah: <strong className="text-slate-800">0°R</strong></div>
            <div className="text-[11px] text-emerald-600 font-bold">Rasio: 4</div>
          </div>
        </div>

        {/* Fahrenheit */}
        <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-100 flex flex-col items-center">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Fahrenheit</span>
          <div className="text-2xl font-black font-mono text-amber-700 mb-3">{fahrenheit}°F</div>

          <div className="relative w-12 h-48 bg-white rounded-full border-2 border-amber-300 p-1 flex flex-col justify-end items-center overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-4 text-[9px] font-mono text-slate-400 select-none">
              <span>212</span>
              <span>122</span>
              <span>32</span>
            </div>
            <div
              className="w-4 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full transition-all duration-200 ease-out"
              style={{ height: `${heightPercent}%` }}
            ></div>
            <div className="absolute -bottom-2 w-8 h-8 rounded-full bg-amber-600 border-2 border-amber-300"></div>
          </div>

          <div className="mt-4 text-center text-xs space-y-0.5 text-slate-600">
            <div>Atas: <strong className="text-slate-800">212°F</strong></div>
            <div>Bawah: <strong className="text-slate-800">32°F</strong></div>
            <div className="text-[11px] text-amber-600 font-bold">Rasio: 9</div>
          </div>
        </div>

        {/* Kelvin */}
        <div className="bg-purple-50/60 rounded-xl p-4 border border-purple-100 flex flex-col items-center">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">Kelvin (SI)</span>
          <div className="text-2xl font-black font-mono text-purple-700 mb-3">{kelvin} K</div>

          <div className="relative w-12 h-48 bg-white rounded-full border-2 border-purple-300 p-1 flex flex-col justify-end items-center overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-4 text-[9px] font-mono text-slate-400 select-none">
              <span>373</span>
              <span>323</span>
              <span>273</span>
            </div>
            <div
              className="w-4 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full transition-all duration-200 ease-out"
              style={{ height: `${heightPercent}%` }}
            ></div>
            <div className="absolute -bottom-2 w-8 h-8 rounded-full bg-purple-600 border-2 border-purple-300"></div>
          </div>

          <div className="mt-4 text-center text-xs space-y-0.5 text-slate-600">
            <div>Atas: <strong className="text-slate-800">373 K</strong></div>
            <div>Bawah: <strong className="text-slate-800">273 K</strong></div>
            <div className="text-[11px] text-purple-600 font-bold">Rasio: 5</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-50/50 rounded-xl border border-blue-200/50 text-xs text-navy-900 text-center font-medium">
        Perbandingan Skala Sederhana: <span className="font-mono font-bold text-deepblue">C : R : (F - 32) : (K - 273) = 5 : 4 : 9 : 5</span>
      </div>
    </div>
  );
}
