import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import { speechService } from '../utils/speech';
import { BotEmotion } from './CosmoBot3D';

interface StarQuestsProps {
  onEquipToy: (toyId: string) => void;
  onSetEmote: (emotion: BotEmotion, label: string, dialogue: string) => void;
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
}

export const StarQuests: React.FC<StarQuestsProps> = ({
  onEquipToy,
  onSetEmote,
  xp,
  setXp,
}) => {
  const [selectedToy, setSelectedToy] = useState<string>('star');
  const [questsCompleted, setQuestsCompleted] = useState<Record<string, boolean>>({
    quest1: true,
    quest2: true,
    quest3: false,
  });

  const toys = [
    {
      id: 'star',
      name: 'Gravity Star',
      icon: '⭐',
      desc: 'Infused with concentrated stellar mass. Curves local space-time curvature.',
      actionName: 'Toss Star',
      sound: () => soundFX.playStarChime(),
      emotion: 'star' as BotEmotion,
      dialogue: '“Catching the Gravity Star! Wow, Newton’s Universal Gravitation says mass attracts mass directly proportional to their masses!”',
    },
    {
      id: 'battery',
      name: 'Plasma Battery',
      icon: '🔋',
      desc: 'High-density ionized hydrogen plasma cell. Boosts ion thruster impulse.',
      actionName: 'Feed Cell',
      sound: () => soundFX.playZap(),
      emotion: 'star' as BotEmotion,
      dialogue: '“YUM! Pure plasma energy absorbed! Thrusters at 100% capacity! Ready for hyperspace!”',
    },
    {
      id: 'asteroid',
      name: 'Micro Asteroid',
      icon: '☄️',
      desc: 'Silicon-rich chondrite space rock harvested from the asteroid belt.',
      actionName: 'Analyze Asteroid',
      sound: () => soundFX.playThud(),
      emotion: 'think' as BotEmotion,
      dialogue: '“Examining micro-asteroid composition... Silicon-rich chondrite detected! Fascinating space geology!”',
    },
    {
      id: 'scanner',
      name: 'Quantum Scanner',
      icon: '🔬',
      desc: 'Emits subatomic lidar beams to scan celestial bodies and gravitational waves.',
      actionName: 'Scan Field',
      sound: () => soundFX.playChirp(),
      emotion: 'think' as BotEmotion,
      dialogue: '“Quantum LiDAR active! Detecting micro-gravitational ripples from distant binary pulsars!”',
    },
    {
      id: 'hand',
      name: 'Tickle Hand',
      icon: '🖐️',
      desc: 'Holographic tactile glove for gentle visor capacitive sensor feedback.',
      actionName: 'Tickle Visor',
      sound: () => soundFX.playGiggle(),
      emotion: 'heart' as BotEmotion,
      dialogue: '“*Giggles* That tickles my visor glass! My capacitive sensor nodes feel your touch! (Affection +50 XP)”',
    },
  ];

  const handleUseToy = (toy: typeof toys[0]) => {
    setSelectedToy(toy.id);
    toy.sound();
    onEquipToy(toy.id);
    onSetEmote(toy.emotion, toy.name, toy.dialogue);
    speechService.speak(toy.dialogue);

    // If quest 3 wasn't completed, mark it complete!
    if (!questsCompleted.quest3) {
      setQuestsCompleted((prev) => ({ ...prev, quest3: true }));
      setXp((prev) => prev + 150);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ffd700', '#ff007f'],
      });
      soundFX.playVictory();
    } else {
      setXp((prev) => prev + 25);
    }
  };

  const completedCount = Object.values(questsCompleted).filter(Boolean).length;
  const questProgressPct = Math.round((completedCount / 3) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      
      {/* Top Banner: Cadet Level & Active Quest Meter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Cadet Profile Status Card (5 Cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl cosmo-glass flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <span className="material-symbols-outlined text-2xl">military_tech</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Cadet Rank
                </span>
                <h3 className="font-display font-bold text-lg text-white">Level 4 Explorer</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-cyan-300 font-bold text-base">{xp}</span>
              <span className="text-[11px] text-slate-400 block font-mono">/ 2,000 XP</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Next Rank: Senior Astrophysicist</span>
              <span className="font-mono text-cyan-400">{Math.round((xp / 2000) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.6)] transition-all duration-500"
                style={{ width: `${Math.min(100, (xp / 2000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Star Quest Badge Card (7 Cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl cosmo-glass flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              ⭐ Active Star Quest
            </span>
            <span className="text-xs font-mono text-cyan-300 font-bold">+150 StarDust XP</span>
          </div>

          <div className="flex items-center gap-5">
            {/* SVG Radial Meter */}
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-cyan-400 transition-all duration-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${questProgressPct}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-display font-bold text-xs text-white">
                {completedCount}/3
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="font-display font-bold text-base text-white">Kepler's Laws Orbit Badge</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Toss 3 celestial items into equilibrium orbit to stabilize CosmoBot's gravitational resonance.
                {completedCount === 3
                  ? ' 🎉 Quest Complete! You unlocked the Kepler Mastery Achievement!'
                  : ' Equip and toss a toy below to complete the final challenge!'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-white/5 text-[11px] text-cyan-300">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
              <span>1. Zero-G Drift</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-white/5 text-[11px] text-cyan-300">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
              <span>2. Angular Drift</span>
            </div>
            <div
              className={`flex items-center gap-1.5 p-2 rounded-lg border text-[11px] transition-all ${
                questsCompleted.quest3
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/80 border-amber-500/30 text-amber-300'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {questsCompleted.quest3 ? 'check_circle' : 'pending'}
              </span>
              <span>3. Equilibrium Orbit</span>
            </div>
          </div>
        </div>

      </div>

      {/* Toy Equip Tray & Interactive Drop Zone */}
      <div className="p-6 rounded-2xl cosmo-glass flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-2xl">backpack</span>
            <h3 className="font-display font-bold text-lg text-white">Cosmic Toy & Experiment Equip Tray</h3>
          </div>
          <span className="text-xs text-slate-400">
            Click or drop any toy to launch it into CosmoBot’s 3D orbit!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {toys.map((toy) => {
            const isEquipped = selectedToy === toy.id;
            return (
              <div
                key={toy.id}
                className={`p-4 rounded-xl transition-all duration-300 flex flex-col justify-between gap-3 ${
                  isEquipped
                    ? 'cosmo-glass-focus bg-slate-900/90 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    : 'bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {toy.icon}
                  </div>
                  {isEquipped && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-slate-950">
                      EQUIPPED
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-white">{toy.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">{toy.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleUseToy(toy)}
                  className={`w-full py-2 px-3 rounded-lg font-display text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isEquipped
                      ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  {toy.actionName}
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Drop-Zone Banner */}
        <div
          onClick={() => handleUseToy(toys[0])}
          className="p-5 rounded-xl border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40 transition-colors flex items-center justify-center gap-3 cursor-pointer group"
        >
          <span className="material-symbols-outlined text-cyan-400 text-2xl group-hover:scale-125 transition-transform animate-bounce">
            file_download
          </span>
          <div className="text-center sm:text-left">
            <span className="font-display font-semibold text-sm text-cyan-300 block">
              Cosmic Orbital Docking Receptacle
            </span>
            <span className="text-xs text-slate-400">
              Click here to test instant toy gravity injection directly into CosmoBot’s hands! (+25 XP)
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
