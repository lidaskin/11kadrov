import React, { useState } from 'react';
import { useFestival } from '../context/FestivalContext';
import { Lock, KeyRound, AlertCircle, CheckCircle2, X, Shield, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const { login } = useFestival();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Пожалуйста, введите пароль администратора');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await login(password);
      if (ok) {
        setIsSuccess(true);
        setError('');
        setTimeout(() => {
          setIsSuccess(false);
          setPassword('');
          onClose();
          if (onSuccessLogin) onSuccessLogin();
        }, 700);
      } else {
        setError('Неверный пароль администратора');
      }
    } catch {
      setError('Ошибка авторизации. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e122e] border-2 border-[#2b3978] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#171d45] hover:bg-[#FF007A] text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#00F0FF] to-[#0072FF] text-black shadow-lg shadow-[#00F0FF]/25">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider bg-[#00F0FF]/10 px-2.5 py-0.5 rounded-full border border-[#00F0FF]/20 mb-1">
              <Shield className="w-3 h-3" /> Доступ оргкомитета
            </div>
            <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
              Вход в админ-панель
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
          Панель управления позволяет редактировать даты, расписание, номинации, жюри, контакты и просматривать поступившие заявки участников.
        </p>

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0 animate-bounce" />
            <div className="text-sm font-bold">Вход выполнен успешно! Загрузка панели...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Пароль администратора:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Введите пароль..."
                  autoFocus
                  className="w-full pl-10 pr-11 py-3 bg-[#14193d] border border-[#2c3870] focus:border-[#00F0FF] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
                  title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FF007A]/10 border border-[#FF007A]/30 text-[#FF007A] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-sm shadow-lg shadow-[#00F0FF]/25 hover:shadow-[#00F0FF]/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Проверка пароля...' : 'Войти в систему управления'}</span>
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-[#1d2554] text-center text-xs text-gray-500">
          <span className="text-[11px] flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-[#00F0FF]" /> Доступ защищен паролем оргкомитета
          </span>
        </div>
      </div>
    </div>
  );
};
