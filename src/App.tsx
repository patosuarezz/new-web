import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IdeaPantry } from './components/sections/IdeaPantry';
import { ProductionKanban } from './components/sections/ProductionKanban';
import { ContentAnalyzer } from './components/sections/ContentAnalyzer';
import { CalendarView } from './components/sections/CalendarView';
import { PotenciadorView } from './components/sections/PotenciadorView';
import { NewIdeaModal } from './components/modals/NewIdeaModal';
import { EditIdeaModal } from './components/modals/EditIdeaModal';
import { BriefPanelModal } from './components/modals/BriefPanelModal';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { activeSection } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F0EDE6] flex flex-col lg:flex-row font-body selection:bg-[#E8A020] selection:text-[#0A0A0A]">
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'despensa' && <IdeaPantry />}
              {activeSection === 'produccion' && <ProductionKanban />}
              {activeSection === 'analizador' && <ContentAnalyzer />}
              {activeSection === 'calendario' && <CalendarView />}
              {activeSection === 'potenciador' && <PotenciadorView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <NewIdeaModal />
      <EditIdeaModal />
      <BriefPanelModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
