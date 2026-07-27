import { IdeaItem } from '../types';

export const INITIAL_SUB_PILLARS: Record<string, string[]> = {
  Educar: ['Tutoriales Rápidos', 'Desmontando Mitos', 'Análisis de Guión'],
  Inspirar: ['Historias Reales', 'Evolución de Carrera', 'Filosofía Creativa'],
  Entretener: ['Retos de Grabación', 'Vlogs de Rodaje', 'Curiosidades Cine'],
  Vender: ['Mis Servicios', 'Plantillas de Guión', 'Masterclass Exclusiva'],
};

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: 'idea-1',
    title: 'Cómo estructurar un gancho en los primeros 3 segundos',
    pillar: 'Educar',
    subPillar: 'Tutoriales Rápidos',
    status: 'Lista',
    createdAt: '2026-07-20T10:00:00.000Z',
    answers: {
      title: 'Cómo estructurar un gancho en los primeros 3 segundos',
      purpose: 'Educar',
      expectation: 'Guardárselo',
      magnets: [
        'Descubrir la respuesta o solución a una situación o problema',
        'Les engancha visualmente'
      ]
    },
    brief: {
      narrativeScript: '## INTRO\n¿Sabías que el 80% de la gente se va de tu vídeo si no la enganchas en los primeros 3 segundos?\n\n## DESARROLLO\nEstructura de 3 pasos:\n1. Afirmación chocante\n2. Pregunta de empatía\n3. Promesa de valor rápido\n\n## CIERRE\nGuarda este vídeo para aplicarlo en tu próximo guión.',
      technicalScript: [
        { id: 't1', scene: '01', visual: 'Plano detalle haciendo zoom rápido a pantalla', audio: 'Efecto de sonido "Whoosh" + Voz en off potente', duration: '0:03', notes: 'Subtítulos grandes en amarillo' },
        { id: 't2', scene: '02', visual: 'B-roll de gráfico de retención de audiencia cayendo', audio: 'Música de tensión sutil', duration: '0:05', notes: 'Resaltar número 80%' }
      ],
      preparatives: [
        { category: 'Localizaciones', items: [{ id: 'p1', text: 'Set principal con iluminación ámbar', completed: true }] },
        { category: 'Atrezzo', items: [{ id: 'p2', text: 'Claqueta de cine vintage', completed: true }] },
        { category: 'Material técnico', items: [{ id: 'p3', text: 'Lente 35mm f/1.8 + Micrófono de solapa', completed: true }] },
        { category: 'Logística', items: [{ id: 'p4', text: 'Exportar gráficos en ProRes 422', completed: false }] }
      ],
      externalLinks: ['https://notion.so/guion-hooks-3s', 'https://youtube.com/watch?v=ref-hook'],
      freeNotes: 'Probar dos versiones de miniatura: una con texto grande y otra centrada en la expresión facial.',
      isWinner: true
    },
    kanbanStatus: 'Lista para publicar',
    estimatedDate: '2026-07-28',
    rrss: ['YouTube Shorts', 'Instagram Reels', 'TikTok'],
    publishDate: '2026-07-25',
    metrics: {
      views: 45200,
      likes: 3820,
      comments: 240,
      shares: 890
    },
    winnerReflection: 'El concepto directo al grano y la demostración visual en el primer segundo provocó un porcentaje de compartidos 3x superior a la media.',
    winnerPattern: 'Estructura de conflicto directo -> demostración -> lista de 3 puntos clave -> llamada a guardar.'
  },
  {
    id: 'idea-2',
    title: 'Detrás de cámaras: Cómo iluminé mi último vídeo con $50',
    pillar: 'Inspirar',
    subPillar: 'Historias Reales',
    status: 'En Producción',
    createdAt: '2026-07-22T14:30:00.000Z',
    answers: {
      title: 'Detrás de cámaras: Cómo iluminé mi último vídeo con $50',
      purpose: 'Inspirar',
      expectation: 'Compartirlo',
      magnets: [
        'Sentirse identificados con lo que se cuenta',
        'Descubrir la respuesta o solución a una situación o problema'
      ]
    },
    brief: {
      narrativeScript: '## INTRO\nNo necesitas $2000 en luces para lograr un look cinematográfico.\n\n## CUERPO\nTe muestro cómo usando papel cebolla y dos tubos LED económicos transformé mi cuarto en un plató nocturno.',
      technicalScript: [
        { id: 't1', scene: '01', visual: 'Comparativa Antes vs Después', audio: 'Voz en off "Look barato vs Look cine"', duration: '0:04', notes: 'Split screen' }
      ],
      preparatives: [
        { category: 'Localizaciones', items: [{ id: 'p1', text: 'Habitación a oscuras', completed: true }] },
        { category: 'Atrezzo', items: [{ id: 'p2', text: 'Focos caseros y banderas negras', completed: true }] },
        { category: 'Material técnico', items: [{ id: 'p3', text: '2 Tubos LED RGB + Trípode básico', completed: true }] },
        { category: 'Logística', items: [{ id: 'p4', text: 'Grabar de noche para control total de luz', completed: true }] }
      ],
      externalLinks: [],
      freeNotes: 'Enfocarse mucho en la narrativa del esfuerzo y la creatividad antes que el equipo.',
      isWinner: false
    },
    kanbanStatus: 'En edición',
    estimatedDate: '2026-07-29',
    rrss: ['Instagram Reels', 'YouTube Shorts']
  },
  {
    id: 'idea-3',
    title: '5 errores catastróficos al grabar audio en exteriores',
    pillar: 'Educar',
    subPillar: 'Tutoriales Rápidos',
    status: 'En Producción',
    createdAt: '2026-07-24T09:15:00.000Z',
    answers: {
      title: '5 errores catastróficos al grabar audio en exteriores',
      purpose: 'Educar',
      expectation: 'Guardárselo',
      magnets: [
        'Descubrir la respuesta o solución a una situación o problema'
      ]
    },
    brief: {
      narrativeScript: '## PUNTOS\n1. No usar antipop de pelo\n2. Grabación con ganancia demasiado alta\n3. Subestimar el viento constante\n4. No hacer prueba de escucha activa con auriculares\n5. Olvidar grabar room tone',
      technicalScript: [],
      preparatives: [
        { category: 'Localizaciones', items: [{ id: 'p1', text: 'Parque con viento tenue', completed: false }] },
        { category: 'Atrezzo', items: [], },
        { category: 'Material técnico', items: [{ id: 'p2', text: 'Grabadora Zoom H4n y peluche anti-viento', completed: true }] },
        { category: 'Logística', items: [], }
      ],
      externalLinks: [],
      freeNotes: '',
      isWinner: false
    },
    kanbanStatus: 'En desarrollo',
    estimatedDate: '2026-07-31'
  },
  {
    id: 'idea-4',
    title: '¿Vale la pena grabar vídeos en 8K en 2026?',
    pillar: 'Entretener',
    subPillar: 'Curiosidades Cine',
    status: 'Madurando',
    createdAt: '2026-07-25T11:20:00.000Z',
    answers: {
      title: '¿Vale la pena grabar vídeos en 8K en 2026?',
      purpose: 'Entretener',
      expectation: 'Comentar',
      magnets: ['No lo sé']
    },
    brief: {
      narrativeScript: 'Duda entre hacer un experimento científico o un vídeo irónico.',
      technicalScript: [],
      preparatives: [
        { category: 'Localizaciones', items: [] },
        { category: 'Atrezzo', items: [] },
        { category: 'Material técnico', items: [] },
        { category: 'Logística', items: [] }
      ],
      externalLinks: [],
      freeNotes: 'Aún necesito afinar si el tono debe ser humorístico o estrictamente técnico.',
      isWinner: false
    }
  },
  {
    id: 'idea-5',
    title: 'Lanzamiento: Plantilla de Escaleta Narrativa para creadores',
    pillar: 'Vender',
    subPillar: 'Plantillas de Guión',
    status: 'Lista',
    createdAt: '2026-07-18T16:00:00.000Z',
    answers: {
      title: 'Lanzamiento: Plantilla de Escaleta Narrativa para creadores',
      purpose: 'Vender',
      expectation: 'Comprar',
      magnets: [
        'Descubrir la respuesta o solución a una situación o problema',
        'Quieren ver el resultado final / segunda parte'
      ]
    },
    brief: {
      narrativeScript: 'Demostración práctica de cómo pasé de tardar 5 horas escribiendo a 45 minutos usando la plantilla.',
      technicalScript: [],
      preparatives: [
        { category: 'Localizaciones', items: [{ id: 'p1', text: 'Escritorio con captura de pantalla', completed: true }] },
        { category: 'Atrezzo', items: [] },
        { category: 'Material técnico', items: [{ id: 'p2', text: 'Micrófono Shure SM7B', completed: true }] },
        { category: 'Logística', items: [{ id: 'p3', text: 'Subir PDF a la tienda', completed: true }] }
      ],
      externalLinks: ['https://gumroad.com/l/escaleta-narrativa'],
      freeNotes: '',
      isWinner: true
    },
    kanbanStatus: 'Lista para publicar',
    estimatedDate: '2026-07-22',
    rrss: ['YouTube', 'Instagram Reels'],
    publishDate: '2026-07-21',
    metrics: {
      views: 28900,
      likes: 2100,
      comments: 310,
      shares: 420
    },
    winnerReflection: 'Enseñar el flujo de trabajo real "antes y después" fue el factor decisivo de conversión.',
    winnerPattern: 'Problema de tiempo -> Demostración en vivo en pantalla -> Solución empaquetada -> CTA claro con descuento.'
  }
];
