import React, { useState } from 'react';
import { useFestival } from '../context/FestivalContext';
import { 
  Users, Award, MapPin, Sparkles, Film, CheckCircle2, 
  ChevronDown, ChevronUp, Star, Clapperboard, Briefcase
} from 'lucide-react';

export const JurySection: React.FC = () => {
  const { juryMembers } = useFestival();
  const [expandedFilmography, setExpandedFilmography] = useState<Record<string, boolean>>({});

  const toggleFilmography = (id: string) => {
    setExpandedFilmography((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="jury" className="py-20 lg:py-28 bg-[#090b16] relative border-t border-[#1b2045]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#FF007A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" /> Экспертный совет и жюри
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            Жюри фестиваля «11 кадров»
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-3 leading-relaxed">
            Выдающиеся деятели отечественной мультипликации, лауреаты премии «Икар», создатели всенародно любимых мультфильмов и ведущие эксперты Союзмультфильма и ВГИК.
          </p>
        </div>

        {/* Featured Editorial Layout for Jury Members */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {juryMembers.map((jury, index) => {
            const isLeader = jury.role.toLowerCase().includes('председатель');
            const isFilmExpanded = !!expandedFilmography[jury.id];
            const hasFilmography = jury.filmography && jury.filmography.length > 0;

            const accentColor = isLeader ? '#FFD600' : '#00F0FF';
            const badgeBg = isLeader 
              ? 'bg-[#FFD600]/20 text-[#FFD600] border-[#FFD600]/50' 
              : 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/50';

            return (
              <div
                key={jury.id}
                className="bg-[#10142d]/90 backdrop-blur-sm border border-[#232b5e] hover:border-[#3d498c] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Subtle top accent line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: isLeader 
                      ? 'linear-gradient(90deg, #FFD600, #FF7A00)' 
                      : 'linear-gradient(90deg, #00F0FF, #FF007A)'
                  }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Portrait & Key Meta */}
                  <div className="lg:col-span-4 flex flex-col space-y-4">
                    {/* Portrait Photo */}
                    <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#161a3b] border-2 border-[#252d60] group-hover:border-[#3d498c] shadow-lg transition-all duration-300">
                      <img
                        src={jury.avatar}
                        alt={jury.name}
                        className={`w-full h-full object-cover ${jury.imagePosition || 'object-center'} group-hover:scale-105 transition-transform duration-500`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d1f]/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Header Badges Overlay */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                        <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md shadow-lg flex items-center gap-1.5 ${badgeBg}`}>
                          {isLeader ? <Star className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                          {jury.role}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-white bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-lg">
                          <MapPin className="w-3 h-3 text-[#00F0FF]" />
                          <span className="text-[11px] font-semibold">{jury.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Competencies / Tags */}
                    {jury.tags && jury.tags.length > 0 && (
                      <div className="bg-[#0b0e24] p-3.5 rounded-2xl border border-[#1b224c]">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                          Специализация и опыт:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {jury.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-medium bg-[#141838] text-gray-200 px-2.5 py-0.5 rounded-lg border border-[#273063]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Dossier, Bio & Detailed Modules */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                    {/* Header: Name and Primary Position */}
                    <div className="border-b border-[#1f2756] pb-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-[#00F0FF] flex items-center gap-1.5">
                            Эксперт №{index + 1} • {jury.role}
                          </span>
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display mt-1 tracking-tight">
                            {jury.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-200 font-semibold mt-2 leading-snug">
                        {jury.company}
                      </p>
                    </div>

                    {/* Bio Block */}
                    <div className="bg-[#0d1026] p-5 rounded-2xl border border-[#1e2652] text-xs sm:text-sm text-gray-300 leading-relaxed space-y-2">
                      <p>{jury.bio}</p>
                    </div>

                    {/* Dual Info Bento Grid: Achievements & Filmography / Projects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sub-block 1: Regalia and Status */}
                      <div className="bg-[#0a0d20] p-4 rounded-2xl border border-[#1d244f] flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#FFD600] flex items-center gap-1.5 mb-3">
                            <Award className="w-4 h-4" /> Регалии и статус:
                          </div>
                          <div className="space-y-2">
                            {jury.achievements && jury.achievements.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sub-block 2: Projects / Filmography or Creative Studios */}
                      <div className="bg-[#0a0d20] p-4 rounded-2xl border border-[#1d244f] flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#00F0FF] flex items-center justify-between mb-3">
                            <span className="flex items-center gap-1.5">
                              {hasFilmography ? <Film className="w-4 h-4" /> : <Clapperboard className="w-4 h-4" />}
                              {hasFilmography ? 'Фильмография и проекты:' : 'Ключевые проекты & студии:'}
                            </span>
                            {hasFilmography && (
                              <span className="text-[10px] text-gray-400 font-normal">
                                {jury.filmography?.length} работ
                              </span>
                            )}
                          </div>

                          {hasFilmography ? (
                            <div>
                              <div className="flex flex-wrap gap-1.5">
                                {(isFilmExpanded 
                                  ? jury.filmography 
                                  : jury.filmography?.slice(0, 5)
                                )?.map((film, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[11px] font-medium bg-[#141838] text-gray-200 px-2 py-1 rounded-md border border-[#263066]"
                                  >
                                    {film}
                                  </span>
                                ))}
                              </div>

                              {jury.filmography && jury.filmography.length > 5 && (
                                <button
                                  onClick={() => toggleFilmography(jury.id)}
                                  className="mt-3 text-xs font-bold text-[#FFD600] hover:text-[#ffe133] flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  {isFilmExpanded ? (
                                    <>
                                      <span>Свернуть список</span>
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </>
                                  ) : (
                                    <>
                                      <span>Показать все {jury.filmography.length} работ</span>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2 text-xs text-gray-300">
                              <div className="flex items-start gap-2">
                                <Briefcase className="w-3.5 h-3.5 text-[#FF007A] mt-0.5 flex-shrink-0" />
                                <span>Студия анимационного девелопмента «Мультипудель»</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Briefcase className="w-3.5 h-3.5 text-[#FF007A] mt-0.5 flex-shrink-0" />
                                <span>Киностудия «Союзмультфильм»</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] mt-0.5 flex-shrink-0" />
                                <span>Шоураннинг и продюсирование оригинальных сериалов</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
