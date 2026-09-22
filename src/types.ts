export interface EventItem {
  id: string;
  title: string;
  category: 'masterclass' | 'screening' | 'lecture' | 'performance' | 'competition' | 'ceremony';
  categoryLabel: string;
  day: number; // 1, 2, 3
  dateStr: string;
  time: string;
  endTime: string;
  location: string;
  speaker?: string;
  speakerRole?: string;
  speakerAvatar?: string;
  description: string;
  targetAudience: string;
  tags: string[];
  capacity?: number;
  isRegistered?: boolean;
}

export interface Nomination {
  id: string;
  title: string;
  code: string;
  iconName: string;
  color: string;
  description: string;
  criteria: string[];
  ageCategories: string[];
  maxDuration: string;
  formats: string[];
}

export interface JuryMember {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  bio: string;
  filmography?: string[];
  achievements?: string[];
  avatar: string;
  imagePosition?: string;
  tags: string[];
}

export interface AnimationWork {
  id: string;
  title: string;
  author: string;
  studio?: string;
  city: string;
  ageCategory: string;
  nomination: string;
  duration: string;
  thumbnail: string;
  videoPreviewUrl?: string;
  likes: number;
  year: number;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ShkiStudio {
  id: string;
  title: string;
  icon: string;
  desc: string;
}

export type AnimashPlacementKey = 'default' | 'hero' | 'floating' | 'card' | 'helper';

export interface AnimashImages {
  default: string;     // Общий базовый образ маскота
  hero: string;        // Главный экран (Hero switcher)
  floating: string;    // Плавающий виджет-гид в правом нижнем углу
  card: string;        // Карточка в блоке «О ШКИ и талисмане»
  helper: string;      // Помощник в интерактивной студии «11 кадров»
}

export interface AnimashSettings {
  name: string;
  badge: string;
  storyTitle: string;
  storyText: string;
  tag1: string;
  tag2: string;
  tag3: string;
  tips: string[];
  images: AnimashImages;
}

export interface FestivalInfo {
  name: string;
  fullName: string;
  shortDescription: string;
  organizer: string;
  parentOrg: string;
  venue: string;
  dates: string;
  grandPrize: string;
  submissionDeadline: string;
  entryFee: string;
  symbol: string;
  phone: string;
  email: string;
  vkUrl: string;
  siteUrl: string;
}

export interface ApplicationFormData {
  agreePersonalData: boolean;
  participationCategory: 'short_film' | 'series' | 'other_noncomp';
  workTitle: string;
  studioOrAuthor: string;
  duration: string;
  nomination: string;
  filmAgeRating: string;
  animationTechnique: string;
  synopsis?: string;
  director: string;
  screenwriter: string;
  artDirector: string;
  voiceActors: string;
  composer: string;
  copyrightHolder: string;
  videoLink: string;
  posterLink?: string;
  framesLinks: string;
  applicantName: string;
  participantAgeCategory: 'I' | 'II' | 'III';
  workplaceAndPosition: string;
  city: string;
  phone: string;
  email: string;
  copyrightConfirmed: boolean;
  agreeRules: boolean;
}

export interface StoredApplication extends ApplicationFormData {
  id: string;
  dbId?: number;
  date: string;
  status?: 'new' | 'reviewed' | 'shortlist' | 'laureate' | 'rejected' | 'pending' | 'approved';
  adminNotes?: string;
  emailSent?: boolean;
  emailError?: string;
  authorName?: string;
  filmTitle?: string;
  nominationId?: string;
  birthDate?: string;
  telegram?: string;
  studioOrSchool?: string;
}
