import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PurposeOption,
  ExpectationOption,
  MagnetOption,
  PillarType
} from '../../types';
import { X, CheckCircle2, Save, Trash2 } from 'lucide-react';

export const EditIdeaModal: React.FC = () => {
  const { ideas, activeEditIdeaId, closeEditModal, updateIdea, deleteIdea } = useApp();

  const idea = ideas.find((i) => i.id === activeEditIdeaId);

  const [title, setTitle] = useState<string>('');
  const [purpose, setPurpose] = useState<PurposeOption>('No lo sé');
  const [expectation, setExpectation] = useState<ExpectationOption>('No lo sé');
  const [selectedMagnets, setSelectedMagnets] = useState<MagnetOption[]>([]);
  const [subPillar, setSubPillar] = useState<string>('');

  useEffect(() => {
    if (idea) {
      setTitle(idea.title);
      setPurpose(idea.answers.purpose);
      setExpectation(idea.answers.expectation);
      setSelectedMagnets(idea.answers.magnets || []);
      setSubPillar(idea.subPillar || '');
    }
  }, [idea]);

  if (!activeEditIdeaId || !idea) return null;

  const handleToggleMagnet = (magnet: MagnetOption) => {
    if (magnet === 'No lo sé') {
      setSelectedMagnets(['No lo sé']);
      return;
    }
    const filtered = selectedMagnets.filter((m) => m !== 'No lo sé');
    if (filtered.includes(magnet)) {
      setSelectedMagnets(filtered.filter((m) => m !== magnet));
    } else {
      setSelectedMagnets([...filtered, magnet]);
    }
  };

  const handleSave = () => {
    if (!idea || !title.trim()) return;

    const pillar: PillarType = purpose !== 'No lo sé' ? (purpose as PillarType) : idea.pillar;

    updateIdea(idea.id, {
      title: title.trim(),
      pillar,
      subPillar: subPillar.trim() || undefined,
      answers: {
        title: title.trim(),
        purpose,
        expectation,
        magnets: selectedMagnets,
      },
    });

    closeEditModal();
  };

  const handleDelete = () => {
    if (confirm('¿Seguro que deseas eliminar esta idea?')) {
      deleteIdea(idea.id);
      closeEditModal();
    }
  };

  const purposeOptions: PurposeOption[] = ['Educar', 'Inspirar', 'Entretener', 'Vender', 'No lo sé'];
  const expectationOptions: ExpectationOption[] = ['Comentar', 'Seguirte', 'Compartirlo', 'Guardárselo', 'Comprar', 'No lo sé'];
  const magnetOptions: MagnetOption[] = [
    'Sentirse identificados con lo que se cuenta',
    'Descubrir la respuesta o solución a una situación o problema',
    'Les engancha visualmente',
    'Quieren ver el resultado final / segunda parte',
    'No lo sé',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#222] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-[#F0EDE6]">
              Editar Respuestas de la Idea
            </h3>
            <p className="text-xs text-[#888]">
              Modifica el título, pilar y preguntas de maduración
            </p>
          </div>
          <button
            onClick={closeEditModal}
            className="p-2 text-[#777] hover:text-[#F0EDE6] hover:bg-[#1A1A1A] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09D96] mb-2">
              Título del Proyecto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#E8A020] focus:outline-none text-sm text-[#F0EDE6] p-3 rounded-xl transition-all"
            />
          </div>

          {/* Sub-Pillar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09D96] mb-2">
              Sub-pilar Personalizado (opcional)
            </label>
            <input
              type="text"
              value={subPillar}
              onChange={(e) => setSubPillar(e.target.value)}
              placeholder="Ej: Tutoriales Rápidos, Vlogs, etc."
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#E8A020] focus:outline-none text-sm text-[#F0EDE6] p-3 rounded-xl transition-all"
            />
          </div>

          {/* Purpose / Pillar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09D96] mb-2">
              Función Principal (Pilar)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {purposeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPurpose(opt)}
                  className={`p-3 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                    purpose === opt
                      ? 'bg-[#1C1810] border-[#E8A020] text-[#E8A020]'
                      : 'bg-[#181818] border-[#262626] text-[#A09D96] hover:bg-[#202020]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Expectation */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09D96] mb-2">
              Acción Deseada del Espectador
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {expectationOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setExpectation(opt)}
                  className={`p-3 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                    expectation === opt
                      ? 'bg-[#1C1810] border-[#E8A020] text-[#E8A020]'
                      : 'bg-[#181818] border-[#262626] text-[#A09D96] hover:bg-[#202020]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Magnets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09D96] mb-2">
              Imanes de Atracción
            </label>
            <div className="space-y-2">
              {magnetOptions.map((opt) => {
                const isSelected = selectedMagnets.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleToggleMagnet(opt)}
                    className={`w-full p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C1810] border-[#E8A020] text-[#E8A020]'
                        : 'bg-[#181818] border-[#262626] text-[#A09D96] hover:bg-[#202020]'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E8A020]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#222] flex items-center justify-between bg-[#0E0E0E]">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-[#221010] hover:bg-[#331515] text-[#FF6B6B] font-medium text-xs rounded-xl flex items-center gap-2 border border-[#441818] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Idea</span>
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#E8A020] hover:bg-[#D48F18] text-[#0A0A0A] font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-[#E8A020]/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
