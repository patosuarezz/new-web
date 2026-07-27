import React from 'react';
import { X, Minimize2, Bold, Italic, Heading1, Heading2, List, Plus, Trash2 } from 'lucide-react';
import { ScriptTechnicalRow } from '../../types';

interface FullScreenScriptEditorProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'narrative' | 'technical';
  narrativeText: string;
  onNarrativeChange: (text: string) => void;
  technicalRows: ScriptTechnicalRow[];
  onTechnicalChange: (rows: ScriptTechnicalRow[]) => void;
  ideaTitle: string;
}

export const FullScreenScriptEditor: React.FC<FullScreenScriptEditorProps> = ({
  isOpen,
  onClose,
  mode,
  narrativeText,
  onNarrativeChange,
  technicalRows,
  onTechnicalChange,
  ideaTitle,
}) => {
  if (!isOpen) return null;

  const handleAddTechnicalRow = () => {
    const newRow: ScriptTechnicalRow = {
      id: `row-${Date.now()}`,
      scene: String(technicalRows.length + 1).padStart(2, '0'),
      visual: '',
      audio: '',
      duration: '',
      notes: '',
    };
    onTechnicalChange([...technicalRows, newRow]);
  };

  const handleUpdateTechnicalRow = (id: string, field: keyof ScriptTechnicalRow, value: string) => {
    onTechnicalChange(
      technicalRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteTechnicalRow = (id: string) => {
    onTechnicalChange(technicalRows.filter((r) => r.id !== id));
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('full-narrative-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'texto';
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    onNarrativeChange(newText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col text-[#F0EDE6]">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-[#222] bg-[#121212] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#E8A020]/20 text-[#E8A020] text-[10px] font-mono font-bold rounded-full uppercase">
              Modo Pantalla Completa
            </span>
            <span className="text-xs text-[#888]">Editor de Guión ({mode === 'narrative' ? 'Narrativo' : 'Técnico'})</span>
          </div>
          <h2 className="font-display font-bold text-lg text-[#F0EDE6] mt-0.5">
            {ideaTitle || 'Proyecto sin Título'}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#F0EDE6] text-xs font-semibold rounded-xl flex items-center gap-2 border border-[#333] transition-colors cursor-pointer"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Salir de Pantalla Completa</span>
        </button>
      </div>

      {/* Main Full Page Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full flex flex-col space-y-4">
        {mode === 'narrative' ? (
          <div className="flex-1 flex flex-col space-y-3">
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1.5 p-2 bg-[#141414] border border-[#222] rounded-xl flex-wrap">
              <button
                onClick={() => insertMarkdown('**', '**')}
                className="p-2 text-[#ccc] hover:text-[#E8A020] hover:bg-[#222] rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Negrita"
              >
                <Bold className="w-4 h-4" />
                <span className="hidden sm:inline">Negrita</span>
              </button>
              <button
                onClick={() => insertMarkdown('*', '*')}
                className="p-2 text-[#ccc] hover:text-[#E8A020] hover:bg-[#222] rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Cursiva"
              >
                <Italic className="w-4 h-4" />
                <span className="hidden sm:inline">Cursiva</span>
              </button>
              <div className="h-4 w-px bg-[#333] mx-1" />
              <button
                onClick={() => insertMarkdown('# ')}
                className="p-2 text-[#ccc] hover:text-[#E8A020] hover:bg-[#222] rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Título 1"
              >
                <Heading1 className="w-4 h-4" />
                <span className="hidden sm:inline">Título H1</span>
              </button>
              <button
                onClick={() => insertMarkdown('## ')}
                className="p-2 text-[#ccc] hover:text-[#E8A020] hover:bg-[#222] rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Título 2"
              >
                <Heading2 className="w-4 h-4" />
                <span className="hidden sm:inline">Título H2</span>
              </button>
              <button
                onClick={() => insertMarkdown('- ')}
                className="p-2 text-[#ccc] hover:text-[#E8A020] hover:bg-[#222] rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Lista"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>

            {/* Large Narrative Editor */}
            <textarea
              id="full-narrative-textarea"
              value={narrativeText}
              onChange={(e) => onNarrativeChange(e.target.value)}
              placeholder="Escribe la escaleta narrativa completa de tu vídeo aquí... Utiliza encabezados, ganchos y diálogos."
              className="flex-1 w-full bg-[#121212] border border-[#222] focus:border-[#E8A020] focus:outline-none p-6 text-base text-[#F0EDE6] rounded-2xl placeholder-[#444] transition-all resize-none leading-relaxed font-body min-h-[500px]"
            />
          </div>
        ) : (
          /* Technical Script Grid */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm text-[#A09D96] uppercase tracking-wider">
                Desglose Técnico por Columnas (Escenas, Plano, Audio, Tiempo)
              </h3>
              <button
                onClick={handleAddTechnicalRow}
                className="px-3.5 py-2 bg-[#E8A020] hover:bg-[#D48F18] text-[#0A0A0A] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Escena</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-[#222] rounded-2xl bg-[#121212]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#222] bg-[#161616] text-[#A09D96]">
                    <th className="p-3.5 w-16 text-center font-mono">ESCENA</th>
                    <th className="p-3.5 min-w-[200px]">IMAGEN / ACCIÓN VISUAL</th>
                    <th className="p-3.5 min-w-[200px]">AUDIO / VOZ EN OFF / EFECTOS</th>
                    <th className="p-3.5 w-24">DURACIÓN</th>
                    <th className="p-3.5 min-w-[150px]">NOTAS DE RODAJE</th>
                    <th className="p-3.5 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {technicalRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#666]">
                        No hay escenas técnicas todavía. Haz clic en "Añadir Escena" para comenzar el desglose.
                      </td>
                    </tr>
                  ) : (
                    technicalRows.map((row) => (
                      <tr key={row.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.scene}
                            onChange={(e) => handleUpdateTechnicalRow(row.id, 'scene', e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-[#262626] text-center font-mono text-xs text-[#E8A020] p-2 rounded-lg focus:outline-none focus:border-[#E8A020]"
                          />
                        </td>
                        <td className="p-2">
                          <textarea
                            value={row.visual}
                            onChange={(e) => handleUpdateTechnicalRow(row.id, 'visual', e.target.value)}
                            rows={2}
                            placeholder="Descripción de la toma..."
                            className="w-full bg-[#0A0A0A] border border-[#262626] text-xs text-[#F0EDE6] p-2 rounded-lg focus:outline-none focus:border-[#E8A020] resize-none"
                          />
                        </td>
                        <td className="p-2">
                          <textarea
                            value={row.audio}
                            onChange={(e) => handleUpdateTechnicalRow(row.id, 'audio', e.target.value)}
                            rows={2}
                            placeholder="Locución o SFX..."
                            className="w-full bg-[#0A0A0A] border border-[#262626] text-xs text-[#F0EDE6] p-2 rounded-lg focus:outline-none focus:border-[#E8A020] resize-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.duration}
                            onChange={(e) => handleUpdateTechnicalRow(row.id, 'duration', e.target.value)}
                            placeholder="0:05"
                            className="w-full bg-[#0A0A0A] border border-[#262626] text-xs text-[#F0EDE6] p-2 rounded-lg focus:outline-none focus:border-[#E8A020]"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.notes}
                            onChange={(e) => handleUpdateTechnicalRow(row.id, 'notes', e.target.value)}
                            placeholder="Iluminación, lente..."
                            className="w-full bg-[#0A0A0A] border border-[#262626] text-xs text-[#F0EDE6] p-2 rounded-lg focus:outline-none focus:border-[#E8A020]"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleDeleteTechnicalRow(row.id)}
                            className="p-1.5 text-[#666] hover:text-[#FF6B6B] hover:bg-[#221010] rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
