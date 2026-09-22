import React, { useState, useEffect } from 'react';
import { useFestival } from '../context/FestivalContext';
import { ApplicationFormData } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import {
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Film,
  Users,
  UserCheck,
  Sparkles,
  X,
  ShieldAlert,
  FileCheck,
  Clapperboard,
  Tv,
  HelpCircle,
  Copy,
  Printer,
  Check,
  FolderArchive,
  Image as ImageIcon,
  Mail,
  Loader2,
  Download,
  AlertTriangle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNomination?: string;
}

const OFFICIAL_EMAIL = 'chita11kadrov@mail.ru';

const ANIMATION_TECHNIQUES = [
  'Рисованная 2D-анимация (покадровая)',
  'Компьютерная 2D-анимация (векторная / перекладка)',
  '3D компьютерная анимация (CGI)',
  'Пластилиновая анимация (Claymation)',
  'Кукольная и предметная Stop-motion анимация',
  'Сыпучая / Песочная анимация',
  'Motion-дизайн и шрифтовая графика',
  'VFX и совмещенная съемка',
  'Экспериментальная / Смешанная техника (Mixed Media)',
  'Другая техника',
];

const AGE_RATINGS = ['0+', '6+', '12+', '16+', '18+'];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  initialNomination,
}) => {
  const { nominations, addApplication } = useFestival();
  const [step, setStep] = useState<number>(1);
  const [ticketId, setTicketId] = useState<string>('');
  const [copiedTicket, setCopiedTicket] = useState<boolean>(false);
  const [copiedFullText, setCopiedFullText] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'success' | 'warning'>('idle');

  const [formData, setFormData] = useState<ApplicationFormData>({
    agreePersonalData: false,

    // Информация о конкурсном фильме
    participationCategory: 'short_film',
    workTitle: '',
    studioOrAuthor: '',
    duration: '',
    nomination: initialNomination || '2D-анимация',
    filmAgeRating: '6+',
    animationTechnique: 'Рисованная 2D-анимация (покадровая)',
    synopsis: '',

    // Информация о творческой группе
    director: '',
    screenwriter: '',
    artDirector: '',
    voiceActors: '',
    composer: '',
    copyrightHolder: '',

    // Необходимые ссылки и файлы
    videoLink: '',
    posterLink: '',
    framesLinks: '',

    // Информация о заявителе
    applicantName: '',
    participantAgeCategory: 'II',
    workplaceAndPosition: '',
    city: 'Чита',
    phone: '',
    email: '',

    // Подтверждения
    copyrightConfirmed: false,
    agreeRules: false,
  });

  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [consentError, setConsentError] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialNomination) {
      setFormData((prev) => ({ ...prev, nomination: initialNomination }));
    }
  }, [initialNomination]);

  // Validate Step 1 (Consent + Film details)
  const validateStep1 = () => {
    const err: Record<string, string> = {};

    if (!consentGiven && !formData.agreePersonalData) {
      setConsentError('Для продолжения необходимо дать согласие на обработку персональных данных');
      return false;
    } else {
      setConsentError('');
    }

    if (!formData.workTitle.trim()) {
      err.workTitle = 'Укажите название фильма';
    }
    if (!formData.studioOrAuthor.trim()) {
      err.studioOrAuthor = 'Укажите название студии производителя или физ. лицо';
    }
    if (!formData.duration.trim()) {
      err.duration = 'Укажите продолжительность фильма (например: 04:30)';
    }
    if (!formData.nomination.trim()) {
      err.nomination = 'Выберите номинацию';
    }
    if (!formData.animationTechnique.trim()) {
      err.animationTechnique = 'Укажите анимационную технику создания';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Validate Step 2 (Creative team)
  const validateStep2 = () => {
    const err: Record<string, string> = {};
    if (!formData.director.trim()) {
      err.director = 'Укажите режиссера фильма';
    }
    if (!formData.copyrightHolder.trim()) {
      err.copyrightHolder = 'Укажите правообладателя фильма (студия, продюсер или автор)';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Validate Step 3 (Links & Applicant details)
  const validateStep3 = () => {
    const err: Record<string, string> = {};
    if (!formData.videoLink.trim() || !formData.videoLink.startsWith('http')) {
      err.videoLink = 'Укажите ссылку на онлайн просмотр или скачивание фильма (http:// или https://)';
    }
    if (!formData.framesLinks.trim()) {
      err.framesLinks = 'Укажите ссылку на кадры из фильма (не менее 3 кадров)';
    }
    if (!formData.applicantName.trim()) {
      err.applicantName = 'Укажите ФИО заявителя';
    }
    if (!formData.city.trim()) {
      err.city = 'Укажите город';
    }
    if (!formData.phone.trim()) {
      err.phone = 'Укажите контактный телефон';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      err.email = 'Укажите корректный e-mail';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Validate Step 4 (Final confirmations)
  const validateStep4 = () => {
    const err: Record<string, string> = {};
    if (!formData.copyrightConfirmed) {
      err.copyrightConfirmed = 'Необходимо подтвердить разрешение правообладателя';
    }
    if (!formData.agreeRules) {
      err.agreeRules = 'Необходимо согласие с условиями регламента';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'short_film') return 'Короткометражный мультфильм (конкурсная программа)';
    if (cat === 'series') return 'Анимационный сериал (конкурсная программа)';
    return 'Другой формат (внеконкурсная программа)';
  };

  const getAgeCategoryLabel = (cat: string) => {
    if (cat === 'I') return 'I – младшая (до 11 лет)';
    if (cat === 'II') return 'II – средняя (от 12 лет)';
    return 'III – старшая (от 18 лет)';
  };

  // Prepare full formatted email text body
  const prepareEmailBody = (regId: string) => {
    return `ЗАЯВКА НА УЧАСТИЕ В ФЕСТИВАЛЕ «11 КАДРОВ»
Регистрационный номер: ${regId}
Дата и время подачи: ${new Date().toLocaleString('ru-RU')}
Получатель (оргкомитет): ${OFFICIAL_EMAIL}

========================================
1. ИНФОРМАЦИЯ О КОНКУРСНОМ ФИЛЬМЕ:
========================================
- Категория: ${getCategoryLabel(formData.participationCategory)}
- Название фильма: «${formData.workTitle}»
- Студия / Автор (физ. лицо): ${formData.studioOrAuthor}
- Продолжительность: ${formData.duration}
- Номинация: ${formData.nomination}
- Возрастная категория фильма: ${formData.filmAgeRating}
- Анимационная техника: ${formData.animationTechnique}
- Синопсис / Аннотация: ${formData.synopsis || 'Не указан'}

========================================
2. ТВОРЧЕСКАЯ ГРУППА:
========================================
- Режиссер: ${formData.director}
- Автор сценария: ${formData.screenwriter || 'Не указан'}
- Художник-постановщик: ${formData.artDirector || 'Не указан'}
- Композитор / Звук: ${formData.composer || 'Не указан'}
- Актеры озвучивания: ${formData.voiceActors || 'Не указаны'}
- Правообладатель: ${formData.copyrightHolder}

========================================
3. ССЫЛКИ И МАТЕРИАЛЫ:
========================================
- Ссылка на просмотр/скачивание фильма: ${formData.videoLink}
- Ссылка на постер: ${formData.posterLink || 'Не прикреплен'}
- Ссылка на кадры из фильма (не менее 3): ${formData.framesLinks}

========================================
4. ИНФОРМАЦИЯ О ЗАЯВИТЕЛЕ:
========================================
- ФИО заявителя: ${formData.applicantName}
- Возрастная категория участников: ${getAgeCategoryLabel(formData.participantAgeCategory)}
- Место работы / Должность / Школа: ${formData.workplaceAndPosition || 'Не указано'}
- Город / Регион: ${formData.city}
- Телефон: ${formData.phone}
- E-mail заявителя: ${formData.email}

========================================
5. СОГЛАСИЯ И РЕГЛАМЕНТ:
========================================
- Согласие на обработку персональных данных (ГПОУ ЗКУК): ДА
- Разрешение правообладателя подтверждено: ДА
- Согласие с условиями регламента фестиваля: ДА
`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setIsSubmitting(true);

    // Generate unique ticket number
    const generatedId = `11K-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedId);

    const emailBody = prepareEmailBody(generatedId);
    const emailSubject = `Заявка на фестиваль 11 кадров: «${formData.workTitle}» [${generatedId}]`;

    try {
      // 1. Send to internal Cloud SQL Database & Mailer service
      let backendSuccess = false;
      try {
        const serverPayload = {
          id: generatedId,
          authorName: formData.applicantName || formData.director || 'Заявитель',
          birthDate: '',
          city: formData.city || '',
          organization: formData.studioOrAuthor || formData.workplaceAndPosition || '',
          phone: formData.phone || '',
          email: formData.email || '',
          telegram: '',
          workTitle: formData.workTitle || 'Конкурсная работа',
          nominationId: formData.nomination || 'main',
          nominationTitle: formData.nomination || 'Основная номинация',
          duration: formData.duration || '',
          description: formData.synopsis || '',
          link: formData.videoLink || '',
          technique: formData.animationTechnique || '',
          consent: true,
        };

        const serverRes = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serverPayload),
        });

        if (serverRes.ok) {
          const resData = await serverRes.json();
          if (resData.success) {
            backendSuccess = true;
            setDeliveryStatus('success');
          }
        }
      } catch (beErr) {
        console.warn('Internal mailer/db request warning:', beErr);
      }

      // 2. FormSubmit backup redundancy to chita11kadrov@mail.ru
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('_subject', emailSubject);
        formDataToSend.append('_replyto', formData.email);
        formDataToSend.append('_captcha', 'false');
        formDataToSend.append('_template', 'table');
        formDataToSend.append('Регистрационный номер', generatedId);
        formDataToSend.append('Название фильма', formData.workTitle);
        formDataToSend.append('Категория фильма', getCategoryLabel(formData.participationCategory));
        formDataToSend.append('Номинация', formData.nomination);
        formDataToSend.append('Студия / Автор', formData.studioOrAuthor);
        formDataToSend.append('Хронометраж', formData.duration);
        formDataToSend.append('Возрастной рейтинг', formData.filmAgeRating);
        formDataToSend.append('Техника анимации', formData.animationTechnique);
        formDataToSend.append('Синопсис', formData.synopsis || '—');
        formDataToSend.append('Режиссер', formData.director);
        formDataToSend.append('Автор сценария', formData.screenwriter || '—');
        formDataToSend.append('Художник-постановщик', formData.artDirector || '—');
        formDataToSend.append('Композитор / Звук', formData.composer || '—');
        formDataToSend.append('Актеры озвучки', formData.voiceActors || '—');
        formDataToSend.append('Правообладатель', formData.copyrightHolder);
        formDataToSend.append('Ссылка на фильм (просмотр/скачивание)', formData.videoLink);
        formDataToSend.append('Ссылка на постер', formData.posterLink || '—');
        formDataToSend.append('Ссылка на кадры (не менее 3)', formData.framesLinks);
        formDataToSend.append('Заявитель (ФИО)', formData.applicantName);
        formDataToSend.append('Возрастная категория участников', getAgeCategoryLabel(formData.participantAgeCategory));
        formDataToSend.append('Место работы / Школа / Должность', formData.workplaceAndPosition || '—');
        formDataToSend.append('Город', formData.city);
        formDataToSend.append('Телефон заявителя', formData.phone);
        formDataToSend.append('Email заявителя', formData.email);
        formDataToSend.append('Полный текст заявки', emailBody);

        const response = await fetch(`https://formsubmit.co/ajax/${OFFICIAL_EMAIL}`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          setDeliveryStatus('success');
        } else if (!backendSuccess) {
          setDeliveryStatus('warning');
        }
      } catch {
        if (!backendSuccess) {
          setDeliveryStatus('warning');
        }
      }
    } catch {
      setDeliveryStatus('warning');
    } finally {
      setIsSubmitting(false);
      setStep(5);

      // Save application to local archive and context
      addApplication({
        id: generatedId,
        date: new Date().toISOString(),
        status: 'pending',
        ...formData,
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF007A', '#00F0FF', '#FFD600', '#FF7A00', '#FFFFFF'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleCopyTicket = async () => {
    await copyToClipboard(ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const handleCopyFullText = async () => {
    await copyToClipboard(prepareEmailBody(ticketId));
    setCopiedFullText(true);
    setTimeout(() => setCopiedFullText(false), 2500);
  };

  const handleDownloadTxt = () => {
    const text = prepareEmailBody(ticketId);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Заявка_11Кадров_${formData.workTitle.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_') || 'фильм'}_${ticketId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Direct WebMail composers
  const subjectEncoded = encodeURIComponent(`Заявка на конкурс «11 кадров»: «${formData.workTitle}» (${ticketId})`);
  const bodyEncoded = encodeURIComponent(prepareEmailBody(ticketId));

  const openMailRuWeb = () => {
    window.open(`https://e.mail.ru/compose?to=${OFFICIAL_EMAIL}&subject=${subjectEncoded}&body=${bodyEncoded}`, '_blank');
  };

  const openYandexWeb = () => {
    window.open(`https://mail.yandex.ru/compose?to=${OFFICIAL_EMAIL}&subject=${subjectEncoded}&body=${bodyEncoded}`, '_blank');
  };

  const openGmailWeb = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${OFFICIAL_EMAIL}&su=${subjectEncoded}&body=${bodyEncoded}`, '_blank');
  };

  const openDefaultMailClient = () => {
    window.open(`mailto:${OFFICIAL_EMAIL}?subject=${subjectEncoded}&body=${bodyEncoded}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#10132b] border border-[#2d3770] rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl relative my-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-[#1b2046] hover:bg-[#252d62] text-gray-400 hover:text-white transition-colors"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF007A]/15 border border-[#FF007A]/30 text-[#FF007A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Онлайн-заявка на конкурс «11 кадров»
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-display">
            {step === 5 ? 'Заявка оформлена!' : 'Форма участия в фестивале'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-1.5 flex-wrap">
            {step === 5 ? (
              <span>Ваша работа зарегистрирована в реестре фестиваля «11 кадров»</span>
            ) : (
              <>
                <span>Заявка отправляется в оргкомитет на почту:</span>
                <span className="inline-flex items-center gap-1 text-[#00F0FF] font-bold bg-[#0c102a] px-2 py-0.5 rounded-md border border-[#232c66]">
                  <Mail className="w-3 h-3" /> {OFFICIAL_EMAIL}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Wizard Stepper Progress Bar */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#212854] -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#FF007A] via-[#00F0FF] to-[#FFD600] -translate-y-1/2 -z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Фильм' },
              { num: 2, label: 'Команда' },
              { num: 3, label: 'Материалы' },
              { num: 4, label: 'Отправка' },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.num
                      ? 'bg-gradient-to-r from-[#FF007A] to-[#00F0FF] text-white shadow-lg shadow-[#FF007A]/30'
                      : 'bg-[#181d3d] border border-[#2b356c] text-gray-400'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-300 mt-1.5 whitespace-nowrap">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: Согласие на ОПД + Информация о конкурсном фильме                  */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Mandatory Personal Data Consent Notice Before Questions */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                consentError
                  ? 'bg-[#261022] border-[#FF007A] shadow-lg shadow-[#FF007A]/20'
                  : consentGiven || formData.agreePersonalData
                  ? 'bg-[#0f1d38]/90 border-[#00F0FF]/50 shadow-md shadow-[#00F0FF]/10'
                  : 'bg-[#0c102b] border-[#253069]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    consentGiven || formData.agreePersonalData
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                      : 'bg-[#FFD600]/20 text-[#FFD600]'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-100 leading-relaxed mb-3">
                    Перед заполнением заявления Вы должны дать свое согласие на обработку персональных данных, поставив отметку ниже:
                  </p>

                  <div className="bg-[#080a1d] p-3.5 sm:p-4 rounded-xl border border-[#1f2858] space-y-2.5 text-xs text-gray-300 leading-relaxed mb-3 max-h-48 overflow-y-auto custom-scrollbar">
                    <p>
                      <strong>Настоящим подтверждаю</strong>, что все сведения, содержащиеся в настоящем согласии и сведения, которые будут даны мною после него, являются принадлежащими мне персональными данными, которые я в своих интересах и по доброй воле передаю для дальнейшей обработки оператору – <strong>ГПОУ Забайкальское краевое училище культуры</strong> (далее – оператор).
                    </p>
                    <p>
                      Я согласен с тем, что на период участия в III Дальневосточном фестивале креативной анимации «11КАДРОВ» и до окончания установленного законом срока размещения персональных данных, все переданные мной оператору персональные данные, являются общедоступными и могут быть размещены на официальном сайте оператора в той части, в которой это необходимо для достижения определенной данным согласием цели.
                    </p>
                    <p>
                      Я понимаю, и согласен с тем, что при передаче моих персональных данных оператору, служащие и работники государственных органов власти, служащие и работники органов местного самоуправления, работники иных учреждений, задействованные в соответствии с законом или иными нормативными правовыми актами, освобождаются от обязательств конфиденциальности перед оператором.
                    </p>
                    <p>
                      Я вправе отозвать свое согласие на обработку персональных данных в любое время посредством соответствующего письменного заявления, которое должно быть направлено оператору заказным письмом с уведомлением о вручении либо передано под расписку представителю оператора.
                    </p>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group select-none bg-[#11173b] p-3 rounded-xl border border-[#2b3879] hover:border-[#00F0FF] transition-all">
                    <input
                      type="checkbox"
                      checked={consentGiven || formData.agreePersonalData}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setConsentGiven(checked);
                        setFormData((prev) => ({ ...prev, agreePersonalData: checked }));
                        if (checked) setConsentError('');
                      }}
                      className="w-5 h-5 rounded accent-[#00F0FF] cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                      Я согласен на передачу персональных данных
                    </span>
                  </label>

                  {consentError && (
                    <p className="text-[#FF007A] text-xs font-bold mt-2 flex items-center gap-1.5 animate-in fade-in">
                      <span>⚠️</span> {consentError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Блок: Информация о конкурсном фильме */}
            <div className="border-t border-[#202854] pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00F0FF]">
                  Информация о конкурсном фильме
                </h3>
              </div>

              {/* Категория участия */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Категория фильма *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'short_film',
                      label: 'Короткометражный мультфильм',
                      sub: 'Конкурсная программа',
                      icon: Film,
                    },
                    {
                      id: 'series',
                      label: 'Анимационный сериал',
                      sub: 'Конкурсная программа',
                      icon: Tv,
                    },
                    {
                      id: 'other_noncomp',
                      label: 'Другой формат',
                      sub: 'Внеконкурсная программа',
                      icon: Clapperboard,
                    },
                  ].map((cat) => {
                    const isSelected = formData.participationCategory === cat.id;
                    const IconComp = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            participationCategory: cat.id as ApplicationFormData['participationCategory'],
                          })
                        }
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#152347] border-[#00F0FF] text-white shadow-md shadow-[#00F0FF]/15'
                            : 'bg-[#0a0c20] border-[#222b5e] text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#00F0FF]' : 'text-gray-400'}`} />
                          <span className="text-xs font-bold text-white">{cat.label}</span>
                        </div>
                        <span className="text-[10px] text-[#FFD600] font-semibold">{cat.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Название фильма и Название студии/физ. лицо */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Название фильма *
                  </label>
                  <input
                    type="text"
                    value={formData.workTitle}
                    onChange={(e) => setFormData({ ...formData, workTitle: e.target.value })}
                    placeholder="Например: Легенды Багулового края"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.workTitle && <p className="text-[#FF007A] text-xs mt-1">{errors.workTitle}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Название студии производителя / физ. лицо *
                  </label>
                  <input
                    type="text"
                    value={formData.studioOrAuthor}
                    onChange={(e) => setFormData({ ...formData, studioOrAuthor: e.target.value })}
                    placeholder="Студия «Анима» / Иванов А. В."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.studioOrAuthor && (
                    <p className="text-[#FF007A] text-xs mt-1">{errors.studioOrAuthor}</p>
                  )}
                </div>
              </div>

              {/* Продолжительность, Номинация, Возрастная категория */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Продолжительность *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="04:30 (мин:сек)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.duration && <p className="text-[#FF007A] text-xs mt-1">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Номинация *
                  </label>
                  <select
                    value={formData.nomination}
                    onChange={(e) => setFormData({ ...formData, nomination: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    {nominations.map((n) => (
                      <option key={n.id} value={n.title}>
                        {n.title}
                      </option>
                    ))}
                    <option value="Забайкальские мотивы и краеведение">Забайкальские мотивы и краеведение</option>
                    <option value="Дебют года">Дебют года (первая работа)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Возрастная категория фильма
                  </label>
                  <select
                    value={formData.filmAgeRating}
                    onChange={(e) => setFormData({ ...formData, filmAgeRating: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    {AGE_RATINGS.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Анимационная техника создания фильма */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Анимационная техника создания фильма *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={
                      ANIMATION_TECHNIQUES.includes(formData.animationTechnique)
                        ? formData.animationTechnique
                        : 'Другая техника'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'Другая техника') {
                        setFormData({ ...formData, animationTechnique: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    {ANIMATION_TECHNIQUES.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.animationTechnique}
                    onChange={(e) => setFormData({ ...formData, animationTechnique: e.target.value })}
                    placeholder="Уточните технику или софт (TVPaint, Blender, Stop-motion...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              {/* Краткий синопсис / аннотация */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Краткий синопсис / аннотация к фильму
                </label>
                <textarea
                  rows={2}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Краткое описание сюжета и идеи фильма (для каталога фестиваля)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Далее: Творческая группа</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Информация о творческой группе                                     */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#202854] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF007A]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#FF007A]">
                  Информация о творческой группе
                </h3>
              </div>
            </div>

            <div className="bg-[#0b0e26] p-3.5 rounded-xl border border-[#242e66] text-xs text-gray-300 flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#FFD600] shrink-0" />
              <span>
                При наличии двух и более человек на одной позиции, имена и фамилии указывайте <strong>через запятую</strong>.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Режиссер *
                </label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  placeholder="Иванов И. И., Петрова А. С."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
                {errors.director && <p className="text-[#FF007A] text-xs mt-1">{errors.director}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Автор сценария
                </label>
                <input
                  type="text"
                  value={formData.screenwriter}
                  onChange={(e) => setFormData({ ...formData, screenwriter: e.target.value })}
                  placeholder="Смирнов В. М."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Художник-постановщик
                </label>
                <input
                  type="text"
                  value={formData.artDirector}
                  onChange={(e) => setFormData({ ...formData, artDirector: e.target.value })}
                  placeholder="Кузнецова Е. Д."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Композитор / Звукорежиссер
                </label>
                <input
                  type="text"
                  value={formData.composer}
                  onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
                  placeholder="Васильев К. Р."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Актеры, озвучивающие фильм
              </label>
              <input
                type="text"
                value={formData.voiceActors}
                onChange={(e) => setFormData({ ...formData, voiceActors: e.target.value })}
                placeholder="Анна Сидорова (Маша), Михаил Орлов (Медведь)..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Правообладатель *
              </label>
              <input
                type="text"
                value={formData.copyrightHolder}
                onChange={(e) => setFormData({ ...formData, copyrightHolder: e.target.value })}
                placeholder="ФИО автора или наименование студии / продюсерского центра"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
              {errors.copyrightHolder && (
                <p className="text-[#FF007A] text-xs mt-1">{errors.copyrightHolder}</p>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-[#1a2046] text-gray-300 text-xs font-bold flex items-center gap-1.5 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Далее: Ссылки и заявитель</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Необходимые ссылки, файлы и информация о заявителе                */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Блок ссылок на материалы */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#202854] pb-2">
                <UploadCloud className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00F0FF]">
                  Необходимые ссылки и файлы
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Ссылка на онлайн просмотр или скачивание просмотровой версии фильма *
                </label>
                <input
                  type="url"
                  value={formData.videoLink}
                  onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  placeholder="https://disk.yandex.ru/... или Google Drive / VK Видео / Rutube"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
                {errors.videoLink && <p className="text-[#FF007A] text-xs mt-1">{errors.videoLink}</p>}
                <p className="text-[11px] text-gray-400 mt-1">
                  Убедитесь, что ссылка открыта для просмотра без пароля (Яндекс.Диск, Google Drive, VK Видео, Rutube, Mail.ru).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FFD600]" /> Постер фильма (при наличии)
                  </label>
                  <input
                    type="text"
                    value={formData.posterLink}
                    onChange={(e) => setFormData({ ...formData, posterLink: e.target.value })}
                    placeholder="Ссылка на файл постера в облаке"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FolderArchive className="w-3.5 h-3.5 text-[#FF007A]" /> Кадры из фильма (не менее 3) *
                  </label>
                  <input
                    type="text"
                    value={formData.framesLinks}
                    onChange={(e) => setFormData({ ...formData, framesLinks: e.target.value })}
                    placeholder="Ссылка на папку с кадрами или скриншотами"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.framesLinks && (
                    <p className="text-[#FF007A] text-xs mt-1">{errors.framesLinks}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Блок информации о заявителе */}
            <div className="border-t border-[#202854] pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#FFD600]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#FFD600]">
                  Информация о заявителе (кто заполнил заявку)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    ФИО заявителя *
                  </label>
                  <input
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder="Иванов Иван Алексеевич"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.applicantName && (
                    <p className="text-[#FF007A] text-xs mt-1">{errors.applicantName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Возрастная категория участников *
                  </label>
                  <select
                    value={formData.participantAgeCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        participantAgeCategory: e.target.value as ApplicationFormData['participantAgeCategory'],
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="I">I – младшая (до 11 лет)</option>
                    <option value="II">II – средняя (от 12 лет)</option>
                    <option value="III">III – старшая (от 18-лет)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Место работы и должность / Школа
                  </label>
                  <input
                    type="text"
                    value={formData.workplaceAndPosition}
                    onChange={(e) => setFormData({ ...formData, workplaceAndPosition: e.target.value })}
                    placeholder="ШКИ Чита, педагог / Студент / Ученик"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Город *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Чита, Улан-Удэ, Владивосток..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.city && <p className="text-[#FF007A] text-xs mt-1">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.phone && <p className="text-[#FF007A] text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="applicant@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0f24] border border-[#262f62] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                  />
                  {errors.email && <p className="text-[#FF007A] text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-[#1a2046] text-gray-300 text-xs font-bold flex items-center gap-1.5 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setStep(4);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Далее: Отправка заявки</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: Подтверждения регламента, прав и отправка на email                */}
        {/* ========================================================================= */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Сводная карточка заявки перед отправкой */}
            <div className="bg-[#0a0c20] p-4 sm:p-5 rounded-2xl border border-[#252f66] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#1c2452] pb-2.5">
                <span className="text-xs font-extrabold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" /> Сводка заявки перед отправкой
                </span>
                <span className="text-xs text-[#FFD600] font-bold px-2 py-0.5 bg-[#FFD600]/10 rounded-md border border-[#FFD600]/30">
                  {formData.nomination}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block">Фильм:</span>
                  <span className="font-bold text-white text-sm">«{formData.workTitle}»</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Студия / Автор:</span>
                  <span className="font-semibold text-gray-200">{formData.studioOrAuthor}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Режиссер:</span>
                  <span className="font-semibold text-gray-200">{formData.director}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Правообладатель:</span>
                  <span className="font-semibold text-gray-200">{formData.copyrightHolder}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Заявитель:</span>
                  <span className="font-semibold text-white">{formData.applicantName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Адрес оргкомитета:</span>
                  <span className="font-mono text-[#00F0FF] font-semibold">{OFFICIAL_EMAIL}</span>
                </div>
              </div>
            </div>

            {/* Юридические подтверждения */}
            <div className="space-y-3.5 bg-[#0d122e] p-4 sm:p-5 rounded-2xl border border-[#222c60]">
              <div className="text-xs text-gray-300 leading-relaxed space-y-1 bg-[#060817] p-3.5 rounded-xl border border-[#1b224c]">
                <p className="font-medium text-gray-200">
                  <strong>Заявитель подтверждает</strong>, что правообладатель дал разрешение на участие указанного в заявке фильма в программе фестиваля.
                </p>
                <p className="text-gray-400">
                  Подача электронной заявки на участие в фестивале означает согласие правообладателя с условиями регламента.
                </p>
              </div>

              {/* Чекбокс 1: Разрешение правообладателя */}
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={formData.copyrightConfirmed}
                  onChange={(e) =>
                    setFormData({ ...formData, copyrightConfirmed: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded accent-[#00F0FF] cursor-pointer"
                />
                <span className="text-xs text-gray-300 group-hover:text-white leading-relaxed">
                  Подтверждаю, что правообладатель дал разрешение на участие фильма «{formData.workTitle || '...' }» в фестивале «11 кадров». *
                </span>
              </label>
              {errors.copyrightConfirmed && (
                <p className="text-[#FF007A] text-xs">{errors.copyrightConfirmed}</p>
              )}

              {/* Чекбокс 2: Согласие с регламентом */}
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={formData.agreeRules}
                  onChange={(e) => setFormData({ ...formData, agreeRules: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded accent-[#00F0FF] cursor-pointer"
                />
                <span className="text-xs text-gray-300 group-hover:text-white leading-relaxed">
                  Я прочитал(а) и согласен(на) c условиями регламента фестиваля. *
                </span>
              </label>
              {errors.agreeRules && (
                <p className="text-[#FF007A] text-xs">{errors.agreeRules}</p>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl bg-[#1a2046] text-gray-300 text-xs font-bold flex items-center gap-1.5 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF007A] via-[#FF7A00] to-[#FFD600] text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#FF007A]/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Отправка на {OFFICIAL_EMAIL}...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Отправить заявку на {OFFICIAL_EMAIL}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: Успешное подтверждение, регистрационный талон и варианты отправки */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#00F0FF] to-[#FF007A] p-0.5 shadow-xl shadow-[#00F0FF]/25">
              <div className="w-full h-full bg-[#10132b] rounded-[22px] flex items-center justify-center text-[#00F0FF]">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display mb-1.5">
                Заявка зарегистрирована!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                Сведения о конкурсном фильме <strong className="text-white">«{formData.workTitle}»</strong> сохранены в реестре.
              </p>
            </div>

            {/* Информационное уведомление об отправке на chita11kadrov@mail.ru */}
            <div className="bg-[#12193b] border border-[#00F0FF]/40 rounded-2xl p-4 sm:p-5 text-left max-w-xl mx-auto space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs text-gray-200 leading-relaxed">
                  <p className="font-bold text-white text-sm mb-1">
                    Отправка на почту оргкомитета: <span className="text-[#00F0FF] font-mono">{OFFICIAL_EMAIL}</span>
                  </p>
                  <p className="text-gray-300">
                    Электронная форма отправлена на сервер рассылки. Для гарантированной мгновенной доставки (без задержек спам-фильтров Mail.ru) вы можете также открыть готовое письмо в 1 клик через свой почтовый сервис:
                  </p>
                </div>
              </div>

              {/* Кнопки мгновенного открытия в веб-почте */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  onClick={openMailRuWeb}
                  className="px-3 py-2 rounded-xl bg-[#005FF9] hover:bg-[#004ec9] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Mail.ru</span>
                </button>

                <button
                  type="button"
                  onClick={openYandexWeb}
                  className="px-3 py-2 rounded-xl bg-[#FC3F1D] hover:bg-[#e03415] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Яндекс</span>
                </button>

                <button
                  type="button"
                  onClick={openGmailWeb}
                  className="px-3 py-2 rounded-xl bg-[#EA4335] hover:bg-[#cf3528] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={openDefaultMailClient}
                  className="px-3 py-2 rounded-xl bg-[#283266] hover:bg-[#344185] text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#4353a4] transition-all hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Почтовик</span>
                </button>
              </div>

              <div className="border-t border-[#232f64] pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                <span>💡 Текст письма уже полностью сформирован и заполнен.</span>
                <button
                  type="button"
                  onClick={handleCopyFullText}
                  className="text-[#FFD600] hover:text-white flex items-center gap-1 font-semibold underline underline-offset-2"
                >
                  {copiedFullText ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copiedFullText ? 'Текст скопирован!' : 'Скопировать весь текст заявки'}
                </button>
              </div>
            </div>

            {/* Официальный электронный талон участника */}
            <div className="bg-[#0b0e26] border-2 border-dashed border-[#00F0FF]/40 rounded-2xl p-5 sm:p-6 text-left max-w-xl mx-auto shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#212b5c] pb-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    Электронный талон участника
                  </span>
                  <span className="text-sm font-black text-[#00F0FF]">
                    III Фестиваль «11 кадров» 2026
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Официальный адрес:</span>
                  <span className="text-xs font-mono font-bold text-[#FFD600]">{OFFICIAL_EMAIL}</span>
                </div>
              </div>

              <div className="bg-[#14193b] p-3 rounded-xl flex items-center justify-between border border-[#2c3770] mb-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">
                    Регистрационный номер
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-wider">
                    {ticketId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="px-3 py-1.5 rounded-lg bg-[#222c60] hover:bg-[#2e3b80] text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedTicket ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300 border-t border-[#202956] pt-3">
                <p>
                  <strong className="text-white">Фильм:</strong> «{formData.workTitle}»
                </p>
                <p>
                  <strong className="text-white">Номинация:</strong> {formData.nomination}
                </p>
                <p>
                  <strong className="text-white">Режиссер:</strong> {formData.director}
                </p>
                <p>
                  <strong className="text-white">Заявитель:</strong> {formData.applicantName} ({formData.phone}, {formData.email})
                </p>
              </div>
            </div>

            {/* Дополнительные действия: Скачать файл заявки, печать и закрыть */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1d2657] hover:bg-[#28357a] border border-[#3b4b9b] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-[#00F0FF]" />
                <span>Скачать заявку (.txt)</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#161a3d] hover:bg-[#202657] border border-[#2b356c] text-gray-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Распечатать талон</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-xs transition-all hover:opacity-90 shadow-md"
              >
                Завершить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
