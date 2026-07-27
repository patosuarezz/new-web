export type PillarType = 'Educar' | 'Inspirar' | 'Entretener' | 'Vender';

export type IdeaStatus = 'Lista' | 'Madurando' | 'En Producción' | 'Publicado';

export type KanbanStatus = 'En desarrollo' | 'Grabado' | 'En edición' | 'Lista para publicar';

export type PurposeOption = 'Educar' | 'Inspirar' | 'Entretener' | 'Vender' | 'No lo sé';

export type ExpectationOption = 'Comentar' | 'Seguirte' | 'Compartirlo' | 'Guardárselo' | 'Comprar' | 'No lo sé';

export type MagnetOption = 
  | 'Sentirse identificados con lo que se cuenta'
  | 'Descubrir la respuesta o solución a una situación o problema'
  | 'Les engancha visualmente'
  | 'Quieren ver el resultado final / segunda parte'
  | 'No lo sé';

export interface IdeaAnswers {
  title: string;
  purpose: PurposeOption;
  expectation: ExpectationOption;
  magnets: MagnetOption[];
}

export interface ScriptTechnicalRow {
  id: string;
  scene: string;
  visual: string;
  audio: string;
  duration: string;
  notes: string;
}

export interface PreparativeItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface PreparativesGroup {
  category: 'Localizaciones' | 'Atrezzo' | 'Material técnico' | 'Logística';
  items: PreparativeItem[];
}

export interface BriefData {
  narrativeScript: string;
  technicalScript: ScriptTechnicalRow[];
  preparatives: PreparativesGroup[];
  externalLinks: string[];
  freeNotes: string;
  isWinner: boolean;
}

export interface IdeaItem {
  id: string;
  title: string;
  pillar: PillarType;
  subPillar?: string;
  status: IdeaStatus;
  createdAt: string; // ISO date string
  answers: IdeaAnswers;
  
  // Production Kanban data (if in production or published)
  kanbanStatus?: KanbanStatus;
  estimatedDate?: string;
  kanbanOrder?: number;
  
  // Brief panel data
  brief: BriefData;
  
  // Analizador metrics
  rrss?: string[];
  publishDate?: string;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  
  // Potenciador reflections
  winnerReflection?: string;
  winnerPattern?: string;
}

export type ActiveSection = 'despensa' | 'produccion' | 'analizador' | 'calendario' | 'potenciador';
