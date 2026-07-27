import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PillarType,
  ScriptTechnicalRow,
  PreparativesGroup,
  PreparativeItem
} from '../../types';
import { FullScreenScriptEditor } from './FullScreenScriptEditor';
import {
  X,
  Maximize2,
  Plus,
  Trash2,
  ExternalLink,
  CheckSquare,
  Square,
  Trophy,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Heading1,
  Heading2,
  FileText,
  Table as TableIcon,
  CheckCircle2,
  Save
} from 'lucide-react';

export const BriefPanelModal: React.FC = () => {
  const {
    ideas,
    subPillars,
    activeBriefIdeaId,
    closeBriefModal,
    updateIdea,
    toggleWinner
  } = useApp();

  const idea = ideas.find((i) => i.id === activeBriefIdeaId);

  // Local state for live brief editing
  const [title, setTitle] = useState<string>('');
  const [pillar, setPillar] = useState<PillarType>('Educar');
  const [subPillar, setSubPillar] = useState<string>('');
  
  const [scriptTab, setScriptTab] = useState<'narrative' | 'technical'>('narrative');
  const [narrativeScript, setNarrativeScript] = useState<string>('');
  const [technicalScript, setTechnicalScript] = useState<ScriptTechnicalRow[]>([]);
  
  const [preparatives, setPreparatives] = useState<PreparativesGroup[]>([]);
  const [externalLinks, setExternalLinks] = useState<string[]>([]);
  const [newLinkInput, setNewLinkInput] = useState<string>('');
  const [freeNotes, setFreeNotes] = useState<string>('');
  const [isWinner, setIsWinner] = useState<boolean>(false);

  // Expanded categories state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Localizaciones: true,
    Atrezzo: true,
    'Material técnico': true,
    Logística: true,
  });

  // Fullscreen editor state
  const [isFullScreenEditorOpen, setIsFullScreenEditorOpen] = useState<boolean>(false);

  // Inputs for adding new items to categories
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({
    Localizaciones: '',
    Atrezzo: '',
    'Material técnico': '',
    Logística: '',
  });

  useEffect(() => {
    if (idea) {
      setTitle(idea.title);
      setPillar(idea.pillar);
      setSubPillar(idea.subPillar || '');
      setNarrativeScript(idea.brief?.narrativeScript || '');
      setTechnicalScript(idea.brief?.technicalScript || []);
      setPreparatives(
        idea.brief?.preparatives?.length
          ? idea.brief.preparatives
          : [
              { category: 'Localizaciones', items: [] },
              { category: 'Atrezzo', items: [] },
              { category: 'Material técnico', items: [] },
              { category: 'Logística', items: [] },
            ]
      );
      setExternalLinks(idea.brief?.externalLinks || []);
      setFreeNotes(idea.brief?.freeNotes || '');
      setIsWinner(!!idea.brief?.isWinner);
    }
  }, [idea]);

  if (!activeBriefIdeaId || !idea) return null;

  const saveBriefData = () => {
    updateIdea(idea.id, {
      title,
      pillar,
      subPillar: subPillar || undefined,
      brief: {
        narrativeScript,
        technicalScript,
        preparatives,
        externalLinks,
        freeNotes,
        isWinner,
      },
    });
  };

  const handleClose = () => {
    saveBriefData();
    closeBriefModal();
  };

  const toggleCategory = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const handleAddPreparativeItem = (catName: 'Localizaciones' | 'Atrezzo' | 'Material técnico' | 'Logística') => {
    const text = (newItemTexts[catName] || '').trim();
    if (!text) return;

    setPreparatives((prev) =>
      prev.map((group) => {
        if (group.category !== catName) return group;
        const newItem: PreparativeItem = {
          id: `p-${Date.now()}-${Math.random()}`,
          text,
          completed: false,
        };
        return {
          ...group,
          items: [...group.items, newItem],
        };
      })
    );

    setNewItemTexts((prev) => ({ ...prev, [catName]: '' }));
  };

  const handleTogglePreparativeItem = (catName: string, itemId: string) => {
    setPreparatives((prev) =>
      prev.map((group) => {
        if (group.category !== catName) return group;
        return {
          ...group,
          items: group.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      })
    );
  };

  const handleDeletePreparativeItem = (catName: string, itemId: string) => {
    setPreparatives((prev) =>
      prev.map((group) => {
        if (group.category !== catName) return group;
        return {
          ...group,
          items: group.items.filter((item) => item.id !== itemId),
        };
      })
    );
  };

  const handleAddLink = () => {
    const url = newLinkInput.trim();
    if (!url) return;
    setExternalLinks((prev) => [...prev, url]);
    setNewLinkInput('');
  };

  const handleRemoveLink = (index: number) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('brief-narrative-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'texto';
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setNarrativeScript(newText);
  };

  const pillarsList: PillarType[] = ['Educar', 'Inspirar', 'Entretener', 'Vender'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#101010] border border-[#262626] rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden glow-amber-sm">
        {/* Header */}
        <div className="p-5 border-b border-[#222] bg-[#141414] flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <span className="px-3 py-1 bg-[#E8A020]/20 text-[#E8A020] text-xs font-mono font-bold rounded-full uppercase">
              Panel de Brief
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre de la idea..."
              className="flex-1 bg-transparent border-b border-transparent focus:border-[#E8A020] focus:outline-none font-display font-bold text-lg sm:text-xl text-[#F0EDE6] py-1 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextState = !isWinner;
                setIsWinner(nextState);
                toggleWinner(idea.id);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isWinner
                  ? 'bg-[#E8A020] text-[#0A0A0A] shadow-md shadow-[#E8A020]/20'
                  : 'bg-[#1C1C1C] text-[#888] hover:text-[#ccc] border border-[#333]'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>¿Fue Ganador?</span>
            </button>

            <button
              onClick={handleClose}
              className="p-2 text-[#777] hover:text-[#F0EDE6] hover:bg-[#202020] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-8">
          {/* Section 1: Pillars & Subpillars */}
          <div className="bg-[#161616] border border-[#222] p-4 sm:p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A09D96] font-semibold">
              1. Pilar & Sub-pilar Narrativo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#888] mb-1.5">Pilar Principal</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {pillarsList.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPillar(p)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        pillar === p
                          ? 'bg-[#1C1810] border-[#E8A020] text-[#E8A020]'
                          : 'bg-[#0A0A0A] border-[#222] text-[#888] hover:text-[#ccc]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#888] mb-1.5">Sub-pilar</label>
                <input
                  type="text"
                  value={subPillar}
                  onChange={(e) => setSubPillar(e.target.value)}
                  placeholder="Ej: Tutoriales Rápidos, Vlogs, etc."
                  className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] focus:outline-none text-xs text-[#F0EDE6] p-2.5 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Script Editor (Narrativo vs Técnico) */}
          <div className="bg-[#161616] border border-[#222] p-4 sm:p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#A09D96] font-semibold">
                  2. Editor de Guión
                </h4>
                <div className="bg-[#0A0A0A] p-1 rounded-xl border border-[#262626] flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setScriptTab('narrative')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      scriptTab === 'narrative'
                        ? 'bg-[#E8A020] text-[#0A0A0A] font-semibold'
                        : 'text-[#888] hover:text-[#ccc]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Narrativo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScriptTab('technical')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      scriptTab === 'technical'
                        ? 'bg-[#E8A020] text-[#0A0A0A] font-semibold'
                        : 'text-[#888] hover:text-[#ccc]'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Técnico</span>
                  </button>
                </div>
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsFullScreenEditorOpen(true)}
                className="px-3 py-1.5 bg-[#222] hover:bg-[#2D2D2D] text-[#E8A020] text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-[#333] transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Pantalla Completa</span>
              </button>
            </div>

            {/* Narrative Tab */}
            {scriptTab === 'narrative' ? (
              <div className="space-y-2">
                {/* Formatting Tools */}
                <div className="flex items-center gap-1 p-1.5 bg-[#0A0A0A] border border-[#222] rounded-xl">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1.5 text-[#aaa] hover:text-[#E8A020] hover:bg-[#1A1A1A] rounded-lg text-xs transition-colors cursor-pointer"
                    title="Negrita"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1.5 text-[#aaa] hover:text-[#E8A020] hover:bg-[#1A1A1A] rounded-lg text-xs transition-colors cursor-pointer"
                    title="Cursiva"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-3 w-px bg-[#333] mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdown('# ')}
                    className="p-1.5 text-[#aaa] hover:text-[#E8A020] hover:bg-[#1A1A1A] rounded-lg text-xs transition-colors cursor-pointer"
                    title="Título H1"
                  >
                    <Heading1 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ')}
                    className="p-1.5 text-[#aaa] hover:text-[#E8A020] hover:bg-[#1A1A1A] rounded-lg text-xs transition-colors cursor-pointer"
                    title="Título H2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  id="brief-narrative-textarea"
                  value={narrativeScript}
                  onChange={(e) => setNarrativeScript(e.target.value)}
                  placeholder="Escaleta libre: escribe aquí el planteamiento, gancho, desarrollo y desenlace..."
                  rows={8}
                  className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] focus:outline-none p-4 text-xs text-[#F0EDE6] rounded-xl transition-all leading-relaxed resize-y font-body"
                />
              </div>
            ) : (
              /* Technical Script Tab */
              <div className="space-y-3">
                <div className="overflow-x-auto border border-[#222] rounded-xl bg-[#0A0A0A]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#222] bg-[#121212] text-[#888]">
                        <th className="p-2.5 w-14 text-center">ESCENA</th>
                        <th className="p-2.5">VISUAL</th>
                        <th className="p-2.5">AUDIO</th>
                        <th className="p-2.5 w-20">TIEMPO</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                      {technicalScript.map((row) => (
                        <tr key={row.id}>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.scene}
                              onChange={(e) =>
                                setTechnicalScript(
                                  technicalScript.map((r) =>
                                    r.id === row.id ? { ...r, scene: e.target.value } : r
                                  )
                                )
                              }
                              className="w-full bg-[#141414] border border-[#222] text-center text-xs text-[#E8A020] p-1.5 rounded focus:outline-none focus:border-[#E8A020]"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.visual}
                              onChange={(e) =>
                                setTechnicalScript(
                                  technicalScript.map((r) =>
                                    r.id === row.id ? { ...r, visual: e.target.value } : r
                                  )
                                )
                              }
                              placeholder="Plano / toma..."
                              className="w-full bg-[#141414] border border-[#222] text-xs text-[#ccc] p-1.5 rounded focus:outline-none focus:border-[#E8A020]"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.audio}
                              onChange={(e) =>
                                setTechnicalScript(
                                  technicalScript.map((r) =>
                                    r.id === row.id ? { ...r, audio: e.target.value } : r
                                  )
                                )
                              }
                              placeholder="Voz / SFX..."
                              className="w-full bg-[#141414] border border-[#222] text-xs text-[#ccc] p-1.5 rounded focus:outline-none focus:border-[#E8A020]"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.duration}
                              onChange={(e) =>
                                setTechnicalScript(
                                  technicalScript.map((r) =>
                                    r.id === row.id ? { ...r, duration: e.target.value } : r
                                  )
                                )
                              }
                              placeholder="0:05"
                              className="w-full bg-[#141414] border border-[#222] text-xs text-[#ccc] p-1.5 rounded focus:outline-none focus:border-[#E8A020]"
                            />
                          </td>
                          <td className="p-1.5 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setTechnicalScript(technicalScript.filter((r) => r.id !== row.id))
                              }
                              className="text-[#666] hover:text-[#FF6B6B] p-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setTechnicalScript([
                      ...technicalScript,
                      {
                        id: `row-${Date.now()}`,
                        scene: String(technicalScript.length + 1).padStart(2, '0'),
                        visual: '',
                        audio: '',
                        duration: '',
                        notes: '',
                      },
                    ])
                  }
                  className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#242424] text-[#E8A020] text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-[#262626] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Fila Técnica</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Preparativos de producción */}
          <div className="bg-[#161616] border border-[#222] p-4 sm:p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A09D96] font-semibold">
              3. Preparativos de Producción
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preparatives.map((group) => {
                const isExpanded = expandedCategories[group.category] ?? true;
                return (
                  <div
                    key={group.category}
                    className="bg-[#0A0A0A] border border-[#222] rounded-xl overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(group.category)}
                      className="w-full p-3 bg-[#121212] border-b border-[#222] flex items-center justify-between text-xs font-bold text-[#F0EDE6] hover:bg-[#181818] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#E8A020]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#888]" />
                        )}
                        <span>{group.category}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#777]">
                        {group.items.filter((i) => i.completed).length}/{group.items.length}
                      </span>
                    </button>

                    {/* Category Items */}
                    {isExpanded && (
                      <div className="p-3 space-y-2">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 group text-xs"
                          >
                            <button
                              type="button"
                              onClick={() => handleTogglePreparativeItem(group.category, item.id)}
                              className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                            >
                              {item.completed ? (
                                <CheckSquare className="w-4 h-4 text-[#E8A020]" />
                              ) : (
                                <Square className="w-4 h-4 text-[#555]" />
                              )}
                              <span
                                className={
                                  item.completed
                                    ? 'line-through text-[#666]'
                                    : 'text-[#D0CCC5]'
                                }
                              >
                                {item.text}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePreparativeItem(group.category, item.id)}
                              className="text-[#555] hover:text-[#FF6B6B] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Add Item Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={newItemTexts[group.category] || ''}
                            onChange={(e) =>
                              setNewItemTexts({
                                ...newItemTexts,
                                [group.category]: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddPreparativeItem(group.category);
                              }
                            }}
                            placeholder="[+] Añadir más..."
                            className="flex-1 bg-[#141414] border border-[#222] focus:border-[#E8A020] focus:outline-none text-xs text-[#F0EDE6] px-2.5 py-1.5 rounded-lg placeholder-[#555]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddPreparativeItem(group.category)}
                            className="p-1.5 bg-[#222] hover:bg-[#E8A020] hover:text-[#0A0A0A] text-[#ccc] rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* External Links */}
            <div className="pt-2 border-t border-[#222] space-y-2">
              <label className="block text-xs text-[#888]">Enlaces Externos (Google Docs, Guiones, Referencias)</label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={newLinkInput}
                  onChange={(e) => setNewLinkInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] focus:outline-none text-xs text-[#F0EDE6] p-2.5 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-3.5 py-2.5 bg-[#222] hover:bg-[#E8A020] hover:text-[#0A0A0A] text-[#F0EDE6] text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>

              {externalLinks.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {externalLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-[#0A0A0A] border border-[#222] rounded-xl flex items-center justify-between text-xs text-[#E8A020]"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1.5 truncate max-w-[80%]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{link}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="text-[#666] hover:text-[#FF6B6B] p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Free Notes */}
          <div className="bg-[#161616] border border-[#222] p-4 sm:p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A09D96] font-semibold">
              4. Notas Libres
            </h4>
            <textarea
              value={freeNotes}
              onChange={(e) => setFreeNotes(e.target.value)}
              placeholder="Anotaciones extra, feedback del equipo, reflexiones durante el rodaje..."
              rows={4}
              className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] focus:outline-none p-3.5 text-xs text-[#F0EDE6] rounded-xl transition-all resize-y"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#222] bg-[#141414] flex items-center justify-between">
          <div className="text-xs text-[#666] hidden sm:block">
            Cambios guardados automáticamente en local
          </div>
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#E8A020] hover:bg-[#D48F18] text-[#0A0A0A] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#E8A020]/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar y Cerrar Brief</span>
          </button>
        </div>
      </div>

      {/* Full Screen Editor Integration */}
      <FullScreenScriptEditor
        isOpen={isFullScreenEditorOpen}
        onClose={() => setIsFullScreenEditorOpen(false)}
        mode={scriptTab}
        narrativeText={narrativeScript}
        onNarrativeChange={setNarrativeScript}
        technicalRows={technicalScript}
        onTechnicalChange={setTechnicalScript}
        ideaTitle={title}
      />
    </div>
  );
};
