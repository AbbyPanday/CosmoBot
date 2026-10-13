import React, { useState } from 'react';
import { soundFX } from '../utils/audio';

interface ConstellationCodexProps {
  onAskBot: (question: string) => void;
}

export const ConstellationCodex: React.FC<ConstellationCodexProps> = ({ onAskBot }) => {
  const [selectedFact, setSelectedFact] = useState<number>(0);
  const [quizState, setQuizState] = useState<{
    answered: boolean;
    selectedOption: number | null;
    isCorrect: boolean;
  }>({
    answered: false,
    selectedOption: null,
    isCorrect: false,
  });

  const facts = [
    {
      id: 0,
      code: 'ASTRO #402',
      title: 'Lagrange Points & Gravitational Wells',
      category: 'Orbital Mechanics',
      icon: 'flare',
      color: 'text-amber-400',
      summary: 'Special locations in space where the gravitational pulls of two large masses equal the centripetal force.',
      details:
        'Discovered by Joseph-Louis Lagrange in 1772. At Lagrange Point 2 (L2), where the James Webb Space Telescope resides, the gravitational pull of the Earth and the Sun combines to hold spacecraft in an orbit synchronized with Earth.',
      questionPrompt: 'Why does the James Webb Space Telescope orbit at Lagrange Point L2?',
    },
    {
      id: 1,
      code: 'ASTRO #403',
      title: 'Einstein’s Equivalence Principle & Zero-G',
      category: 'General Relativity',
      icon: 'public_off',
      color: 'text-cyan-400',
      summary: 'In an elevator in free-fall or in space orbit, observers cannot distinguish gravity from acceleration.',
      details:
        'When CosmoBot floats in deep space or orbit, gravity is still pulling at nearly 90% of Earth surface strength in low orbit (LEO). However, because CosmoBot and the spacecraft are both falling at the exact same rate toward Earth without hitting it, true weightlessness is felt!',
      questionPrompt: 'Explain how free fall creates the sensation of zero gravity.',
    },
    {
      id: 2,
      code: 'ASTRO #404',
      title: 'Solar Sails & Photon Radiation Pressure',
      category: 'Propulsion Science',
      icon: 'solar_power',
      color: 'text-emerald-400',
      summary: 'Photons have zero rest mass, yet carry kinetic momentum (p = E / c) that pushes spacecraft.',
      details:
        'When millions of photons reflect off ultra-reflective mirrors (like CosmoBot’s anti-gravity ring mirrors), their momentum reverses direction, delivering double momentum transfer to accelerate the ship forever without burning heavy chemical fuels.',
      questionPrompt: 'How can light with no mass push a heavy spacecraft through vacuum?',
    },
    {
      id: 3,
      code: 'ASTRO #405',
      title: 'Atmospheric Refraction & Star Twinkling',
      category: 'Optics & Vacuum',
      icon: 'auto_awesome',
      color: 'text-purple-400',
      summary: 'Stars only twinkle when viewed through a turbulent atmosphere—in space, their light is rock-solid.',
      details:
        'Earth’s shifting warm and cold air pockets act as thousands of tiny shifting lenses, bending incoming photon rays. Outside the atmosphere where CosmoBot floats, stars shine steadily with brilliant unwavering intensity.',
      questionPrompt: 'Why do stars stop twinkling when viewed from outside the atmosphere?',
    },
  ];

  const quiz = {
    question: 'Why doesn’t the Moon crash into Earth even though gravity constantly pulls on it?',
    options: [
      { text: 'Earth’s gravity is too weak at lunar distance.', correct: false },
      { text: 'The Moon has high sideways tangential velocity, so it continually falls around Earth.', correct: true },
      { text: 'Cosmic rays push the Moon outward with equal force.', correct: false },
      { text: 'Dark energy repels the Moon at close planetary proximity.', correct: false },
    ],
    explanation:
      'Correct! Sir Isaac Newton’s cannonball thought experiment explains this: if an object travels sideways fast enough (~1.02 km/s for the Moon), the curve of its fall matches the curvature of Earth, keeping it in stable perpetual orbit!',
  };

  const handleAnswerQuiz = (index: number, isCorrect: boolean) => {
    if (quizState.answered) return;
    if (isCorrect) {
      soundFX.playStarChime();
    } else {
      soundFX.playThud();
    }
    setQuizState({
      answered: true,
      selectedOption: index,
      isCorrect,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl cosmo-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-2xl">menu_book</span>
            <h2 className="font-display font-bold text-xl text-white">Constellation Codex & Orbital Physics</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Fundamental astrophysics and celestial mechanics curated by CosmoBot’s neural library.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            4 ARCHIVAL CODEX MODULES
          </span>
        </div>
      </div>

      {/* Main Grid: Facts on Left (7 cols), Interactive Quiz on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Codex Facts (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facts.map((fact) => {
              const isSelected = selectedFact === fact.id;
              return (
                <div
                  key={fact.id}
                  onClick={() => setSelectedFact(fact.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'cosmo-glass-focus bg-slate-900/90 shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                      : 'cosmo-glass hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      {fact.code}
                    </span>
                    <span className={`material-symbols-outlined text-xl ${fact.color}`}>
                      {fact.icon}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm text-white">{fact.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{fact.summary}</p>
                  </div>

                  <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                    <span>Read Deep Dive</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Deep Dive Reader */}
          <div className="p-6 rounded-2xl cosmo-glass flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-2xl ${facts[selectedFact].color}`}>
                  {facts[selectedFact].icon}
                </span>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    {facts[selectedFact].category}
                  </span>
                  <h3 className="font-display font-bold text-base text-white">
                    {facts[selectedFact].title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onAskBot(facts[selectedFact].questionPrompt)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 font-display text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">chat</span>
                Ask CosmoBot
              </button>
            </div>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {facts[selectedFact].details}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Quiz Challenge (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl cosmo-glass flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">psychology</span>
                <h3 className="font-display font-bold text-base text-white">Cadet Knowledge Check</h3>
              </div>
              <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                +100 XP
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-display font-semibold text-sm text-slate-100 leading-snug">
                {quiz.question}
              </h4>

              <div className="flex flex-col gap-2.5 mt-2">
                {quiz.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-900/70 border-white/10 hover:border-cyan-500/50 text-slate-300';
                  if (quizState.answered) {
                    if (opt.correct) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                    } else if (quizState.selectedOption === idx) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={quizState.answered}
                      onClick={() => handleAnswerQuiz(idx, opt.correct)}
                      className={`w-full p-3.5 rounded-xl border text-xs text-left font-sans transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                    >
                      <span>{opt.text}</span>
                      {quizState.answered && opt.correct && (
                        <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                      )}
                      {quizState.answered && !opt.correct && quizState.selectedOption === idx && (
                        <span className="material-symbols-outlined text-rose-400 text-base">cancel</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizState.answered && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                <span className="font-display font-semibold text-cyan-300 block">
                  {quizState.isCorrect ? '✨ Stellar Discovery!' : '💡 Telemetry Correction:'}
                </span>
                <p className="leading-relaxed">{quiz.explanation}</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
