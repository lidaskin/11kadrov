import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FestivalInfo,
  EventItem,
  Nomination,
  JuryMember,
  AnimationWork,
  FaqItem,
  ShkiStudio,
  StoredApplication,
  AnimashSettings,
  AnimashPlacementKey,
} from '../types';
import {
  FESTIVAL_INFO as INITIAL_FESTIVAL_INFO,
  SCHEDULE_EVENTS as INITIAL_SCHEDULE_EVENTS,
  NOMINATIONS as INITIAL_NOMINATIONS,
  JURY_MEMBERS as INITIAL_JURY_MEMBERS,
  GALLERY_WORKS as INITIAL_GALLERY_WORKS,
  FAQS as INITIAL_FAQS,
  SHKI_STUDIOS as INITIAL_SHKI_STUDIOS,
  INITIAL_ANIMASH_SETTINGS,
} from '../festivalData';

interface FestivalContextType {
  // State
  festivalInfo: FestivalInfo;
  animashSettings: AnimashSettings;
  scheduleEvents: EventItem[];
  nominations: Nomination[];
  juryMembers: JuryMember[];
  galleryWorks: AnimationWork[];
  faqs: FaqItem[];
  shkiStudios: ShkiStudio[];
  applications: StoredApplication[];

  // Admin Auth
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;

  // CRUD Festival Info
  updateFestivalInfo: (data: Partial<FestivalInfo>) => void;

  // Mascot / Animash
  updateAnimashSettings: (data: Partial<AnimashSettings>) => void;
  updateAnimashImage: (placement: AnimashPlacementKey, imageUrl: string) => void;
  setAnimashImageForAll: (imageUrl: string) => void;
  resetAnimashSettings: () => void;

  // CRUD Schedule
  addScheduleEvent: (event: Omit<EventItem, 'id'>) => void;
  updateScheduleEvent: (id: string, event: Partial<EventItem>) => void;
  deleteScheduleEvent: (id: string) => void;

  // CRUD Nominations
  addNomination: (nom: Omit<Nomination, 'id'>) => void;
  updateNomination: (id: string, nom: Partial<Nomination>) => void;
  deleteNomination: (id: string) => void;

  // CRUD Jury
  addJuryMember: (jury: Omit<JuryMember, 'id'>) => void;
  updateJuryMember: (id: string, jury: Partial<JuryMember>) => void;
  deleteJuryMember: (id: string) => void;

  // CRUD Gallery Works
  addGalleryWork: (work: Omit<AnimationWork, 'id'>) => void;
  updateGalleryWork: (id: string, work: Partial<AnimationWork>) => void;
  deleteGalleryWork: (id: string) => void;

  // CRUD FAQ
  addFaq: (faq: FaqItem) => void;
  updateFaq: (index: number, faq: Partial<FaqItem>) => void;
  deleteFaq: (index: number) => void;

  // Applications CRM
  updateApplicationStatus: (id: string, status: StoredApplication['status'], adminNotes?: string) => void;
  deleteApplication: (id: string) => void;
  addApplication: (app: StoredApplication) => void;
  refreshApplications: () => void;
  syncApplicationsFromDb: () => Promise<void>;
  resendApplicationEmail: (dbId: number) => Promise<{ success: boolean; error?: string }>;

  // Backup / Restore
  exportAllData: () => string;
  importAllData: (jsonData: string) => { success: boolean; message: string };
  resetToDefaults: () => void;
}

const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INFO: 'shki_fest_info_v3',
  ANIMASH: 'shki_fest_animash_v3',
  SCHEDULE: 'shki_fest_schedule_v3',
  NOMINATIONS: 'shki_fest_nominations_v3',
  JURY: 'shki_fest_jury_v4',
  GALLERY: 'shki_fest_gallery_v3',
  FAQS: 'shki_fest_faqs_v3',
  STUDIOS: 'shki_fest_studios_v3',
  APPLICATIONS: 'festival_applications_archive',
  ADMIN_AUTH: 'shki_fest_admin_token_v3',
  ADMIN_PASSWORD: 'shki_fest_admin_password_v3',
};

const DEFAULT_ADMIN_PASS = '11kadrov';

