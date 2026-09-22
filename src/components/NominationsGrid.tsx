import React, { useState } from 'react';
import { Nomination } from '../types';
import { useFestival } from '../context/FestivalContext';
import { Award, Check, Sparkles, Send, Clock, FileText, Info, ShieldCheck, Box, Activity, Camera, Layers, Glasses, Palette, BookOpen } from 'lucide-react';

interface NominationsGridProps {
  onSelectNominationForApply: (nominationTitle: string) => void;
  onOpenRegulation?: () => void;
}

export const NominationsGrid: React.FC<NominationsGridProps> = ({
  onSelectNominationForApply,
  onOpenRegulation,
}) => {
  const { nominations } = useFestival();
  const [activeNomination, setActiveNomination] = useState<Nomination | null>(null);

  const getNominationIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box':
        return Box;
      case 'Sparkles':
        return Sparkles;
      case 'Activity':
        return Activity;
      case 'Camera':
        return Camera;
      case 'Layers':
        return Layers;
      case 'Glasses':
        return Glasses;
      case 'Palette':
        return Palette;
      default:
        return Award;
    }
  };

  return (
    <section id="nominations" className="py-20 lg:py-28 bg-[#090b17] relative border-t border-[#1b2045]">
      {/* Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF007A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/30 text-[#FFD600] text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" /> Конкурсная программа 2026
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            7 конкурсных номинаций
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-3 leading-relaxed">
            Конкурсная программа охватывает все ключевые направления и техники анимации — от классической покадровой рисованной мультипликации и 3D до VFX, иммерсивного VR/AR и авторского экспериментирования. Оценка в 3 возрастных категориях: «до 12 лет», «13–17 лет» и «18+».
          </p>

          {/* Quick Regulation Access Banner */}
          {onOpenRegulation && (
            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 p-3 sm:px-5 sm:py-2.5 rounded-2xl bg-[#141a3d] border border-[#27336f] text-xs">
              <span className="text-gray-300">
                Ознакомьтесь с полным текстом официального регламента участия:
              </span>
              <button
                onClick={onOpenRegulation}
                className="px-3.5 py-1.5 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] font-bold border border-[#00F0FF]/40 transition-all flex items-center gap-1.5 cursor-pointer group"
              >
                <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Читать Положение о фестивале</span>
              </button>
            </div>
          )}
        </div>

        {/* Nominations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nominations.map((nom) => {
            const Icon = getNominationIcon(nom.iconName);

            return (
              <div
                key={nom.id}
                className="bg-[#12162f] border border-[#262e60] hover:border-[#4250a2] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative group overflow-hidden"
              >
                {/* Top Corner Color Tag */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-30 group-hover:opacity-60 blur-xl transition-opacity"
                  style={{ backgroundColor: nom.color }}
                />

                <div>
                  {/* Icon & Code Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md"
                      style={{
                        backgroundColor: `${nom.color}15`,
                        borderColor: `${nom.color}40`,
                        color: nom.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-black tracking-widest px-2.5 py-1 rounded-lg bg-[#181d3d] border border-[#2b356c] text-gray-300">
                      {nom.code}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-[#00F0FF] transition-colors font-display">
                    {nom.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-300 leading-relaxed mb-5">
                    {nom.description}
                  </p>

                  {/* Quick Criteria Highlights */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Критерии жюри:
                    </span>
                    {nom.criteria.slice(0, 3).map((crit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#00F0FF] flex-shrink-0" />
                        <span className="truncate">{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Meta & Actions */}
                <div className="pt-4 border-t border-[#212854]">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FFD600]" /> {nom.maxDuration}
                    </span>
                    <span className="text-gray-300 font-semibold">
                      Категории: {nom.ageCategories.join(', ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveNomination(nom)}
                      className="py-2 px-3 rounded-xl bg-[#1a2046] hover:bg-[#252d62] text-xs font-bold text-gray-200 flex items-center justify-center gap-1.5 transition-colors border border-[#2d3770] cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Регламент</span>
                    </button>

                    <button
                      onClick={() => onSelectNominationForApply(nom.title)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#FF8A00] hover:from-[#ff1a8c] hover:to-[#ff991a] text-xs font-extrabold text-white flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Подать</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nomination Regulations Modal */}
      {activeNomination && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121630] border border-[#303a74] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5 border-b border-[#252e60] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border font-black text-xs sm:text-sm"
                  style={{
                    backgroundColor: `${activeNomination.color}20`,
                    borderColor: activeNomination.color,
                    color: activeNomination.color,
                  }}
                >
                  {activeNomination.code}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                    Регламент номинации
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                    {activeNomination.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveNomination(null)}
                className="p-2 rounded-xl bg-[#1b2046] hover:bg-[#252d62] text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-sm text-gray-300 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-white mb-1">Описание категории:</h4>
                <p className="text-xs leading-relaxed text-gray-300">{activeNomination.description}</p>
              </div>

              <div className="bg-[#0b0e20] p-4 rounded-xl border border-[#212954]">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00F0FF]" /> Критерии оценки жюри:
                </h4>
                <ul className="space-y-1.5 text-xs">
                  {activeNomination.criteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#00F0FF] font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#171d3d] p-3 rounded-xl border border-[#263060]">
                  <span className="text-gray-400 block mb-1">Хронометраж:</span>
                  <span className="font-bold text-white">{activeNomination.maxDuration}</span>
                </div>
                <div className="bg-[#171d3d] p-3 rounded-xl border border-[#263060]">
                  <span className="text-gray-400 block mb-1">Возраст:</span>
                  <span className="font-bold text-white">{activeNomination.ageCategories.join(', ')}</span>
                </div>
                <div className="bg-[#171d3d] p-3 rounded-xl border border-[#263060]">
                  <span className="text-gray-400 block mb-1">Форматы:</span>
                  <span className="font-bold text-white truncate">{activeNomination.formats.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-[#252e60] flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveNomination(null)}
                className="px-4 py-2.5 rounded-xl bg-[#1b2046] text-xs font-semibold text-gray-300 hover:text-white cursor-pointer"
              >
                Закрыть
              </button>

              <button
                onClick={() => {
                  const nomTitle = activeNomination.title;
                  setActiveNomination(null);
                  onSelectNominationForApply(nomTitle);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#FF8A00] text-xs font-extrabold text-white shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Подать работу в эту номинацию</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
