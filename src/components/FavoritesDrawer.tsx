import React from 'react';
import { EventItem } from '../types';
import { SCHEDULE_EVENTS } from '../festivalData';
import { Bookmark, Clock, MapPin, Trash2, X, Calendar, Download } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedEventIds: string[];
  onRemoveSave: (eventId: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedEventIds,
  onRemoveSave,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const savedEvents = SCHEDULE_EVENTS.filter((ev) => savedEventIds.includes(ev.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
      <div className="bg-[#0f1226] border-l border-[#242b58] w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#21274e] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#FFD600]/20 text-[#FFD600]">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display">Мое расписание</h3>
                <span className="text-xs text-gray-400">
                  Сохранено событий: {savedEvents.length}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#171c3b] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          {savedEvents.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Bookmark className="w-12 h-12 stroke-1 mx-auto mb-3 text-gray-600" />
              <p className="text-sm font-semibold text-gray-300">Ваш список пуст</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Нажимайте на значок закладки в программе фестиваля, чтобы собрать персональное расписание.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              {savedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#151936] border border-[#262e60] rounded-xl p-4 flex items-start justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#00F0FF] mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.dateStr.split(' ')[0]} • {ev.time} - {ev.endTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{ev.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF7A00]" /> {ev.location}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveSave(ev.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#FF007A] hover:bg-[#202750] transition-colors"
                    title="Удалить из списка"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedEvents.length > 0 && (
          <div className="pt-4 border-t border-[#21274e] flex items-center justify-between gap-3">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-gray-400 hover:text-[#FF007A] transition-colors"
            >
              Очистить всё
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold text-xs"
            >
              Продолжить просмотр
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
