import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Star, Award, Zap, X, ChevronRight } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';

interface MilashAnimashProps {
  variant?: 'hero' | 'floating' | 'helper' | 'card' | 'avatar';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  speechText?: string;
  customImage?: string;
  className?: string;
  onActionClick?: (action: string) => void;
}

export const MilashAnimash: React.FC<MilashAnimashProps> = ({
  variant = 'hero',
  size = 'lg',
  showSpeech = true,
  speechText,
  customImage,
  className = '',
  onActionClick,
}) => {
  const { animashSettings } = useFestival();
  const [isHappy, setIsHappy] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showHeartEffect, setShowHeartEffect] = useState<boolean>(false);

  const tips = (animashSettings?.tips && animashSettings.tips.length > 0)
    ? animashSettings.tips
    : [
      'Привет! Я Милаш-Анимаш — официальный маскот фестиваля «11 кадров»! 🎬',
      'Лайфхак: 11 кадров — это классическая минимальная секунда для ультрадинамичной анимации!',
      'Подай работу до 5 октября — участие бесплатное для всех возрастов!',
      'Главный приз: Грант на продюсирование твоего мультфильма и планшет Wacom!',
      'Опробуй нашу 11-кадровую онлайн-студию ниже — нарисуй свой первый шот!',
      'Жюри из Союзмультфильма и ВГИКа отсмотрит каждую заявку!',
    ];

  // Resolve image based on current variant and settings
  const mascotSrc = customImage || (
    variant === 'hero' ? animashSettings?.images?.hero :
    variant === 'floating' ? animashSettings?.images?.floating :
    variant === 'card' ? animashSettings?.images?.card :
    variant === 'helper' ? animashSettings?.images?.helper :
    animashSettings?.images?.default
  ) || animashSettings?.images?.default || '/milash.png';

  const mascotName = animashSettings?.name || 'Милаш-Анимаш';

  // Cycle tips automatically if in hero or floating mode
  useEffect(() => {
    if (speechText) return;
    const tipInterval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, 6000);

    return () => clearInterval(tipInterval);
  }, [speechText, tips.length]);

  const handleMascotClick = () => {
    setClickCount((prev) => prev + 1);
    setIsHappy(true);
    setShowHeartEffect(true);
    setActiveTipIndex((prev) => (prev + 1) % tips.length);

    setTimeout(() => {
      setIsHappy(false);
    }, 1200);

    setTimeout(() => {
      setShowHeartEffect(false);
    }, 1000);
  };

  const currentSpeech = speechText || tips[activeTipIndex];

  // Sizing Classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36 sm:w-48 sm:h-48',
    xl: 'w-48 h-48 sm:w-60 sm:h-60',
  }[size];

  // Mascot Visual Artwork (Dynamic graphic styled for the festival)
  const renderMascotVisual = () => (
    <div className={`relative flex items-center justify-center ${sizeClasses} group select-none`}>
      {/* Dynamic Cyber Glow Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr from-[#00F0FF]/25 via-[#FF007A]/25 to-[#FFD600]/20 rounded-full blur-xl transition-all duration-500 pointer-events-none ${
          isHappy ? 'scale-130 opacity-100' : 'group-hover:scale-115 opacity-70'
        }`}
      />

      {/* Floating Sparkles Accent */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <span className="absolute -top-1 right-2 text-xs animate-pulse text-[#FFD600]">✦</span>
        <span className="absolute bottom-2 -left-1 text-xs animate-ping text-[#00F0FF]">✨</span>
        <span className="absolute top-1/2 -right-2 text-[10px] text-[#FF007A]">★</span>
      </div>

      {/* Mascot Image */}
      <img
        src={mascotSrc}
        alt={`${mascotName} — маскот фестиваля «11 кадров»`}
        className={`w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,240,255,0.4)] drop-shadow-[0_4px_10px_rgba(255,0,122,0.3)] transition-all duration-300 transform-gpu ${
          isHappy ? 'scale-110 -rotate-3 animate-pulse' : 'group-hover:scale-105 group-hover:-translate-y-1'
        }`}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );

  // 1. FLOATING WIDGET MODE (Bottom right assistant)
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 flex flex-col items-end ${className}`}>
        {/* Expandable Assistant Dialog / Speech Bubble */}
        {isExpanded && (
          <div className="mb-3 w-80 sm:w-96 bg-[#10142e]/95 backdrop-blur-xl border-2 border-[#00F0FF]/50 rounded-3xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] text-white animate-in slide-in-from-bottom-5 duration-300 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-gray-400 hover:text-white hover:bg-[#1f2652] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Mascot Badge */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#FF007A] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1024] rounded-full flex items-center justify-center text-xs">
                  🎬
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5 font-display">
                  {mascotName}
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-[#00F0FF]/20 text-[#00F0FF] rounded-md border border-[#00F0FF]/40">
                    {animashSettings?.badge || 'Гид'}
                  </span>
                </h4>
                <p className="text-[11px] text-gray-400">Твой проводник в мир фестиваля</p>
              </div>
            </div>

            {/* Current Mascot Tip / Speech */}
            <div className="bg-[#0b0d1e] rounded-2xl p-3.5 border border-[#222954] mb-4 relative">
              <p className="text-xs text-gray-200 leading-relaxed font-medium">
                {currentSpeech}
              </p>
              <button
                onClick={() => setActiveTipIndex((prev) => (prev + 1) % tips.length)}
                className="mt-2 text-[11px] text-[#00F0FF] hover:text-[#FFD600] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Следующий совет</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsExpanded(false);
                  onActionClick?.('apply');
                }}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#FF5E00] text-white text-xs font-bold shadow-md hover:scale-102 transition-transform flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Подать заявку</span>
              </button>

              <button
                onClick={() => {
                  setIsExpanded(false);
                  onActionClick?.('studio');
                  const el = document.getElementById('mini-studio');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-2 rounded-xl bg-[#1a2046] hover:bg-[#252e63] border border-[#353f80] text-[#00F0FF] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Тест 11 кадров</span>
              </button>
            </div>

            {/* Fun Interact: Pet / Cheer Mascot */}
            <div className="mt-3 pt-2.5 border-t border-[#1e254e] flex items-center justify-between text-[11px] text-gray-400">
              <span>Любишь анимацию?</span>
              <button
                onClick={handleMascotClick}
                className="flex items-center gap-1.5 text-[#FF85C0] hover:text-[#FF007A] font-bold bg-[#FF007A]/10 px-2.5 py-1 rounded-full border border-[#FF007A]/30 transition-all hover:scale-105"
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>Погладить {mascotName.split('-')[0]} {clickCount > 0 && `(${clickCount})`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Mascot Button */}
        <div className="relative group">
          {/* Heart / Sparkle Particle on Pet */}
          {showHeartEffect && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-bounce pointer-events-none z-50">
              💖✨
            </div>
          )}

          {/* Quick Notification Bubble when collapsed */}
          {!isExpanded && (
            <div
              onClick={() => setIsExpanded(true)}
              className="absolute -top-10 right-0 bg-[#0e122b] border border-[#00F0FF]/40 text-[#00F0FF] text-[11px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap cursor-pointer hover:bg-[#171d42] transition-all animate-pulse flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#FFD600]" />
              <span>{mascotName.split('-')[0]} здесь! Жми</span>
            </div>
          )}

          {/* Mascot Trigger Avatar */}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              handleMascotClick();
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#161b3d] via-[#10142e] to-[#252f6b] p-1 border-2 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(255,0,122,0.6)] hover:border-[#FF007A] transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer relative"
            title={`${mascotName} — гид фестиваля`}
          >
            <div className="w-full h-full flex items-center justify-center overflow-visible">
              {renderMascotVisual()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF007A] text-white text-[10px] font-black flex items-center justify-center border-2 border-[#0b0c16]">
              11
            </span>
          </button>
        </div>
      </div>
    );
  }

  // 2. HELPER / MINI-STUDIO COMPANION MODE
  if (variant === 'helper') {
    return (
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#14193d] to-[#0c0f24] border border-[#2b356f] shadow-lg ${className}`}
      >
        <div
          onClick={handleMascotClick}
          className="cursor-pointer shrink-0 transition-transform hover:scale-110"
          title={`Кликни на ${mascotName}!`}
        >
          {renderMascotVisual()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-[#00F0FF] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" /> Совет от {mascotName}:
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
            {currentSpeech}
          </p>
        </div>
      </div>
    );
  }

  // 3. CARD / STORY SECTION MODE
  if (variant === 'card') {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181e42] via-[#0f132b] to-[#090b19] border-2 border-[#333f80] p-6 sm:p-8 shadow-2xl ${className}`}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF007A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div
              onClick={handleMascotClick}
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95 group relative"
            >
              {renderMascotVisual()}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#00F0FF] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Погладить!
              </div>
            </div>
          </div>

          <div className="md:col-span-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF85C0] text-xs font-bold mb-3">
              <Star className="w-3.5 h-3.5 fill-[#FFD600] text-[#FFD600]" />
              <span>{animashSettings?.badge || 'Главный талисман «11 кадров»'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 font-display">
              {animashSettings?.storyTitle || (
                <>
                  Знакомьтесь: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFD600] to-[#FF007A]">{mascotName}</span>
                </>
              )}
            </h3>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
              {animashSettings?.storyText ||
                'Милаш-Анимаш родился в лаборатории анимации Школы креативных индустрий в Чите. Его наушники в форме кинопленок улавливают самые смелые творческие идеи, а волшебный стилус превращает 11 кадров во вдохновляющие миры. Он будет встречать всех гостей на фестивале, позировать для селфи и вручать призы победителям!'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-semibold text-gray-300">
              <span className="px-3 py-1.5 rounded-xl bg-[#121633] border border-[#252e61] text-[#00F0FF]">
                {animashSettings?.tag1 || '🎧 Слушает звук в 48 кГц'}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#121633] border border-[#252e61] text-[#FFD600]">
                {animashSettings?.tag2 || '✏️ Рисует 11 кадров в секунду'}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#121633] border border-[#252e61] text-[#FF85C0]">
                {animashSettings?.tag3 || '🎬 Главный символ фестиваля'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. HERO DEFAULT INTERACTIVE MODE
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Interactive Speech Bubble */}
      {showSpeech && (
        <div
          onClick={handleMascotClick}
          className="mb-3 max-w-[280px] sm:max-w-[320px] bg-gradient-to-r from-[#171c40]/95 to-[#0f122c]/95 backdrop-blur-md border border-[#00F0FF]/50 rounded-2xl p-3.5 shadow-xl text-center cursor-pointer transition-all hover:border-[#FFD600] hover:scale-102 group relative"
        >
          {/* Speech triangle tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#0f122c]" />

          <p className="text-xs sm:text-sm text-gray-100 font-semibold leading-snug">
            {currentSpeech}
          </p>

          <span className="text-[10px] text-[#00F0FF] group-hover:text-[#FFD600] font-bold block mt-1 transition-colors">
            ✨ Нажми на {mascotName.split('-')[0]} для нового секрета
          </span>
        </div>
      )}

      {/* Mascot Animated Character */}
      <div
        onClick={handleMascotClick}
        className="cursor-pointer transition-transform active:scale-95 relative"
        title={`${mascotName} — нажми меня!`}
      >
        {/* Heart / Sparkle Particle on Pet */}
        {showHeartEffect && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce pointer-events-none z-30">
            💖
          </div>
        )}

        {renderMascotVisual()}
      </div>

      {/* Mascot Name Badge */}
      <div className="mt-1 flex items-center gap-1.5 bg-[#121530]/90 px-3 py-1 rounded-full border border-[#2b3363]">
        <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
        <span className="text-xs font-black text-white tracking-wide">
          {mascotName}
        </span>
      </div>
    </div>
  );
};
