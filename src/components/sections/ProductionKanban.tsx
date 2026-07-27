import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import { useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../../context/AppContext';
import { KanbanStatus, IdeaItem } from '../../types';
import {
  Clapperboard,
  Video,
  Scissors,
  CheckCircle,
  Calendar,
  Trophy,
  FileEdit,
  Plus
} from 'lucide-react';

const KANBAN_COLUMNS: { id: KanbanStatus; title: string; icon: React.ReactNode }[] = [
  { id: 'En desarrollo', title: 'En Desarrollo', icon: <Clapperboard className="w-4 h-4 text-[#E8A020]" /> },
  { id: 'Grabado', title: 'Grabado', icon: <Video className="w-4 h-4 text-[#E8A020]" /> },
  { id: 'En edición', title: 'En Edición', icon: <Scissors className="w-4 h-4 text-[#E8A020]" /> },
  { id: 'Lista para publicar', title: 'Lista Para Publicar', icon: <CheckCircle className="w-4 h-4 text-[#E8A020]" /> },
];

// Individual Sortable Card
const KanbanCard: React.FC<{ idea: IdeaItem; onClick: () => void }> = ({ idea, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: idea.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-[#141414] border border-[#262626] hover:border-[#E8A020]/50 p-4 rounded-xl space-y-3 shadow-md hover:shadow-lg hover:shadow-[#E8A020]/5 transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-center justify-between gap-2">
        {/* Pilar Badge */}
        <span className="px-2.5 py-0.5 bg-[#1C1810] border border-[#E8A020]/30 text-[#E8A020] text-[10px] font-mono font-semibold rounded-full">
          {idea.pillar}
        </span>

        {/* Winner Indicator */}
        {idea.brief?.isWinner && (
          <span className="p-1 bg-[#E8A020] text-[#0A0A0A] rounded-full" title="Vídeo Ganador">
            <Trophy className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Video Title */}
      <h4 className="font-display font-semibold text-sm text-[#F0EDE6] group-hover:text-[#E8A020] transition-colors line-clamp-2">
        {idea.title}
      </h4>

      {/* Card Footer: Date & Brief button */}
      <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] text-[#888]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#666]" />
          <span>{idea.estimatedDate || 'Sin fecha'}</span>
        </div>

        <span className="text-xs text-[#E8A020] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <FileEdit className="w-3 h-3" /> Brief
        </span>
      </div>
    </div>
  );
};

// Droppable Column Container
const KanbanColumn: React.FC<{
  columnId: KanbanStatus;
  title: string;
  icon: React.ReactNode;
  ideas: IdeaItem[];
  onCardClick: (ideaId: string) => void;
}> = ({ columnId, title, icon, ideas, onCardClick }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-[#101010] border border-[#222] rounded-2xl p-4 flex flex-col min-h-[500px] w-72 lg:w-80 flex-shrink-0"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F] mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-display font-bold text-sm text-[#F0EDE6]">{title}</h3>
        </div>
        <span className="px-2 py-0.5 bg-[#1C1C1C] text-[#888] text-xs font-mono font-semibold rounded-full">
          {ideas.length}
        </span>
      </div>

      {/* Column Ideas List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {ideas.length === 0 ? (
          <div className="h-40 border border-dashed border-[#222] rounded-xl flex items-center justify-center text-center p-4">
            <p className="text-xs text-[#555]">
              Arrastra una tarjeta aquí o asigna producción a una idea.
            </p>
          </div>
        ) : (
          ideas.map((idea) => (
            <KanbanCard key={idea.id} idea={idea} onClick={() => onCardClick(idea.id)} />
          ))
        )}
      </div>
    </div>
  );
};

export const ProductionKanban: React.FC = () => {
  const { ideas, updateKanbanStatus, openBriefModal, openNewIdeaModal } = useApp();
  const [activeDraggingId, setActiveDraggingId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDraggingId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDraggingId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Find the dragging idea
    const draggingIdea = ideas.find((i) => i.id === activeId);
    if (!draggingIdea) return;

    // Check if dropped directly on a column droppable or over another card
    const targetColumn = KANBAN_COLUMNS.find((col) => col.id === overId)?.id;

    if (targetColumn) {
      updateKanbanStatus(activeId, targetColumn);
    } else {
      // Find the card that was dropped over
      const overIdea = ideas.find((i) => i.id === overId);
      if (overIdea && overIdea.kanbanStatus) {
        updateKanbanStatus(activeId, overIdea.kanbanStatus);
      }
    }
  };

  const activeDraggingIdea = ideas.find((i) => i.id === activeDraggingId);

  // Filter ideas currently in Production
  const productionIdeas = ideas.filter((i) => i.status === 'En Producción');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212] border border-[#222] p-4 rounded-2xl">
        <div>
          <h3 className="font-display font-bold text-base text-[#F0EDE6]">
            Tablero Kanban de Producción
          </h3>
          <p className="text-xs text-[#888]">
            Gestiona el ciclo de rodaje y guionización. Haz clic en cualquier tarjeta para abrir su Panel de Brief.
          </p>
        </div>

        <button
          onClick={openNewIdeaModal}
          className="px-4 py-2 bg-[#E8A020] hover:bg-[#D48F18] text-[#0A0A0A] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-[#E8A020]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Proyecto</span>
        </button>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
          {KANBAN_COLUMNS.map((col) => {
            const colIdeas = productionIdeas.filter((i) => i.kanbanStatus === col.id);
            return (
              <KanbanColumn
                key={col.id}
                columnId={col.id}
                title={col.title}
                icon={col.icon}
                ideas={colIdeas}
                onCardClick={(id) => openBriefModal(id)}
              />
            );
          })}
        </div>

        {/* Drag Overlay Preview */}
        <DragOverlay>
          {activeDraggingIdea ? (
            <div className="bg-[#181818] border-2 border-[#E8A020] p-4 rounded-xl shadow-2xl space-y-2 opacity-90 w-72">
              <span className="px-2.5 py-0.5 bg-[#E8A020]/20 text-[#E8A020] text-[10px] font-mono font-bold rounded-full">
                {activeDraggingIdea.pillar}
              </span>
              <h4 className="font-display font-bold text-sm text-[#F0EDE6]">
                {activeDraggingIdea.title}
              </h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
