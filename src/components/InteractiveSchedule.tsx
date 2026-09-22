import React, { useState } from 'react';
import { EventItem } from '../types';
import { useFestival } from '../context/FestivalContext';
import { Calendar, Clock, MapPin, User, Bookmark, Search, Download, CheckCircle2, Users, Sparkles, Filter } from 'lucide-react';

interface InteractiveScheduleProps {
  savedEventIds: string[];
  onToggleSave: (eventId: string) => void;
  onRegisterEvent: (event: EventItem) => void;
}

export const InteractiveSchedule: React.FC<InteractiveScheduleProps> = ({
  savedEventIds,
  onToggleSave,
  onRegisterEvent,
}) => {
  const { scheduleEvents } = useFestival();
  const [selectedDay, setSelectedDay] = useState<number | 'all'>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Все события' },
    { id: 'masterclass', label: 'Мастер-классы и воркшопы' },
    { id: 'screening', label: 'Кинопоказы и шорт-лист' },
    { id: 'lecture', label: 'Лекции и круглые столы' },
    { id: 'competition', label: 'Хакатон' },
    { id: 'performance', label: 'Перформансы и DJ' },
    { id: 'ceremony', label: 'Церемонии' },
  ];

  // Filter events
  const filteredEvents = scheduleEvents.filter((ev) => {
    // Day match
    if (selectedDay !== 'all' && ev.day !== selectedDay) return false;

    // Category match
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;

    // Saved only filter
    if (showSavedOnly && !savedEventIds.includes(ev.id)) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchSpeaker = ev.speaker?.toLowerCase().includes(q) || false;
      const matchLocation = ev.location.toLowerCase().includes(q);
      const matchTags = ev.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSpeaker && !matchLocation && !matchTags) return false;
    }

    return true;
  });

  // Download .ics calendar event
  const downloadIcsCalendar = () => {
    const eventsToExport = showSavedOnly
      ? scheduleEvents.filter((ev) => savedEventIds.includes(ev.id))
      : scheduleEvents;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//11 Kadrov Animation Festival//RU',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ].join('\r\n');

    eventsToExport.forEach((ev) => {
      const dateMap: Record<number, string> = {
        1: '20261016',
        2: '20261017',
        3: '20261018',
      };
      const dateStr = dateMap[ev.day] || '20261016';
      const startTimeFormatted = `${dateStr}T${ev.time.replace(':', '')}00`;
      const endTimeFormatted = `${dateStr}T${ev.endTime.replace(':', '')}00`;

      icsContent += '\r\n' + [
        'BEGIN:VEVENT',
        `UID:${ev.id}@shki75.zabcult.ru`,
        `DTSTAMP:${dateStr}T000000Z`,
        `DTSTART:${startTimeFormatted}`,
        `DTEND:${endTimeFormatted}`,
        `SUMMARY:11 Кадров: ${ev.title}`,
        `DESCRIPTION:${ev.description.replace(/\n/g, ' ')}`,
        `LOCATION:${ev.location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n');
    });

    icsContent += '\r\nEND:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '11_kadrov_festival_schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryColor = (cat: EventItem['category']) => {
    switch (cat) {
      case 'masterclass':
        return 'border-[#00F0FF]/40 bg-[#00F0FF]/10 text-[#00F0FF]';
      case 'screening':
        return 'border-[#FF007A]/40 bg-[#FF007A]/10 text-[#FF007A]';
      case 'lecture':
        return 'border-[#FFD600]/40 bg-[#FFD600]/10 text-[#FFD600]';
      case 'performance':
        return 'border-[#9B51E0]/40 bg-[#9B51E0]/10 text-[#C084FC]';
      case 'competition':
        return 'border-[#FF7A00]/40 bg-[#FF7A00]/10 text-[#FF7A00]';
      case 'ceremony':
        return 'border-white/40 bg-white/10 text-white';
      default:
        return 'border-gray-500/40 bg-gray-500/10 text-gray-300';
    }
  };

  return (
    <section id="schedule" className="py-20 lg:py-28 bg-[#0b0d1a] relative border-t border-[#1d2347]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" /> Программа 16–18 октября 2026
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
              Интерактивное расписание
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl">
              Составьте персональный маршрут по фестивалю «11 кадров». Все мастер-классы, воркшопы и кинопоказы бесплатные по предварительной регистрации.
            </p>
          </div>
        </div>

        {/* Filters Controls Panel */}
        <div className="bg-[#12162f] border border-[#262e5e] rounded-2xl p-5 mb-8 shadow-xl">
          {/* Day Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 border-b border-[#20274f] pb-4">
            <button
              onClick={() => setSelectedDay(1)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedDay === 1
                  ? 'bg-gradient-to-r from-[#FF007A] to-[#FF5E00] text-white shadow-lg shadow-[#FF007A]/25 ring-2 ring-[#FF007A]/40'
                  : 'bg-[#181e3d] text-gray-300 hover:bg-[#222a57] hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>День 1: 16 октября (Пт)</span>
              <span className="text-[11px] opacity-80 font-normal hidden sm:inline">• Открытие в к/т «Удокан» (15:00)</span>
            </button>

            <button
              onClick={() => setSelectedDay(2)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedDay === 2
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold shadow-lg shadow-[#00F0FF]/25 ring-2 ring-[#00F0FF]/40'
                  : 'bg-[#181e3d] text-gray-300 hover:bg-[#222a57] hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>День 2: 17 октября (Сб)</span>
              <span className="text-[11px] opacity-80 font-normal hidden sm:inline">• Смотр фильмов & Воркшопы в ШКИ</span>
            </button>

            <button
              onClick={() => setSelectedDay(3)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedDay === 3
                  ? 'bg-gradient-to-r from-[#FFD600] to-[#FF8A00] text-black font-extrabold shadow-lg shadow-[#FFD600]/25 ring-2 ring-[#FFD600]/40'
                  : 'bg-[#181e3d] text-gray-300 hover:bg-[#222a57] hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>День 3: 18 октября (Вс)</span>
              <span className="text-[11px] opacity-80 font-normal hidden sm:inline">• Закрытие в к/т «Удокан»</span>
            </button>

            <button
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDay === 'all'
                  ? 'bg-white text-black ring-2 ring-white/40'
                  : 'bg-[#181e3d] text-gray-400 hover:bg-[#222a57] hover:text-white'
              }`}
            >
              Все 3 дня (16–18 октября)
            </button>
          </div>

          {/* Category Badges & Search Box */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Categories horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#2b356c] text-white border border-[#4859b3]'
                      : 'bg-[#161a35] text-gray-400 hover:text-gray-200 hover:bg-[#1f244a]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search + Favorites Toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Search bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Поиск по программе..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#171c3b] border border-[#2b3469] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              {/* Favorites toggle */}
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  showSavedOnly
                    ? 'bg-[#FFD600] text-black shadow-md'
                    : 'bg-[#171c3b] text-gray-300 border border-[#2b3469] hover:text-white'
                }`}
                title="Показать только сохраненные события"
              >
                <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-black' : ''}`} />
                <span className="hidden sm:inline">Избранное</span>
                {savedEventIds.length > 0 && <span>({savedEventIds.length})</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid / Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-[#12162f] rounded-2xl border border-[#262e5e]">
            <Sparkles className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">События не найдены</h4>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Попробуйте сбросить фильтры или выбрать другой день программы.
            </p>
            <button
              onClick={() => {
                setSelectedDay('all');
                setSelectedCategory('all');
                setSearchQuery('');
                setShowSavedOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#232b59] text-xs font-bold text-[#00F0FF] hover:bg-[#2c3770]"
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const isSaved = savedEventIds.includes(ev.id);
              const badgeClass = getCategoryColor(ev.category);

              return (
                <div
                  key={ev.id}
                  className="bg-[#131733] border border-[#242c5b] hover:border-[#3d4994] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl relative group"
                >
                  {/* Top Bar: Time, Category Badge & Favorite Bookmark */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-black text-white bg-[#1c234d] px-2.5 py-1 rounded-lg border border-[#313c7d]">
                        <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>
                          {ev.time} – {ev.endTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                          {ev.categoryLabel}
                        </span>

                        <button
                          onClick={() => onToggleSave(ev.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSaved
                              ? 'bg-[#FFD600]/20 text-[#FFD600]'
                              : 'text-gray-500 hover:text-gray-200 hover:bg-[#1e254f]'
                          }`}
                          title={isSaved ? 'Удалить из избранного' : 'Добавить в избранное'}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Date subtitle if viewing all days */}
                    {selectedDay === 'all' && (
                      <div className="text-[11px] font-semibold text-[#00F0FF] mb-1">
                        {ev.dateStr}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-snug mb-2">
                      {ev.title}
                    </h3>

                    {/* Speaker Info if present */}
                    {ev.speaker && (
                      <div className="flex items-start gap-2 text-xs text-gray-300 mb-3 bg-[#0d1024] p-2.5 rounded-xl border border-[#1f254e]">
                        <User className="w-3.5 h-3.5 text-[#FF007A] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">{ev.speaker}</span>
                          {ev.speakerRole && <span className="text-[11px] text-gray-400 block">{ev.speakerRole}</span>}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {ev.description}
                    </p>

                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {ev.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium bg-[#1a2046] text-gray-300 px-2 py-0.5 rounded-md border border-[#2b356e]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action: Registration / Ticket */}
                  <div className="pt-3 border-t border-[#222956] flex items-center justify-between gap-2">
                    {ev.capacity && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>Мест: {ev.capacity}</span>
                      </div>
                    )}

                    <button
                      onClick={() => onRegisterEvent(ev)}
                      className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF]/20 to-[#0072FF]/20 hover:from-[#00F0FF] hover:to-[#0072FF] text-[#00F0FF] hover:text-black border border-[#00F0FF]/40 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Записаться (Бесплатно)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
