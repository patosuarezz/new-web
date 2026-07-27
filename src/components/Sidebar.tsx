import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveSection } from '../types';
import {
  Sparkles,
  Clapperboard,
  BarChart3,
  Calendar as CalendarIcon,
  Trophy,
  RotateCcw,
  Plus,
  Video
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeSection, setActiveSection, openNewIdeaModal, ideas, resetDataToSample } = useApp();

  const navItems: { id: ActiveSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'despensa',
      label: 'Despensa de Ideas',
      icon: <Sparkles className="w-5 h-5" />,
      badge: ideas.filter((i) => i.status === 'Lista' || i.status === 'Madurando').length,
    },
    {
      id: 'produccion',
      label: 'Producción',
      icon: <Clapperboard className="w-5 h-5" />,
      badge: ideas.filter((i) => i.status === 'En Producción').length,
    },
    {
      id: 'analizador',
      label: 'Analizador',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: ideas.filter((i) => i.status === 'Publicado' || i.kanbanStatus === 'Lista para publicar').length,
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      id: 'potenciador',
      label: 'Potenciador',
      icon: <Trophy className="w-5 h-5" />,
      badge: ideas.filter((i) => i.brief?.isWinner).length,
    },
  ];

  const handleSelect = (id: ActiveSection) => {
    setActiveSection(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:static top-0 left-0 z-40 h-full w-64 bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Header / Brand */}
      <div className="p-6 border-b border-[#1A1A1A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A020] to-[#996000] p-0.5 shadow-lg shadow-[#E8A020]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <Video className="w-5 h-5 text-[#E8A020]" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider text-[#F0EDE6] flex items-center gap-1.5">
              CINE<span className="text-[#E8A020]">FLOW</span>
            </h1>
            <p className="text-[10px] tracking-widest uppercase text-[#A09D96]">
              Gestión Creativa
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4">
        <button
          onClick={() => {
            openNewIdeaModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#E8A020] to-[#D48F18] text-[#0A0A0A] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#E8A020]/20 hover:shadow-[#E8A020]/40 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nueva Idea</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-[#666] uppercase">
          Estructura Creativa
        </div>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                isActive
                  ? 'bg-[#181510] text-[#E8A020] border border-[#E8A020]/30 shadow-md shadow-[#E8A020]/10 font-semibold'
                  : 'text-[#A09D96] hover:bg-[#141414] hover:text-[#F0EDE6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`transition-colors ${
                    isActive ? 'text-[#E8A020]' : 'text-[#777] group-hover:text-[#F0EDE6]'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                    isActive
                      ? 'bg-[#E8A020]/20 text-[#E8A020]'
                      : 'bg-[#1F1F1F] text-[#888] group-hover:text-[#ccc]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Sample Data Button */}
      <div className="p-4 border-t border-[#1A1A1A] space-y-2">
        <button
          onClick={() => {
            if (confirm('¿Restablecer los datos de ejemplo iniciales? Perderás tus cambios no guardados.')) {
              resetDataToSample();
            }
          }}
          className="w-full py-2 px-3 bg-[#141414] hover:bg-[#1F1F1F] text-[#888] hover:text-[#F0EDE6] text-xs rounded-lg flex items-center justify-center gap-2 border border-[#222] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Ejemplo</span>
        </button>
        <div className="text-center text-[10px] text-[#555]">
          Organización Narrativa v1.0
        </div>
      </div>
    </aside>
  );
};
