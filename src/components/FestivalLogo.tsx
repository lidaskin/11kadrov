import React from 'react';

interface FestivalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animate?: boolean;
}

export const FestivalLogo: React.FC<FestivalLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  animate = false,
}) => {
  const sizeMap = {
    sm: { icon: 36, textClass: 'text-lg font-black' },
    md: { icon: 48, textClass: 'text-2xl font-black' },
    lg: { icon: 72, textClass: 'text-3xl font-black' },
    xl: { icon: 120, textClass: 'text-5xl font-black' },
  };

  const currentSize = sizeMap[size];

  // 11 distinct petals with vibrant colors from the logo
  const petals = [
    { color: '#FF007A', angle: 0 },    // Hot Pink
    { color: '#FF8A00', angle: 32.7 }, // Orange
    { color: '#00F0FF', angle: 65.4 }, // Cyan
    { color: '#FF007A', angle: 98.1 }, // Hot Pink
    { color: '#FFEA00', angle: 130.8 },// Yellow
    { color: '#FFD600', angle: 163.5 },// Amber Yellow
    { color: '#0051FF', angle: 196.2 },// Royal Blue
    { color: '#FFEA00', angle: 228.9 },// Yellow
    { color: '#FF007A', angle: 261.6 },// Hot Pink
    { color: '#FFD600', angle: 294.3 },// Bright Yellow
    { color: '#FF007A', angle: 327 },  // Hot Pink
  ];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex-shrink-0" style={{ width: currentSize.icon, height: currentSize.icon }}>
        {/* Outer floating stars from logo */}
        <div className="absolute -top-1 -right-1 text-[#FF007A] text-xs pointer-events-none animate-pulse">★</div>
        <div className="absolute bottom-1 -right-2 text-[#FFD600] text-xs pointer-events-none">★</div>
        <div className="absolute -bottom-1 right-2 text-[#24284b] text-[10px] pointer-events-none">★</div>

        <svg
          viewBox="0 0 200 200"
          className={`w-full h-full drop-shadow-md ${animate ? 'hover:rotate-180 transition-transform duration-700' : ''}`}
        >
          {/* Outer dark ring */}
          <circle cx="100" cy="100" r="92" fill="#1C1F3B" stroke="#00F0FF" strokeWidth="6" />
          
          {/* Cyan left arc highlight */}
          <path
            d="M 100 8 A 92 92 0 0 0 100 192"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Golden inner bezel */}
          <circle cx="100" cy="100" r="76" fill="#1C1F3B" stroke="#B8A020" strokeWidth="4" />

          {/* 11 Petals aperture wheel */}
          <g transform="translate(100, 100)">
            {petals.map((petal, index) => (
              <g key={index} transform={`rotate(${petal.angle})`}>
                <path
                  d="M -13 -36 C -18 -56, 18 -56, 13 -36 C 9 -22, -9 -22, -13 -36 Z"
                  fill={petal.color}
                  stroke="#1C1F3B"
                  strokeWidth="2.5"
                />
                {/* Tiny center dot on petal */}
                <circle cx="0" cy="-42" r="3.5" fill="#B8A020" opacity="0.9" />
              </g>
            ))}

            {/* Inner golden camera lens rings */}
            <circle cx="0" cy="0" r="32" fill="#A89418" stroke="#1C1F3B" strokeWidth="4" />
            <circle cx="0" cy="0" r="22" fill="#887610" stroke="#1C1F3B" strokeWidth="3" />
            <circle cx="0" cy="0" r="12" fill="#1C1F3B" />
            <circle cx="0" cy="0" r="6" fill="#FFD600" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`tracking-tight leading-none text-white font-extrabold ${currentSize.textClass}`}>
            11<span className="text-[#00F0FF]">кадров</span>
          </span>
          <span className="text-[10px] tracking-widest text-[#FFD600] font-semibold uppercase">
            ШКИ • Забайкалье
          </span>
        </div>
      )}
    </div>
  );
};
