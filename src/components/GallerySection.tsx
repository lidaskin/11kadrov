import React, { useState } from 'react';
import { AnimationWork } from '../types';
import { useFestival } from '../context/FestivalContext';
import { Film, Play, Heart, Clock, MapPin, Sparkles, Filter, X } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { galleryWorks } = useFestival();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedWork, setSelectedWork] = useState<AnimationWork | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'Все работы' },
    { id: '2D-анимация', label: '2D-анимация' },
    { id: '3D-анимация', label: '3D-анимация' },
    { id: 'Stop-motion анимация', label: 'Stop-motion' },
    { id: 'Motion-дизайн и шрифтовая/Scribble-анимация', label: 'Motion & Scribble' },
    { id: 'Визуальные эффекты (VFX)', label: 'VFX' },
    { id: 'VR/AR и интерактивная анимация', label: 'VR / AR' },
    { id: 'Экспериментальная анимация', label: 'Экспериментал' },
  ];

  const filteredWorks = galleryWorks.filter((w) => {
    if (activeCategory !== 'all' && w.nomination !== activeCategory) return false;
    return true;
  });

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter((item) => item !== id));
    } else {
      setLikedIds([...likedIds, id]);
    }
  };


  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#0b0d1c] relative border-t border-[#1d234a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF007A]/15 border border-[#FF007A]/30 text-[#FF007A] text-xs font-bold uppercase tracking-wider mb-3">
              <Film className="w-3.5 h-3.5" /> Онлайн-кинозал фестиваля
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
              Панорама авторских работ
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl">
              Смотрите конкурсные и внеконкурсные мультфильмы молодых аниматоров Забайкалья и регионов Дальнего Востока.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#FF007A] text-white shadow-lg shadow-[#FF007A]/25'
                    : 'bg-[#161a35] text-gray-400 hover:text-white hover:bg-[#202750]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => {
            const isLiked = likedIds.includes(work.id);

            return (
              <div
                key={work.id}
                onClick={() => setSelectedWork(work)}
                className="bg-[#121630] border border-[#242d5e] hover:border-[#42509c] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#00F0FF] text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FFD600]" />
                    {work.duration}
                  </div>

                  {/* Age Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-[#FF007A]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                    {work.ageCategory}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider block mb-1">
                      {work.nomination}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-snug mb-2 font-display">
                      {work.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                      {work.description}
                    </p>
                  </div>

                  {/* Author & Likes Bar */}
                  <div className="pt-3 border-t border-[#202752] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-300 font-medium block truncate max-w-[170px]">
                        {work.author}
                      </span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF7A00]" /> {work.city} • {work.studio || 'Индивидуально'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleLike(work.id, e)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                        isLiked
                          ? 'bg-[#FF007A]/20 border-[#FF007A]/40 text-[#FF007A]'
                          : 'bg-[#181d3d] border-[#293264] text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-bold text-[11px]">{work.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video / Work Preview Modal */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121630] border border-[#313c77] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Mock Player Screen */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <img
                src={selectedWork.thumbnail}
                alt={selectedWork.title}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/50 backdrop-blur-xs">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF007A] to-[#00F0FF] text-white flex items-center justify-center shadow-2xl mb-4 animate-pulse">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedWork.title}</h3>
                <p className="text-xs text-gray-300 max-w-md">
                  Показ конкурсного мультфильма на фестивале «11 кадров» в ШКИ Чита.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info bar */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                    {selectedWork.nomination} • {selectedWork.ageCategory}
                  </span>
                  <h3 className="text-2xl font-black text-white font-display mt-0.5">
                    {selectedWork.title}
                  </h3>
                </div>

                <button
                  onClick={(e) => toggleLike(selectedWork.id, e)}
                  className="px-4 py-2 rounded-xl bg-[#1c2247] border border-[#2e3975] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#252f63]"
                >
                  <Heart className={`w-4 h-4 text-[#FF007A] ${likedIds.includes(selectedWork.id) ? 'fill-current' : ''}`} />
                  <span>{selectedWork.likes} зрительских голосов</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                {selectedWork.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#0b0e22] p-3.5 rounded-xl border border-[#1f2652]">
                <div>
                  <span className="text-gray-500 block">Автор:</span>
                  <span className="font-bold text-white">{selectedWork.author}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Студия:</span>
                  <span className="font-bold text-white">{selectedWork.studio || 'Независимый'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Город:</span>
                  <span className="font-bold text-white">{selectedWork.city}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Хронометраж:</span>
                  <span className="font-bold text-[#FFD600]">{selectedWork.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
