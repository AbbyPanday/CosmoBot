import React, { useMemo } from 'react';

export const Starfield: React.FC = () => {
  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 90; i++) {
      const size = Math.random() * 2.5 + 0.8;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = Math.random() * 0.7 + 0.3;
      const delay = Math.random() * 4;
      const duration = Math.random() * 3 + 2;
      list.push({ id: i, size, x, y, opacity, delay, duration });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star-twinkle"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2 + 2}px rgba(255, 255, 255, 0.85)`,
            animation: `pulseGlow ${s.duration}s ease-in-out infinite alternate ${s.delay}s`,
          }}
        />
      ))}
      {/* Ambient Cosmic Nebula Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[550px] h-64 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />
    </div>
  );
};
