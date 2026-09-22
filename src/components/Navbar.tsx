import React, { useState, useEffect } from 'react';
import { FestivalLogo } from './FestivalLogo';
import {
  Menu,
  X,
  Calendar,
  Award,
  Users,
  Film,
  Sparkles,
  Bookmark,
  MapPin,
  FileText,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  onOpenApply?: (preselectedNomination?: string) => void;
  savedCount: number;
  onOpenFavorites: () => void;
  onOpenRegulation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenFavorites,
  onOpenRegulation,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Программа', href: '#schedule', icon: Calendar },
    { label: 'Номинации', href: '#nominations', icon: Award },
    { label: 'Лаборатория', href: '#mini-studio', icon: Sparkles },
    { label: 'Панорама работ', href: '#gallery', icon: Film },
    { label: 'Жюри', href: '#jury', icon: Users },
    { label: 'О ШКИ', href: '#about-shki', icon: MapPin },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090b16]/90 backdrop-blur-md border-b border-[#21274a] shadow-xl py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center group transition-transform hover:scale-105">
            <FestivalLogo size="md" animate={true} />
          </a>

          {/* Desktop Nav Links - Designer Floating Capsule Dock */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-[#101432]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-[#00F0FF]/15">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-gray-300 hover:text-white flex items-center gap-1.5 transition-all duration-200 hover:bg-white/10 group"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00F0FF] group-hover:scale-110 transition-all duration-200" />
                  <span>{link.label}</span>
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-0.5 rounded-full bg-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}

            {onOpenRegulation && (
              <>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button
                  onClick={onOpenRegulation}
                  className="relative px-3.5 py-1.5 rounded-full text-xs font-bold text-[#00F0FF] bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 hover:border-[#00F0FF]/60 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.12)] group cursor-pointer"
                  title="Ознакомиться с Положением о фестивале"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#00F0FF] group-hover:scale-110 transition-transform" />
                  <span>Положение (Читать)</span>
                </button>
              </>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Bookmarks / Favorites button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-xl bg-[#171b36] hover:bg-[#232952] border border-[#2b3363] text-gray-200 hover:text-[#FFD600] transition-colors cursor-pointer"
              title="Мое расписание"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF007A] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-[#0b0c16] animate-bounce">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-lg bg-[#171b36] text-gray-200 border border-[#2b3363]"
              title="Мое расписание"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF007A] text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#171b36] text-gray-200 border border-[#2b3363] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e1d] border-b border-[#21274a] px-5 py-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-gray-200 hover:bg-[#1a2042] hover:text-[#00F0FF] transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#00F0FF]" />
                  <span>{link.label}</span>
                </a>
              );
            })}

            {onOpenRegulation && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegulation();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-gray-200 hover:bg-[#1a2042] hover:text-[#00F0FF] transition-colors text-left"
              >
                <BookOpen className="w-5 h-5 text-[#00F0FF]" />
                <span>Положение о фестивале (Читать онлайн)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

