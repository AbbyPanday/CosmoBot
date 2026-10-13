import React from 'react';
import { PhysicsParams } from './CosmoBot3D';
import { soundFX } from '../utils/audio';

interface OrbitalMechanicsLabProps {
  physics: PhysicsParams;
  setPhysics: React.Dispatch<React.SetStateAction<PhysicsParams>>;
  onExplainZeroG?: () => void;
}

export const OrbitalMechanicsLab: React.FC<OrbitalMechanicsLabProps> = ({
  physics,
  setPhysics,
  onExplainZeroG,
}) => {
  const toggleZeroG = () => {
    soundFX.playChirp();
    setPhysics((prev) => ({
      ...prev,
      zeroGActive: !prev.zeroGActive,
    }));
  };

  const updateParam = (key: keyof PhysicsParams, val: number) => {
    setPhysics((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Derived telemetry metrics for deep immersion
  const orbitalVelocity = (7.68 * physics.orbitSpeed).toFixed(2);
  const orbitalPeriod = (92.4 / Math.max(0.2, physics.orbitSpeed)).toFixed(1);
  const centripetalG = physics.zeroGActive ? (0.0).toFixed(2) : physics.gravityWell.toFixed(2);
  const orbitalAltitude = (408 + (1 - physics.gravityWell / 2) * 80).toFixed(0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Overview & Live Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Orbital Parameters Controls (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-2xl cosmo-glass flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">tune</span>
                  <h2 className="font-display font-bold text-lg text-white">Orbital Mechanics Controls</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust zero-G simulation physics directly affecting CosmoBot’s real-time 3D flight engine.
                </p>
              </div>

              {/* Zero-G Toggle Button */}
              <button
                type="button"
                onClick={toggleZeroG}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-medium text-xs transition-all shadow-lg active:scale-95 ${
                  physics.zeroGActive
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {physics.zeroGActive ? 'public_off' : 'public'}
                </span>
                <span>{physics.zeroGActive ? 'Zero-G: ACTIVE' : 'Artificial Gravity: 1.0G'}</span>
              </button>
            </div>

            {/* Slider 1: Orbit Speed */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-semibold text-cyan-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-cyan-400 text-base">speed</span>
                  Orbital Velocity Multiplier
                </span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  {physics.orbitSpeed.toFixed(1)}x ({physics.orbitSpeed > 1.8 ? 'Hyper Orbit' : physics.orbitSpeed < 0.6 ? 'Low Drag' : 'Optimal Cruise'})
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={physics.orbitSpeed}
                onChange={(e) => updateParam('orbitSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.2x Low Drag</span>
                <span>1.0x Earth LEO</span>
                <span>2.5x Hyper Impulse</span>
              </div>
            </div>

            {/* Slider 2: Asteroid Density */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-semibold text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">scatter_plot</span>
                  Asteroid Field Particle Density
                </span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  {physics.asteroidDensity} Particles
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={physics.asteroidDensity}
                onChange={(e) => updateParam('asteroidDensity', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 (Sparse Void)</span>
                <span>42 (Main Belt)</span>
                <span>120 (Dense Kuiper Cluster)</span>
              </div>
            </div>

            {/* Slider 3: Gravity Well Strength */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-semibold text-purple-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-purple-400 text-base">blur_circular</span>
                  Celestial Gravity Well ({physics.gravityWell < 0.2 ? 'Microgravity' : physics.gravityWell < 0.8 ? 'Mars / Moon' : 'Jupiter Jovian'})
                </span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  {physics.gravityWell.toFixed(2)} g
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={physics.gravityWell}
                onChange={(e) => updateParam('gravityWell', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.00g (Deep Space Free Fall)</span>
                <span>0.38g (Mars)</span>
                <span>1.0g (Earth)</span>
                <span>2.0g (Gas Giant)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs text-slate-400">
                Want CosmoBot to explain the mathematics?
              </span>
              <button
                type="button"
                onClick={onExplainZeroG}
                className="text-xs text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
              >
                <span>Explain Equivalence Principle</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Flight Telemetry & Bento Metrics (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl cosmo-glass flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">satellite_alt</span>
                <h3 className="font-display font-bold text-base text-white">Orbital Flight Telemetry</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                STABLE EQUILIBRIUM
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col">
                <span className="text-[11px] text-slate-400 font-sans">Linear Orbital Velocity</span>
                <span className="font-mono text-xl font-bold text-cyan-300 mt-1">
                  {orbitalVelocity} <span className="text-xs font-normal text-slate-400">km/s</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Vector: tangential</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col">
                <span className="text-[11px] text-slate-400 font-sans">Orbital Period (T)</span>
                <span className="font-mono text-xl font-bold text-amber-300 mt-1">
                  {orbitalPeriod} <span className="text-xs font-normal text-slate-400">min</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Keplerian 3rd Law</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col">
                <span className="text-[11px] text-slate-400 font-sans">Net Gravity Pull</span>
                <span className="font-mono text-xl font-bold text-purple-300 mt-1">
                  {centripetalG} <span className="text-xs font-normal text-slate-400">g</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Centrifugal offset</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col">
                <span className="text-[11px] text-slate-400 font-sans">Orbital Altitude</span>
                <span className="font-mono text-xl font-bold text-emerald-300 mt-1">
                  {orbitalAltitude} <span className="text-xs font-normal text-slate-400">km</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">LEO apogee</span>
              </div>
            </div>

            {/* Scientific Diagram Box */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-display font-semibold">
                <span className="material-symbols-outlined text-base">science</span>
                <span>Astrophysical Principle in Play:</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {physics.zeroGActive
                  ? "Newton's First Law & Einstein's Free-Fall: In orbit, CosmoBot is not free from gravity—gravity is bending the forward path into a continuous circle around Earth at 7.68 km/s!"
                  : "Simulated centripetal floor locked CosmoBot's tank treads. Centripetal acceleration equals (v² / r), giving artificial 1G downward normal force!"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
