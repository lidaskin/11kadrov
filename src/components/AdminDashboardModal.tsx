import React, { useState } from 'react';
import { useFestival } from '../context/FestivalContext';
import { generateProjectZip } from '../utils/sourceDownloader';
import { downloadFile } from '../utils/downloader';
import {
  EventItem,
  Nomination,
  JuryMember,
  AnimationWork,
  FaqItem,
  StoredApplication,
  FestivalInfo,
  AnimashPlacementKey,
  AnimashSettings,
  AnimashImages,
} from '../types';
import {
  X,
  Settings,
  Calendar,
  Trophy,
  Users,
  Film,
  HelpCircle,
  Inbox,
  Save,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  KeyRound,
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  Check,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  FolderArchive,
  Code2,
  Image as ImageIcon,
  Wand2,
  Copy,
  RotateCcw,
  MessageSquare,
  Tag,
  Layers,
  CheckCheck,
  Database,
} from 'lucide-react';
import { AdminDatabaseManager } from './AdminDatabaseManager';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'info' | 'mascot' | 'schedule' | 'nominations' | 'jury' | 'gallery' | 'faqs' | 'applications' | 'database' | 'backup';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    festivalInfo,
    updateFestivalInfo,
    scheduleEvents,
    addScheduleEvent,
    updateScheduleEvent,
    deleteScheduleEvent,
    nominations,
    addNomination,
    updateNomination,
    deleteNomination,
    juryMembers,
    addJuryMember,
    updateJuryMember,
    deleteJuryMember,
    galleryWorks,
    addGalleryWork,
    updateGalleryWork,
    deleteGalleryWork,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    applications,
    updateApplicationStatus,
    deleteApplication,
    syncApplicationsFromDb,
    resendApplicationEmail,
    exportAllData,
    importAllData,
    resetToDefaults,
    changeAdminPassword,
    logout,
    animashSettings,
    updateAnimashSettings,
    updateAnimashImage,
    setAnimashImageForAll,
    resetAnimashSettings,
  } = useFestival();

  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string>('');
  const [isGeneratingZip, setIsGeneratingZip] = useState<boolean>(false);

  // Info Tab Local State
  const [infoForm, setInfoForm] = useState<FestivalInfo>(festivalInfo);

  // Mascot / Animash State
  const [mascotForm, setMascotForm] = useState<AnimashSettings>(animashSettings);
  const [newTipInput, setNewTipInput] = useState('');
  const [selectedPlacementTab, setSelectedPlacementTab] = useState<AnimashPlacementKey | 'all'>('all');
  const [editingTipIndex, setEditingTipIndex] = useState<number | null>(null);
  const [editingTipText, setEditingTipText] = useState<string>('');
  const [isPettingPreview, setIsPettingPreview] = useState<boolean>(false);

  // Sync mascot form when animashSettings updates externally
  React.useEffect(() => {
    setMascotForm(animashSettings);
  }, [animashSettings]);

  // Password Change State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Edit / Add Modal States for Sub-Entities
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventForm, setEventForm] = useState<Omit<EventItem, 'id'>>({
    title: '',
    category: 'masterclass',
    categoryLabel: 'Мастер-класс',
    day: 1,
    dateStr: '16 октября 2026 (Пятница)',
    time: '12:00',
    endTime: '13:30',
    location: 'Школа креативных индустрий',
    speaker: '',
    speakerRole: '',
    description: '',
    targetAudience: 'Для всех участников (6+)',
    tags: ['Мастер-класс'],
    capacity: 50,
  });

  // Edit Nomination State
  const [editingNom, setEditingNom] = useState<Nomination | null>(null);
  const [isAddingNom, setIsAddingNom] = useState(false);
  const [nomForm, setNomForm] = useState<Omit<Nomination, 'id'>>({
    title: '',
    code: 'NEW-NOM',
    iconName: 'Sparkles',
    color: '#00F0FF',
    description: '',
    criteria: ['Оригинальность замысла', 'Качество анимации', 'Звуковой ряд'],
    ageCategories: ['до 12 лет', '13–17 лет', '18+'],
    maxDuration: 'до 10 минут',
    formats: ['MP4', 'Full HD 1080p'],
  });

  // Edit Jury State
  const [editingJury, setEditingJury] = useState<JuryMember | null>(null);
  const [isAddingJury, setIsAddingJury] = useState(false);
  const [juryForm, setJuryForm] = useState<Omit<JuryMember, 'id'>>({
    name: '',
    role: 'Член жюри',
    company: 'Союзмультфильм / ВГИК',
    city: 'Москва',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tags: ['Режиссура', 'Анимация'],
  });

  // Edit Gallery Work State
  const [editingWork, setEditingWork] = useState<AnimationWork | null>(null);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [workForm, setWorkForm] = useState<Omit<AnimationWork, 'id'>>({
    title: '',
    author: '',
    studio: '',
    city: 'Чита',
    ageCategory: '13–17 лет',
    nomination: '2D-анимация',
    duration: '03:00',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    likes: 50,
    year: 2026,
    description: '',
  });

  // Edit FAQ State
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [faqForm, setFaqForm] = useState<FaqItem>({ q: '', a: '' });

  // Applications CRM State
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<StoredApplication | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setErrorNotice(msg);
      setTimeout(() => setErrorNotice(''), 4000);
    } else {
      setSuccessNotice(msg);
      setTimeout(() => setSuccessNotice(''), 3000);
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateFestivalInfo(infoForm);
    showNotification('Основные данные фестиваля успешно сохранены!');
  };

  // Mascot / Animash Handlers
  const handleSaveMascot = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateAnimashSettings(mascotForm);
    showNotification('Все настройки талисмана Анимаша успешно сохранены!');
  };

  const handleUpdateMascotImage = (placement: AnimashPlacementKey, url: string) => {
    const updated = {
      ...mascotForm,
      images: {
        ...mascotForm.images,
        [placement]: url,
      },
    };
    setMascotForm(updated);
    updateAnimashImage(placement, url);
    showNotification(`Изображение для «${placement}» мгновенно обновлено!`);
  };

  const handleUploadMascotImage = (placement: AnimashPlacementKey, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleUpdateMascotImage(placement, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyImageToAll = (url: string) => {
    const updated = {
      ...mascotForm,
      images: {
        default: url,
        hero: url,
        floating: url,
        card: url,
        helper: url,
      },
    };
    setMascotForm(updated);
    setAnimashImageForAll(url);
    showNotification('Новый образ Анимаша применен ко всем местам сайта!');
  };

  const handleResetPlacementImage = (placement: AnimashPlacementKey) => {
    handleUpdateMascotImage(placement, '/milash.png');
  };

  const handleResetAllMascot = () => {
    if (window.confirm('Сбросить все картинки, реплики и историю Анимаша к исходным?')) {
      resetAnimashSettings();
      setMascotForm(animashSettings);
      showNotification('Анимаш успешно сброшен к заводским настройкам!');
    }
  };

  const handleAddTip = () => {
    if (!newTipInput.trim()) return;
    const updatedTips = [...(mascotForm.tips || []), newTipInput.trim()];
    const updated = { ...mascotForm, tips: updatedTips };
    setMascotForm(updated);
    updateAnimashSettings({ tips: updatedTips });
    setNewTipInput('');
    showNotification('Новая реплика Анимаша добавлена!');
  };

  const handleDeleteTip = (index: number) => {
    const updatedTips = (mascotForm.tips || []).filter((_, i) => i !== index);
    const updated = { ...mascotForm, tips: updatedTips };
    setMascotForm(updated);
    updateAnimashSettings({ tips: updatedTips });
    showNotification('Реплика удалена!');
  };

  const handleSaveEditedTip = (index: number) => {
    if (!editingTipText.trim()) return;
    const updatedTips = [...(mascotForm.tips || [])];
    updatedTips[index] = editingTipText.trim();
    const updated = { ...mascotForm, tips: updatedTips };
    setMascotForm(updated);
    updateAnimashSettings({ tips: updatedTips });
    setEditingTipIndex(null);
    setEditingTipText('');
    showNotification('Реплика Анимаша обновлена!');
  };

  const handleSaveScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    if (editingEvent) {
      updateScheduleEvent(editingEvent.id, eventForm);
      showNotification(`Событие «${eventForm.title}» обновлено!`);
    } else {
      addScheduleEvent(eventForm);
      showNotification(`Новое событие «${eventForm.title}» добавлено!`);
    }
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleSaveNomination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomForm.title.trim()) return;

    if (editingNom) {
      updateNomination(editingNom.id, nomForm);
      showNotification(`Номинация «${nomForm.title}» обновлена!`);
    } else {
      addNomination(nomForm);
      showNotification(`Новая номинация «${nomForm.title}» добавлена!`);
    }
    setEditingNom(null);
    setIsAddingNom(false);
  };

  const handleSaveJury = (e: React.FormEvent) => {
    e.preventDefault();
    if (!juryForm.name.trim()) return;

    if (editingJury) {
      updateJuryMember(editingJury.id, juryForm);
      showNotification(`Данные эксперта «${juryForm.name}» обновлены!`);
    } else {
      addJuryMember(juryForm);
      showNotification(`Новый эксперт «${juryForm.name}» добавлен в состав жюри!`);
    }
    setEditingJury(null);
    setIsAddingJury(false);
  };

  const handleSaveGalleryWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workForm.title.trim()) return;

    if (editingWork) {
      updateGalleryWork(editingWork.id, workForm);
      showNotification(`Работа «${workForm.title}» обновлена!`);
    } else {
      addGalleryWork(workForm);
      showNotification(`Работа «${workForm.title}» добавлена в галерею!`);
    }
    setEditingWork(null);
    setIsAddingWork(false);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.q.trim() || !faqForm.a.trim()) return;

    if (editingFaqIndex !== null) {
      updateFaq(editingFaqIndex, faqForm);
      showNotification('Вопрос-ответ FAQ успешно обновлен!');
    } else {
      addFaq(faqForm);
      showNotification('Новый вопрос-ответ добавлен в FAQ!');
    }
    setEditingFaqIndex(null);
    setIsAddingFaq(false);
    setFaqForm({ q: '', a: '' });
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `11kadrov_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Резервная копия сайта успешно выгружена в JSON!');
  };

  const handleDownloadFullZip = async () => {
    setIsGeneratingZip(true);
    showNotification('Формирование архива проекта...');
    try {
      const filename = `festival_11_kadrov_source_${new Date().toISOString().slice(0, 10)}.zip`;
      const ok = await downloadFile('/festival-11-kadrov-full-site.zip', filename);
      if (!ok) {
        window.open('/festival-11-kadrov-full-site.zip', '_blank');
      }
      showNotification('Архив проекта (.ZIP) отправлен на скачивание!');
    } catch (err) {
      showNotification('Ошибка при скачивании ZIP архива', true);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importAllData(content);
      if (res.success) {
        showNotification(res.message);
        setInfoForm(festivalInfo);
      } else {
        showNotification(res.message, true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportApplicationsCSV = () => {
    if (applications.length === 0) {
      showNotification('Список заявок пуст', true);
      return;
    }

    const headers = [
      'ID заявки',
      'Дата',
      'Статус',
      'Название фильма',
      'Номинация',
      'Студия/Автор',
      'Хронометраж',
      'Возраст участников',
      'Заявитель',
      'Телефон',
      'Email',
      'Город',
      'Ссылка на видео',
      'Заметки оргкомитета',
    ];

    const rows = applications.map((app) => [
      `"${app.id}"`,
      `"${app.date ? new Date(app.date).toLocaleString('ru-RU') : ''}"`,
      `"${app.status || 'Новая'}"`,
      `"${(app.workTitle || '').replace(/"/g, '""')}"`,
      `"${(app.nomination || '').replace(/"/g, '""')}"`,
      `"${(app.studioOrAuthor || '').replace(/"/g, '""')}"`,
      `"${app.duration || ''}"`,
      `"${app.participantAgeCategory || ''}"`,
      `"${(app.applicantName || '').replace(/"/g, '""')}"`,
      `"${app.phone || ''}"`,
      `"${app.email || ''}"`,
      `"${(app.city || '').replace(/"/g, '""')}"`,
      `"${app.videoLink || ''}"`,
      `"${(app.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zayavki_11_Kadrov_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Список заявок экспортирован в CSV (Excel)!');
  };

  const filteredApplications = applications.filter((app) => {
    if (appStatusFilter !== 'all' && (app.status || 'new') !== appStatusFilter) return false;
    if (!appSearch.trim()) return true;
    const q = appSearch.toLowerCase();
    return (
      app.workTitle?.toLowerCase().includes(q) ||
      app.applicantName?.toLowerCase().includes(q) ||
      app.city?.toLowerCase().includes(q) ||
      app.id?.toLowerCase().includes(q) ||
      app.nomination?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl bg-[#090b1e] border-2 border-[#283570] rounded-3xl shadow-2xl flex flex-col max-h-[94vh] my-auto overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#121638] via-[#1a204e] to-[#121638] border-b border-[#252f63] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider bg-[#00F0FF]/10 px-2.5 py-0.5 rounded-full border border-[#00F0FF]/20 mb-1">
                <Shield className="w-3 h-3" /> Панель управления оргкомитета
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white font-display uppercase tracking-tight">
                Административный центр • 11 КАДРОВ
              </h2>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1d2550] hover:bg-[#FF007A] text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              title="Выйти из режима администратора"
            >
              Выйти
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1d2550] hover:bg-white text-gray-400 hover:text-black transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {successNotice && (
          <div className="bg-[#00F0FF]/15 border-b border-[#00F0FF]/40 px-6 py-2.5 text-[#00F0FF] text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}
        {errorNotice && (
          <div className="bg-[#FF007A]/15 border-b border-[#FF007A]/40 px-6 py-2.5 text-[#FF007A] text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="bg-[#0c0f2b] border-b border-[#1f2854] px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#00F0FF] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Инфо фестиваля</span>
          </button>

          <button
            onClick={() => setActiveTab('mascot')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'mascot'
                ? 'bg-gradient-to-r from-[#FF007A] via-[#FF5E00] to-[#FFD600] text-white shadow-md shadow-[#FF007A]/30'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFD600]" />
            <span>Талисман Анимаш</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-[#00F0FF] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Расписание ({scheduleEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('nominations')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'nominations'
                ? 'bg-[#00F0FF] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Номинации ({nominations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jury')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'jury'
                ? 'bg-[#00F0FF] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Жюри ({juryMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#00F0FF] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Галерея ({galleryWorks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#00F0FF] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-[#FF007A] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Заявки ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black shadow-md shadow-[#00F0FF]/25'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>База данных & Mailer</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 font-bold transition-all cursor-pointer ml-auto ${
              activeTab === 'backup'
                ? 'bg-[#FFD600] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#151a3d]'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Резерв & Пароль</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#090b1e]">
          
          {/* ======================================================== */}
          {/* TAB 1: FESTIVAL MAIN INFO */}
          {/* ======================================================== */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="max-w-4xl space-y-6">
              <div className="p-4 rounded-2xl bg-[#101436] border border-[#222c61] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Редактирование основных реквизитов</h3>
                  <p className="text-xs text-gray-400">Изменения моментально отображаются на всех экранах и в футере сайта.</p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#3bf1fd] text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/25 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить изменения</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Название фестиваля:
                  </label>
                  <input
                    type="text"
                    value={infoForm.name}
                    onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Полное официальное название:
                  </label>
                  <input
                    type="text"
                    value={infoForm.fullName}
                    onChange={(e) => setInfoForm({ ...infoForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFD600] uppercase tracking-wider mb-1">
                    Главный приз фестиваля:
                  </label>
                  <input
                    type="text"
                    value={infoForm.grandPrize}
                    onChange={(e) => setInfoForm({ ...infoForm, grandPrize: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#FFD600]/40 focus:border-[#FFD600] rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Даты проведения:
                  </label>
                  <input
                    type="text"
                    value={infoForm.dates}
                    onChange={(e) => setInfoForm({ ...infoForm, dates: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Дедлайн приема конкурсных заявок:
                  </label>
                  <input
                    type="text"
                    value={infoForm.submissionDeadline}
                    onChange={(e) => setInfoForm({ ...infoForm, submissionDeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Контактный телефон оргкомитета:
                  </label>
                  <input
                    type="text"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    E-mail для справок и заявок:
                  </label>
                  <input
                    type="email"
                    value={infoForm.email}
                    onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Официальная страница ВКонтакте:
                  </label>
                  <input
                    type="text"
                    value={infoForm.vkUrl}
                    onChange={(e) => setInfoForm({ ...infoForm, vkUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Площадки проведения:
                  </label>
                  <input
                    type="text"
                    value={infoForm.venue}
                    onChange={(e) => setInfoForm({ ...infoForm, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Краткое описание фестиваля:
                  </label>
                  <textarea
                    rows={3}
                    value={infoForm.shortDescription}
                    onChange={(e) => setInfoForm({ ...infoForm, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB: MASCOT (ANIMASH) MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'mascot' && (
            <div className="space-y-8 max-w-5xl">
              
              {/* Top Banner & Main Actions */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#170e33] via-[#211245] to-[#121638] border-2 border-[#FF007A]/40 shadow-xl shadow-[#FF007A]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF85C0] text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
                    <span>Интерактивный символ фестиваля</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
                    Управление маскотом • {mascotForm.name || 'Милаш-Анимаш'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
                    Меняйте изображения талисмана на разных экранах сайта (на главном экране, в плавающем помощнике, в карточке ШКИ или в студии анимации), загружайте свои PNG/GIF арты, меняйте имя, легенду и реплики.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSaveMascot()}
                    className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#00A3FF] hover:brightness-110 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00F0FF]/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить всё</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAllMascot}
                    className="px-4 py-3 rounded-2xl bg-[#1d2550] hover:bg-[#FF007A]/40 text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    title="Сбросить все настройки Анимаша к заводским"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Сбросить</span>
                  </button>
                </div>
              </div>

              {/* Universal Batch Changer: Change image everywhere in 1 click */}
              <div className="p-5 rounded-3xl bg-[#0e1338] border-2 border-[#00F0FF]/40 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00F0FF] uppercase tracking-wider mb-1">
                      <Layers className="w-4 h-4" />
                      <span>Быстрая смена маскота на всём сайте</span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      Установить единый арт Анимаша для всех 5 мест
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Загрузите файл или укажите ссылку, чтобы новый облик применился сразу везде (Главный экран, виджет, карточка, студия, резерв).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <label className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#FF5E00] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF007A]/20 cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Загрузить для всего сайта</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              if (dataUrl) handleApplyImageToAll(dataUrl);
                            };
                            reader.readAsDataURL(file);
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleApplyImageToAll('/milash.png')}
                      className="px-3.5 py-2.5 rounded-xl bg-[#1a214d] hover:bg-[#25306e] text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      title="Восстановить оригинальный арт /milash.png для всех мест"
                    >
                      Оригинал
                    </button>
                  </div>
                </div>
              </div>

              {/* Placement Filter Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#00F0FF]" />
                      <span>Места размещения и индивидуальные картинки:</span>
                    </h4>
                    <p className="text-xs text-gray-400">
                      Вы можете задать свой уникальный образ для каждого экрана (например, в позе рисования для студии или в полный рост для карточки).
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#0e1236] p-1 rounded-xl border border-[#232c66] text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedPlacementTab('all')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedPlacementTab === 'all'
                          ? 'bg-[#00F0FF] text-black shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Все 5 мест
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlacementTab('hero')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedPlacementTab === 'hero'
                          ? 'bg-[#00F0FF] text-black shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Главный
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlacementTab('floating')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedPlacementTab === 'floating'
                          ? 'bg-[#00F0FF] text-black shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Виджет-гид
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlacementTab('card')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedPlacementTab === 'card'
                          ? 'bg-[#00F0FF] text-black shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      О ШКИ
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlacementTab('helper')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedPlacementTab === 'helper'
                          ? 'bg-[#00F0FF] text-black shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Студия
                    </button>
                  </div>
                </div>

                {/* Placements Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[
                    {
                      key: 'default' as AnimashPlacementKey,
                      title: '1. Основной образ (по умолчанию)',
                      badge: 'Базовый fallback',
                      desc: 'Используется как основа везде, где не назначена отдельная картинка.',
                      location: 'По всему сайту (глобальный образ)',
                      defaultSrc: '/milash.png',
                    },
                    {
                      key: 'hero' as AnimashPlacementKey,
                      title: '2. Главный экран фестиваля (Hero)',
                      badge: 'Секция Hero',
                      desc: 'Центральный блок страницы в интерактивном переключателе («Милаш» / «Эмблема»).',
                      location: 'Главный экран (под таймером фестиваля)',
                      defaultSrc: '/milash.png',
                    },
                    {
                      key: 'floating' as AnimashPlacementKey,
                      title: '3. Плавающий виджет-гид (Floating)',
                      badge: 'Нижний правый угол',
                      desc: 'Круглая кнопка внизу экрана и всплывающий диалог с советами и приветствием.',
                      location: 'Закреплен в правом нижнем углу на всех страницах',
                      defaultSrc: '/milash.png',
                    },
                    {
                      key: 'card' as AnimashPlacementKey,
                      title: '4. Презентационная карточка (О ШКИ)',
                      badge: 'Секция о школе',
                      desc: 'Крупная визуальная карточка с историей создания персонажа и его тегами.',
                      location: 'Секция «О Школе креативных индустрий»',
                      defaultSrc: '/milash.png',
                    },
                    {
                      key: 'helper' as AnimashPlacementKey,
                      title: '5. Помощник в Студии «11 кадров»',
                      badge: 'Интерактивная студия',
                      desc: 'Анимированный ассистент над холстом мультипликатора, помогающий рисовать кадры.',
                      location: 'Секция «Создай свой мультфильм 11 кадров»',
                      defaultSrc: '/milash.png',
                    },
                  ]
                    .filter((item) => selectedPlacementTab === 'all' || selectedPlacementTab === item.key)
                    .map((item) => {
                      const currentSrc = mascotForm.images[item.key] || mascotForm.images.default || '/milash.png';
                      const isCustom = Boolean(mascotForm.images[item.key]);
                      const inputId = `upload-mascot-${item.key}`;

                      return (
                        <div
                          key={item.key}
                          className="p-5 rounded-3xl bg-[#0f143a] border-2 border-[#26336e] hover:border-[#00F0FF]/60 transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                                  {item.badge}
                                </span>
                                <h5 className="text-base font-black text-white">{item.title}</h5>
                                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                              </div>
                            </div>

                            {/* Preview & Controls Container */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 my-4 p-3 rounded-2xl bg-[#090b1e] border border-[#1e275c]">
                              {/* Mascot Visual Preview */}
                              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center bg-gradient-to-b from-[#182052]/60 to-[#0c0f29] rounded-2xl border border-[#2b397a] overflow-hidden group">
                                <img
                                  src={currentSrc}
                                  alt={item.title}
                                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/milash.png';
                                  }}
                                />
                                <div className="absolute top-1.5 right-1.5">
                                  {isCustom ? (
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] inline-block shadow-sm shadow-[#00F0FF]" title="Индивидуальный арт" />
                                  ) : (
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block" title="Используется образ по умолчанию" />
                                  )}
                                </div>
                              </div>

                              {/* Upload & Quick Action Buttons */}
                              <div className="flex-1 w-full space-y-2">
                                <div className="flex items-center gap-2">
                                  <label
                                    htmlFor={inputId}
                                    className="flex-1 px-3 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#3cf2ff] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#00F0FF]/20 cursor-pointer transition-all"
                                  >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Загрузить фото / PNG</span>
                                  </label>
                                  <input
                                    id={inputId}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadMascotImage(item.key, file);
                                      e.target.value = '';
                                    }}
                                  />
                                </div>

                                {/* URL Input */}
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={mascotForm.images[item.key] || ''}
                                    placeholder="Или вставьте URL ссылки..."
                                    onChange={(e) => handleUpdateMascotImage(item.key, e.target.value)}
                                    className="w-full pl-2.5 pr-8 py-1.5 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-xs text-white placeholder-gray-500"
                                  />
                                  {mascotForm.images[item.key] && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateMascotImage(item.key, '')}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF007A]"
                                      title="Очистить"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                {/* Presets & Helpers */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMascotImage(item.key, '/milash.png')}
                                    className="px-2 py-1 rounded-lg bg-[#192252] hover:bg-[#25327a] text-[11px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                                  >
                                    Оригинал
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleApplyImageToAll(currentSrc)}
                                    className="px-2 py-1 rounded-lg bg-[#271d4a] hover:bg-[#FF007A] text-[11px] font-semibold text-[#FF85C0] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                                    title="Скопировать эту картинку на все остальные места сайта"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>На весь сайт</span>
                                  </button>

                                  {item.key !== 'default' && (
                                    <button
                                      type="button"
                                      onClick={() => handleResetPlacementImage(item.key)}
                                      className="px-2 py-1 rounded-lg bg-[#14193d] hover:bg-[#1f2861] text-[11px] font-semibold text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
                                      title="Сбросить к основному образу"
                                    >
                                      Сброс
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-gray-500 border-t border-[#1d2657] pt-2 flex items-center justify-between">
                            <span>Локация: {item.location}</span>
                            <span className="font-mono text-gray-400">{isCustom ? 'Персональный арт' : 'Наследует общий'}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Text & Lore Settings: Name, Badge, Story & Tags */}
              <div className="p-6 rounded-3xl bg-[#0f143a] border-2 border-[#283570] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-[#FFD600]" />
                      <span>Имя, статус и легенда талисмана</span>
                    </h4>
                    <p className="text-xs text-gray-400">
                      Эти тексты выводятся в приветственном диалоге и в большой карточке секции «О ШКИ».
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveMascot()}
                    className="px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#3bf1fd] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#00F0FF]/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Сохранить тексты</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Имя персонажа:
                    </label>
                    <input
                      type="text"
                      value={mascotForm.name}
                      onChange={(e) => setMascotForm({ ...mascotForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Бейдж / Роль:
                    </label>
                    <input
                      type="text"
                      value={mascotForm.badge}
                      onChange={(e) => setMascotForm({ ...mascotForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Заголовок карточки в блоке «О ШКИ»:
                    </label>
                    <input
                      type="text"
                      value={mascotForm.storyTitle}
                      onChange={(e) => setMascotForm({ ...mascotForm, storyTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Легенда / биография талисмана:
                    </label>
                    <textarea
                      rows={4}
                      value={mascotForm.storyText}
                      onChange={(e) => setMascotForm({ ...mascotForm, storyText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-sm text-white"
                    />
                  </div>

                  {/* 3 Tags */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                      Особые фишки и теги талисмана (3 характеристики):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={mascotForm.tag1}
                        onChange={(e) => setMascotForm({ ...mascotForm, tag1: e.target.value })}
                        placeholder="Тег 1 (напр. 🎧 Слушает звук...)"
                        className="px-3.5 py-2 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-xs text-white"
                      />
                      <input
                        type="text"
                        value={mascotForm.tag2}
                        onChange={(e) => setMascotForm({ ...mascotForm, tag2: e.target.value })}
                        placeholder="Тег 2 (напр. ✏️ 11 кадров в секунду)"
                        className="px-3.5 py-2 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-xs text-white"
                      />
                      <input
                        type="text"
                        value={mascotForm.tag3}
                        onChange={(e) => setMascotForm({ ...mascotForm, tag3: e.target.value })}
                        placeholder="Тег 3 (напр. 🎬 Главный символ)"
                        className="px-3.5 py-2 bg-[#12173d] border border-[#273570] focus:border-[#00F0FF] rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips & Quotes Speech Balloons Editor */}
              <div className="p-6 rounded-3xl bg-[#0f143a] border-2 border-[#283570] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
                      <span>Фразы и советы Анимаша ({mascotForm.tips?.length || 0})</span>
                    </h4>
                    <p className="text-xs text-gray-400">
                      Эти реплики маскот произносит в интерактивном облачке при клике и при наведении на сайте.
                    </p>
                  </div>
                </div>

                {/* Add new tip input */}
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#090b1e] border border-[#253273]">
                  <input
                    type="text"
                    value={newTipInput}
                    placeholder="Напишите новую фразу для Анимаша (например: «Не забудь подать заявку до 5 октября!»)..."
                    onChange={(e) => setNewTipInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTip();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTip}
                    disabled={!newTipInput.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#FF5E00] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FF007A]/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить реплику</span>
                  </button>
                </div>

                {/* Tips List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(mascotForm.tips || []).map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#12173d] border border-[#232c66] flex items-center justify-between gap-3 group hover:border-[#00F0FF]/40 transition-all"
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="w-5 h-5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>

                        {editingTipIndex === idx ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editingTipText}
                              onChange={(e) => setEditingTipText(e.target.value)}
                              className="flex-1 px-3 py-1 bg-[#090b1e] border border-[#00F0FF] rounded-lg text-xs text-white"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditedTip(idx)}
                              className="p-1.5 rounded-lg bg-[#00F0FF] text-black font-bold text-xs cursor-pointer"
                              title="Применить"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTipIndex(null)}
                              className="p-1.5 rounded-lg bg-[#1c2452] text-gray-300 hover:text-white text-xs cursor-pointer"
                              title="Отмена"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-200 leading-relaxed">
                            «{tip}»
                          </p>
                        )}
                      </div>

                      {editingTipIndex !== idx && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTipIndex(idx);
                              setEditingTipText(tip);
                            }}
                            className="p-1.5 rounded-lg bg-[#18204d] hover:bg-[#00F0FF] text-gray-400 hover:text-black transition-all cursor-pointer"
                            title="Редактировать фразу"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTip(idx)}
                            className="p-1.5 rounded-lg bg-[#18204d] hover:bg-[#FF007A] text-gray-400 hover:text-white transition-all cursor-pointer"
                            title="Удалить фразу"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Save */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Все изменения сохраняются в браузерном хранилище и входят в резервные копии сайта.
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveMascot()}
                  className="px-6 py-3 rounded-2xl bg-[#00F0FF] hover:bg-[#3bf1fd] text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#00F0FF]/25 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить настройки талисмана</span>
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SCHEDULE MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Программа и расписание фестиваля</h3>
                  <p className="text-xs text-gray-400">Всего событий: {scheduleEvents.length}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setEventForm({
                      title: '',
                      category: 'masterclass',
                      categoryLabel: 'Мастер-класс',
                      day: 1,
                      dateStr: '16 октября 2026 (Пятница)',
                      time: '12:00',
                      endTime: '13:30',
                      location: 'Школа креативных индустрий (ул. Красной Звезды, 7)',
                      speaker: '',
                      speakerRole: '',
                      description: '',
                      targetAudience: 'Для всех участников (6+)',
                      tags: ['Мастер-класс', 'ШКИ'],
                      capacity: 50,
                    });
                    setIsAddingEvent(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить событие</span>
                </button>
              </div>

              {/* Event Form Modal */}
              {isAddingEvent && (
                <div className="p-5 rounded-2xl bg-[#12173d] border-2 border-[#00F0FF]/50 shadow-2xl">
                  <h4 className="text-sm font-bold text-[#00F0FF] uppercase tracking-wider mb-4">
                    {editingEvent ? 'Редактирование события' : 'Новое событие расписания'}
                  </h4>
                  <form onSubmit={handleSaveScheduleEvent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Название события:</label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">День фестиваля:</label>
                      <select
                        value={eventForm.day}
                        onChange={(e) => {
                          const d = Number(e.target.value);
                          const dateNames: Record<number, string> = {
                            1: '16 октября 2026 (Пятница)',
                            2: '17 октября 2026 (Суббота)',
                            3: '18 октября 2026 (Воскресенье)',
                          };
                          setEventForm({ ...eventForm, day: d, dateStr: dateNames[d] || '' });
                        }}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      >
                        <option value={1}>День 1 (16 октября) — Открытие</option>
                        <option value={2}>День 2 (17 октября) — Смотр и мастер-классы</option>
                        <option value={3}>День 3 (18 октября) — Награждение и закрытие</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Время начала:</label>
                      <input
                        type="text"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        placeholder="14:00"
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Время окончания:</label>
                      <input
                        type="text"
                        value={eventForm.endTime}
                        onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                        placeholder="15:30"
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Категория:</label>
                      <select
                        value={eventForm.category}
                        onChange={(e) => {
                          const cat = e.target.value as EventItem['category'];
                          const labels: Record<string, string> = {
                            masterclass: 'Мастер-класс',
                            screening: 'Кинопоказ',
                            lecture: 'Лекция',
                            performance: 'Шоу / Перформанс',
                            competition: 'Хакатон / Конкурс',
                            ceremony: 'Церемония',
                          };
                          setEventForm({ ...eventForm, category: cat, categoryLabel: labels[cat] || 'Событие' });
                        }}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      >
                        <option value="masterclass">Мастер-класс</option>
                        <option value="screening">Кинопоказ / Смотр</option>
                        <option value="lecture">Лекция / Q&A</option>
                        <option value="competition">Хакатон / Конкурс</option>
                        <option value="ceremony">Церемония / Регистрация</option>
                        <option value="performance">Шоу / Перформанс</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Локация / Зал:</label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Спикер / Ведущий:</label>
                      <input
                        type="text"
                        value={eventForm.speaker || ''}
                        onChange={(e) => setEventForm({ ...eventForm, speaker: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Описание:</label>
                      <textarea
                        rows={2}
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingEvent(false);
                          setEditingEvent(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1f2650] text-gray-300 text-xs font-bold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#00F0FF] text-black text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Сохранить событие</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Event List */}
              <div className="space-y-3">
                {scheduleEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-[#101436] border border-[#202958] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#384890] transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#192252] text-[#00F0FF] text-[10px] font-bold">
                          День {ev.day} • {ev.time} - {ev.endTime}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#25173f] text-[#FF007A] text-[10px] font-bold">
                          {ev.categoryLabel}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{ev.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1">{ev.description}</p>
                      <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#00F0FF]" /> {ev.location}</span>
                        {ev.speaker && <span>Ведущий: {ev.speaker}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingEvent(ev);
                          setEventForm({
                            title: ev.title,
                            category: ev.category,
                            categoryLabel: ev.categoryLabel,
                            day: ev.day,
                            dateStr: ev.dateStr,
                            time: ev.time,
                            endTime: ev.endTime,
                            location: ev.location,
                            speaker: ev.speaker || '',
                            speakerRole: ev.speakerRole || '',
                            description: ev.description,
                            targetAudience: ev.targetAudience,
                            tags: ev.tags,
                            capacity: ev.capacity || 50,
                          });
                          setIsAddingEvent(true);
                        }}
                        className="p-2 rounded-xl bg-[#18204c] hover:bg-[#00F0FF] text-gray-300 hover:text-black transition-all cursor-pointer"
                        title="Редактировать"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить событие «${ev.title}»?`)) {
                            deleteScheduleEvent(ev.id);
                            showNotification('Событие удалено');
                          }
                        }}
                        className="p-2 rounded-xl bg-[#18204c] hover:bg-[#FF007A] text-gray-300 hover:text-white transition-all cursor-pointer"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: NOMINATIONS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'nominations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Номинации конкурсной программы</h3>
                  <p className="text-xs text-gray-400">Всего номинаций: {nominations.length}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingNom(null);
                    setNomForm({
                      title: '',
                      code: 'NEW-NOM',
                      iconName: 'Sparkles',
                      color: '#00F0FF',
                      description: '',
                      criteria: ['Оригинальность замысла', 'Качество анимации', 'Звуковой ряд'],
                      ageCategories: ['до 12 лет', '13–17 лет', '18+'],
                      maxDuration: 'до 10 минут',
                      formats: ['MP4', 'Full HD 1080p'],
                    });
                    setIsAddingNom(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить номинацию</span>
                </button>
              </div>

              {isAddingNom && (
                <div className="p-5 rounded-2xl bg-[#12173d] border-2 border-[#00F0FF]/50">
                  <h4 className="text-sm font-bold text-[#00F0FF] mb-4">
                    {editingNom ? 'Редактирование номинации' : 'Новая номинация'}
                  </h4>
                  <form onSubmit={handleSaveNomination} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Название номинации:</label>
                      <input
                        type="text"
                        required
                        value={nomForm.title}
                        onChange={(e) => setNomForm({ ...nomForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Хронометраж:</label>
                      <input
                        type="text"
                        value={nomForm.maxDuration}
                        onChange={(e) => setNomForm({ ...nomForm, maxDuration: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Описание номинации:</label>
                      <textarea
                        rows={2}
                        value={nomForm.description}
                        onChange={(e) => setNomForm({ ...nomForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNom(false);
                          setEditingNom(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1f2650] text-gray-300 text-xs font-bold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#00F0FF] text-black text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Сохранить</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nominations.map((nom) => (
                  <div
                    key={nom.id}
                    className="p-4 rounded-2xl bg-[#101436] border border-[#202958] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1b224c] text-[#00F0FF] border border-[#2a3875]">
                          {nom.code}
                        </span>
                        <span className="text-xs text-gray-400">{nom.maxDuration}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">{nom.title}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">{nom.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#1a2147] flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {nom.ageCategories?.join(', ')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingNom(nom);
                            setNomForm({
                              title: nom.title,
                              code: nom.code,
                              iconName: nom.iconName,
                              color: nom.color,
                              description: nom.description,
                              criteria: nom.criteria || [],
                              ageCategories: nom.ageCategories || [],
                              maxDuration: nom.maxDuration,
                              formats: nom.formats || [],
                            });
                            setIsAddingNom(true);
                          }}
                          className="p-2 rounded-xl bg-[#18204c] hover:bg-[#00F0FF] text-gray-300 hover:text-black transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Удалить номинацию «${nom.title}»?`)) {
                              deleteNomination(nom.id);
                              showNotification('Номинация удалена');
                            }
                          }}
                          className="p-2 rounded-xl bg-[#18204c] hover:bg-[#FF007A] text-gray-300 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: JURY MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'jury' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Состав жюри и экспертов</h3>
                  <p className="text-xs text-gray-400">Экспертов: {juryMembers.length}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingJury(null);
                    setJuryForm({
                      name: '',
                      role: 'Член жюри',
                      company: 'Союзмультфильм / ВГИК',
                      city: 'Москва',
                      bio: '',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      tags: ['Режиссура', 'Анимация'],
                    });
                    setIsAddingJury(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить эксперта</span>
                </button>
              </div>

              {isAddingJury && (
                <div className="p-5 rounded-2xl bg-[#12173d] border-2 border-[#00F0FF]/50">
                  <h4 className="text-sm font-bold text-[#00F0FF] mb-4">
                    {editingJury ? 'Редактирование эксперта' : 'Новый эксперт жюри'}
                  </h4>
                  <form onSubmit={handleSaveJury} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">ФИО эксперта:</label>
                      <input
                        type="text"
                        required
                        value={juryForm.name}
                        onChange={(e) => setJuryForm({ ...juryForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Должность / Роль:</label>
                      <input
                        type="text"
                        value={juryForm.role}
                        onChange={(e) => setJuryForm({ ...juryForm, role: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Организация / Студия:</label>
                      <input
                        type="text"
                        value={juryForm.company}
                        onChange={(e) => setJuryForm({ ...juryForm, company: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Ссылка на фото (URL):</label>
                      <input
                        type="url"
                        value={juryForm.avatar}
                        onChange={(e) => setJuryForm({ ...juryForm, avatar: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Биография и достижения:</label>
                      <textarea
                        rows={3}
                        value={juryForm.bio}
                        onChange={(e) => setJuryForm({ ...juryForm, bio: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingJury(false);
                          setEditingJury(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1f2650] text-gray-300 text-xs font-bold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#00F0FF] text-black text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Сохранить</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {juryMembers.map((j) => (
                  <div
                    key={j.id}
                    className="p-4 rounded-2xl bg-[#101436] border border-[#202958] flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={j.avatar}
                        alt={j.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#2a3778]"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{j.name}</h4>
                        <div className="text-[11px] text-[#00F0FF]">{j.role}</div>
                        <div className="text-[10px] text-gray-400">{j.company} ({j.city})</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-3 mb-4 leading-relaxed">{j.bio}</p>

                    <div className="pt-2 border-t border-[#1a2147] flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingJury(j);
                          setJuryForm({
                            name: j.name,
                            role: j.role,
                            company: j.company,
                            city: j.city,
                            bio: j.bio,
                            avatar: j.avatar,
                            tags: j.tags || [],
                          });
                          setIsAddingJury(true);
                        }}
                        className="p-2 rounded-xl bg-[#18204c] hover:bg-[#00F0FF] text-gray-300 hover:text-black transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить эксперта «${j.name}»?`)) {
                            deleteJuryMember(j.id);
                            showNotification('Эксперт удален');
                          }
                        }}
                        className="p-2 rounded-xl bg-[#18204c] hover:bg-[#FF007A] text-gray-300 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: GALLERY WORKS */}
          {/* ======================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Галерея мультфильмов и работ</h3>
                  <p className="text-xs text-gray-400">Работ: {galleryWorks.length}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingWork(null);
                    setWorkForm({
                      title: '',
                      author: '',
                      studio: '',
                      city: 'Чита',
                      ageCategory: '13–17 лет',
                      nomination: '2D-анимация',
                      duration: '03:00',
                      thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
                      likes: 50,
                      year: 2026,
                      description: '',
                    });
                    setIsAddingWork(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить фильм</span>
                </button>
              </div>

              {isAddingWork && (
                <div className="p-5 rounded-2xl bg-[#12173d] border-2 border-[#00F0FF]/50">
                  <h4 className="text-sm font-bold text-[#00F0FF] mb-4">
                    {editingWork ? 'Редактирование фильма' : 'Новый фильм в галерее'}
                  </h4>
                  <form onSubmit={handleSaveGalleryWork} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Название фильма:</label>
                      <input
                        type="text"
                        required
                        value={workForm.title}
                        onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Автор(ы):</label>
                      <input
                        type="text"
                        value={workForm.author}
                        onChange={(e) => setWorkForm({ ...workForm, author: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Студия / Школа:</label>
                      <input
                        type="text"
                        value={workForm.studio || ''}
                        onChange={(e) => setWorkForm({ ...workForm, studio: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Номинация:</label>
                      <input
                        type="text"
                        value={workForm.nomination}
                        onChange={(e) => setWorkForm({ ...workForm, nomination: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Хронометраж:</label>
                      <input
                        type="text"
                        value={workForm.duration}
                        onChange={(e) => setWorkForm({ ...workForm, duration: e.target.value })}
                        placeholder="02:30"
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Обложка / Постер URL:</label>
                      <input
                        type="url"
                        value={workForm.thumbnail}
                        onChange={(e) => setWorkForm({ ...workForm, thumbnail: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Описание / Синопсис:</label>
                      <textarea
                        rows={2}
                        value={workForm.description}
                        onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingWork(false);
                          setEditingWork(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1f2650] text-gray-300 text-xs font-bold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#00F0FF] text-black text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Сохранить</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryWorks.map((work) => (
                  <div
                    key={work.id}
                    className="p-3 rounded-2xl bg-[#101436] border border-[#202958] flex flex-col justify-between"
                  >
                    <div className="relative rounded-xl overflow-hidden mb-3 aspect-video bg-black">
                      <img
                        src={work.thumbnail}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold">
                        {work.duration}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-0.5">{work.title}</h4>
                    <div className="text-[11px] text-[#00F0FF] mb-1">{work.author}</div>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{work.description}</p>

                    <div className="pt-2 border-t border-[#1a2147] flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 uppercase">{work.nomination}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingWork(work);
                            setWorkForm({
                              title: work.title,
                              author: work.author,
                              studio: work.studio || '',
                              city: work.city,
                              ageCategory: work.ageCategory,
                              nomination: work.nomination,
                              duration: work.duration,
                              thumbnail: work.thumbnail,
                              likes: work.likes,
                              year: work.year,
                              description: work.description,
                            });
                            setIsAddingWork(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#18204c] hover:bg-[#00F0FF] text-gray-300 hover:text-black transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Удалить работу «${work.title}»?`)) {
                              deleteGalleryWork(work.id);
                              showNotification('Работа удалена');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-[#18204c] hover:bg-[#FF007A] text-gray-300 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: FAQ MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Вопросы и ответы (FAQ)</h3>
                  <p className="text-xs text-gray-400">Вопросов в базе: {faqs.length}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaqIndex(null);
                    setFaqForm({ q: '', a: '' });
                    setIsAddingFaq(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить вопрос</span>
                </button>
              </div>

              {isAddingFaq && (
                <div className="p-5 rounded-2xl bg-[#12173d] border-2 border-[#00F0FF]/50">
                  <h4 className="text-sm font-bold text-[#00F0FF] mb-4">
                    {editingFaqIndex !== null ? 'Редактирование вопроса' : 'Новый вопрос FAQ'}
                  </h4>
                  <form onSubmit={handleSaveFaq} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Вопрос:</label>
                      <input
                        type="text"
                        required
                        value={faqForm.q}
                        onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Ответ:</label>
                      <textarea
                        rows={3}
                        required
                        value={faqForm.a}
                        onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingFaq(false);
                          setEditingFaqIndex(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1f2650] text-gray-300 text-xs font-bold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#00F0FF] text-black text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Сохранить</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#101436] border border-[#202958] flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white mb-1.5">{faq.q}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{faq.a}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingFaqIndex(idx);
                          setFaqForm(faq);
                          setIsAddingFaq(true);
                        }}
                        className="p-2 rounded-xl bg-[#18204c] hover:bg-[#00F0FF] text-gray-300 hover:text-black transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить вопрос «${faq.q}»?`)) {
                            deleteFaq(idx);
                            showNotification('Вопрос удален');
                          }
                        }}
                        className="p-2 rounded-xl bg-[#18204c] hover:bg-[#FF007A] text-gray-300 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: APPLICATIONS CRM */}
          {/* ======================================================== */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Заявки участников на конкурс</h3>
                  <p className="text-xs text-gray-400">
                    Всего в базе: {applications.length} (отфильтровано: {filteredApplications.length})
                  </p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <button
                    onClick={handleExportApplicationsCSV}
                    className="px-4 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#32effc] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer flex-1 sm:flex-initial"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Экспорт в Excel (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="p-3 bg-[#101438] border border-[#232d61] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Поиск по названию мультфильма, автору, городу, ID..."
                    className="w-full pl-9 pr-4 py-2 bg-[#090b1e] border border-[#273570] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto text-xs">
                  <button
                    onClick={() => setAppStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
                      appStatusFilter === 'all'
                        ? 'bg-[#00F0FF] text-black'
                        : 'bg-[#151a3d] text-gray-300 hover:text-white'
                    }`}
                  >
                    Все ({applications.length})
                  </button>
                  <button
                    onClick={() => setAppStatusFilter('new')}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
                      appStatusFilter === 'new'
                        ? 'bg-[#FFD600] text-black'
                        : 'bg-[#151a3d] text-gray-300 hover:text-white'
                    }`}
                  >
                    Новые
                  </button>
                  <button
                    onClick={() => setAppStatusFilter('shortlist')}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
                      appStatusFilter === 'shortlist'
                        ? 'bg-[#00F0FF] text-black'
                        : 'bg-[#151a3d] text-gray-300 hover:text-white'
                    }`}
                  >
                    Шорт-лист
                  </button>
                  <button
                    onClick={() => setAppStatusFilter('laureate')}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
                      appStatusFilter === 'laureate'
                        ? 'bg-[#FF007A] text-white'
                        : 'bg-[#151a3d] text-gray-300 hover:text-white'
                    }`}
                  >
                    Лауреаты
                  </button>
                </div>
              </div>

              {/* Table / Cards */}
              {filteredApplications.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#101438] border border-[#222c61] text-center">
                  <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-white mb-1">Заявок не найдено</h4>
                  <p className="text-xs text-gray-400">
                    {applications.length === 0
                      ? 'Когда участники отправляют заявки через сайт, они автоматически сохраняются в этот раздел.'
                      : 'Попробуйте изменить параметры поиска или фильтра.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApplications.map((app) => {
                    const statusBadges: Record<string, { label: string; color: string }> = {
                      new: { label: 'Новая', color: 'bg-[#FFD600]/20 text-[#FFD600] border-[#FFD600]/40' },
                      reviewed: { label: 'На рассмотрении', color: 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/40' },
                      shortlist: { label: 'Шорт-лист', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
                      laureate: { label: 'Лауреат / Призёр', color: 'bg-[#FF007A]/20 text-[#FF007A] border-[#FF007A]/40' },
                      rejected: { label: 'Отклонена', color: 'bg-gray-500/20 text-gray-400 border-gray-500/40' },
                    };

                    const badge = statusBadges[app.status || 'new'] || statusBadges.new;

                    return (
                      <div
                        key={app.id}
                        className="p-4 rounded-2xl bg-[#101438] border border-[#202958] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#334282] transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono text-gray-400 bg-[#161d47] px-2 py-0.5 rounded-md">
                              {app.id}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {app.date ? new Date(app.date).toLocaleDateString('ru-RU') : ''}
                            </span>
                            {app.emailSent !== undefined && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                                  app.emailSent
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30'
                                }`}
                              >
                                <Mail className="w-2.5 h-2.5" />
                                {app.emailSent ? 'Отправлено на chita11kadrov@mail.ru' : 'В очереди Mailer'}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-white mb-1">
                            «{app.workTitle || 'Без названия'}»
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-300">
                            <span><strong className="text-gray-400">Номинация:</strong> {app.nomination}</span>
                            <span><strong className="text-gray-400">Автор/Студия:</strong> {app.studioOrAuthor}</span>
                            <span><strong className="text-gray-400">Город:</strong> {app.city}</span>
                            <span><strong className="text-gray-400">Хронометраж:</strong> {app.duration}</span>
                          </div>

                          {app.adminNotes && (
                            <div className="mt-2 text-xs text-[#FFD600] bg-[#FFD600]/10 border border-[#FFD600]/20 p-2 rounded-lg">
                              Заметка: {app.adminNotes}
                            </div>
                          )}
                        </div>

                        {/* Status Switcher & Details */}
                        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center">
                          <select
                            value={app.status || 'new'}
                            onChange={(e) => {
                              updateApplicationStatus(app.id, e.target.value as StoredApplication['status']);
                              showNotification(`Статус заявки ${app.id} изменен!`);
                            }}
                            className="px-2.5 py-1.5 bg-[#171d47] border border-[#2b3770] rounded-xl text-xs text-white font-bold"
                          >
                            <option value="new">Новая</option>
                            <option value="reviewed">На рассмотрении</option>
                            <option value="shortlist">Шорт-лист</option>
                            <option value="laureate">Лауреат / Призёр</option>
                            <option value="rejected">Отклонена</option>
                          </select>

                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 rounded-xl bg-[#1d2552] hover:bg-[#00F0FF] text-gray-200 hover:text-black text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Просмотр</span>
                          </button>

                          {app.videoLink && (
                            <a
                              href={app.videoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-[#1d2552] hover:bg-[#FF007A] text-gray-200 hover:text-white transition-all"
                              title="Открыть видео фильма"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {app.dbId && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const res = await resendApplicationEmail(app.dbId!);
                                if (res.success) {
                                  showNotification('Уведомление направлено на chita11kadrov@mail.ru!');
                                } else {
                                  showNotification(res.error || 'Ошибка отправки почты');
                                }
                              }}
                              title="Отправить повторно на chita11kadrov@mail.ru"
                              className="p-2 rounded-xl bg-[#1d2552] hover:bg-[#00F0FF] text-gray-300 hover:text-black transition-all cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Удалить заявку «${app.workTitle}» (${app.id})?`)) {
                                deleteApplication(app.id);
                                showNotification('Заявка удалена');
                              }
                            }}
                            className="p-2 rounded-xl bg-[#1d2552] hover:bg-[#FF007A] text-gray-400 hover:text-white transition-all"
                            title="Удалить заявку"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View Selected Application Full Card Modal */}
              {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
                  <div className="relative w-full max-w-3xl bg-[#0d1029] border-2 border-[#2b3773] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="absolute top-5 right-5 p-2 rounded-xl bg-[#171d45] hover:bg-white text-gray-400 hover:text-black transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/30">
                        <Film className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-400">№ {selectedApp.id}</span>
                        <h3 className="text-xl font-bold text-white">«{selectedApp.workTitle}»</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-[#12163d] border border-[#202958]">
                        <span className="text-gray-400 block mb-1">Номинация:</span>
                        <span className="font-bold text-white text-sm">{selectedApp.nomination}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#12163d] border border-[#202958]">
                        <span className="text-gray-400 block mb-1">Автор / Студия:</span>
                        <span className="font-bold text-white text-sm">{selectedApp.studioOrAuthor}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#12163d] border border-[#202958]">
                        <span className="text-gray-400 block mb-1">Заявитель (ФИО):</span>
                        <span className="font-bold text-white">{selectedApp.applicantName}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#12163d] border border-[#202958]">
                        <span className="text-gray-400 block mb-1">Контакты:</span>
                        <span className="font-bold text-white">{selectedApp.phone} • {selectedApp.email}</span>
                      </div>
                    </div>

                    {selectedApp.synopsis && (
                      <div className="p-4 rounded-xl bg-[#12163d] border border-[#202958] text-xs">
                        <span className="text-gray-400 block mb-1 font-bold uppercase">Синопсис / Описание сюжета:</span>
                        <p className="text-gray-200 leading-relaxed">{selectedApp.synopsis}</p>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-[#12163d] border border-[#202958] space-y-2 text-xs">
                      <span className="text-gray-400 block font-bold uppercase">Ссылки на материалы:</span>
                      <div>
                        <strong className="text-white">Видео фильма:</strong>{' '}
                        <a href={selectedApp.videoLink} target="_blank" rel="noopener noreferrer" className="text-[#00F0FF] hover:underline break-all">
                          {selectedApp.videoLink}
                        </a>
                      </div>
                      <div>
                        <strong className="text-white">Кадры из фильма:</strong>{' '}
                        <a href={selectedApp.framesLinks} target="_blank" rel="noopener noreferrer" className="text-[#00F0FF] hover:underline break-all">
                          {selectedApp.framesLinks}
                        </a>
                      </div>
                      {selectedApp.posterLink && (
                        <div>
                          <strong className="text-white">Постер:</strong>{' '}
                          <a href={selectedApp.posterLink} target="_blank" rel="noopener noreferrer" className="text-[#00F0FF] hover:underline break-all">
                            {selectedApp.posterLink}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Admin Note field */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                        Заметка жюри / оргкомитета:
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedApp.adminNotes || ''}
                        onBlur={(e) => {
                          updateApplicationStatus(selectedApp.id, selectedApp.status, e.target.value);
                          showNotification('Заметка сохранена');
                        }}
                        placeholder="Оценка, баллы жюри, замечания..."
                        className="w-full px-3 py-2 bg-[#12163d] border border-[#202958] rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: DATABASE & MAILER SERVICE */}
          {/* ======================================================== */}
          {activeTab === 'database' && <AdminDatabaseManager />}

          {/* ======================================================== */}
          {/* TAB 8: BACKUP & PASSWORD SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'backup' && (
            <div className="max-w-4xl space-y-8">
              {/* Password Change Card */}
              <div className="p-6 rounded-2xl bg-[#101436] border border-[#222c61] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Смена пароля администратора</h4>
                    <p className="text-xs text-gray-400">Установите надежный пароль для доступа к оргкомитетской панели.</p>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setPassMessage(null);
                    const res = await changeAdminPassword(oldPass, newPass);
                    if (res.success) {
                      setPassMessage({ text: res.message, isError: false });
                      setOldPass('');
                      setNewPass('');
                    } else {
                      setPassMessage({ text: res.message, isError: true });
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Текущий пароль:
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      placeholder="Текущий пароль"
                      className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] rounded-xl text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Новый пароль:
                    </label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Минимум 4 символа"
                      className="w-full px-3.5 py-2.5 bg-[#12173d] border border-[#26336e] rounded-xl text-sm text-white"
                    />
                  </div>

                  {passMessage && (
                    <div
                      className={`sm:col-span-2 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        passMessage.isError
                          ? 'bg-[#FF007A]/15 text-[#FF007A] border border-[#FF007A]/30'
                          : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                      }`}
                    >
                      {passMessage.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      <span>{passMessage.text}</span>
                    </div>
                  )}

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Обновить пароль</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Data Backup Card */}
              <div className="p-6 rounded-2xl bg-[#101436] border border-[#222c61] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Скачать исходный код сайта (ZIP-архив)</h4>
                    <p className="text-xs text-gray-400">
                      Скачивание полного серверного комплекта: React frontend, Node.js/Express backend (server.ts), реляционная база PostgreSQL (schema.sql), почтовая служба (chita11kadrov@mail.ru), Docker Compose, Nginx и скрипты деплоя.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0d26] border border-[#1b2354] space-y-2 text-xs text-gray-300">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#00F0FF]" /> Быстрый запуск на сервере (Docker Compose или PM2):
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-gray-400">
                    <li>Распакуйте архив на вашем VPS/сервере: <code className="text-[#00F0FF] bg-black/40 px-1.5 py-0.5 rounded">unzip festival-11-kadrov-server.zip</code>.</li>
                    <li>Скопируйте конфиг: <code className="text-[#00F0FF] bg-black/40 px-1.5 py-0.5 rounded">cp .env.production.example .env</code> и укажите пароли для БД и почты Mail.ru.</li>
                    <li>Запустите одной командой: <code className="text-[#FFD600] bg-black/40 px-1.5 py-0.5 rounded">./deploy.sh</code> или <code className="text-[#FFD600] bg-black/40 px-1.5 py-0.5 rounded">docker compose up -d</code>.</li>
                  </ol>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleDownloadFullZip}
                    disabled={isGeneratingZip}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-[#00F0FF]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FolderArchive className="w-4 h-4" />
                    <span>{isGeneratingZip ? 'Упаковка файлов в ZIP...' : 'Скачать полный серверный ZIP-архив'}</span>
                  </button>

                  <a
                    href="/api/export/schema.sql"
                    download="schema.sql"
                    className="px-4 py-3 rounded-xl bg-[#182152] hover:bg-[#222e70] border border-[#2e3e8f] text-xs font-bold text-white flex items-center gap-2 transition-all"
                  >
                    <Database className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Схема БД (schema.sql)</span>
                  </a>

                  <a
                    href="/api/export/readme"
                    download="README_DEPLOY.md"
                    className="px-4 py-3 rounded-xl bg-[#182152] hover:bg-[#222e70] border border-[#2e3e8f] text-xs font-bold text-white flex items-center gap-2 transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#FFD600]" />
                    <span>Инструкция по развёртыванию</span>
                  </a>
                </div>
              </div>

              {/* JSON Database Backup Card */}
              <div className="p-6 rounded-2xl bg-[#101436] border border-[#222c61] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Резервная копия базы данных (.JSON)</h4>
                    <p className="text-xs text-gray-400">
                      Сохранение контента (расписание, номинации, заявки, жюри) в файл JSON для быстрого восстановления на любых устройствах.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleExportBackup}
                    className="px-5 py-3 rounded-xl bg-[#18204e] hover:bg-[#253278] border border-[#303f8a] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#00F0FF]" />
                    <span>Экспорт данных (.JSON)</span>
                  </button>

                  <label className="px-5 py-3 rounded-xl bg-[#18204e] hover:bg-[#253278] border border-[#303f8a] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer">
                    <Upload className="w-4 h-4 text-[#FFD600]" />
                    <span>Восстановить из файла JSON</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          'ВНИМАНИЕ: Сбросить все изменения к базовому состоянию фестиваля? Все кастомные правки будут возвращены к исходным значениям.'
                        )
                      ) {
                        resetToDefaults();
                        showNotification('Все данные сброшены к значениям по умолчанию');
                        setInfoForm(festivalInfo);
                      }
                    }}
                    className="px-4 py-3 rounded-xl bg-[#26152b] hover:bg-[#FF007A] text-[#FF007A] hover:text-white border border-[#FF007A]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ml-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Сброс к исходным</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
