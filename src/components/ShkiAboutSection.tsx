import React from 'react';
import { MilashAnimash } from './MilashAnimash';
import { SHKI_STUDIOS } from '../festivalData';
import { useFestival } from '../context/FestivalContext';
import { MapPin, Film, Mic, Music, Video, Palette, Cpu, Phone, Mail, Globe, ExternalLink, Sparkles, Navigation } from 'lucide-react';

export const ShkiAboutSection: React.FC = () => {
  const { festivalInfo } = useFestival();
  const getStudioIcon = (icon: string) => {
    switch (icon) {
      case 'Film':
        return Film;
      case 'Cpu':
        return Cpu;
      case 'Mic':
        return Mic;
      case 'Music':
        return Music;
      case 'Video':
        return Video;
      case 'Palette':
        return Palette;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="about-shki" className="py-20 lg:py-28 bg-[#0a0c1a] relative border-t border-[#1a2044]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" /> Главная площадка фестиваля
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            Школа креативных индустрий
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-3 leading-relaxed">
            ШКИ Забайкальского края создана в рамках федерального проекта «Придумано в России» на базе Забайкальского краевого училища культуры. Это современное высокотехнологичное пространство для подростков 12–18 лет.
          </p>
        </div>

        {/* 6 Creative Studios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {SHKI_STUDIOS.map((studio) => {
            const Icon = getStudioIcon(studio.icon);

            return (
              <div
                key={studio.id}
                className="bg-[#121630] border border-[#242d5e] rounded-2xl p-6 hover:border-[#4150a0] transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00F0FF] transition-colors font-display">
                  {studio.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {studio.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mascot Feature Story Card */}
        <div className="mb-14">
          <MilashAnimash variant="card" />
        </div>

        {/* Location, Venue & Contact Info Bar */}
        <div className="bg-[#121630] border border-[#262e60] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#FFD600] uppercase tracking-wider block mb-1">
              Площадки проведения фестиваля
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              Главные локации «11 кадров 2026»
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Venue 1: Udokan */}
            <div className="bg-[#0c0f24] p-5 sm:p-6 rounded-2xl border border-[#273060] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF007A]/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF85C0] text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> 16 и 18 октября • Открытие & Закрытие
                </div>
                <h4 className="text-xl font-black text-white mb-2">Кинотеатр «Удокан»</h4>
                <p className="text-xs text-[#00F0FF] font-semibold mb-3">г. Чита, ул. Ленина, д. 111</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  Главный и крупнейший кинотеатр Забайкалья. Здесь состоятся: <strong>Торжественное открытие (16 октября в 15:00)</strong>, премьерные показы и <strong>Торжественное закрытие с награждением победителей (18 октября)</strong> на гигантском киноэкране.
                </p>
              </div>
              <a
                href="https://yandex.ru/maps/?text=Чита+Ленина+111+кинотеатр+Удокан"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1d244c] hover:bg-[#283269] text-xs font-bold text-[#00F0FF] flex items-center justify-center gap-2 border border-[#344180] transition-colors mt-2"
              >
                <span>Удокан на Яндекс.Картах</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Venue 2: SHKI */}
            <div className="bg-[#0c0f24] p-5 sm:p-6 rounded-2xl border border-[#273060] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> 17 октября • Смотр фильмов & Воркшопы
                </div>
                <h4 className="text-xl font-black text-white mb-2">Школа креативных индустрий</h4>
                <p className="text-xs text-[#FFD600] font-semibold mb-3">г. Чита, ул. Красной Звезды, д. 7</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  Здание Забайкальского краевого училища культуры. Фестивальный хаб: лаборатории 2D и 3D анимации, звукозаписи, студия stop-motion, кинозалы смотра конкурсных фильмов и зона хакатона.
                </p>
              </div>
              <a
                href="https://yandex.ru/maps/?text=Чита+Красной+Звезды+7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1d244c] hover:bg-[#283269] text-xs font-bold text-[#FFD600] flex items-center justify-center gap-2 border border-[#344180] transition-colors mt-2"
              >
                <span>ШКИ на Яндекс.Картах</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Contact Details footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#1d2550]">
            <a
              href={`tel:${festivalInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#080a1c] border border-[#202752] text-gray-300 hover:text-white hover:border-[#00F0FF] transition-all"
            >
              <Phone className="w-4 h-4 text-[#00F0FF]" />
              <div>
                <span className="text-[10px] text-gray-500 block">Телефон оргкомитета</span>
                <span className="font-bold">{festivalInfo.phone}</span>
              </div>
            </a>

            <a
              href={`mailto:${festivalInfo.email}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#080a1c] border border-[#202752] text-gray-300 hover:text-white hover:border-[#FF007A] transition-all"
            >
              <Mail className="w-4 h-4 text-[#FF007A]" />
              <div>
                <span className="text-[10px] text-gray-500 block">Электронная почта</span>
                <span className="font-bold">{festivalInfo.email}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
