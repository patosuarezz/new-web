import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Zap,
  Eye,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  FileText,
  Lightbulb,
  Save,
  Check,
  TrendingUp
} from 'lucide-react';

export const PotenciadorView: React.FC = () => {
  const { ideas, updateWinnerDetails, openBriefModal } = useApp();

  // Filter all winner videos
  const winnerIdeas = ideas.filter((i) => i.brief?.isWinner);

  // Global metrics aggregates
  const totalViews = winnerIdeas.reduce((sum, i) => sum + (i.metrics?.views || 0), 0);
  const totalLikes = winnerIdeas.reduce((sum, i) => sum + (i.metrics?.likes || 0), 0);
  const totalComments = winnerIdeas.reduce((sum, i) => sum + (i.metrics?.comments || 0), 0);

  // Local state for reflections
  const [reflections, setReflections] = React.useState<
    Record<string, { reflection: string; pattern: string; saved: boolean }>
  >({});

  const getReflectionData = (ideaId: string) => {
    if (reflections[ideaId]) return reflections[ideaId];
    const idea = ideas.find((i) => i.id === ideaId);
    return {
      reflection: idea?.winnerReflection || '',
      pattern: idea?.winnerPattern || '',
      saved: false,
    };
  };

  const handleChange = (ideaId: string, field: 'reflection' | 'pattern', value: string) => {
    const current = getReflectionData(ideaId);
    setReflections({
      ...reflections,
      [ideaId]: {
        ...current,
        [field]: value,
        saved: false,
      },
    });
  };

  const handleSaveDetails = (ideaId: string) => {
    const data = getReflectionData(ideaId);
    updateWinnerDetails(ideaId, data.reflection, data.pattern);

    setReflections({
      ...reflections,
      [ideaId]: {
        ...data,
        saved: true,
      },
    });

    setTimeout(() => {
      setReflections((prev) => ({
        ...prev,
        [ideaId]: { ...prev[ideaId], saved: false },
      }));
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#18140B] via-[#121212] to-[#18140B] border border-[#E8A020]/40 p-6 lg:p-8 rounded-2xl glow-amber-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E8A020] text-[#0A0A0A] rounded-2xl font-bold shadow-lg shadow-[#E8A020]/30">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-[#F0EDE6] flex items-center gap-2">
              <span>Potenciador de Éxitos</span>
              <span className="text-xs font-mono font-normal text-[#E8A020] bg-[#22180A] px-3 py-1 rounded-full border border-[#E8A020]/30">
                Fórmula de Replicación
              </span>
            </h2>
            <p className="text-xs text-[#A09D96] mt-1 max-w-2xl">
              Analiza los patrones narrativos y razones del éxito de tus vídeos ganadores para replicar tus mejores fórmulas.
            </p>
          </div>
        </div>

        {/* Global Metrics Aggregate Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#E8A020]/20">
          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#E8A020]" /> Total Ganadores
            </span>
            <p className="font-display text-2xl font-bold text-[#F0EDE6]">{winnerIdeas.length}</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#E8A020]" /> Total Vistas
            </span>
            <p className="font-display text-2xl font-bold text-[#F0EDE6]">
              {totalViews.toLocaleString('es-ES')}
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5 text-[#E8A020]" /> Total Likes
            </span>
            <p className="font-display text-2xl font-bold text-[#F0EDE6]">
              {totalLikes.toLocaleString('es-ES')}
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#E8A020]" /> Comentarios
            </span>
            <p className="font-display text-2xl font-bold text-[#F0EDE6]">
              {totalComments.toLocaleString('es-ES')}
            </p>
          </div>
        </div>
      </div>

      {/* Winner Content Cards Grid */}
      <div className="space-y-6">
        <h3 className="font-display font-bold text-lg text-[#F0EDE6] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#E8A020]" />
          <span>Colección de Historias Ganadoras ({winnerIdeas.length})</span>
        </h3>

        {winnerIdeas.length === 0 ? (
          <div className="bg-[#121212] border border-dashed border-[#262626] p-12 rounded-2xl text-center space-y-3">
            <Trophy className="w-12 h-12 text-[#333] mx-auto" />
            <h4 className="font-display font-bold text-base text-[#888]">
              Aún no has marcado ningún vídeo como "Ganador".
            </h4>
            <p className="text-xs text-[#555] max-w-md mx-auto">
              Ve al Analizador de Contenido o abre el Panel de Brief de un proyecto y activa la casilla "¿Fue ganador?" para coleccionar tus mejores éxitos aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {winnerIdeas.map((idea) => {
              const data = getReflectionData(idea.id);

              return (
                <div
                  key={idea.id}
                  className="bg-[#121212] border border-[#222] hover:border-[#E8A020]/40 p-6 rounded-2xl space-y-5 shadow-xl transition-all glow-amber-sm flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 bg-[#1C1810] border border-[#E8A020]/30 text-[#E8A020] text-xs font-mono font-bold rounded-full">
                        Pilar: {idea.pillar}
                      </span>

                      <button
                        onClick={() => openBriefModal(idea.id)}
                        className="text-xs text-[#888] hover:text-[#E8A020] flex items-center gap-1 font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ver Brief Original</span>
                      </button>
                    </div>

                    <h4 className="font-display font-bold text-lg text-[#F0EDE6] leading-snug">
                      {idea.title}
                    </h4>

                    {/* Quick Metrics */}
                    {idea.metrics && (
                      <div className="flex items-center gap-4 text-xs font-mono text-[#A09D96] bg-[#0A0A0A] p-2.5 rounded-xl border border-[#1F1F1F]">
                        <span>👀 {(idea.metrics.views || 0).toLocaleString()} vistas</span>
                        <span>❤️ {(idea.metrics.likes || 0).toLocaleString()} likes</span>
                        <span>💬 {(idea.metrics.comments || 0).toLocaleString()} com.</span>
                      </div>
                    )}
                  </div>

                  {/* Reflection Text Fields */}
                  <div className="space-y-4 pt-3 border-t border-[#1F1F1F]">
                    {/* Why it worked */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase text-[#E8A020] tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4" />
                        <span>Por qué funcionó (Reflexión)</span>
                      </label>
                      <textarea
                        value={data.reflection}
                        onChange={(e) => handleChange(idea.id, 'reflection', e.target.value)}
                        placeholder="Ej: El gancho directo en los primeros 2 segundos generó un retención de audiencia del 75%..."
                        rows={3}
                        className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] focus:outline-none p-3 text-xs text-[#F0EDE6] rounded-xl transition-all resize-y"
                      />
                    </div>

                    {/* What narrative pattern was used */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase text-[#E8A020] tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        <span>Qué estructura narrativa usé (Patrón)</span>
                      </label>
                      <textarea
                        value={data.pattern}
                        onChange={(e) => handleChange(idea.id, 'pattern', e.target.value)}
                        placeholder="Ej: Problema común -> Error grave -> Demostración en vivo -> Solución en 3 pasos..."
                        rows={3}
                        className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] focus:outline-none p-3 text-xs text-[#F0EDE6] rounded-xl transition-all resize-y"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveDetails(idea.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        data.saved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1C1810] hover:bg-[#262015] border border-[#E8A020]/40 text-[#E8A020]'
                      }`}
                    >
                      {data.saved ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Patrón Guardado</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Guardar Reflexión</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
