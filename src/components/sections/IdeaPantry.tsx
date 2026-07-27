import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PillarType, IdeaItem } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Film,
  Send,
  Plus,
  Pencil,
  FileEdit,
  GraduationCap,
  Heart,
  Smile,
  ShoppingBag,
  HelpCircle,
  Filter
} from 'lucide-react';

export const IdeaPantry: React.FC = () => {
  const {
    ideas,
    subPillars,
    addSubPillar,
    moveIdeaToProduction,
    openBriefModal,
    openEditModal,
    openNewIdeaModal,
    searchQuery,
    selectedPillarFilter,
    setSelectedPillarFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
  } = useApp();

  const [newSubPillarInputs, setNewSubPillarInputs] = useState<Record<string, string>>({});
  const [addingSubPillarFor, setAddingSubPillarFor] = useState<string | null>(null);

  // Top 4 stats
  const countListas = ideas.filter((i) => i.status === 'Lista').length;
  const countMadurando = ideas.filter((i) => i.status === 'Madurando').length;
  const countEnProduccion = ideas.filter((i) => i.status === 'En Producción').length;
  const countPublicadas = ideas.filter((i) => i.status === 'Publicado').length;

  const pillars: PillarType[] = ['Educar', 'Inspirar', 'Entretener', 'Vender'];

  const pillarIcons: Record<PillarType, React.ReactNode> = {
    Educar: <GraduationCap className="w-5 h-5 text-[#E8A020]" />,
    Inspirar: <Heart className="w-5 h-5 text-[#E8A020]" />,
    Entretener: <Smile className="w-5 h-5 text-[#E8A020]" />,
    Vender: <ShoppingBag className="w-5 h-5 text-[#E8A020]" />,
  };

  const handleAddSubPillarSubmit = (pillar: PillarType) => {
    const val = newSubPillarInputs[pillar]?.trim();
    if (val) {
      addSubPillar(pillar, val);
      setNewSubPillarInputs({ ...newSubPillarInputs, [pillar]: '' });
      setAddingSubPillarFor(null);
    }
  };

  // Filter ideas by search, pillar filter, status filter
  const filterIdeas = (pillarIdeas: IdeaItem[]) => {
    return pillarIdeas.filter((idea) => {
      // Must only show ideas in Pantry (Lista or Madurando), or if user filtered specifically
      const matchesSearch =
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.subPillar?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatusFilter === 'Todos'
          ? idea.status === 'Lista' || idea.status === 'Madurando'
          : idea.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-[#222] p-5 rounded-2xl flex items-center justify-between glow-amber-sm">
          <div>
            <p className="text-xs uppercase font-mono tracking-wider text-[#A09D96]">
              Ideas Listas
            </p>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-[#F0EDE6] mt-1">
              {countListas}
            </h3>
          </div>
          <div className="p-3 bg-[#E8A020]/10 text-[#E8A020] rounded-xl border border-[#E8A020]/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121212] border border-[#222] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-mono tracking-wider text-[#A09D96]">
              Madurando
            </p>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-[#F0EDE6] mt-1">
              {countMadurando}
            </h3>
          </div>
          <div className="p-3 bg-[#1F1F1F] text-[#A09D96] rounded-xl border border-[#2B2B2B]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121212] border border-[#222] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-mono tracking-wider text-[#A09D96]">
              En Producción
            </p>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-[#F0EDE6] mt-1">
              {countEnProduccion}
            </h3>
          </div>
          <div className="p-3 bg-[#1F1F1F] text-[#A09D96] rounded-xl border border-[#2B2B2B]">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121212] border border-[#222] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-mono tracking-wider text-[#A09D96]">
              Publicadas
            </p>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-[#F0EDE6] mt-1">
              {countPublicadas}
            </h3>
          </div>
          <div className="p-3 bg-[#1F1F1F] text-[#A09D96] rounded-xl border border-[#2B2B2B]">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#121212] border border-[#222] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#E8A020]" />
          <span className="text-xs font-semibold text-[#A09D96] uppercase tracking-wider">
            Filtrar Despensa:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Pillar Filter */}
          <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 border border-[#222] rounded-xl text-xs">
            {['Todos', 'Educar', 'Inspirar', 'Entretener', 'Vender'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPillarFilter(p)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedPillarFilter === p
                    ? 'bg-[#E8A020] text-[#0A0A0A] font-semibold'
                    : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 border border-[#222] rounded-xl text-xs">
            {['Todos', 'Lista', 'Madurando'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedStatusFilter === st
                    ? 'bg-[#E8A020] text-[#0A0A0A] font-semibold'
                    : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pillars Sections */}
      <div className="space-y-10">
        {pillars
          .filter((p) => selectedPillarFilter === 'Todos' || selectedPillarFilter === p)
          .map((pillar) => {
            const pillarIdeas = ideas.filter((i) => i.pillar === pillar);
            const filteredPillarIdeas = filterIdeas(pillarIdeas);
            const subPillarsList = subPillars[pillar] || [];

            return (
              <section
                key={pillar}
                className="bg-[#101010] border border-[#222] p-6 rounded-2xl space-y-6"
              >
                {/* Pillar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#1C1810] border border-[#E8A020]/30 rounded-xl">
                      {pillarIcons[pillar]}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#F0EDE6] flex items-center gap-2">
                        <span>Pilar: {pillar}</span>
                        <span className="text-xs font-mono font-normal text-[#888] bg-[#1A1A1A] px-2 py-0.5 rounded-full">
                          {filteredPillarIdeas.length} ideas
                        </span>
                      </h3>
                      <p className="text-xs text-[#888] mt-0.5">
                        {pillar === 'Educar' && 'Tutoriales, consejos técnicos y valor directo'}
                        {pillar === 'Inspirar' && 'Historias de superación, mindset y tras de cámaras'}
                        {pillar === 'Entretener' && 'Retos, humor, curiosidades y formato dinámico'}
                        {pillar === 'Vender' && 'Llamados a la acción, productos, servicios y valor directo'}
                      </p>
                    </div>
                  </div>

                  {/* Sub-pillars badges & Add button */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {subPillarsList.map((subP) => (
                      <span
                        key={subP}
                        className="px-2.5 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-[#ccc] text-xs rounded-lg font-medium"
                      >
                        {subP}
                      </span>
                    ))}

                    {addingSubPillarFor === pillar ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newSubPillarInputs[pillar] || ''}
                          onChange={(e) =>
                            setNewSubPillarInputs({ ...newSubPillarInputs, [pillar]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddSubPillarSubmit(pillar);
                          }}
                          placeholder="Nombre sub-pilar..."
                          className="bg-[#0A0A0A] border border-[#E8A020] text-xs text-[#F0EDE6] px-2.5 py-1 rounded-lg focus:outline-none w-32"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddSubPillarSubmit(pillar)}
                          className="px-2 py-1 bg-[#E8A020] text-[#0A0A0A] text-xs font-bold rounded-lg cursor-pointer"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingSubPillarFor(pillar)}
                        className="px-2.5 py-1 bg-[#1A1812] hover:bg-[#262218] border border-[#E8A020]/30 text-[#E8A020] text-xs rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Sub-pilar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Ideas Cards Grid */}
                {filteredPillarIdeas.length === 0 ? (
                  <div className="p-8 text-center bg-[#0A0A0A] border border-dashed border-[#222] rounded-xl space-y-2">
                    <p className="text-sm text-[#777] font-medium">
                      Nada aquí todavía. Las mejores historias empiezan en blanco.
                    </p>
                    <button
                      onClick={openNewIdeaModal}
                      className="text-xs text-[#E8A020] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Crear una idea para el pilar {pillar}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPillarIdeas.map((idea) => {
                      const isLista = idea.status === 'Lista';

                      return (
                        <div
                          key={idea.id}
                          className="bg-[#141414] border border-[#222] hover:border-[#E8A020]/40 p-5 rounded-xl space-y-4 transition-all duration-200 group flex flex-col justify-between"
                        >
                          {/* Card Top Header */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              {/* Status Badge */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                                  isLista
                                    ? 'bg-[#E8A020]/20 text-[#E8A020] border border-[#E8A020]/30'
                                    : 'bg-[#222] text-[#A09D96] border border-[#333]'
                                }`}
                              >
                                {isLista ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Lista</span>
                                  </>
                                ) : (
                                  <>
                                    <HelpCircle className="w-3 h-3" />
                                    <span>Madurando</span>
                                  </>
                                )}
                              </span>

                              <span className="text-[10px] font-mono text-[#666]">
                                {new Date(idea.createdAt).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                })}
                              </span>
                            </div>

                            {/* Title - Clean dark layout without vertical lines */}
                            <h4 className="font-display font-semibold text-sm text-[#F0EDE6] leading-snug line-clamp-2 group-hover:text-[#E8A020] transition-colors">
                              {idea.title}
                            </h4>

                            {idea.subPillar && (
                              <span className="inline-block text-[10px] font-mono text-[#888] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#222]">
                                {idea.subPillar}
                              </span>
                            )}
                          </div>

                          {/* Answers Summary Badges */}
                          <div className="pt-2 border-t border-[#1F1F1F] space-y-1.5 text-[11px] text-[#888]">
                            <p className="truncate">
                              <span className="text-[#666]">Acción:</span>{' '}
                              <span className="text-[#ccc]">{idea.answers.expectation}</span>
                            </p>
                            <p className="truncate">
                              <span className="text-[#666]">Imanes:</span>{' '}
                              <span className="text-[#ccc]">
                                {idea.answers.magnets.length} seleccionados
                              </span>
                            </p>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
                            {/* Edit initial answers button */}
                            <button
                              onClick={() => openEditModal(idea.id)}
                              className="p-2 text-[#777] hover:text-[#E8A020] hover:bg-[#1F1F1F] rounded-lg transition-colors cursor-pointer"
                              title="Editar respuestas iniciales"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2">
                              {/* Open Brief Button */}
                              <button
                                onClick={() => openBriefModal(idea.id)}
                                className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#282828] text-[#ccc] text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <FileEdit className="w-3.5 h-3.5" />
                                <span>Brief</span>
                              </button>

                              {/* Send to production button */}
                              {isLista && (
                                <button
                                  onClick={() => moveIdeaToProduction(idea.id, 'En desarrollo')}
                                  className="px-3 py-1.5 bg-[#E8A020] hover:bg-[#D48F18] text-[#0A0A0A] font-bold text-xs rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-[#E8A020]/20"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Producir</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
};
