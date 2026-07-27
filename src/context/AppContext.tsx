import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  IdeaItem,
  PillarType,
  IdeaAnswers,
  KanbanStatus,
  ActiveSection,
  BriefData
} from '../types';
import { INITIAL_IDEAS, INITIAL_SUB_PILLARS } from '../data/initialData';

interface AppContextType {
  ideas: IdeaItem[];
  subPillars: Record<string, string[]>;
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPillarFilter: string;
  setSelectedPillarFilter: (pillar: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;
  
  // Modals state
  activeBriefIdeaId: string | null;
  openBriefModal: (ideaId: string) => void;
  closeBriefModal: () => void;
  
  activeEditIdeaId: string | null;
  openEditModal: (ideaId: string) => void;
  closeEditModal: () => void;
  
  isNewIdeaModalOpen: boolean;
  openNewIdeaModal: () => void;
  closeNewIdeaModal: () => void;
  
  // Actions
  addIdea: (answers: IdeaAnswers) => IdeaItem;
  updateIdea: (id: string, updates: Partial<IdeaItem>) => void;
  deleteIdea: (id: string) => void;
  moveIdeaToProduction: (id: string, targetStatus?: KanbanStatus) => void;
  updateKanbanStatus: (id: string, status: KanbanStatus) => void;
  addSubPillar: (pillar: PillarType, subPillarName: string) => void;
  toggleWinner: (id: string) => void;
  updateWinnerDetails: (id: string, reflection: string, pattern: string) => void;
  updateMetricsAndPublish: (
    id: string,
    data: {
      publishDate: string;
      rrss: string[];
      metrics: { views: number; likes: number; comments: number; shares: number };
      isWinner: boolean;
    }
  ) => void;
  resetDataToSample: () => void;
}

const STORAGE_KEY_IDEAS = 'cineflow_ideas_v1';
const STORAGE_KEY_SUBPILLARS = 'cineflow_subpillars_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IDEAS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading ideas from localStorage', e);
    }
    return INITIAL_IDEAS;
  });

  const [subPillars, setSubPillars] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBPILLARS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading subpillars from localStorage', e);
    }
    return INITIAL_SUB_PILLARS;
  });

  const [activeSection, setActiveSection] = useState<ActiveSection>('despensa');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>('Todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Todos');

  // Modals state
  const [activeBriefIdeaId, setActiveBriefIdeaId] = useState<string | null>(null);
  const [activeEditIdeaId, setActiveEditIdeaId] = useState<string | null>(null);
  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IDEAS, JSON.stringify(ideas));
    } catch (e) {
      console.error('Error saving ideas to localStorage', e);
    }
  }, [ideas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBPILLARS, JSON.stringify(subPillars));
    } catch (e) {
      console.error('Error saving subpillars to localStorage', e);
    }
  }, [subPillars]);

  const openBriefModal = (ideaId: string) => setActiveBriefIdeaId(ideaId);
  const closeBriefModal = () => setActiveBriefIdeaId(null);

  const openEditModal = (ideaId: string) => setActiveEditIdeaId(ideaId);
  const closeEditModal = () => setActiveEditIdeaId(null);

  const openNewIdeaModal = () => setIsNewIdeaModalOpen(true);
  const closeNewIdeaModal = () => setIsNewIdeaModalOpen(false);

  // Helper to determine status
  const determineStatus = (answers: IdeaAnswers): 'Lista' | 'Madurando' => {
    const hasDontKnowPurpose = answers.purpose === 'No lo sé';
    const hasDontKnowExpectation = answers.expectation === 'No lo sé';
    const hasDontKnowMagnet = answers.magnets.includes('No lo sé');

    if (hasDontKnowPurpose || hasDontKnowExpectation || hasDontKnowMagnet) {
      return 'Madurando';
    }
    return 'Lista';
  };

  const addIdea = (answers: IdeaAnswers): IdeaItem => {
    const status = determineStatus(answers);
    const pillar: PillarType =
      answers.purpose !== 'No lo sé' ? (answers.purpose as PillarType) : 'Educar';

    const defaultBrief: BriefData = {
      narrativeScript: '',
      technicalScript: [],
      preparatives: [
        { category: 'Localizaciones', items: [] },
        { category: 'Atrezzo', items: [] },
        { category: 'Material técnico', items: [] },
        { category: 'Logística', items: [] },
      ],
      externalLinks: [],
      freeNotes: '',
      isWinner: false,
    };

    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      title: answers.title.trim() || 'Nueva Idea sin Título',
      pillar,
      status,
      createdAt: new Date().toISOString(),
      answers,
      brief: defaultBrief,
    };

    setIdeas((prev) => [newIdea, ...prev]);
    return newIdea;
  };

  const updateIdea = (id: string, updates: Partial<IdeaItem>) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        
        let newAnswers = updates.answers ? { ...idea.answers, ...updates.answers } : idea.answers;
        let newStatus = updates.status || idea.status;

        // If answers were updated, re-evaluate status if user hasn't explicitly overridden it
        if (updates.answers && !updates.status) {
          newStatus = determineStatus(newAnswers);
        }

        return {
          ...idea,
          ...updates,
          answers: newAnswers,
          status: newStatus,
        };
      })
    );
  };

  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    if (activeBriefIdeaId === id) closeBriefModal();
    if (activeEditIdeaId === id) closeEditModal();
  };

  const moveIdeaToProduction = (id: string, targetStatus: KanbanStatus = 'En desarrollo') => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        return {
          ...idea,
          status: 'En Producción',
          kanbanStatus: targetStatus,
          estimatedDate: idea.estimatedDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        };
      })
    );
  };

  const updateKanbanStatus = (id: string, status: KanbanStatus) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        return {
          ...idea,
          kanbanStatus: status,
          status: status === 'Lista para publicar' ? 'En Producción' : idea.status,
        };
      })
    );
  };

  const addSubPillar = (pillar: PillarType, subPillarName: string) => {
    const trimmed = subPillarName.trim();
    if (!trimmed) return;
    setSubPillars((prev) => {
      const existing = prev[pillar] || [];
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        [pillar]: [...existing, trimmed],
      };
    });
  };

  const toggleWinner = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        const currentWinnerState = idea.brief.isWinner;
        return {
          ...idea,
          brief: {
            ...idea.brief,
            isWinner: !currentWinnerState,
          },
        };
      })
    );
  };

  const updateWinnerDetails = (id: string, reflection: string, pattern: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        return {
          ...idea,
          winnerReflection: reflection,
          winnerPattern: pattern,
        };
      })
    );
  };

  const updateMetricsAndPublish = (
    id: string,
    data: {
      publishDate: string;
      rrss: string[];
      metrics: { views: number; likes: number; comments: number; shares: number };
      isWinner: boolean;
    }
  ) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        return {
          ...idea,
          status: 'Publicado',
          publishDate: data.publishDate,
          rrss: data.rrss,
          metrics: data.metrics,
          brief: {
            ...idea.brief,
            isWinner: data.isWinner,
          },
        };
      })
    );
  };

  const resetDataToSample = () => {
    setIdeas(INITIAL_IDEAS);
    setSubPillars(INITIAL_SUB_PILLARS);
    localStorage.removeItem(STORAGE_KEY_IDEAS);
    localStorage.removeItem(STORAGE_KEY_SUBPILLARS);
  };

  return (
    <AppContext.Provider
      value={{
        ideas,
        subPillars,
        activeSection,
        setActiveSection,
        searchQuery,
        setSearchQuery,
        selectedPillarFilter,
        setSelectedPillarFilter,
        selectedStatusFilter,
        setSelectedStatusFilter,
        activeBriefIdeaId,
        openBriefModal,
        closeBriefModal,
        activeEditIdeaId,
        openEditModal,
        closeEditModal,
        isNewIdeaModalOpen,
        openNewIdeaModal,
        closeNewIdeaModal,
        addIdea,
        updateIdea,
        deleteIdea,
        moveIdeaToProduction,
        updateKanbanStatus,
        addSubPillar,
        toggleWinner,
        updateWinnerDetails,
        updateMetricsAndPublish,
        resetDataToSample,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
