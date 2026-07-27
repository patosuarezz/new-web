import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IdeaItem } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Video,
  CheckCircle2,
  Clock,
  X,
  FileEdit
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { ideas, updateMetricsAndPublish, openBriefModal } = useApp();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);
  const [selectedIdeaIdForSchedule, setSelectedIdeaIdForSchedule] = useState<string>('');
  const [schedulePlatform, setSchedulePlatform] = useState<string>('YouTube Shorts');

  // Month navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week offset (Monday = 0)
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const totalDays = lastDayOfMonth.getDate();

  const daysMatrix: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysMatrix.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysMatrix.push(d);
  }

  // Get scheduled or published videos mapped by YYYY-MM-DD
  const getVideosForDate = (dateStr: string): IdeaItem[] => {
    return ideas.filter((idea) => {
      const pDate = idea.publishDate || idea.estimatedDate;
      return pDate === dateStr;
    });
  };

  const handleScheduleSubmit = () => {
    if (!selectedDateForModal || !selectedIdeaIdForSchedule) return;

    const ideaToSchedule = ideas.find((i) => i.id === selectedIdeaIdForSchedule);
    if (!ideaToSchedule) return;

    updateMetricsAndPublish(ideaToSchedule.id, {
      publishDate: selectedDateForModal,
      rrss: ideaToSchedule.rrss?.length ? ideaToSchedule.rrss : [schedulePlatform],
      metrics: ideaToSchedule.metrics || { views: 0, likes: 0, comments: 0, shares: 0 },
      isWinner: !!ideaToSchedule.brief?.isWinner,
    });

    setSelectedDateForModal(null);
    setSelectedIdeaIdForSchedule('');
  };

  const unscheduledIdeas = ideas.filter(
    (i) => i.status === 'Lista' || i.status === 'En Producción' || i.status === 'Madurando'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Header & Controls */}
      <div className="bg-[#121212] border border-[#222] p-4 lg:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E8A020]/10 text-[#E8A020] rounded-xl border border-[#E8A020]/20">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#F0EDE6]">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-[#888]">
              Haz clic en cualquier día para programar una publicación futura.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#242424] text-[#ccc] text-xs font-semibold rounded-xl border border-[#2B2B2B] transition-colors cursor-pointer"
          >
            Hoy
          </button>
          <div className="flex items-center gap-1 bg-[#1A1A1A] border border-[#2B2B2B] p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-[#ccc] hover:text-[#E8A020] hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-[#ccc] hover:text-[#E8A020] hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-[#101010] border border-[#222] rounded-2xl overflow-hidden shadow-2xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#222] bg-[#141414] text-center text-xs font-mono font-bold text-[#888] uppercase py-3">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sáb</span>
          <span>Dom</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#1A1A1A] bg-[#0D0D0D]">
          {daysMatrix.map((dayNum, index) => {
            if (dayNum === null) {
              return <div key={`empty-${index}`} className="min-h-[110px] bg-[#080808]" />;
            }

            const formattedDay = String(dayNum).padStart(2, '0');
            const formattedMonth = String(month + 1).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const isToday =
              new Date().getDate() === dayNum &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            const dayVideos = getVideosForDate(dateStr);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDateForModal(dateStr)}
                className={`min-h-[110px] p-2 hover:bg-[#141414] transition-colors cursor-pointer flex flex-col justify-between group relative ${
                  isToday ? 'bg-[#181510]' : ''
                }`}
              >
                {/* Date number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isToday
                        ? 'bg-[#E8A020] text-[#0A0A0A]'
                        : 'text-[#888] group-hover:text-[#F0EDE6]'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDateForModal(dateStr);
                    }}
                    className="p-1 text-[#555] hover:text-[#E8A020] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Programar vídeo en esta fecha"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scheduled Videos List */}
                <div className="mt-1 space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                  {dayVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openBriefModal(video.id);
                      }}
                      className="p-1.5 bg-[#1A1A1A] hover:bg-[#242424] border border-[#2B2B2B] hover:border-[#E8A020]/40 rounded-lg text-[10px] text-[#F0EDE6] space-y-0.5 shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#E8A020] font-mono font-semibold text-[9px] truncate">
                          {video.pillar}
                        </span>
                        {video.status === 'Publicado' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Clock className="w-3 h-3 text-[#E8A020]" />
                        )}
                      </div>
                      <p className="font-medium truncate leading-tight">{video.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Video Modal */}
      {selectedDateForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl glow-amber-sm">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#F0EDE6]">
                  Programar Publicación
                </h3>
                <p className="text-xs text-[#888]">Fecha: {selectedDateForModal}</p>
              </div>
              <button
                onClick={() => setSelectedDateForModal(null)}
                className="p-1.5 text-[#777] hover:text-[#F0EDE6] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A09D96] uppercase mb-1">
                  Seleccionar Idea de la Despensa
                </label>
                <select
                  value={selectedIdeaIdForSchedule}
                  onChange={(e) => setSelectedIdeaIdForSchedule(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] text-xs text-[#F0EDE6] p-3 rounded-xl focus:outline-none"
                >
                  <option value="">-- Selecciona una idea --</option>
                  {unscheduledIdeas.map((idea) => (
                    <option key={idea.id} value={idea.id}>
                      [{idea.pillar}] {idea.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A09D96] uppercase mb-1">
                  Plataforma Principal
                </label>
                <select
                  value={schedulePlatform}
                  onChange={(e) => setSchedulePlatform(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E8A020] text-xs text-[#F0EDE6] p-3 rounded-xl focus:outline-none"
                >
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDateForModal(null)}
                className="px-4 py-2 bg-[#1C1C1C] text-[#ccc] text-xs rounded-xl hover:bg-[#282828]"
              >
                Cancelar
              </button>
              <button
                disabled={!selectedIdeaIdForSchedule}
                onClick={handleScheduleSubmit}
                className="px-5 py-2 bg-[#E8A020] disabled:opacity-40 hover:bg-[#D48F18] text-[#0A0A0A] font-bold text-xs rounded-xl shadow-md shadow-[#E8A020]/20"
              >
                Confirmar Programación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
