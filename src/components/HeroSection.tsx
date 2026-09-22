import React, { useState, useEffect } from 'react';
import { FestivalLogo } from './FestivalLogo';
import { MilashAnimash } from './MilashAnimash';
import { Calendar, MapPin, Sparkles, Send, PlayCircle, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';

interface HeroSectionProps {
  onOpenApply: () => void;
  onScrollToSchedule: () => void;
  onScrollToMiniStudio: () => void;
  onOpenRegulation?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenApply,
  onScrollToSchedule,
  onScrollToMiniStudio,
  onOpenRegulation,
}) => {
  const { festivalInfo, animashSettings } = useFestival();
  const mascotName = animashSettings?.name || 'Милаш-Анимаш';
  // Countdown to October 10 (Deadline) or October 17 (Festival)
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 35,
    seconds: 10,
  });

  const [activeVisual, setActiveVisual] = useState<'mascot' | 'emblem'>('mascot');

  useEffect(() => {
    // Dynamic countdown calculation based on October 5 deadline
    const targetDate = new Date('2026-10-05T23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-radial from-[#15193a] via-[#0b0c16] to-[#07080f]">
      {/* Background ambient lighting effects matching the logo palette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#FF007A]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#FFD600]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & Main Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Badges */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e244d] border border-[#3b478c] text-white text-xs font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                <span>Школа креативных индустрий • Чита</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF85C0] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Символ: {mascotName}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 font-display">
              Дальневосточный фестиваль <br className="hidden sm:inline" />
              креативной анимации <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFD600] to-[#FF007A]">
                «11 кадров»
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal">
              Главный праздник анимации Дальнего Востока на 3 дня: <strong>16 октября</strong> открытие в кинотеатре «Удокан» в 15:00, <strong>17 октября</strong> смотр конкурсных фильмов, воркшопы и мастер-классы в ШКИ, <strong>18 октября</strong> торжественное закрытие и награждение в к/т «Удокан»!
            </p>

            {/* Quick Meta Info Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-gray-300 mb-9">
              <div className="flex items-center gap-2 bg-[#12152b] px-3.5 py-2 rounded-xl border border-[#262c5a]">
                <Calendar className="w-4 h-4 text-[#00F0FF]" />
                <span>16 – 18 октября 2026 (3 дня)</span>
              </div>
              <div className="flex items-center gap-2 bg-[#12152b] px-3.5 py-2 rounded-xl border border-[#262c5a]">
                <MapPin className="w-4 h-4 text-[#FF007A]" />
                <span>к/т «Удокан» & ШКИ (Чита)</span>
              </div>
              <div className="flex items-center gap-2 bg-[#12152b] px-3.5 py-2 rounded-xl border border-[#262c5a]">
                <CheckCircle2 className="w-4 h-4 text-[#FFD600]" />
                <span>Участие бесплатное</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF007A] via-[#FF5E00] to-[#FFD600] text-white font-extrabold text-base shadow-xl shadow-[#FF007A]/30 hover:shadow-[#FF007A]/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>Подать конкурсную работу</span>
              </button>

              <button
                onClick={onScrollToSchedule}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#171b38] hover:bg-[#222854] border border-[#333c75] text-white font-bold text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-[#00F0FF]" />
                <span>Программа фестиваля</span>
              </button>

              <button
                onClick={onScrollToMiniStudio}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#12162f] hover:bg-[#1c224a] border border-[#242b58] text-[#00F0FF] hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Тест 11 кадров</span>
              </button>
            </div>

            {/* Read Regulation Link */}
            {onOpenRegulation && (
              <div className="mt-5 flex items-center justify-center lg:justify-start">
                <button
                  onClick={onOpenRegulation}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101432] hover:bg-[#19204a] text-xs font-bold text-gray-300 hover:text-white border border-[#232b60] hover:border-[#00F0FF]/50 transition-all cursor-pointer shadow-md group"
                >
                  <BookOpen className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
                  <span>Читать официальное Положение о фестивале</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-medium">
                    12 глав онлайн
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Visual Mascot & Interactive Countdown Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Center Animated Visual with Logo Aperture */}
            <div className="relative w-full max-w-[380px] p-6 rounded-3xl bg-gradient-to-b from-[#181d3d]/90 to-[#0e1124]/95 border-2 border-[#333d7a] shadow-2xl backdrop-blur-xl">
              {/* Sponsor Prize Ribbon */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD600] to-[#FF8A00] text-black text-xs font-black px-4 py-1 rounded-full shadow-lg uppercase tracking-wide whitespace-nowrap">
                Особый приз от генерального спонсора
              </div>

              {/* Visual Switcher Tabs */}
              <div className="flex items-center justify-center gap-1.5 mb-2 p-1 bg-[#0f1228] rounded-xl border border-[#232a54] max-w-[260px] mx-auto">
                <button
                  onClick={() => setActiveVisual('mascot')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeVisual === 'mascot'
                      ? 'bg-gradient-to-r from-[#00F0FF] to-[#00838F] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>🎬</span>
                  <span>{mascotName}</span>
                </button>
                <button
                  onClick={() => setActiveVisual('emblem')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeVisual === 'emblem'
                      ? 'bg-gradient-to-r from-[#FF007A] to-[#FF5E00] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>★</span>
                  <span>Эмблема 11К</span>
                </button>
              </div>

              {/* Center Animated Visual: Mascot OR Logo Emblem */}
              <div className="my-2 flex flex-col items-center justify-center relative min-h-[220px]">
                {activeVisual === 'mascot' ? (
                  <MilashAnimash variant="hero" size="lg" showSpeech={true} />
                ) : (
                  <>
                    <div className="relative p-2">
                      <FestivalLogo size="xl" showText={false} animate={true} />
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-3xl font-black text-white tracking-wider font-display">
                        11<span className="text-[#00F0FF]">кадров</span>
                      </span>
                      <p className="text-xs text-[#FFD600] font-bold uppercase tracking-widest mt-0.5">
                        Дальневосточный фестиваль анимации
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Countdown to Submission Deadline Card */}
              <div className="bg-[#090b17]/90 rounded-2xl p-4 border border-[#222852] mt-2">
                <div className="flex items-center justify-between text-xs text-gray-300 font-semibold mb-3">
                  <span className="flex items-center gap-1.5 text-[#00F0FF]">
                    <Clock className="w-3.5 h-3.5" /> Прием заявок открыт:
                  </span>
                  <span className="text-gray-400">до 5 октября</span>
                </div>

                {/* Counter Grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#151936] rounded-xl py-2 px-1 border border-[#2a3264]">
                    <span className="block text-xl font-black text-white leading-none">{timeLeft.days}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 block">дней</span>
                  </div>
                  <div className="bg-[#151936] rounded-xl py-2 px-1 border border-[#2a3264]">
                    <span className="block text-xl font-black text-[#00F0FF] leading-none">{timeLeft.hours}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 block">часов</span>
                  </div>
                  <div className="bg-[#151936] rounded-xl py-2 px-1 border border-[#2a3264]">
                    <span className="block text-xl font-black text-[#FFD600] leading-none">{timeLeft.minutes}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 block">минут</span>
                  </div>
                  <div className="bg-[#151936] rounded-xl py-2 px-1 border border-[#2a3264]">
                    <span className="block text-xl font-black text-[#FF007A] leading-none">{timeLeft.seconds}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 block">секунд</span>
                  </div>
                </div>
              </div>

              {/* Quick Key Perks List */}
              <div className="mt-4 pt-3 border-t border-[#222852] grid grid-cols-2 gap-2 text-[11px] text-gray-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" /> 7 конкурсных номинаций
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF007A]" /> Возраст: 0+ / 12-17 / 18+
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]" /> Эксперты индустрии
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" /> Дипломы и Грант
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker / Running Marquee */}
      <div className="mt-16 py-3.5 bg-[#0e1124] border-y border-[#232a54] overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-8 items-center text-xs font-black uppercase tracking-widest text-gray-400 animate-marquee">
          <span className="text-[#FF007A] flex items-center gap-2">★ 2D-Анимация</span>
          <span>•</span>
          <span className="text-[#00F0FF] flex items-center gap-2">★ 3D-Анимация & Моделирование</span>
          <span>•</span>
          <span className="text-[#FF7A00] flex items-center gap-2">★ Stop-Motion & Пластилин</span>
          <span>•</span>
          <span className="text-[#FFD600] flex items-center gap-2">★ Motion-Дизайн & Scribble</span>
          <span>•</span>
          <span className="text-[#A855F7] flex items-center gap-2">★ Визуальные эффекты (VFX)</span>
          <span>•</span>
          <span className="text-[#00F0FF] flex items-center gap-2">★ VR/AR & Интерактив</span>
          <span>•</span>
          <span className="text-[#E11D48] flex items-center gap-2">★ Экспериментальная анимация</span>
          <span>•</span>
          <span className="text-[#FFD600] flex items-center gap-2">★ Анимационный Хакатон</span>
          <span>•</span>
          <span className="text-white flex items-center gap-2">★ Школа креативных индустрий Чита</span>
        </div>
      </div>
    </section>
  );
};
