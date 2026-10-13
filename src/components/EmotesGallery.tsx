import React from 'react';
import { BotEmotion } from './CosmoBot3D';
import { soundFX } from '../utils/audio';
import { speechService } from '../utils/speech';

interface EmotesGalleryProps {
  onSelectEmote: (emotion: BotEmotion, moodLabel: string, dialogue: string) => void;
  currentEmotion: BotEmotion;
}

export const EmotesGallery: React.FC<EmotesGalleryProps> = ({ onSelectEmote, currentEmotion }) => {
  const emotes = [
    {
      id: 'happy' as BotEmotion,
      name: 'Playful Wave & Idle',
      tag: 'DEFAULT MODE',
      tagColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmJ_UuMO85Vyg090tYoYXeA22dlrHJm_Q0LjPFC7nXY2LBGUu-w3AB2I2khgDvlerwWD2jKysJupjnbYYuuYKzt3KMw8M53pKKnCkWvjIpaDLYqX2RkRaUscnyHvQ7gBYeiRMd7IdjPvg7bo2bkJrxljolzfsip3RBH9W1ZD-YPA-juidGZfE-izcOP82Pl7vIrrry258aIJU39LuD1Oc_Iba1rDy_BqrevBFsBDne1o_CCZfJXiudshnoFoGnSTc-_Us',
      visor: 'Arched Cyan Pixel Eyes + Pink Pixel Blush',
      behavior: 'Right hand friendly procedural wave, floating zero-G bob, natural blinking cadence.',
      dialogue: '“Hey explorer! I’m floating here in orbit! What should we explore together next?”',
      sound: () => soundFX.playChirp(),
    },
    {
      id: 'heart' as BotEmotion,
      name: 'Heart Eyes & Affection',
      tag: 'TACTILE REACTION',
      tagColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1XuLCpsH3HYbDgvgOMxVt_jvWYdoGikhgHrpDl1ENbrBmSdN6iJE635r9fXwYcVuZT25QypJYAKwYxeaxpxQQli7z0EmvUY8SxeDT4a7nwxu-0Fe6IjjTmQFpm3AzUJHadBsLmj4EatCeR6jdrvalCPLv2CFIpCu_SRnV1Iux2T0NhSuWJDUfG0hQoKXwlhh6mEPS2rn7Srbov7sIPUFMmDNua1juKdJ-8sVKMWPlbEHXWJI2jpJ9BdC40',
      visor: 'Glowing Cyan Hearts (<3 <3) + Deep Crimson Blush',
      behavior: 'Springy tactile recoil wobble upon visor poke, high-frequency haptic ring pulse.',
      dialogue: '“*Giggles* That tickles my visor glass! My capacitive sensor nodes feel your touch! (Affection +50 XP)”',
      sound: () => soundFX.playGiggle(),
    },
    {
      id: 'laugh' as BotEmotion,
      name: 'Sonic Giggles & Joke',
      tag: 'HUMOR NODE',
      tagColor: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1UcsZZSVXbfPwuOkwYuv0LXPh7REMq1e6MAhgrbyv0LX3pXRCU7RYF2GiJ4d96yuMz0vh9pLEEk5x_LDd1wLfB6QEhJs6RDLt6VW1EMaiKJiPW39D8XMCzqwKzvpXNfNAPJVtJEtTaxMQQvf7-qnoTo94UD_Ap8G-uDzdoTDIom4EecsHdW--e2fagZvD62MlBzR0Sh8AKOsJiGBDwOP4ntxVhmdN7XP6xiRml_vXbQamsaEXNZel2NBAmM',
      visor: 'Squint Laughing Arches + Open Pixel Smile + Audio Waves',
      behavior: 'Torso oscillates rapidly at 8Hz, speaker diaphragms emit harmonic chuckles.',
      dialogue: '“HAHAHA! Why didn’t the astronaut stay at the hotel on the moon? Because it had no atmosphere! *beep boop*”',
      sound: () => soundFX.playGiggle(),
    },
    {
      id: 'think' as BotEmotion,
      name: 'Deep Analysis & Ponder',
      tag: 'ASTROPHYSICS SCAN',
      tagColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1Vzt3A0lDJBb6iV6zfVAZvaGYEZoCH0GCn7mzYjJWF1PhBqlnH1OOCSa6EVJ1mSFPeRgksIf-iBw2yv5XmhCv0XlfpMYynKyCuER0p2byPuG_1KiWwe8mBEh8wTy0XZm8u8hXK0bMfxDqTI2oO_fEYEwsszqq2_ROGdj9IkMU0CMinngV1wmVRAI90J53YVWVSR-vThNgmzLtprrFr-YyK-qS8FaoTQkyPmPvfoK9iB0ecQhUmc9o91Ap-c',
      visor: 'Rotating HUD Radar Target + Quantum Question Node',
      behavior: 'Head tilts thoughtfully, quantum neural core processes orbital trajectory vectors.',
      dialogue: '“Examining celestial coordinates... Calculating orbital velocity and Keplerian eccentricity matrices!”',
      sound: () => soundFX.playThud(),
    },
    {
      id: 'star' as BotEmotion,
      name: 'Victory Celebration & Fireworks',
      tag: 'MISSION TRIUMPH',
      tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1V0htQfKqdOGCDePjg4IbDIFS9XJ-7PxFW5S2vFlJyk1PBjXdg2Irt7Cpk1jtatZAouUEnog5-ZKDWknBG_5NgjVrSl_F8_LHFLlhXcIQHo7v5kF3ujfgG0ZakVTrjDLlgO1ub__rJrHGE6MaejU5ASmXm9hiiT8uJR-iBmcbrqouh9YhqIjx-sTv3KI1V-1ytkcTe2mINz33jTriFKNfR2P_akuhS3iyPAVGnNyxC4Fe5Mrhzd0P7WCEQ',
      visor: 'Glowing Golden 5-Point Stars + Triumphant Beaming Smile',
      behavior: 'Twin ion micro-thrusters ignite plumes, arms thrown in victory peace signs, fireworks bloom.',
      dialogue: '“MISSION SUCCESS! Both thrusters active, firing digital fireworks! You are completely stellar!”',
      sound: () => soundFX.playVictory(),
    },
    {
      id: 'star' as BotEmotion,
      name: 'Catching Star & Toy Juggling',
      tag: 'KINETIC ORBIT',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1VvTtPljZ3Qz8gCf1a_ih4b1AiWB7Iv2Z0qCe-V0AbaVYlZakAM0O2Prey4leaHGTYLBJ76jSBYARw_9krnkFAQ8XnTbmip4XxUMYQ-aEB6a5PYJ8x1r0yzxqJqoZLPtvfUivMNRZOJMUlJq-0plI-oglkC4vfZ_ubIwz1ar5kI2-8jfVYocEWR1i5qrxXwHaOWO99WeuMG4SqlG8kuralwQrtfma7LxsZMNxI4aAm8QVl07CtAa2AGI_kC',
      visor: 'Cheery Arched Eyes + Harmonic Smile',
      behavior: 'Interstellar juggling of Gravity Star and Ion Plasma cells in microgravity equilibrium.',
      dialogue: '“Wheee! Caught the Gravity Star right in mid-orbit! Look at those zero-G parabolic curves!”',
      sound: () => soundFX.playStarChime(),
    },
  ];

  const handleTestEmote = (emote: typeof emotes[0]) => {
    emote.sound();
    onSelectEmote(emote.id, emote.name, emote.dialogue);
    speechService.speak(emote.dialogue);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl cosmo-glass">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-2xl">theater_comedy</span>
            <h2 className="font-display font-bold text-xl text-white">Robot Reactions & Emotes Gallery</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Explore all 6 Pixar/Octane render expressions designed for CosmoBot’s curved OLED visor and zero-G physics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          ACTIVE EMOTE: <span className="font-bold text-white uppercase">{currentEmotion}</span>
        </div>
      </div>

      {/* Grid of Emotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emotes.map((e, index) => {
          const isActive = currentEmotion === e.id;
          return (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                isActive
                  ? 'cosmo-glass-focus bg-slate-900/80 shadow-[0_0_30px_rgba(0,240,255,0.25)]'
                  : 'cosmo-glass hover:border-cyan-500/40 hover:bg-slate-900/60'
              }`}
            >
              {/* Concept Image Preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950/80 border-b border-white/10">
                <img
                  src={e.image}
                  alt={e.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${e.tagColor}`}>
                    {e.tag}
                  </span>
                </div>
                {isActive && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold shadow-lg">
                    <span className="material-symbols-outlined text-[14px]">play_circle</span>
                    LIVE IN 3D
                  </div>
                )}
              </div>

              {/* Details & Specs */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-semibold text-base text-white group-hover:text-cyan-300 transition-colors">
                    {e.name}
                  </h3>
                  
                  <div className="text-xs text-slate-300 space-y-1.5 font-sans">
                    <div className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-mono text-[11px] flex-shrink-0">VISOR:</span>
                      <span className="text-slate-300 text-[12px]">{e.visor}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-mono text-[11px] flex-shrink-0">PHYSICS:</span>
                      <span className="text-slate-400 text-[12px]">{e.behavior}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-xs text-slate-300 italic font-sans leading-relaxed">
                    {e.dialogue}
                  </div>
                </div>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => handleTestEmote(e)}
                  className="w-full py-2.5 px-4 rounded-xl font-display font-medium text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500 hover:to-teal-400 text-cyan-200 hover:text-slate-950 border border-cyan-500/40 hover:border-transparent transition-all shadow-md active:scale-98"
                >
                  <span className="material-symbols-outlined text-[16px]">touch_app</span>
                  Trigger This State in 3D
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
