import React, { useState, useEffect } from 'react';
import { FestivalProvider, useFestival } from './context/FestivalContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveSchedule } from './components/InteractiveSchedule';
import { NominationsGrid } from './components/NominationsGrid';
import { FlipbookMiniStudio } from './components/FlipbookMiniStudio';
import { GallerySection } from './components/GallerySection';
import { JurySection } from './components/JurySection';
import { ShkiAboutSection } from './components/ShkiAboutSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ApplicationModal } from './components/ApplicationModal';
import { TicketPassModal } from './components/TicketPassModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { MilashAnimash } from './components/MilashAnimash';
import { RegulationModal } from './components/RegulationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdminFloatingBar } from './components/AdminFloatingBar';
import { EventItem } from './types';

function AppContent() {
  // Modal states
  const [isApplyOpen, setIsApplyOpen] = useState<boolean>(false);
  const [selectedNominationForApply, setSelectedNominationForApply] = useState<string | undefined>(undefined);
  const [selectedEventForPass, setSelectedEventForPass] = useState<EventItem | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isRegulationOpen, setIsRegulationOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // Saved schedule bookmarks in localStorage
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('11k_saved_events');
      return stored ? JSON.parse(stored) : ['ev-1', 'ev-5', 'ev-9'];
    } catch {
      return ['ev-1', 'ev-5', 'ev-9'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('11k_saved_events', JSON.stringify(savedEventIds));
    } catch {
      // ignore
    }
  }, [savedEventIds]);

  const handleToggleSaveEvent = (eventId: string) => {
    setSavedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleClearAllSaves = () => {
    setSavedEventIds([]);
  };

  const handleOpenApplyModal = (nominationTitle?: string) => {
    setSelectedNominationForApply(nominationTitle);
    setIsApplyOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c16] text-white flex flex-col selection:bg-[#00F0FF] selection:text-black font-sans relative">
      {/* Sticky Header Navigation */}
      <Navbar
        onOpenApply={handleOpenApplyModal}
        savedCount={savedEventIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenRegulation={() => setIsRegulationOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection
          onOpenApply={() => handleOpenApplyModal()}
          onScrollToSchedule={() => handleScrollToSection('schedule')}
          onScrollToMiniStudio={() => handleScrollToSection('mini-studio')}
          onOpenRegulation={() => setIsRegulationOpen(true)}
        />

        {/* 2. Interactive Schedule */}
        <InteractiveSchedule
          savedEventIds={savedEventIds}
          onToggleSave={handleToggleSaveEvent}
          onRegisterEvent={(event) => setSelectedEventForPass(event)}
        />

        {/* 3. Nominations & Competition Categories */}
        <NominationsGrid
          onSelectNominationForApply={(nomTitle) => handleOpenApplyModal(nomTitle)}
          onOpenRegulation={() => setIsRegulationOpen(true)}
        />

        {/* 4. Interactive 11-Frame Mini Animation Studio & Animator Sandbox */}
        <FlipbookMiniStudio />

        {/* 5. Showcase / Video Gallery */}
        <GallerySection />

        {/* 6. Jury & Expert Council */}
        <JurySection />

        {/* 7. About School of Creative Industries & Location */}
        <ShkiAboutSection />

        {/* 8. Frequently Asked Questions */}
        <FaqSection
          onOpenRegulation={() => setIsRegulationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenRegulation={() => setIsRegulationOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Admin Floating Quick Access Bar */}
      <AdminFloatingBar onOpenDashboard={() => setIsAdminDashboardOpen(true)} />

      {/* Online Application Wizard Modal */}
      <ApplicationModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        initialNomination={selectedNominationForApply}
      />

      {/* Official Festival Regulation Modal */}
      <RegulationModal
        isOpen={isRegulationOpen}
        onClose={() => setIsRegulationOpen(false)}
        onOpenApply={() => handleOpenApplyModal()}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onOpenDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Admin Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />

      {/* Event Ticket / Pass Generator Modal */}
      <TicketPassModal
        event={selectedEventForPass}
        onClose={() => setSelectedEventForPass(null)}
      />

      {/* Saved Events Bookmarks Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedEventIds={savedEventIds}
        onRemoveSave={handleToggleSaveEvent}
        onClearAll={handleClearAllSaves}
      />

      {/* Interactive Floating Mascot Assistant: Milash-Animash */}
      <MilashAnimash
        variant="floating"
        onActionClick={(action) => {
          if (action === 'apply') {
            handleOpenApplyModal();
          } else if (action === 'studio') {
            handleScrollToSection('mini-studio');
          }
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <FestivalProvider>
      <AppContent />
    </FestivalProvider>
  );
}

export default App;

