import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { solutions, flashcards, analysisSessions } from '@/db';

type Solution = typeof solutions.$inferSelect;
type Flashcard = typeof flashcards.$inferSelect;
type AnalysisSession = typeof analysisSessions.$inferSelect;

interface SolutionState {
  currentSolution: Solution | null;
  solutions: Solution[];
  flashcards: Flashcard[];
  analysisSessions: AnalysisSession[];

  // Actions
  setCurrentSolution: (solution: Solution | null) => void;
  setSolutions: (solutions: Solution[]) => void;
  addSolution: (solution: Solution) => void;
  updateSolution: (id: string, updates: Partial<Solution>) => void;
  removeSolution: (id: string) => void;

  setFlashcards: (flashcards: Flashcard[]) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  removeFlashcard: (id: string) => void;

  setAnalysisSessions: (sessions: AnalysisSession[]) => void;
  addAnalysisSession: (session: AnalysisSession) => void;
}

export const useSolutionStore = create<SolutionState>()(
  devtools(
    (set) => ({
      currentSolution: null,
      solutions: [],
      flashcards: [],
      analysisSessions: [],

      setCurrentSolution: (solution) => set({ currentSolution: solution }),

      setSolutions: (solutions) => set({ solutions }),

      addSolution: (solution) =>
        set((state) => ({
          solutions: [...state.solutions, solution],
        })),

      updateSolution: (id, updates) =>
        set((state) => ({
          solutions: state.solutions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
          currentSolution:
            state.currentSolution?.id === id
              ? { ...state.currentSolution, ...updates }
              : state.currentSolution,
        })),

      removeSolution: (id) =>
        set((state) => ({
          solutions: state.solutions.filter((s) => s.id !== id),
          currentSolution:
            state.currentSolution?.id === id ? null : state.currentSolution,
        })),

      setFlashcards: (flashcards) => set({ flashcards }),

      addFlashcard: (flashcard) =>
        set((state) => ({
          flashcards: [...state.flashcards, flashcard],
        })),

      removeFlashcard: (id) =>
        set((state) => ({
          flashcards: state.flashcards.filter((f) => f.id !== id),
        })),

      setAnalysisSessions: (analysisSessions) => set({ analysisSessions }),

      addAnalysisSession: (session) =>
        set((state) => ({
          analysisSessions: [...state.analysisSessions, session],
        })),
    }),
    { name: 'solution-store' }
  )
);
