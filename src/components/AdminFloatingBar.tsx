import React from 'react';
import { useFestival } from '../context/FestivalContext';
import { ShieldCheck, Settings, LogOut } from 'lucide-react';

interface AdminFloatingBarProps {
  onOpenDashboard: () => void;
}

export const AdminFloatingBar: React.FC<AdminFloatingBarProps> = ({ onOpenDashboard }) => {
  const { isAdmin, logout, applications } = useFestival();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#0b0e26]/95 backdrop-blur-md border-2 border-[#00F0FF]/60 rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-black/80 flex items-center gap-3">
        <div className="flex items-center gap-2 pl-1">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]"></span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[11px] font-extrabold text-white flex items-center gap-1 leading-none">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" /> Админ-режим
            </span>
            <span className="text-[9px] text-gray-400 mt-0.5">
              Заявок: <strong className="text-[#FFD600]">{applications.length}</strong>
            </span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-[#1e2652] hidden sm:block"></div>

        <button
          onClick={onOpenDashboard}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-[#00F0FF]/25 hover:shadow-[#00F0FF]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Панель управления</span>
        </button>

        <button
          onClick={logout}
          className="p-2 rounded-xl bg-[#14193d] hover:bg-[#FF007A] text-gray-400 hover:text-white transition-all cursor-pointer"
          title="Выйти из админки"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
