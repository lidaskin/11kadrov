import React, { useState } from 'react';
import { useFestival } from '../context/FestivalContext';
import { HelpCircle, ChevronDown, Sparkles, BookOpen } from 'lucide-react';

interface FaqSectionProps {
  onOpenRegulation?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenRegulation }) => {
  const { faqs } = useFestival();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#090b16] relative border-t border-[#1b2045]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/30 text-[#FFD600] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Вопросы и ответы
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            Часто задаваемые вопросы
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2">
            Всё, что нужно знать об участии в фестивале «11 кадров» и регламенте показов.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`bg-[#121630] border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen ? 'border-[#00F0FF]/50 shadow-xl' : 'border-[#222954] hover:border-[#313c77]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-white leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#00F0FF] text-black' : 'bg-[#1a2044] text-gray-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#1c234a]/60 animate-in fade-in-50 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout to Read Regulation */}
        {onOpenRegulation && (
          <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-[#12183e] via-[#161d4d] to-[#101438] border border-[#2b3778] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Хотите изучить полный официальный регламент?
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Ознакомьтесь с утвержденным Положением о фестивале — все 12 глав доступны онлайн с поиском и оглавлением.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenRegulation}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-xs shadow-lg shadow-[#00F0FF]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Читать Положение онлайн</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
