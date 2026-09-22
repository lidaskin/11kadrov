import React from 'react';
import { FestivalLogo } from './FestivalLogo';
import { useFestival } from '../context/FestivalContext';
import { ArrowUp, Phone, Mail, Globe, MapPin, ExternalLink, Lock, ShieldCheck, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenRegulation?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenAdminDashboard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegulation,
  onOpenAdminLogin,
  onOpenAdminDashboard,
}) => {
  const { festivalInfo, isAdmin } = useFestival();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#06070d] border-t border-[#181d3d] text-gray-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1b2042]">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-4">
            <FestivalLogo size="md" />
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              {festivalInfo.fullName}. Ежегодная площадка для юных талантов, мультипликационных студий и педагогов со всей России.
            </p>
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>Организатор: {festivalInfo.organizer}</p>
              <p>База: {festivalInfo.parentOrg}</p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Разделы сайта</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#schedule" className="hover:text-[#00F0FF] transition-colors">
                  Программа фестиваля ({festivalInfo.dates})
                </a>
              </li>
              <li>
                <a href="#nominations" className="hover:text-[#00F0FF] transition-colors">
                  Номинации и регламент
                </a>
              </li>
              {onOpenRegulation && (
                <li>
                  <button
                    onClick={onOpenRegulation}
                    className="hover:text-[#00F0FF] transition-colors flex items-center gap-1.5 cursor-pointer text-left group"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#00F0FF] group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-gray-300 group-hover:text-white">Положение о фестивале (Читать онлайн / Скачать)</span>
                  </button>
                </li>
              )}
              <li>
                <a href="#mini-studio" className="hover:text-[#00F0FF] transition-colors">
                  Лаборатория «11 кадров» (Тест аниматора)
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#00F0FF] transition-colors">
                  Панорама авторских работ
                </a>
              </li>
              <li>
                <a href="#jury" className="hover:text-[#00F0FF] transition-colors">
                  Жюри и эксперты
                </a>
              </li>
              <li>
                <a href="#about-shki" className="hover:text-[#00F0FF] transition-colors">
                  О Школе креативных индустрий & Площадки
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#00F0FF] transition-colors">
                  Вопросы и ответы (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts & Official Links */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Контакты и площадки</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                <span>{festivalInfo.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00F0FF] flex-shrink-0" />
                <a href={`tel:${festivalInfo.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {festivalInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF007A] flex-shrink-0" />
                <a href={`mailto:${festivalInfo.email}`} className="hover:text-white transition-colors">
                  {festivalInfo.email}
                </a>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-2">
              <a
                href="https://shki75.zabcult.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141935] hover:bg-[#1f2650] border border-[#293264] text-xs font-semibold text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Первоисточник shki75.zabcult.ru</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              {/* Admin Login Button */}
              {isAdmin ? (
                <button
                  onClick={onOpenAdminDashboard}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-xs font-bold text-[#00F0FF] transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Панель администратора</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141935] hover:bg-[#1f2650] border border-[#293264] text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Вход для оргкомитета</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © 2024–2026 {festivalInfo.fullName}. Все права защищены.
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <button
                onClick={onOpenAdminDashboard}
                className="text-[11px] text-[#00F0FF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3" /> Управление сайтом
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                Вход администратора
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141935] hover:bg-[#202750] text-gray-300 hover:text-white border border-[#232a52] transition-colors"
            >
              <span>Наверх</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

