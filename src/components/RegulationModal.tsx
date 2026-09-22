import React, { useState, useMemo } from 'react';
import { useFestival } from '../context/FestivalContext';
import { copyToClipboard } from '../utils/clipboard';
import {
  FileText,
  X,
  Download,
  Printer,
  Award,
  Calendar,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Send,
  BookOpen,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  MapPin,
  Clock,
  ShieldCheck,
  Video,
} from 'lucide-react';

interface RegulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApply?: () => void;
}

export const RegulationModal: React.FC<RegulationModalProps> = ({
  isOpen,
  onClose,
  onOpenApply,
}) => {
  const { festivalInfo, nominations } = useFestival();
  const [activeTab, setActiveTab] = useState<'reader' | 'summary' | 'criteria'>('reader');
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const fullRegulationText = `
УТВЕРЖДЕНО
Организационным комитетом Дальневосточного
фестиваля креативной анимации «11 кадров»
г. Чита, Забайкальский край, 2026 год

ПОЛОЖЕНИЕ
о проведении Дальневосточного фестиваля креативной анимации «11 кадров»

1. ОБЩИЕ ПОЛОЖЕНИЯ И СТАТУС ФЕСТИВАЛЯ
1.1. Настоящее Положение регламентирует статус, цели, задачи, порядок организации, проведения, отбора работ и подведения итогов Дальневосточного фестиваля креативной анимации «11 кадров» (далее — Фестиваль).
1.2. Фестиваль является открытым межрегиональным смотром-конкурсом авторского анимационного кино, медиаискусства и современных анимационных технологий.
1.3. Концепция фестиваля «11 кадров» основана на идее, что каждый отдельный кадр анимации несёт в себе авторскую выразительность, душу и художественный смысл.
1.4. Участие в фестивале является полностью бесплатным для всех конкурсантов. Организационные, вступительные или регистрационные взносы не взимаются.

2. ЦЕЛИ И ЗАДАЧИ ФЕСТИВАЛЯ
2.1. Главная цель: всесторонняя поддержка и развитие творческого потенциала детей, подростков и молодежи в сфере мультипликации и креативных индустрий.
2.2. Задачи Фестиваля:
  - Популяризация российской авторской анимации и медиатворчества;
  - Выявление одаренных авторов, детских анимационных студий и творческих коллективов;
  - Создание единой коммуникационной платформы для обмена опытом между воспитанниками Школ креативных индустрий (ШКИ), детских мультстудий, профильных колледжей и вузов;
  - Повышение профессионального мастерства педагогов-наставников анимационных студий;
  - Профориентация подрастающего поколения в индустрии кино и анимации.

3. ОРГАНИЗАТОРЫ И РУКОВОДЯЩИЕ ОРГАНЫ
3.1. Учредитель Фестиваля: Министерство культуры Забайкальского края.
3.2. Организаторы Фестиваля:
  - Школа креативных индустрий (ШКИ) Забайкальского края;
  - ГПОУ «Забайкальское краевое училище культуры».
3.3. Для организации и проведения Фестиваля формируется Организационный комитет (Оргкомитет), который утверждает состав Экспертной комиссии и профессионального Жюри.

4. СРОКИ, ЭТАПЫ И ПЛОЩАДКИ ПРОВЕДЕНИЯ
4.1. Даты проведения финальных мероприятий: ${festivalInfo.dates} (3 дня).
4.2. Места проведения (г. Чита):
  - Кинотеатр «Удокан» (ул. Ленина, д. 111) — торжественное открытие, открытые конкурсные показы на большом экране, церемония закрытия и награждение победителей;
  - Школа креативных индустрий (ШКИ) Забайкальского края (ул. Красной Звезды, д. 7) — воркшопы, мастер-классы ведущих аниматоров РФ, круглые столы, питчинги и лаборатории.
4.3. Календарные этапы:
  - Приём конкурсных заявок: до 5 октября 2026 года (включительно);
  - Отборочный этап и формирование шорт-листа: 6 – 12 октября 2026 года;
  - Очные конкурсные показы и мастер-классы: 16 – 18 октября 2026 года.

5. УЧАСТНИКИ И ВОЗРАСТНЫЕ КАТЕГОРИИ
5.1. К участию приглашаются индивидуальные авторы, детские и юношеские анимационные студии, учащиеся Школ креативных индустрий, студенты творческих колледжей и профильных вузов, а также независимые творческие группы из всех субъектов Российской Федерации.
5.2. Конкурс проводится по трём возрастным категориям авторов:
  - I возрастная категория: до 11 лет включительно (детские студии и юные авторы);
  - II возрастная категория: от 12 до 17 лет включительно (подростковые студии, учащиеся ШКИ);
  - III возрастная категория: от 18 лет (молодёжь, студенты профильных вузов, независимые дебютанты).

6. НОМИНАЦИИ КОНКУРСНОЙ ПРОГРАММЫ
${nominations
  .map(
    (n, i) =>
      `${i + 1}. «${n.title}» [Код: ${n.code}]\n   Описание: ${n.description}\n   Хронометраж: ${n.maxDuration || 'до 15 минут'} | Форматы: ${(n.formats || ['MP4', 'FullHD']).join(', ')} | Возраст: ${(n.ageCategories || []).join(', ')}`
  )
  .join('\n\n')}

7. ТРЕБОВАНИЯ К КОНКУРСНЫМ РАБОТАМ И ТЕХНИЧЕСКИЕ ПАРАМЕТРЫ
7.1. К участию допускаются фильмы, завершенные производством в 2024–2026 годах.
7.2. Хронометраж работы: от 30 секунд до 15 минут (включая заставки и титры).
7.3. Формат видеофайла: MP4 или MOV, кодек H.264, H.265 или Apple ProRes.
7.4. Разрешение видео: не ниже Full HD (1920×1080), соотношение сторон 16:9 (допускается 2K и 4K).
7.5. Звуковая дорожка: стерео (2.0), 48 кГц / 24-16 бит, без клиппинга и звуковых искажений.
7.6. Фильм должен иметь вступительные либо финальные титры с обязательным указанием названия работы, автора(ов), звукорежиссера, студии и года создания.
7.7. Язык работы: русский язык либо сопровождение русскими субтитрами.
7.8. Не допускаются работы, содержащие ненормативную лексику, материалы эротического характера, пропаганду насилия, розни или нарушающие законодательство РФ.

8. ПОРЯДОК ПОДАЧИ И ОТБОРА ЗАЯВОК
8.1. Заявки подаются через официальную интерактивную форму на сайте ${festivalInfo.siteUrl} или по почте ${festivalInfo.email}.
8.2. К заявке прилагаются:
  - Прямая ссылка на облачное хранилище (Яндекс Диск, Облако Mail.ru, Google Drive, VK Видео) с возможностью скачивания файла оригинального качества;
  - Не менее 3 (трёх) качественных скриншотов / кадров из мультфильма (формат JPG/PNG, от 1920×1080);
  - Постер / афиша фильма (при наличии);
  - Краткий синопсис / аннотация сюжета (до 500 знаков).
8.3. Один автор или одна студия имеет право подать несколько фильмов в разные номинации. На каждый фильм заполняется отдельная заявка.

9. ПРОФЕССИОНАЛЬНОЕ ЖЮРИ И РЕГЛАМЕНТ ОЦЕНКИ
9.1. В состав жюри входят признанные режиссеры-мультипликаторы, художники-постановщики, продюсеры ведущих анимационных студий России и преподаватели профильных вузов.
9.2. Оценка работ производится по 10-балльной шкале по следующим критериям:
  - Драматургия и сценарий (логика сюжета, смысловая глубина, выразительность персонажей);
  - Анимационное мастерство (пластика движений, тайминг, спейсинг, владение выбранной техникой);
  - Визуальное решение (художественный стиль, колористика, композиция кадра, фон и декорации);
  - Звукорежиссура и музыка (озвучка, саунд-дизайн, органичность звука и видео);
  - Оригинальность и новаторство художественного высказывания.
9.3. Решение жюри является окончательным и обжалованию не подлежит.

10. НАГРАЖДЕНИЕ И ПРИЗОВОЙ ФОНД
10.1. Главный приз Фестиваля (Гран-при): ${festivalInfo.grandPrize}, эксклюзивная статуэтка «11 кадров» и диплом Гран-при.
10.2. В каждой конкурсной номинации и возрастной группе присуждаются дипломы Лауреатов I, II и III степеней.
10.3. Дополнительные награды:
  - Специальный приз от генерального спонсора фестиваля;
  - Специальные дипломы жюри («За лучший дебют», «За сохранение национальных традиций»);
  - Приз зрительских симпатий по результатам открытого голосования в к/т «Удокан».
10.4. Все авторы фильмов, вошедших в лонг-лист, получают официальный сертификат участника Фестиваля.

11. АВТОРСКИЕ ПРАВА И СОГЛАСИЕ НА ПОКАЗ
11.1. Направляя фильм на Фестиваль, заявитель гарантирует наличие у него исключительных или неисключительных авторских прав на видео- и аудиоматериалы (музыку, визуальные элементы).
11.2. Участник безвозмездно предоставляет Оргкомитету неисключительное право на публичный некоммерческий показ фильма в рамках фестивальных сеансов и открытых показов.
11.3. Оргкомитет имеет право использовать фрагменты фильма (до 10% хронометража) и скриншоты для промо-материалов, каталогов, телерепортажей и публикаций в СМИ.

12. КОНТАКТНАЯ ИНФОРМАЦИЯ ОРГКОМИТЕТА
- Официальный сайт: ${festivalInfo.siteUrl}
- Электронная почта для заявок и связи: ${festivalInfo.email}
- Телефон горячей линии: ${festivalInfo.phone}
- Адрес площадки: ${festivalInfo.venue}
`;

  const sections = useMemo(() => [
    {
      id: 'sec-1',
      num: '1',
      title: 'Общие положения и статус фестиваля',
      content: `1.1. Настоящее Положение регламентирует статус, цели, задачи, порядок организации, проведения, отбора работ и подведения итогов Дальневосточного фестиваля креативной анимации «11 кадров» (далее — Фестиваль).
1.2. Фестиваль является открытым межрегиональным смотром-конкурсом авторского анимационного кино, мультипликации и современных медиатехнологий.
1.3. Концепция фестиваля «11 кадров» базируется на классическом принципе кинематографа: каждый отдельный кадр несёт в себе авторское чувство, динамику и эстетический смысл.
1.4. Участие в фестивале является полностью бесплатным для всех участников. Организационные, вступительные или регистрационные взносы не взимаются.`,
    },
    {
      id: 'sec-2',
      num: '2',
      title: 'Цели и задачи проведения',
      content: `2.1. Главная цель: всесторонняя поддержка, развитие и популяризация творческого потенциала детей, подростков и молодежи в сфере мультипликации и креативных индустрий на территории Дальнего Востока и регионов РФ.
2.2. Задачи Фестиваля:
• Популяризация российской авторской анимации и медиаискусства среди подрастающего поколения;
• Выявление ярких талантливых мультипликаторов, детских студий и творческих коллективов;
• Создание профессиональной коммуникационной платформы для обмена опытом между воспитанниками Школ креативных индустрий (ШКИ), детских мультстудий, профильных колледжей и вузов;
• Повышение педагогической квалификации наставников и руководителей анимационных объединений;
• Профориентация молодежи в сфере креативных профессий (режиссура, 2D/3D-графика, саунд-дизайн, сценаристика).`,
    },
    {
      id: 'sec-3',
      num: '3',
      title: 'Организаторы и руководящие органы',
      content: `3.1. Учредитель Фестиваля: Министерство культуры Забайкальского края.
3.2. Организаторы Фестиваля:
• Школа креативных индустрий (ШКИ) Забайкальского края;
• ГПОУ «Забайкальское краевое училище культуры».
3.3. Для общего руководства подготовкой и проведением Фестиваля сформирован Организационный комитет (Оргкомитет), Отборочная комиссия и независимое профессиональное Жюри.`,
    },
    {
      id: 'sec-4',
      num: '4',
      title: 'Сроки, этапы и площадки проведения',
      content: `4.1. Даты проведения основных мероприятий: ${festivalInfo.dates} (3 дня).
4.2. Места проведения в г. Чита:
• Кинотеатр «Удокан» (ул. Ленина, д. 111) — площадка торжественного открытия, открытых конкурсных показов на большом экране, финала и награждения победителей;
• Школа креативных индустрий (ШКИ) Забайкальского края (ул. Красной Звезды, д. 7) — творческие воркшопы, мастер-классы приглашенных мастеров анимации, круглые столы и анимационная лаборатория.
4.3. Календарные этапы:
• Приём заявок и конкурсных фильмов: до 5 октября 2026 г. (включительно);
• Отборочный тур и формирование шорт-листа: 6 – 12 октября 2026 г.;
• Очные показы, работа жюри и церемония закрытия: 16 – 18 октября 2026 г.`,
    },
    {
      id: 'sec-5',
      num: '5',
      title: 'Участники и возрастные группы',
      content: `5.1. К участию приглашаются индивидуальные авторы, детские и подростковые студии анимации, учащиеся Школ креативных индустрий, студенты художественных училищ и профильных вузов, а также независимые творческие команды из всех регионов России.
5.2. Конкурс проводится по 3 (трём) возрастным категориям авторов:
• I возрастная категория: до 11 лет включительно (детские студии и юные мультипликаторы);
• II возрастная категория: от 12 до 17 лет включительно (подростковые студии, учащиеся ШКИ);
• III возрастная категория: от 18 лет (молодёжь, студенты вузов, взрослые авторы-дебютанты).`,
    },
    {
      id: 'sec-6',
      num: '6',
      title: 'Номинации конкурсной программы',
      content: `Конкурсная программа включает 7 официальных номинаций:
${nominations
  .map(
    (n, i) =>
      `\n${i + 1}) «${n.title}» [${n.code}]\n• Направленность: ${n.description}\n• Форматы и хронометраж: ${n.maxDuration || 'до 15 мин'}, ${(n.formats || ['MP4']).join(', ')}\n• Возрастные категории: ${(n.ageCategories || []).join(', ')}`
  )
  .join('\n')}`,
    },
    {
      id: 'sec-7',
      num: '7',
      title: 'Технические требования к конкурсным фильмам',
      content: `7.1. К участию допускаются фильмы, созданные в 2024–2026 годах.
7.2. Хронометраж работ: от 30 секунд до 15 минут (включая титры).
7.3. Формат видеофайлов: контейнеры MP4 или MOV, сжатие H.264, H.265 или Apple ProRes.
7.4. Разрешение видео: не менее Full HD (1920×1080), соотношение сторон 16:9. Разрешается предоставление 2K и 4K копий для фестивального экрана.
7.5. Аудио: стереодорожка (2.0), 48 кГц, 16/24 бит, сбалансированный уровень громкости без перегрузок.
7.6. Обязательно наличие титров (начальных или финальных) с указанием названия фильма, создателей, звукорежиссера, студии и года выпуска.
7.7. Язык фильмов: русский, либо оригинальный язык с русскими субтитрами.
7.8. К конкурсу не допускаются работы, содержащие нецензурную лексику, пропаганду насилия, розни или нарушающие законодательство РФ.`,
    },
    {
      id: 'sec-8',
      num: '8',
      title: 'Порядок подачи, регистрации и отбора заявок',
      content: `8.1. Участие в фестивале бесплатное.
8.2. Заявка направляется через интерактивную форму на официальном сайте ${festivalInfo.siteUrl} либо на адрес ${festivalInfo.email}.
8.3. В состав заявки входят:
• Прямая ссылка на облачное хранилище (Яндекс Диск, Облако Mail.ru, Google Drive, VK Видео) с возможностью скачивания файла фильма в оригинальном качестве;
• Не менее 3 качественных скриншотов (кадров) из фильма в высоком разрешении (JPG/PNG, от 1920×1080);
• Постер / афиша работы (при наличии);
• Синопсис (краткое описание сюжета до 500 знаков).
8.4. Один автор или студия имеет право подать несколько фильмов. На каждый фильм оформляется индивидуальная заявка.`,
    },
    {
      id: 'sec-9',
      num: '9',
      title: 'Профессиональное жюри и система оценки',
      content: `9.1. Состав профессионального жюри формируется Оргкомитетом из числа ведущих режиссеров анимации, продюсеров, художников и преподавателей анимационных школ России.
9.2. Оценивание работ осуществляется по 10-балльной системе по следующим критериям:
1. Драматургия и сценарий — целостность истории, выразительность персонажей, логика сюжета;
2. Анимационное мастерство — плавность движений, тайминг, спейсинг, владение выбранной техникой;
3. Визуальное решение — художественный стиль, колористика, композиция кадра, фон и декорации;
4. Звукорежиссура и музыка — озвучка персонажей, шумовой дизайн (фоли), гармония звука и картинки;
5. Целостность восприятия — оригинальность замысла и общее художественное воздействие.
9.3. Решение жюри является окончательным и пересмотру не подлежит.`,
    },
    {
      id: 'sec-10',
      num: '10',
      title: 'Подведение итогов, награждение и призовой фонд',
      content: `10.1. Главный приз Фестиваля (Гран-при): ${festivalInfo.grandPrize}, эксклюзивная памятная статуэтка «11 кадров» и диплом Гран-при.
10.2. В каждой конкурсной номинации и возрастной группе присуждаются дипломы Лауреатов I, II и III степеней.
10.3. Специальные награды:
• Особый приз от генерального спонсора фестиваля;
• Специальные призы и дипломы жюри («За лучший анимационный дебют», «За сохранение культурного наследия»);
• Приз зрительских симпатий по результатам открытого зрительского голосования в кинотеатре «Удокан».
10.4. Все участники конкурса получают именные официальные сертификаты участников Дальневосточного фестиваля креативной анимации.`,
    },
    {
      id: 'sec-11',
      num: '11',
      title: 'Авторские права, лицензирование и согласие на показ',
      content: `11.1. Заявитель гарантирует, что обладает всеми необходимыми правами на аудиовизуальное произведение и использованную музыку, и несет полную ответственность в случае претензий третьих лиц.
11.2. Участник безвозмездно предоставляет Оргкомитету право на некоммерческий публичный показ фильма в рамках фестивальной программы.
11.3. Оргкомитет получает право использовать фрагменты фильма (до 10% общего хронометража) и скриншоты для подготовки фестивальных каталогов, видеороликов, телерепортажей и публикаций в СМИ.`,
    },
    {
      id: 'sec-12',
      num: '12',
      title: 'Контакты и реквизиты Оргкомитета',
      content: `• Официальный веб-сайт фестиваля: ${festivalInfo.siteUrl}
• Официальный адрес электронной почты для заявок: ${festivalInfo.email}
• Контактный телефон горячей линии: ${festivalInfo.phone}
• Адрес места проведения: ${festivalInfo.venue} (г. Чита, Забайкальский край)`,
    },
  ], [festivalInfo, nominations]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.content.toLowerCase().includes(q) ||
        sec.num.includes(q)
    );
  }, [sections, searchQuery]);

  const handleDownloadText = () => {
    const blob = new Blob([fullRegulationText.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Polozhenie_11_kadrov_2026.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySection = async (sec: { num: string; title: string; content: string }) => {
    const text = `${sec.num}. ${sec.title.toUpperCase()}\n\n${sec.content}`;
    await copyToClipboard(text);
    setCopiedSection(sec.num);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0b0e24] border border-[#2b3777] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#10153d] via-[#151c50] to-[#0f1338] border-b border-[#232d66] flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00F0FF] to-[#0072FF] text-black flex items-center justify-center shadow-lg shadow-[#00F0FF]/20 flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider">
                  Официальный документ • Читать онлайн
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Утверждено оргкомитетом
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-white font-display leading-tight truncate">
                Положение о фестивале «11 кадров» (Чита, 2026)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleDownloadText}
              className="p-2 sm:p-2.5 rounded-xl bg-[#171f4b] hover:bg-[#232e6e] text-gray-300 hover:text-white border border-[#2b397c] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Скачать файл положения"
            >
              <Download className="w-4 h-4 text-[#00F0FF]" />
              <span className="hidden md:inline">Скачать (.txt)</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 sm:p-2.5 rounded-xl bg-[#171f4b] hover:bg-[#232e6e] text-gray-300 hover:text-white border border-[#2b397c] transition-all cursor-pointer hidden sm:flex"
              title="Распечатать положение"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-[#171f4b] hover:bg-[#FF007A] text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1b2352] bg-[#0c102b] px-4 sm:px-6 gap-2 flex-shrink-0">
          <div className="flex overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('reader')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reader'
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Читать Положение целиком</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF]">
                12 глав
              </span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'summary'
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
              <span>Краткая выжимка (шпаргалка)</span>
            </button>
            <button
              onClick={() => setActiveTab('criteria')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'criteria'
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#FF007A]" />
              <span>Критерии оценки жюри</span>
            </button>
          </div>

          {/* Reader Tools (Font Size + Search) */}
          {activeTab === 'reader' && (
            <div className="flex items-center gap-2 pb-2 sm:pb-0">
              <div className="flex items-center bg-[#13193e] rounded-xl border border-[#232e69] p-0.5">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    fontSize === 'sm' ? 'bg-[#00F0FF] text-black font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Шрифт: мелкий"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('base')}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    fontSize === 'base' ? 'bg-[#00F0FF] text-black font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Шрифт: стандартный"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    fontSize === 'lg' ? 'bg-[#00F0FF] text-black font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Шрифт: крупный"
                >
                  A+
                </button>
              </div>

              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Поиск по тексту..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#11173d] border border-[#232e69] focus:border-[#00F0FF] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-gray-300 leading-relaxed custom-scrollbar flex-1 bg-[#090c21]">
          {/* ======================================================== */}
          {/* TAB 1: FULL ONLINE READER */}
          {/* ======================================================== */}
          {activeTab === 'reader' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Table of Contents (Sticky on Desktop) */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-3">
                <div className="bg-[#0f1436] border border-[#222c66] rounded-2xl p-4 sticky top-0 shadow-lg">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1f285c]">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#00F0FF]" /> Оглавление
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {filteredSections.length} из {sections.length}
                    </span>
                  </div>

                  <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                    {sections.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-start gap-2 cursor-pointer ${
                          activeSectionId === sec.id
                            ? 'bg-gradient-to-r from-[#00F0FF]/20 to-[#0072FF]/20 text-[#00F0FF] font-bold border border-[#00F0FF]/40'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-[#161c47]'
                        }`}
                      >
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#18204d] text-gray-300 mt-0.5 flex-shrink-0">
                          § {sec.num}
                        </span>
                        <span className="line-clamp-2 leading-tight">{sec.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Right Column: Full Text Content with Section Headers */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                {/* Official Letterhead Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12183e] to-[#0d1230] border border-[#25306d] text-center space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#00F0FF]">
                    Министерство культуры Забайкальского края
                  </div>
                  <h2 className="text-base sm:text-xl font-black text-white font-display uppercase tracking-tight">
                    Положение о проведении Дальневосточного фестиваля креативной анимации «11 кадров»
                  </h2>
                  <p className="text-xs text-gray-400 max-w-xl mx-auto">
                    Официальный свод правил, требований к конкурсным фильмам, порядка подачи заявок и работы жюри.
                  </p>
                </div>

                {filteredSections.length === 0 && (
                  <div className="p-8 text-center bg-[#101438] rounded-2xl border border-[#202960]">
                    <Search className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-300 font-semibold">По запросу «{searchQuery}» ничего не найдено</p>
                    <p className="text-xs text-gray-500 mt-1">Попробуйте ввести другое ключевое слово или очистить строку поиска.</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-[#1b2354] hover:bg-[#253070] text-xs text-white"
                    >
                      Сбросить поиск
                    </button>
                  </div>
                )}

                {/* Section Cards */}
                {filteredSections.map((sec) => (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0f1436] border border-[#232d66] hover:border-[#384898] transition-all space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-[#1c2454] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-black text-xs flex items-center justify-center font-mono">
                          {sec.num}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-white font-display">
                          {sec.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleCopySection(sec)}
                        className="p-1.5 rounded-lg bg-[#18204c] hover:bg-[#263375] text-gray-400 hover:text-white text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Скопировать главу"
                      >
                        {copiedSection === sec.num ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400 hidden sm:inline">Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">Копировать</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div
                      className={`text-gray-300 font-sans leading-relaxed whitespace-pre-line ${
                        fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
                      }`}
                    >
                      {sec.content}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SUMMARY (QUICK FACTS) */}
          {/* ======================================================== */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Highlight Prize Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00F0FF]/15 via-[#FFD600]/15 to-[#FF007A]/15 border border-[#00F0FF]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#FFD600] font-black text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" /> Главный приз фестиваля
                  </div>
                  <p className="text-white font-black text-lg sm:text-2xl font-display">
                    Гран-при: {festivalInfo.grandPrize} + Статуэтка «11 кадров»
                  </p>
                </div>
                <div className="text-xs text-gray-300 bg-[#0e122e] px-4 py-2 rounded-xl border border-[#242f69]">
                  Сроки: <strong className="text-white">{festivalInfo.dates}</strong>
                </div>
              </div>

              {/* 4 Pillars of the Festival */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#111638] border border-[#232d66] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Users className="w-4 h-4 text-[#00F0FF]" /> Кто может участвовать?
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Индивидуальные авторы, детские и подростковые анимационные студии, учащиеся Школ креативных индустрий, студенты и творческие коллективы со всей России в 3 возрастных группах (до 11 лет, 12–17 лет, 18+).
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111638] border border-[#232d66] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Video className="w-4 h-4 text-[#FF007A]" /> Требования к фильму
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Год производства: <strong>2024–2026</strong>. Хронометраж: <strong>от 30 секунд до 15 минут</strong>. Формат: MP4 или MOV в разрешении Full HD (1920×1080) или 4K.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111638] border border-[#232d66] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD600]" /> Участие абсолютно бесплатное
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Фестиваль не взимает организационных и вступительных взносов. Все показы, мастер-классы, воркшопы и образовательные активности открыты для участников.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111638] border border-[#232d66] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Авторские права и титры
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Заявитель гарантирует авторство работы и лицензионную чистоту саундтрека. Обязательно наличие титров с именами создателей.
                  </p>
                </div>
              </div>

              {/* Step by Step submission */}
              <div className="p-5 rounded-2xl bg-[#0f1436] border border-[#222c66] space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#00F0FF]" /> 4 простых шага для подачи заявки:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0a0d24] border border-[#1b2354] space-y-1">
                    <span className="font-bold text-[#00F0FF] block">Шаг 1. Подготовка</span>
                    <span className="text-gray-400">Проверьте фильм: от 30 сек до 15 мин, наличие титров и чистый звук.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0a0d24] border border-[#1b2354] space-y-1">
                    <span className="font-bold text-[#00F0FF] block">Шаг 2. Облако</span>
                    <span className="text-gray-400">Загрузите видео и 3 скриншота на Яндекс.Диск или Облако Mail.ru с открытым доступом.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0a0d24] border border-[#1b2354] space-y-1">
                    <span className="font-bold text-[#FFD600] block">Шаг 3. Анкета</span>
                    <span className="text-gray-400">Заполните интерактивную онлайн-форму на этом сайте за 3 минуты.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0a0d24] border border-[#1b2354] space-y-1">
                    <span className="font-bold text-emerald-400 block">Шаг 4. Шорт-лист</span>
                    <span className="text-gray-400">Получите номер заявки и ожидайте итоги отбора для показа в кинотеатре «Удокан».</span>
                  </div>
                </div>
              </div>

              {/* 7 Nominations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  7 официальных номинаций 2026 года:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {nominations.map((n, i) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-xl bg-[#11163a] border border-[#222d66] text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-white">
                        {i + 1}. {n.title}
                      </span>
                      <span className="text-[11px] text-[#00F0FF] font-mono">{n.subtitle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CRITERIA */}
          {/* ======================================================== */}
          {activeTab === 'criteria' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#111638] border border-[#232d66] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFD600]/15 text-[#FFD600] border border-[#FFD600]/30">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      10-балльная шкала оценивания работ профессиональным жюри
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Каждый эксперт жюри заполняет индивидуальный судейский протокол по 5 ключевым компонентам.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-[#0b0e26] border border-[#1f285c] space-y-1">
                    <span className="font-bold text-[#00F0FF] block text-sm">1. Драматургия и сценарий (до 10 баллов)</span>
                    <span className="text-gray-300">
                      Целостность истории, выразительность персонажей, логика сюжета, смысловая глубина и посыл.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0b0e26] border border-[#1f285c] space-y-1">
                    <span className="font-bold text-[#FF007A] block text-sm">2. Анимационное мастерство (до 10 баллов)</span>
                    <span className="text-gray-300">
                      Тайминг, спейсинг, пластика и плавность движений, сложность и виртуозность владения техникой.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0b0e26] border border-[#1f285c] space-y-1">
                    <span className="font-bold text-[#FFD600] block text-sm">3. Визуальное решение (до 10 баллов)</span>
                    <span className="text-gray-300">
                      Художественный стиль, работа с цветом, композиция кадра, проработка персонажей и фонов.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0b0e26] border border-[#1f285c] space-y-1">
                    <span className="font-bold text-emerald-400 block text-sm">4. Звукорежиссура и музыка (до 10 баллов)</span>
                    <span className="text-gray-300">
                      Озвучивание персонажей, шумовые эффекты (фоли), авторский саундтрек и органичность с видеорядом.
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-xl bg-[#0b0e26] border border-[#1f285c] space-y-1">
                    <span className="font-bold text-purple-300 block text-sm">5. Общее восприятие и оригинальность (до 10 баллов)</span>
                    <span className="text-gray-300">
                      Эмоциональный отклик, уникальность авторского голоса, смелость художественного поиска.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-[#0a0d22] border-t border-[#1b2352] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <span>Оргкомитет фестиваля:</span>
            <a href={`tel:${festivalInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-[#00F0FF] font-semibold hover:underline">
              {festivalInfo.phone}
            </a>
            <span>•</span>
            <a href={`mailto:${festivalInfo.email}`} className="text-[#00F0FF] font-semibold hover:underline">
              {festivalInfo.email}
            </a>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleDownloadText}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#151c44] hover:bg-[#202b66] border border-[#273575] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Скачать Положение</span>
            </button>

            {onOpenApply && (
              <button
                onClick={() => {
                  onClose();
                  onOpenApply();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#FF8A00] hover:from-[#ff1a8c] hover:to-[#ff991a] text-white text-xs font-black shadow-lg shadow-[#FF007A]/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Подать заявку</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
