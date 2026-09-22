import React, { useState } from 'react';
import { EventItem } from '../types';
import { CheckCircle2, QrCode, Calendar, Clock, MapPin, X, Sparkles, Download, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TicketPassModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({ event, onClose }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [ticketNum, setTicketNum] = useState('');

  if (!event) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    const code = `11K-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketNum(code);
    setIsBooked(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#FF007A', '#FFD600'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121630] border border-[#2e3770] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1b2046] hover:bg-[#252d62] text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isBooked ? (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Бесплатный электронный билет
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-display mb-2">
              Запись на мероприятие
            </h3>

            <div className="bg-[#0b0e22] p-4 rounded-2xl border border-[#212954] mb-5">
              <h4 className="font-bold text-white text-sm mb-1">{event.title}</h4>
              <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-gray-300 mt-2">
                <span className="flex items-center gap-1 text-[#00F0FF]">
                  <Calendar className="w-3.5 h-3.5" /> {event.dateStr}
                </span>
                <span className="flex items-center gap-1 text-[#FFD600]">
                  <Clock className="w-3.5 h-3.5" /> {event.time} – {event.endTime}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" /> {event.location}
                </span>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Ваше имя и фамилия *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Анна Смирнова"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Email для получения билета *
                </label>
                <input
                  type="email"
                  required
                  placeholder="anna@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Телефон (для напоминания в Telegram/SMS)
                </label>
                <input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-black text-sm shadow-xl shadow-[#00F0FF]/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Получить бесплатный пропуск</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-white font-display mb-1">
              Билет забронирован!
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              Покажите этот QR-код на входе в Школу креативных индустрий.
            </p>

            {/* Visual Digital Ticket Pass */}
            <div className="bg-gradient-to-br from-[#181d3d] to-[#0a0d1e] border-2 border-[#00F0FF] rounded-2xl p-5 text-left relative overflow-hidden shadow-2xl mb-5">
              <div className="flex items-center justify-between border-b border-[#293264] pb-3 mb-3">
                <div>
                  <span className="text-xs font-black text-white">11КАДРОВ • ПРОПУСК</span>
                  <p className="text-[10px] text-[#00F0FF]">ШКИ Чита, ул. Красной Звезды 7</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-[#FFD600]">{ticketNum}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-xl p-1.5 flex items-center justify-center flex-shrink-0">
                  {/* Stylized QR Code Visual */}
                  <div className="w-full h-full border-2 border-black grid grid-cols-4 gap-0.5 p-0.5 bg-white">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${(i * 7 + 3) % 2 === 0 ? 'bg-black' : 'bg-transparent'} rounded-xs`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-white line-clamp-1">{event.title}</p>
                  <p className="text-gray-300 text-[11px]">{userName}</p>
                  <p className="text-[#00F0FF] font-semibold text-[11px]">{event.dateStr}, {event.time}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#1b2046] text-white text-xs font-bold hover:bg-[#262e63]"
            >
              Готово
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
