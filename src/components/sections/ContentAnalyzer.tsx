import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IdeaItem } from '../../types';
import {
  Trophy,
  BarChart2,
  Calendar,
  Share2,
  Eye,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Save,
  Check
} from 'lucide-react';

const RRSS_OPTIONS = ['YouTube', 'YouTube Shorts', 'Instagram Reels', 'TikTok', 'LinkedIn', 'X/Twitter'];

export const ContentAnalyzer: React.FC = () => {
  const { ideas, updateMetricsAndPublish, toggleWinner } = useApp();

  // Get all videos that are published OR ready to publish ('Lista para publicar' or status 'Publicado')
  const analyzerIdeas = ideas.filter(
    (i) => i.status === 'Publicado' || i.kanbanStatus === 'Lista para publicar'
  );

  // Editable state per video
  const [editingData, setEditingData] = useState<
    Record<
      string,
      {
        publishDate: string;
        rrss: string[];
        views: number;
        likes: number;
        comments: number;
        shares: number;
        isWinner: boolean;
        saved: boolean;
      }
    >
  >({});

  const getIdeaData = (idea: IdeaItem) => {
    if (editingData[idea.id]) return editingData[idea.id];
    return {
      publishDate:
        idea.publishDate ||
        idea.estimatedDate ||
        new Date().toISOString().split('T')[0],
      rrss: idea.rrss || ['YouTube Shorts', 'Instagram Reels'],
      views: idea.metrics?.views || 0,
      likes: idea.metrics?.likes || 0,
      comments: idea.metrics?.comments || 0,
      shares: idea.metrics?.shares || 0,
      isWinner: !!idea.brief?.isWinner,
      saved: false,
    };
  };

  const handleFieldChange = (
    ideaId: string,
    field: string,
    value: any
  ) => {
    const current = getIdeaData(ideas.find((i) => i.id === ideaId)!);
    setEditingData({
      ...editingData,
      [ideaId]: {
        ...current,
        [field]: value,
        saved: false,
      },
    });
  };

  const handleRrssToggle = (ideaId: string, platform: string) => {
    const current = getIdeaData(ideas.find((i) => i.id === ideaId)!);
    const existing = current.rrss;
    const nextRrss = existing.includes(platform)
      ? existing.filter((p) => p !== platform)
      : [...existing, platform];

    handleFieldChange(ideaId, 'rrss', nextRrss);
  };

  const handleSaveMetrics = (idea: IdeaItem) => {
    const data = getIdeaData(idea);
    updateMetricsAndPublish(idea.id, {
      publishDate: data.publishDate,
      rrss: data.rrss,
      metrics: {
        views: Number(data.views) || 0,
        likes: Number(data.likes) || 0,
        comments: Number(data.comments) || 0,
        shares: Number(data.shares) || 0,
      },
      isWinner: data.isWinner,
    });

    setEditingData({
      ...editingData,
      [idea.id]: {
        ...data,
        saved: true,
      },
    });

    setTimeout(() => {
      setEditingData((prev) => ({
        ...prev,
        [idea.id]: { ...prev[idea.id], saved: false },
      }));
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Notice Banner */}
      <div className="bg-[#14120D] border border-[#E8A020]/30 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E8A020]/10 text-[#E8A020] rounded-xl">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#F0EDE6]">
              Analizador de Contenido Publicado
            </h3>
            <p className="text-xs text-[#A09D96]">
              Registra el impacto a los 7 días de cada vídeo para identificar el contenido ganador.
            </p>
          </div>
        </div>

        <span className="hidden md:inline-block text-[11px] font-mono text-[#E8A020] bg-[#1F180C] px-3 py-1 rounded-full border border-[#E8A020]/20">
          Próximamente: Conexión API con RRSS para métricas en vivo
        </span>
      </div>

      {/* Analyzer Table Container (Esqueleto siempre visible) */}
      <div className="bg-[#101010] border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#222] bg-[#141414] flex items-center justify-between">
          <h4 className="font-display font-bold text-sm text-[#F0EDE6] flex items-center gap-2">
            <span>Rendimiento de Vídeos ({analyzerIdeas.length})</span>
          </h4>
          <span className="text-xs text-[#888]">Los vídeos "Ganadores" se copian al Potenciador</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#222] bg-[#161616] text-[#A09D96] font-mono uppercase text-[11px]">
                <th className="p-4 min-w-[280px]">TÍTULO DEL VÍDEO (SIN TRUNCAR)</th>
                <th className="p-4 min-w-[200px]">REDES SOCIALES (RRSS)</th>
                <th className="p-4 w-40">FECHA DE PUBLICACIÓN</th>
                <th className="p-4 min-w-[280px]">ESTADÍSTICAS A LOS 7 DÍAS</th>
                <th className="p-4 w-28 text-center">GANADOR</th>
                <th className="p-4 w-24 text-center font-mono">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {analyzerIdeas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#666]">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-display font-semibold text-sm text-[#888]">
                        Aún no hay vídeos en fase de análisis.
                      </p>
                      <p className="text-xs text-[#555]">
                        Mueve tus tarjetas a "Lista para publicar" en el Kanban o crea una nueva idea para ver el esqueleto completarse.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                analyzerIdeas.map((idea) => {
                  const data = getIdeaData(idea);

                  return (
                    <tr key={idea.id} className="hover:bg-[#141414] transition-colors">
                      {/* Title - UNTRUNCATED */}
                      <td className="p-4 align-top">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-[#1C1810] border border-[#E8A020]/30 text-[#E8A020] text-[10px] font-mono rounded">
                            {idea.pillar}
                          </span>
                          <p className="font-display font-semibold text-sm text-[#F0EDE6] whitespace-normal leading-relaxed">
                            {idea.title}
                          </p>
                        </div>
                      </td>

                      {/* RRSS Multi-Select */}
                      <td className="p-4 align-top">
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {RRSS_OPTIONS.map((rrss) => {
                            const isSelected = data.rrss.includes(rrss);
                            return (
                              <button
                                key={rrss}
                                type="button"
                                onClick={() => handleRrssToggle(idea.id, rrss)}
                                className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#E8A020]/20 border-[#E8A020] text-[#E8A020]'
                                    : 'bg-[#0A0A0A] border-[#222] text-[#666] hover:text-[#aaa]'
                                }`}
                              >
                                {rrss}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Publish Date with Calendar Picker */}
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#262626] p-2 rounded-xl text-xs text-[#F0EDE6]">
                          <Calendar className="w-4 h-4 text-[#E8A020]" />
                          <input
                            type="date"
                            value={data.publishDate}
                            onChange={(e) => handleFieldChange(idea.id, 'publishDate', e.target.value)}
                            className="bg-transparent focus:outline-none text-xs text-[#F0EDE6] cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* 7-Day Stats (Views, Likes, Comments, Shares) */}
                      <td className="p-4 align-top">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Views */}
                          <div className="flex items-center gap-1.5 bg-[#0A0A0A] border border-[#222] px-2.5 py-1.5 rounded-lg">
                            <Eye className="w-3.5 h-3.5 text-[#E8A020]" />
                            <input
                              type="number"
                              value={data.views}
                              onChange={(e) => handleFieldChange(idea.id, 'views', e.target.value)}
                              placeholder="Vistas"
                              className="w-full bg-transparent focus:outline-none text-xs text-[#F0EDE6]"
                            />
                          </div>

                          {/* Likes */}
                          <div className="flex items-center gap-1.5 bg-[#0A0A0A] border border-[#222] px-2.5 py-1.5 rounded-lg">
                            <ThumbsUp className="w-3.5 h-3.5 text-[#E8A020]" />
                            <input
                              type="number"
                              value={data.likes}
                              onChange={(e) => handleFieldChange(idea.id, 'likes', e.target.value)}
                              placeholder="Likes"
                              className="w-full bg-transparent focus:outline-none text-xs text-[#F0EDE6]"
                            />
                          </div>

                          {/* Comments */}
                          <div className="flex items-center gap-1.5 bg-[#0A0A0A] border border-[#222] px-2.5 py-1.5 rounded-lg">
                            <MessageSquare className="w-3.5 h-3.5 text-[#E8A020]" />
                            <input
                              type="number"
                              value={data.comments}
                              onChange={(e) => handleFieldChange(idea.id, 'comments', e.target.value)}
                              placeholder="Comentarios"
                              className="w-full bg-transparent focus:outline-none text-xs text-[#F0EDE6]"
                            />
                          </div>

                          {/* Shares */}
                          <div className="flex items-center gap-1.5 bg-[#0A0A0A] border border-[#222] px-2.5 py-1.5 rounded-lg">
                            <Share2 className="w-3.5 h-3.5 text-[#E8A020]" />
                            <input
                              type="number"
                              value={data.shares}
                              onChange={(e) => handleFieldChange(idea.id, 'shares', e.target.value)}
                              placeholder="Compartidos"
                              className="w-full bg-transparent focus:outline-none text-xs text-[#F0EDE6]"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Toggle Winner */}
                      <td className="p-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const nextWinner = !data.isWinner;
                            handleFieldChange(idea.id, 'isWinner', nextWinner);
                            toggleWinner(idea.id);
                          }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center ${
                            data.isWinner
                              ? 'bg-[#E8A020] text-[#0A0A0A] shadow-md shadow-[#E8A020]/20'
                              : 'bg-[#1C1C1C] text-[#555] hover:text-[#ccc] border border-[#2B2B2B]'
                          }`}
                          title={data.isWinner ? 'Marcado como Ganador' : 'Marcar como Ganador'}
                        >
                          <Trophy className="w-5 h-5" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => handleSaveMetrics(idea)}
                          className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            data.saved
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#1F1F1F] hover:bg-[#282828] text-[#E8A020] border border-[#333]'
                          }`}
                        >
                          {data.saved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>OK</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Guardar</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
