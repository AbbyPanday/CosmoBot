import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CosmoBot3D, BotEmotion, PhysicsParams } from './components/CosmoBot3D';
import { Starfield } from './components/Starfield';
import { EmotesGallery } from './components/EmotesGallery';
import { OrbitalMechanicsLab } from './components/OrbitalMechanicsLab';
import { StarQuests } from './components/StarQuests';
import { ConstellationCodex } from './components/ConstellationCodex';
import { soundFX } from './utils/audio';
import { speechService } from './utils/speech';

export type TabKey =
  | 'play-zone'
  | 'orbital-lab'
  | 'emotes-gallery'
  | 'star-quests'
  | 'constellation-codex';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  emotion?: BotEmotion;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('play-zone');
  const [emotion, setEmotion] = useState<BotEmotion>('happy');
  const [moodLabel, setMoodLabel] = useState<string>('✨ Playful & Responsive');
  const [dialogueText, setDialogueText] = useState<string>(
    '“Hey explorer! Hover over me to high-five, toss a space toy, or tell me anything in the chatbar below!”'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [xp, setXp] = useState<number>(1450);

  // Orbital physics parameters for 3D simulation
  const [physics, setPhysics] = useState<PhysicsParams>({
    orbitSpeed: 1.0,
    asteroidDensity: 42,
    gravityWell: 0.38,
    zeroGActive: true,
  });

  // Haptic ripples on click
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleIdRef = useRef<number>(0);

  const emoteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync sound & voice service states
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setEnabled(next);
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    speechService.setEnabled(next);
    if (next) {
      speechService.speak('Voice synthesizer online!');
    }
  };

  // Helper to trigger temporary emote state and reset back to idle
  const triggerTemporaryEmote = useCallback(
    (
      emo: BotEmotion,
      label: string,
      dialogue: string,
      durationMs: number = 5500,
      soundToPlay?: () => void
    ) => {
      if (emoteTimeoutRef.current) {
        clearTimeout(emoteTimeoutRef.current);
      }

      setEmotion(emo);
      setMoodLabel(label);
      setDialogueText(dialogue);

      if (soundToPlay) {
        soundToPlay();
      }

      speechService.speak(dialogue);

      emoteTimeoutRef.current = setTimeout(() => {
        setEmotion('happy');
        setMoodLabel('✨ Playful & Responsive');
        setDialogueText('“I’m floating here in orbit! What should we explore together next?”');
      }, durationMs);
    },
    []
  );

  // Spawn visual click ripple
  const createRipple = (x: number, y: number) => {
    const id = ++rippleIdRef.current;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 650);
  };

  // Robot click / Poke interaction
  const handleRobotPoke = (e?: React.MouseEvent) => {
    if (e) {
      createRipple(e.clientX, e.clientY);
    } else {
      createRipple(window.innerWidth / 2, window.innerHeight * 0.42);
    }
    triggerTemporaryEmote(
      'heart',
      '❤️ Affectionate Touch',
      '“*Giggles* That tickles my visor glass! My capacitive sensor nodes feel your touch! (Affection +50 XP)”',
      5000,
      () => soundFX.playGiggle()
    );
    setXp((prev) => prev + 50);
  };

  // Toy tossing action triggers
  const handleTossToy = (toyType: 'star' | 'battery' | 'asteroid' | 'joke', e?: React.MouseEvent) => {
    if (e) {
      createRipple(e.clientX, e.clientY);
    }

    if (toyType === 'star') {
      triggerTemporaryEmote(
        'star',
        '⭐ Catching Gravity Star',
        '“Wheee! Nice throw! Caught the Gravity Star right in mid-orbit! Look at those zero-G parabolic curves!”',
        6000,
        () => soundFX.playStarChime()
      );
      setXp((prev) => prev + 30);
    } else if (toyType === 'battery') {
      triggerTemporaryEmote(
        'star',
        '⚡ Plasma Supercharged',
        '“YUM! Pure plasma energy absorbed! Thrusters at 100% capacity! Ready for hyperspace!”',
        6000,
        () => soundFX.playZap()
      );
      setXp((prev) => prev + 40);
    } else if (toyType === 'asteroid') {
      triggerTemporaryEmote(
        'think',
        '☄️ Analyzing Specimen',
        '“Examining micro-asteroid composition... Silicon-rich chondrite detected! Fascinating space geology!”',
        5500,
        () => soundFX.playThud()
      );
      setXp((prev) => prev + 25);
    } else if (toyType === 'joke') {
      triggerTemporaryEmote(
        'laugh',
        '😂 Sonic Giggles',
        '“HAHAHA! Why didn’t the astronaut stay at the hotel on the moon? Because it had no atmosphere! *giggles at 8Hz*”',
        6000,
        () => soundFX.playGiggle()
      );
      setXp((prev) => prev + 35);
    }
  };

  // Handle chat submission
  const processQuery = (rawQuery: string) => {
    const q = rawQuery.toLowerCase().trim();
    if (!q) return;

    soundFX.playChirp();
    // Show thinking emote first
    setEmotion('think');
    setMoodLabel('🧠 Processing Neural Telemetry');
    setDialogueText('“Hmm, scanning celestial archives and computing answer...”');

    setTimeout(() => {
      if (q.includes('joke') || q.includes('funny') || q.includes('laugh')) {
        triggerTemporaryEmote(
          'laugh',
          '😂 Sonic Giggles',
          '“LOL! How do space travelers drink tea in orbit? Out of flying saucers! *happy beep boop*”',
          6500,
          () => soundFX.playGiggle()
        );
      } else if (
        q.includes('celebrat') ||
        q.includes('win') ||
        q.includes('victory') ||
        q.includes('yay') ||
        q.includes('awesome')
      ) {
        triggerTemporaryEmote(
          'star',
          '🎆 Fireworks Celebration',
          '“MISSION SUCCESS! Both thrusters active, firing digital fireworks! You are completely stellar!”',
          6500,
          () => soundFX.playVictory()
        );
      } else if (
        q.includes('gravity') ||
        q.includes('fly') ||
        q.includes('orbit') ||
        q.includes('thruster') ||
        q.includes('zero') ||
        q.includes('zero-g')
      ) {
        triggerTemporaryEmote(
          'think',
          '🛰️ Orbital Physics Active',
          '“In zero gravity, my twin ion micro-thrusters emit gentle 240Hz pulses to counteract drift. Because there’s no air resistance, once I push forward, I float forever!”',
          7000,
          () => soundFX.playChirp()
        );
      } else if (
        q.includes('love') ||
        q.includes('cute') ||
        q.includes('hi') ||
        q.includes('hello') ||
        q.includes('hug') ||
        q.includes('tickle')
      ) {
        triggerTemporaryEmote(
          'heart',
          '❤️ Heart Synced',
          '“Awww! *visors flash heart-pixels* It’s wonderful having you aboard! My emotional neural network is at 99.8% happiness!”',
          6000,
          () => soundFX.playGiggle()
        );
      } else if (q.includes('black hole') || q.includes('singularity')) {
        triggerTemporaryEmote(
          'think',
          '🕳️ Black Hole Horizon',
          '“Black holes have an escape velocity faster than the speed of light! Not even my radio telemetry signals can escape past their event horizon!”',
          7000,
          () => soundFX.playThud()
        );
      } else if (q.includes('jupiter') || q.includes('big')) {
        triggerTemporaryEmote(
          'star',
          '🪐 Jovian Scale',
          '“Jupiter is so massive that more than 1,300 Earths could fit inside it! Its Great Red Spot storm is bigger than Earth itself!”',
          7000,
          () => soundFX.playChirp()
        );
      } else {
        triggerTemporaryEmote(
          'star',
          '✨ Understood!',
          `“Roger that! Transmitting calculations straight to your console! Toss me a star or ask me anything else about the cosmos!”`,
          6500,
          () => soundFX.playChirp()
        );
      }
      setXp((prev) => prev + 20);
    }, 600);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    processQuery(text);
  };

  // Voice listening simulation toggle
  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      soundFX.playChirp();
      setInputText('How do solar sails work in deep space?');
      setTimeout(() => {
        setIsListening(false);
        processQuery('How do solar sails work in deep space?');
        setInputText('');
      }, 1800);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between bg-slate-950 text-slate-100 select-none">
      
      {/* 1. Deep Space Twinkling Starfield Background */}
      <Starfield />

      {/* 2. Haptic Touch Ripple Rings */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="touch-ring"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '90px',
            height: '90px',
            transform: 'translate(-50%, -50%) scale(2.2)',
            opacity: 0,
          }}
        />
      ))}

      {/* 3. Top Command Navigation Bar */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 pt-4 pb-2 border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
        
        {/* Brand & Companion Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl cosmo-glass flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.35)]">
            <svg
              className="w-5 h-5 animate-spin"
              style={{ animationDuration: '12s' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base tracking-wide text-white">CosmoBot</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                ACTIVE 3D COMPANION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              Hover, poke, toss toys, or chat below
            </p>
          </div>
        </div>

        {/* Cosmo Academy Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('play-zone')}
            className={`px-3 py-1.5 rounded-lg font-display text-xs transition-all ${
              activeTab === 'play-zone'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Interactive Play Zone
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orbital-lab')}
            className={`px-3 py-1.5 rounded-lg font-display text-xs transition-all ${
              activeTab === 'orbital-lab'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Orbital Mechanics Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('star-quests')}
            className={`px-3 py-1.5 rounded-lg font-display text-xs transition-all ${
              activeTab === 'star-quests'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Star Quests & Experiments
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('emotes-gallery')}
            className={`px-3 py-1.5 rounded-lg font-display text-xs transition-all ${
              activeTab === 'emotes-gallery'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Robot Reactions & Emotes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('constellation-codex')}
            className={`px-3 py-1.5 rounded-lg font-display text-xs transition-all ${
              activeTab === 'constellation-codex'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Constellation Codex
          </button>
        </nav>

        {/* Right Status Capsule: Mood, Audio, Explorer XP */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Mood Indicator Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-slate-300 shadow-lg">
            <span className="text-slate-400 font-mono text-[10px]">MOOD:</span>
            <span className="text-cyan-300 font-display font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              {moodLabel}
            </span>
            <div className="h-3 w-[1px] bg-white/10 mx-0.5" />
            <button
              type="button"
              onClick={() => handleRobotPoke()}
              className="hover:text-cyan-300 transition-colors text-[11px] text-slate-300 font-medium"
            >
              👆 Poke Visor
            </button>
          </div>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Disable SFX' : 'Enable SFX'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              soundEnabled
                ? 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-slate-900/50 text-slate-500 border border-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Voice Synthesizer Toggle */}
          <button
            type="button"
            onClick={toggleVoice}
            title={voiceEnabled ? 'CosmoBot Voice ON' : 'CosmoBot Voice OFF'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              voiceEnabled
                ? 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-900/50 text-slate-500 border border-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {voiceEnabled ? 'record_voice_over' : 'voice_over_off'}
            </span>
          </button>

          {/* XP Progress pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs">
            <span className="material-symbols-outlined text-amber-400 text-[16px]">stars</span>
            <span className="font-mono text-cyan-300 font-semibold">{xp} XP</span>
          </div>

          {/* Mobile Tab Switcher Dropdown Trigger */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabKey)}
              aria-label="Cosmo Academy Screen Navigation"
              className="bg-slate-900 text-xs text-cyan-300 border border-white/20 rounded-lg px-2 py-1.5 focus:outline-none"
            >
              <option value="play-zone">🎮 Play Zone</option>
              <option value="orbital-lab">🛰️ Orbital Lab</option>
              <option value="star-quests">⭐ Star Quests</option>
              <option value="emotes-gallery">🎭 Emotes Gallery</option>
              <option value="constellation-codex">📖 Codex</option>
            </select>
          </div>

        </div>
      </header>

      {/* 4. Main Body: Switchable Tab Views */}
      {activeTab === 'play-zone' && (
        <main
          onClick={(e) => {
            // If click directly in background, trigger ripple
            if (e.target === e.currentTarget) {
              createRipple(e.clientX, e.clientY);
            }
          }}
          className="relative z-10 flex-1 flex items-center justify-center w-full max-h-[72vh] px-4 my-auto"
        >
          {/* Central 3D Robot Container with Overlay Controls */}
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            
            {/* Dynamic Ambient Backlight Aura */}
            <div
              className={`absolute w-[460px] h-[460px] rounded-full blur-[90px] pointer-events-none transition-all duration-700 ${
                emotion === 'heart'
                  ? 'bg-pink-500/25'
                  : emotion === 'star'
                  ? 'bg-amber-400/25'
                  : emotion === 'laugh'
                  ? 'bg-pink-400/25'
                  : emotion === 'think'
                  ? 'bg-purple-500/25'
                  : 'bg-cyan-500/20'
              }`}
            />

            {/* REAL-TIME 3D THREE.JS PROCEDURAL COSMOBOT */}
            <div className="absolute inset-0 w-full h-full z-10">
              <CosmoBot3D
                emotion={emotion}
                physics={physics}
                onRobotClick={() => handleRobotPoke()}
              />
            </div>

            {/* SPEECH BUBBLE DOCKED OVER ROBOT HEAD */}
            <div className="absolute -top-3 md:top-2 max-w-md cosmo-glass px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 opacity-100 z-20 pointer-events-none">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-sans font-medium text-slate-100 leading-relaxed">
                    {dialogueText}
                  </p>
                </div>
              </div>
              {/* Downward Speech Bubble Tail */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 cosmo-glass border-t-0 border-l-0 border-r border-b border-cyan-400/30" />
            </div>

            {/* FLOATING ACTION PILLS IN SPACE (Toss Star, Feed Cell, Asteroid, Tell Joke) */}
            <div className="absolute inset-0 pointer-events-none z-20">
              
              {/* Top-Left: Toss Star */}
              <button
                type="button"
                onClick={(e) => handleTossToy('star', e)}
                title="Click to toss Gravity Star at CosmoBot!"
                className="toy-item pointer-events-auto absolute top-10 left-3 md:left-14 p-3 rounded-2xl cosmo-glass hover:cosmo-glass-focus hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer group/toy"
              >
                <div className="text-2xl filter drop-shadow-[0_0_10px_#facc15] group-hover/toy:animate-bounce">
                  ⭐
                </div>
                <span className="block text-[10px] text-amber-300/90 font-mono text-center mt-1 font-semibold">
                  Toss Star
                </span>
              </button>

              {/* Bottom-Left: Feed Cell */}
              <button
                type="button"
                onClick={(e) => handleTossToy('battery', e)}
                title="Click to feed Ion Plasma Cell to CosmoBot!"
                className="toy-item pointer-events-auto absolute bottom-8 left-6 md:left-20 p-3 rounded-2xl cosmo-glass hover:cosmo-glass-focus hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer group/toy"
              >
                <div className="text-2xl filter drop-shadow-[0_0_10px_#00f0ff] group-hover/toy:rotate-12">
                  ⚡
                </div>
                <span className="block text-[10px] text-cyan-300/90 font-mono text-center mt-1 font-semibold">
                  Feed Cell
                </span>
              </button>

              {/* Top-Right: Asteroid */}
              <button
                type="button"
                onClick={(e) => handleTossToy('asteroid', e)}
                title="Click to toss Micro Asteroid for geological scan!"
                className="toy-item pointer-events-auto absolute top-16 right-3 md:right-14 p-3 rounded-2xl cosmo-glass hover:cosmo-glass-focus hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer group/toy"
              >
                <div className="text-2xl filter drop-shadow-[0_0_8px_#94a3b8] group-hover/toy:-rotate-12">
                  ☄️
                </div>
                <span className="block text-[10px] text-slate-300 font-mono text-center mt-1 font-semibold">
                  Asteroid
                </span>
              </button>

              {/* Bottom-Right: Tell Joke */}
              <button
                type="button"
                onClick={(e) => handleTossToy('joke', e)}
                title="Click to tell a Space Joke & make CosmoBot giggle!"
                className="toy-item pointer-events-auto absolute bottom-10 right-6 md:right-20 p-3 rounded-2xl cosmo-glass hover:cosmo-glass-focus hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer group/toy"
              >
                <div className="text-2xl filter drop-shadow-[0_0_10px_#f472b6] group-hover/toy:scale-125">
                  😂
                </div>
                <span className="block text-[10px] text-pink-300/90 font-mono text-center mt-1 font-semibold">
                  Tell Joke
                </span>
              </button>

            </div>

          </div>
        </main>
      )}

      {/* Tab: Orbital Mechanics Lab */}
      {activeTab === 'orbital-lab' && (
        <main className="relative z-20 flex-1 overflow-y-auto">
          <OrbitalMechanicsLab
            physics={physics}
            setPhysics={setPhysics}
            onExplainZeroG={() => {
              setActiveTab('play-zone');
              processQuery('Explain how zero-g flight and equivalence principle work in orbit');
            }}
          />
        </main>
      )}

      {/* Tab: Star Quests */}
      {activeTab === 'star-quests' && (
        <main className="relative z-20 flex-1 overflow-y-auto">
          <StarQuests
            onEquipToy={(toyId) => {
              if (toyId === 'star') handleTossToy('star');
              else if (toyId === 'battery') handleTossToy('battery');
              else if (toyId === 'asteroid') handleTossToy('asteroid');
              else if (toyId === 'hand') handleRobotPoke();
              else triggerTemporaryEmote('think', '🔬 Quantum Scan', '“Scanning localized quantum gravity anomalies!”', 5000, () => soundFX.playChirp());
            }}
            onSetEmote={(emo, lbl, dial) => triggerTemporaryEmote(emo, lbl, dial)}
            xp={xp}
            setXp={setXp}
          />
        </main>
      )}

      {/* Tab: Robot Reactions & Emotes Gallery */}
      {activeTab === 'emotes-gallery' && (
        <main className="relative z-20 flex-1 overflow-y-auto">
          <EmotesGallery
            currentEmotion={emotion}
            onSelectEmote={(emo, lbl, dial) => {
              triggerTemporaryEmote(emo, lbl, dial, 6500);
            }}
          />
        </main>
      )}

      {/* Tab: Constellation Codex */}
      {activeTab === 'constellation-codex' && (
        <main className="relative z-20 flex-1 overflow-y-auto">
          <ConstellationCodex
            onAskBot={(q) => {
              setActiveTab('play-zone');
              processQuery(q);
            }}
          />
        </main>
      )}

      {/* 5. Sleek Floating Bottom Glassmorphism Chat Dock */}
      <footer className="relative z-30 w-full px-4 pb-5 pt-2 flex flex-col items-center">
        
        {/* Quick Conversational Prompt Chips */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto max-w-2xl px-2 scrollbar-none">
          <button
            type="button"
            onClick={() => processQuery('Tell me a funny space joke!')}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 shadow-md"
          >
            🚀 "Tell me a space joke"
          </button>
          <button
            type="button"
            onClick={() => processQuery('Do a victory backflip celebration!')}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 shadow-md"
          >
            🎆 "Celebrate victory"
          </button>
          <button
            type="button"
            onClick={() => processQuery('How do your thrusters fly in zero gravity?')}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 shadow-md"
          >
            🪐 "Explain zero-g flight"
          </button>
          <button
            type="button"
            onClick={() => handleRobotPoke()}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-pink-400/50 text-pink-300/90 transition-all active:scale-95 shadow-md"
          >
            ❤️ "Tickle robot"
          </button>
        </div>

        {/* Main Glassmorphic Input Dock */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleChatSubmit} className="relative flex items-center">
            <div className="relative w-full rounded-2xl cosmo-glass transition-all duration-300 focus-within:cosmo-glass-focus flex items-center p-1.5 shadow-[0_15px_45px_rgba(0,0,0,0.8)]">
              
              {/* Mic Icon with Voice Input Simulation */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Listening...' : 'Voice Input Simulation'}
                className={`pl-3 pr-2 flex items-center justify-center transition-colors ${
                  isListening ? 'text-amber-400 animate-pulse' : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                <svg
                  className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>

              {/* Text Input Field */}
              <input
                type="text"
                autoComplete="off"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice input..."
                    : "Type anything to CosmoBot (e.g. 'tell a joke', 'high five', 'how big is Jupiter?')..."
                }
                className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-400/70 text-sm md:text-base focus:ring-0 focus:outline-none px-2 py-2 font-sans"
              />

              {/* Affection / Poke Quick Button */}
              <button
                type="button"
                onClick={() => handleRobotPoke()}
                title="Affection / Touch Visor"
                className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-xl hover:bg-white/5 mr-1"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </button>

              {/* Electric Cyan Send Button */}
              <button
                type="submit"
                aria-label="Send message to CosmoBot"
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-300 text-slate-950 font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] active:scale-95 transition-all flex-shrink-0"
              >
                <svg
                  className="w-5 h-5 transform translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>

            </div>
          </form>

          {/* Micro Footer Legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-3 mt-1.5 font-sans">
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">Enter</kbd> to chat
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
              CosmoBot v4.2 • Responsive Zero-G Physics • WebGL 3D
            </span>
          </div>
        </div>

      </footer>
    </div>
  );
}
