import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Menu, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { activeSection, searchQuery, setSearchQuery, openNewIdeaModal } = useApp();

  const titles: Record<string, { title: string; subtitle: string }> = {
    despensa: {
      title: 'Despensa de Ideas',
      subtitle: 'Captura y madura historias antes de entrar a producción',
    },
    produccion: {
      title: 'Tablero de Producción',
      subtitle: 'Flujo visual de rodaje, edición y guionización',
    },
    analizador: {
      title: 'Analizador de Contenido',
      subtitle: 'Evaluación de publicaciones, métricas e impacto',
    },
    calendario: {
      title: 'Calendario Editorial',
      subtitle: 'Planificación de fechas y publicaciones futuras',
    },
    potenciador: {
      title: 'Potenciador de Éxitos',
      subtitle: 'Análisis de patrones ganadores para replicar tus mejores historias',
    },
  };

  const current = titles[activeSection] || titles.despensa;

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1F1F1F] px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#A09D96] hover:text-[#F0EDE6] hover:bg-[#1A1A1A] rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#F0EDE6]">
            {current.title}
          </h2>
          <p className="text-xs text-[#A09D96] hidden sm:block mt-0.5">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative w-40 sm:w-64">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar historias..."
            className="w-full bg-[#141414] border border-[#262626] focus:border-[#E8A020] focus:outline-none text-xs text-[#F0EDE6] placeholder-[#555] pl-9 pr-3 py-2 rounded-xl transition-all"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={openNewIdeaModal}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#E8A020] hover:bg-[#D48F18] text-[#0A0A0A] font-semibold text-xs rounded-xl shadow-md shadow-[#E8A020]/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nueva Idea</span>
        </button>
      </div>
    </header>
  );
};