export const FestivalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Festival Info
  const [festivalInfo, setFestivalInfo] = useState<FestivalInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO);
      return saved ? { ...INITIAL_FESTIVAL_INFO, ...JSON.parse(saved) } : INITIAL_FESTIVAL_INFO;
    } catch {
      return INITIAL_FESTIVAL_INFO;
    }
  });

  // 1.1 Animash / Mascot Settings
  const [animashSettings, setAnimashSettings] = useState<AnimashSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANIMASH);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_ANIMASH_SETTINGS,
          ...parsed,
          images: {
            ...INITIAL_ANIMASH_SETTINGS.images,
            ...(parsed.images || {}),
          },
        };
      }
      return INITIAL_ANIMASH_SETTINGS;
    } catch {
      return INITIAL_ANIMASH_SETTINGS;
    }
  });

  // 2. Schedule Events
  const [scheduleEvents, setScheduleEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_EVENTS;
    } catch {
      return INITIAL_SCHEDULE_EVENTS;
    }
  });

  // 3. Nominations
  const [nominations, setNominations] = useState<Nomination[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOMINATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOMINATIONS;
    } catch {
      return INITIAL_NOMINATIONS;
    }
  });

  // 4. Jury Members
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JURY);
      const parsed = saved ? JSON.parse(saved) : INITIAL_JURY_MEMBERS;
      return Array.isArray(parsed)
        ? parsed.filter((j: JuryMember) => j.id !== 'j-3' && !j.name?.toLowerCase().includes('антонов'))
        : INITIAL_JURY_MEMBERS;
    } catch {
      return INITIAL_JURY_MEMBERS;
    }
  });

  // 5. Gallery Works
  const [galleryWorks, setGalleryWorks] = useState<AnimationWork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY_WORKS;
    } catch {
      return INITIAL_GALLERY_WORKS;
    }
  });

  // 6. FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  // 7. Studios
  const [shkiStudios] = useState<ShkiStudio[]>(INITIAL_SHKI_STUDIOS);

  // 8. Applications Archive
  const [applications, setApplications] = useState<StoredApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 9. Admin Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Persist State to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(festivalInfo));
    } catch (e) {
      console.error(e);
    }
  }, [festivalInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleEvents));
    } catch (e) {
      console.error(e);
    }
  }, [scheduleEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(nominations));
    } catch (e) {
      console.error(e);
    }
  }, [nominations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JURY, JSON.stringify(juryMembers));
    } catch (e) {
      console.error(e);
    }
  }, [juryMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(galleryWorks));
    } catch (e) {
      console.error(e);
    }
  }, [galleryWorks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    } catch (e) {
      console.error(e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANIMASH, JSON.stringify(animashSettings));
    } catch (e) {
      console.error(e);
    }
  }, [animashSettings]);

  // Auth methods
  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        return true;
      }
    } catch (e) {
      console.warn('Backend login verification failed, using local fallback:', e);
    }

    const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASS;
    if (password.trim() === currentPass) {
      setIsAdmin(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const changeAdminPassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    if (newPass.length < 4) {
      return { success: false, message: 'Новый пароль должен содержать не менее 4 символов' };
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: oldPass.trim(), newPassword: newPass.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPass);
        return { success: true, message: 'Пароль администратора успешно обновлён в базе данных!' };
      } else if (data.error) {
        return { success: false, message: data.error };
      }
    } catch (e) {
      console.warn('Backend password change failed, using local fallback:', e);
    }

    const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASS;
    if (oldPass !== currentPass) {
      return { success: false, message: 'Текущий пароль указан неверно' };
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPass);
    return { success: true, message: 'Пароль администратора успешно изменен' };
  };

  // CRUD Festival Info
  const updateFestivalInfo = (data: Partial<FestivalInfo>) => {
    setFestivalInfo((prev) => ({ ...prev, ...data }));
  };

  // Mascot / Animash Methods
  const updateAnimashSettings = (data: Partial<AnimashSettings>) => {
    setAnimashSettings((prev) => ({
      ...prev,
      ...data,
      images: data.images ? { ...prev.images, ...data.images } : prev.images,
    }));
  };

  const updateAnimashImage = (placement: AnimashPlacementKey, imageUrl: string) => {
    setAnimashSettings((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [placement]: imageUrl,
      },
    }));
  };

  const setAnimashImageForAll = (imageUrl: string) => {
    setAnimashSettings((prev) => ({
      ...prev,
      images: {
        default: imageUrl,
        hero: imageUrl,
        floating: imageUrl,
        card: imageUrl,
        helper: imageUrl,
      },
    }));
  };

  const resetAnimashSettings = () => {
    setAnimashSettings(INITIAL_ANIMASH_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEYS.ANIMASH);
    } catch (e) {
      console.error(e);
    }
  };

  // CRUD Schedule
  const addScheduleEvent = (eventData: Omit<EventItem, 'id'>) => {
    const newId = `ev-${Date.now()}`;
    const newEvent: EventItem = { ...eventData, id: newId };
    setScheduleEvents((prev) => [newEvent, ...prev]);
  };

  const updateScheduleEvent = (id: string, updatedFields: Partial<EventItem>) => {
    setScheduleEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updatedFields } : ev))
    );
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // CRUD Nominations
  const addNomination = (nomData: Omit<Nomination, 'id'>) => {
    const newId = `nom-${Date.now()}`;
    const newNom: Nomination = { ...nomData, id: newId };
    setNominations((prev) => [...prev, newNom]);
  };

  const updateNomination = (id: string, updatedFields: Partial<Nomination>) => {
    setNominations((prev) =>
      prev.map((nom) => (nom.id === id ? { ...nom, ...updatedFields } : nom))
    );
  };

  const deleteNomination = (id: string) => {
    setNominations((prev) => prev.filter((nom) => nom.id !== id));
  };

  // CRUD Jury
  const addJuryMember = (juryData: Omit<JuryMember, 'id'>) => {
    const newId = `jury-${Date.now()}`;
    const newJury: JuryMember = { ...juryData, id: newId };
    setJuryMembers((prev) => [...prev, newJury]);
  };

  const updateJuryMember = (id: string, updatedFields: Partial<JuryMember>) => {
    setJuryMembers((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updatedFields } : j))
    );
  };

  const deleteJuryMember = (id: string) => {
    setJuryMembers((prev) => prev.filter((j) => j.id !== id));
  };

  // CRUD Gallery Works
  const addGalleryWork = (workData: Omit<AnimationWork, 'id'>) => {
    const newId = `w-${Date.now()}`;
    const newWork: AnimationWork = { ...workData, id: newId };
    setGalleryWorks((prev) => [newWork, ...prev]);
  };

  const updateGalleryWork = (id: string, updatedFields: Partial<AnimationWork>) => {
    setGalleryWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedFields } : w))
    );
  };

  const deleteGalleryWork = (id: string) => {
    setGalleryWorks((prev) => prev.filter((w) => w.id !== id));
  };

  // CRUD FAQ
  const addFaq = (faq: FaqItem) => {
    setFaqs((prev) => [...prev, faq]);
  };

  const updateFaq = (index: number, updatedFields: Partial<FaqItem>) => {
    setFaqs((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Applications CRM
  const syncApplicationsFromDb = async () => {
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const dbList = await res.json();
        if (Array.isArray(dbList) && dbList.length > 0) {
          setApplications((prev) => {
            const byExternal = new Map<string, StoredApplication>(prev.map((p) => [p.id, p]));
            const dbMapped: StoredApplication[] = dbList.map((dbApp: any) => {
              const existing = byExternal.get(dbApp.externalId || `db_${dbApp.id}`);
              return {
                id: dbApp.externalId || `db_${dbApp.id}`,
                dbId: dbApp.id,
                date: dbApp.createdAt ? new Date(dbApp.createdAt).toISOString() : new Date().toISOString(),
                status: (dbApp.status || 'new') as any,
                emailSent: dbApp.emailSent,
                emailError: dbApp.emailError,
                workTitle: dbApp.workTitle || '',
                filmTitle: dbApp.workTitle || '',
                nomination: dbApp.nominationTitle || '',
                nominationId: dbApp.nominationId || '',
                duration: dbApp.duration || '',
                animationTechnique: dbApp.technique || '',
                synopsis: dbApp.description || '',
                videoLink: dbApp.link || '',
                framesLinks: '',
                applicantName: dbApp.authorName || '',
                authorName: dbApp.authorName || '',
                participantAgeCategory: 'II',
                workplaceAndPosition: dbApp.organization || '',
                city: dbApp.city || '',
                phone: dbApp.phone || '',
                email: dbApp.email || '',
                telegram: dbApp.telegram || '',
                studioOrAuthor: dbApp.organization || '',
                participationCategory: 'short_film',
                filmAgeRating: '6+',
                director: dbApp.authorName || '',
                screenwriter: '',
                artDirector: '',
                voiceActors: '',
                composer: '',
                copyrightHolder: dbApp.authorName || '',
                agreePersonalData: true,
                copyrightConfirmed: true,
                agreeRules: true,
                adminNotes: existing?.adminNotes || '',
              };
            });

            const dbIds = new Set(dbMapped.map((m) => m.id));
            const localOnly = prev.filter((p) => !dbIds.has(p.id));
            return [...dbMapped, ...localOnly];
          });
        }
      }
    } catch (e) {
      console.warn('Could not sync applications from DB:', e);
    }
  };

  useEffect(() => {
    syncApplicationsFromDb();
  }, []);

  const updateApplicationStatus = async (
    id: string,
    status: StoredApplication['status'],
    adminNotes?: string
  ) => {
    let targetDbId: number | undefined;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          targetDbId = app.dbId;
          return { ...app, status, adminNotes: adminNotes !== undefined ? adminNotes : app.adminNotes };
        }
        return app;
      })
    );

    if (targetDbId) {
      try {
        await fetch(`/api/applications/${targetDbId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
      } catch (e) {
        console.warn('Failed to update status in DB:', e);
      }
    }
  };

  const deleteApplication = async (id: string) => {
    const target = applications.find((a) => a.id === id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
    if (target?.dbId) {
      try {
        await fetch(`/api/applications/${target.dbId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Failed to delete application from DB:', e);
      }
    }
  };

  const addApplication = async (app: StoredApplication) => {
    setApplications((prev) => [app, ...prev]);

    try {
      const payload = {
        id: app.id,
        authorName: app.authorName || app.applicantName || app.director || 'Участник',
        birthDate: app.birthDate || '',
        city: app.city || '',
        organization: app.studioOrAuthor || app.workplaceAndPosition || '',
        phone: app.phone || '',
        email: app.email || '',
        telegram: app.telegram || '',
        workTitle: app.workTitle || app.filmTitle || 'Конкурсная работа',
        nominationId: app.nominationId || app.nomination || 'main',
        nominationTitle: app.nomination || 'Основная номинация',
        duration: app.duration || '',
        description: app.synopsis || '',
        link: app.videoLink || '',
        technique: app.animationTechnique || '',
        consent: true,
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.application?.id) {
          setApplications((prev) =>
            prev.map((item) =>
              item.id === app.id
                ? {
                    ...item,
                    dbId: data.application.id,
                    emailSent: data.mailResult?.success,
                    emailError: data.mailResult?.error,
                  }
                : item
            )
          );
        }
      }
    } catch (e) {
      console.error('Failed to post application to backend DB / mailer:', e);
    }
  };

  const resendApplicationEmail = async (dbId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/applications/${dbId}/resend-email`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplications((prev) =>
          prev.map((item) =>
            item.dbId === dbId
              ? { ...item, emailSent: true, emailError: undefined }
              : item
          )
        );
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Ошибка отправки' };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Сетевая ошибка' };
    }
  };

  const refreshApplications = () => {
    syncApplicationsFromDb();
  };

  // Backup & Restore
  const exportAllData = (): string => {
    const bundle = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      festivalInfo,
      animashSettings,
      scheduleEvents,
      nominations,
      juryMembers,
      galleryWorks,
      faqs,
      applications,
    };
    return JSON.stringify(bundle, null, 2);
  };

  const importAllData = (jsonData: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonData);
      if (data.festivalInfo) setFestivalInfo(data.festivalInfo);
      if (data.animashSettings) setAnimashSettings(data.animashSettings);
      if (data.scheduleEvents && Array.isArray(data.scheduleEvents)) setScheduleEvents(data.scheduleEvents);
      if (data.nominations && Array.isArray(data.nominations)) setNominations(data.nominations);
      if (data.juryMembers && Array.isArray(data.juryMembers)) setJuryMembers(data.juryMembers);
      if (data.galleryWorks && Array.isArray(data.galleryWorks)) setGalleryWorks(data.galleryWorks);
      if (data.faqs && Array.isArray(data.faqs)) setFaqs(data.faqs);
      if (data.applications && Array.isArray(data.applications)) setApplications(data.applications);
      return { success: true, message: 'Все данные фестиваля успешно импортированы!' };
    } catch {
      return { success: false, message: 'Ошибка чтения JSON: некорректный формат файла' };
    }
  };

  const resetToDefaults = () => {
    setFestivalInfo(INITIAL_FESTIVAL_INFO);
    setAnimashSettings(INITIAL_ANIMASH_SETTINGS);
    setScheduleEvents(INITIAL_SCHEDULE_EVENTS);
    setNominations(INITIAL_NOMINATIONS);
    setJuryMembers(INITIAL_JURY_MEMBERS);
    setGalleryWorks(INITIAL_GALLERY_WORKS);
    setFaqs(INITIAL_FAQS);
    localStorage.removeItem(STORAGE_KEYS.INFO);
    localStorage.removeItem(STORAGE_KEYS.ANIMASH);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.NOMINATIONS);
    localStorage.removeItem(STORAGE_KEYS.JURY);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.FAQS);
  };

  return (
    <FestivalContext.Provider
      value={{
        festivalInfo,
        animashSettings,
        scheduleEvents,
        nominations,
        juryMembers,
        galleryWorks,
        faqs,
        shkiStudios,
        applications,
        isAdmin,
        login,
        logout,
        changeAdminPassword,
        updateFestivalInfo,
        updateAnimashSettings,
        updateAnimashImage,
        setAnimashImageForAll,
        resetAnimashSettings,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        addNomination,
        updateNomination,
        deleteNomination,
        addJuryMember,
        updateJuryMember,
        deleteJuryMember,
        addGalleryWork,
        updateGalleryWork,
        deleteGalleryWork,
        addFaq,
        updateFaq,
        deleteFaq,
        updateApplicationStatus,
        deleteApplication,
        addApplication,
        refreshApplications,
        syncApplicationsFromDb,
        resendApplicationEmail,
        exportAllData,
        importAllData,
        resetToDefaults,
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
};

export const useFestival = () => {
  const context = useContext(FestivalContext);
  if (!context) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
};
