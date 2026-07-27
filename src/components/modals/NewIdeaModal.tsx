import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PurposeOption,
  ExpectationOption,
  MagnetOption,
  IdeaAnswers,
} from '../../types';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export const NewIdeaModal: React.FC = () => {
  const { isNewIdeaModalOpen, closeNewIdeaModal, addIdea } = useApp();

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [purpose, setPurpose] = useState<PurposeOption | null>(null);
  const [expectation, setExpectation] = useState<ExpectationOption | null>(null);
  const [selectedMagnets, setSelectedMagnets] = useState<MagnetOption[]>([]);

  if (!isNewIdeaModalOpen) return null;

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setPurpose(null);
    setExpectation(null);
    setSelectedMagnets([]);
  };

  const handleClose = () => {
    resetForm();
    closeNewIdeaModal();
  };

  const handleToggleMagnet = (magnet: MagnetOption) => {
    if (magnet === 'No lo sé') {
      setSelectedMagnets(['No lo sé']);
      return;
    }

    const withoutDontKnow = selectedMagnets.filter((m) => m !== 'No lo sé');
    if (withoutDontKnow.includes(magnet)) {
      setSelectedMagnets(withoutDontKnow.filter((m) => m !== magnet));
    } else {
      setSelectedMagnets([...withoutDontKnow, magnet]);
    }
  };

  const handleFinish = () => {
    if (!title.trim() || !purpose || !expectation || selectedMagnets.length === 0) return;

    const answers: IdeaAnswers = {
      title,
      purpose,
      expectation,
      magnets: selectedMagnets,
    };

    addIdea(answers);
    handleClose();
  };

  const isStep1Valid = title.trim().length > 0;
  const isStep2Valid = purpose !== null;
  const isStep3Valid = expectation !== null;
  const isStep4Valid = selectedMagnets.length > 0;

  const purposeOptions: PurposeOption[] = ['Educar', 'Inspirar', 'Entretener', 'Vender', 'No lo sé'];

  const expectationOptions: ExpectationOption[] = [
    'Comentar',
    'Seguirte',
    'Compartirlo',
    'Guardárselo',
    'Comprar',
    'No lo sé',
  ];

  const magnetOptions: MagnetOption[] = [
    'Sentirse identificados con lo que se cuenta',
    'Descubrir la respuesta o solución a una situación o problema',
    'Les engancha visualmente',
    'Quieren ver el resultado final / segunda parte',
    'No lo sé',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl glow-amber-sm flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E8A020]/10 text-[#E8A020] rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#F0EDE6]">
                Capturar Nueva Idea
              </h3>
              <p className="text-xs text-[#888]">Paso {step} de 4</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-[#777] hover:text-[#F0EDE6] hover:bg-[#1A1A1A] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1A1A1A] h-1">
          <div
            className="bg-[#E8A020] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-display text-base font-semibold text-[#F0EDE6] mb-1">
                  1. ¿Qué quieres contar?
                </label>
                <p className="text-xs text-[#999]">
                  Escribe el título provisional de tu vídeo o la idea general que tienes en mente.
                </p>
              </div>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="¿Qué historia quieres contar?"
                rows={4}
                autoFocus
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#E8A020] focus:outline-none text-sm text-[#F0EDE6] p-4 rounded-xl placeholder-[#555] transition-all resize-none"
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block font-display text-base font-semibold text-[#F0EDE6] mb-1">
                  2. ¿Qué función cumple?
                </label>
                <p className="text-xs text-[#999]">
                  Elige el propósito principal de este vídeo (esto asignará automáticamente el pilar).
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {purposeOptions.map((option) => {
                  const isSelected = purpose === option;
                  const isDontKnow = option === 'No lo sé';
                  return (
                    <button
                      key={option}
                      onClick={() => setPurpose(option)}
                      className={`p-4 rounded-xl text-left border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C1810] border-[#E8A020] text-[#E8A020] shadow-md shadow-[#E8A020]/10'
                          : 'bg-[#181818] border-[#262626] text-[#D0CCC5] hover:bg-[#202020] hover:border-[#333]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isDontKnow && <HelpCircle className="w-4 h-4 text-[#888]" />}
                        <span>{option}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E8A020]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-display text-base font-semibold text-[#F0EDE6] mb-1">
                  3. ¿Qué querrá hacer el espectador al acabarlo?
                </label>
                <p className="text-xs text-[#999]">
                  Sé sincero y analiza cuál es el llamado a la acción implícito u objetivo principal.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {expectationOptions.map((option) => {
                  const isSelected = expectation === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setExpectation(option)}
                      className={`p-4 rounded-xl text-left border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C1810] border-[#E8A020] text-[#E8A020] shadow-md shadow-[#E8A020]/10'
                          : 'bg-[#181818] border-[#262626] text-[#D0CCC5] hover:bg-[#202020] hover:border-[#333]'
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E8A020]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block font-display text-base font-semibold text-[#F0EDE6] mb-1">
                  4. ¿Cuántos imanes tiene tu vídeo?
                </label>
                <p className="text-xs text-[#999]">
                  Selección múltiple: marca todos los factores de atracción que posee tu historia.
                </p>
              </div>
              <div className="space-y-2.5">
                {magnetOptions.map((option) => {
                  const isSelected = selectedMagnets.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleToggleMagnet(option)}
                      className={`w-full p-4 rounded-xl text-left border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C1810] border-[#E8A020] text-[#E8A020] shadow-md shadow-[#E8A020]/10'
                          : 'bg-[#181818] border-[#262626] text-[#D0CCC5] hover:bg-[#202020] hover:border-[#333]'
                      }`}
                    >
                      <span>{option}</span>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#E8A020] border-[#E8A020] text-[#0A0A0A]'
                            : 'border-[#444] bg-[#0A0A0A]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#222] flex items-center justify-between bg-[#0E0E0E]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#282828] text-[#ccc] font-medium text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
              }
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-[#E8A020] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D48F18] text-[#0A0A0A] font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-[#E8A020]/20 transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!isStep4Valid}
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-[#E8A020] to-[#D48F18] disabled:opacity-40 disabled:cursor-not-allowed text-[#0A0A0A] font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#E8A020]/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Guardar Idea</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
