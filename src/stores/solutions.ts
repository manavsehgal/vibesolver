import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Solution, Flashcard, AnalysisSession, Project, Tag } from '@/db/indexeddb';
import type { SolutionLibraryView, SolutionFilter, SolutionSort } from '@/types';

interface SolutionState {
  // Current state
  currentSolution: Solution | null;
  solutions: Solution[];
  flashcards: Flashcard[];
  analysisSessions: AnalysisSession[];
  projects: Project[];
  tags: Tag[];
  
  // Library view state
  libraryView: SolutionLibraryView;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isExporting: boolean;

  // Basic solution actions
  setCurrentSolution: (solution: Solution | null) => void;
  setSolutions: (solutions: Solution[]) => void;
  addSolution: (solution: Solution) => void;
  updateSolution: (id: string, updates: Partial<Solution>) => void;
  removeSolution: (id: string) => void;
  
  // Solution management actions
  saveSolution: (solution: Partial<Solution>) => Promise<Solution>;
  loadSolutions: () => Promise<void>;
  searchSolutions: (query: string) => Promise<Solution[]>;
  toggleFavorite: (id: string) => void;
  addTag: (solutionId: string, tag: string) => void;
  removeTag: (solutionId: string, tag: string) => void;
  
  // Bulk operations
  bulkDelete: (ids: string[]) => void;
  bulkUpdateTags: (ids: string[], tags: string[]) => void;
  bulkExport: (ids: string[], format: string) => Promise<void>;

  // Flashcard actions
  setFlashcards: (flashcards: Flashcard[]) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  removeFlashcard: (id: string) => void;

  // Analysis actions
  setAnalysisSessions: (sessions: AnalysisSession[]) => void;
  addAnalysisSession: (session: AnalysisSession) => void;
  
  // Project actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  // Tag actions
  setTags: (tags: Tag[]) => void;
  addTagToLibrary: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  removeTagFromLibrary: (id: string) => void;
  
  // Library view actions
  setLibraryView: (view: Partial<SolutionLibraryView>) => void;
  setFilter: (filter: Partial<SolutionFilter>) => void;
  setSort: (sort: SolutionSort) => void;
  setSelectedSolutions: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setExporting: (exporting: boolean) => void;
}

export const useSolutionStore = create<SolutionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentSolution: null,
      solutions: [],
      flashcards: [],
      analysisSessions: [],
      projects: [],
      tags: [],
      
      libraryView: {
        mode: 'grid',
        filter: {},
        sort: { field: 'updatedAt', direction: 'desc' },
        selectedIds: [],
      },
      
      isLoading: false,
      isSaving: false,
      isExporting: false,

      // Basic solution actions
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
        
      // Solution management actions
      saveSolution: async (solution) => {
        set({ isSaving: true });
        try {
          const { solutionOperations } = await import('@/db');
          const savedSolution = await solutionOperations.create(solution);
          get().addSolution(savedSolution);
          return savedSolution;
        } catch (error) {
          console.error('Failed to save solution:', error);
          throw error;
        } finally {
          set({ isSaving: false });
        }
      },
      
      loadSolutions: async () => {
        set({ isLoading: true });
        try {
          const { solutionOperations } = await import('@/db');
          const solutions = await solutionOperations.getAll();
          set({ solutions });
        } catch (error) {
          console.error('Failed to load solutions:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      searchSolutions: async (query) => {
        try {
          const { solutionOperations } = await import('@/db');
          return await solutionOperations.search(query);
        } catch (error) {
          console.error('Failed to search solutions:', error);
          const { solutions } = get();
          return solutions.filter(s => 
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.description.toLowerCase().includes(query.toLowerCase())
          );
        }
      },
      
      toggleFavorite: async (id) => {
        try {
          const { solutionOperations } = await import('@/db');
          const updatedSolution = await solutionOperations.toggleFavorite(id);
          set((state) => ({
            solutions: state.solutions.map((s) =>
              s.id === id ? updatedSolution : s
            ),
          }));
        } catch (error) {
          console.error('Failed to toggle favorite:', error);
          // Fallback to local state update
          set((state) => ({
            solutions: state.solutions.map((s) =>
              s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
            ),
          }));
        }
      },
        
      addTag: (solutionId, tag) =>
        set((state) => ({
          solutions: state.solutions.map((s) => {
            if (s.id === solutionId) {
              const currentTags = s.tags ? JSON.parse(s.tags) : [];
              if (!currentTags.includes(tag)) {
                return { ...s, tags: JSON.stringify([...currentTags, tag]) };
              }
            }
            return s;
          }),
        })),
        
      removeTag: (solutionId, tag) =>
        set((state) => ({
          solutions: state.solutions.map((s) => {
            if (s.id === solutionId) {
              const currentTags = s.tags ? JSON.parse(s.tags) : [];
              return { ...s, tags: JSON.stringify(currentTags.filter((t: string) => t !== tag)) };
            }
            return s;
          }),
        })),
        
      // Bulk operations
      bulkDelete: async (ids) => {
        try {
          const { solutionOperations } = await import('@/db');
          await solutionOperations.bulkDelete(ids);
          set((state) => ({
            solutions: state.solutions.filter((s) => !ids.includes(s.id)),
            libraryView: {
              ...state.libraryView,
              selectedIds: [],
            },
          }));
        } catch (error) {
          console.error('Failed to bulk delete solutions:', error);
          throw error;
        }
      },
        
      bulkUpdateTags: (ids, tags) =>
        set((state) => ({
          solutions: state.solutions.map((s) =>
            ids.includes(s.id) ? { ...s, tags: JSON.stringify(tags) } : s
          ),
        })),
        
      bulkExport: async (_ids: string[], _format: string) => {
        set({ isExporting: true });
        try {
          // TODO: Implement bulk export
        } finally {
          set({ isExporting: false });
        }
      },

      // Flashcard actions
      setFlashcards: (flashcards) => set({ flashcards }),
      addFlashcard: (flashcard) =>
        set((state) => ({
          flashcards: [...state.flashcards, flashcard],
        })),
      removeFlashcard: (id) =>
        set((state) => ({
          flashcards: state.flashcards.filter((f) => f.id !== id),
        })),

      // Analysis actions
      setAnalysisSessions: (analysisSessions) => set({ analysisSessions }),
      addAnalysisSession: (session) =>
        set((state) => ({
          analysisSessions: [...state.analysisSessions, session],
        })),
        
      // Project actions
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
        
      // Tag actions
      setTags: (tags) => set({ tags }),
      addTagToLibrary: (tag) =>
        set((state) => ({
          tags: [...state.tags, tag],
        })),
      updateTag: (id, updates) =>
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      removeTagFromLibrary: (id) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
        })),
        
      // Library view actions
      setLibraryView: (view) =>
        set((state) => ({
          libraryView: { ...state.libraryView, ...view },
        })),
        
      setFilter: (filter) =>
        set((state) => ({
          libraryView: {
            ...state.libraryView,
            filter: { ...state.libraryView.filter, ...filter },
          },
        })),
        
      setSort: (sort) =>
        set((state) => ({
          libraryView: { ...state.libraryView, sort },
        })),
        
      setSelectedSolutions: (ids) =>
        set((state) => ({
          libraryView: { ...state.libraryView, selectedIds: ids },
        })),
        
      clearSelection: () =>
        set((state) => ({
          libraryView: { ...state.libraryView, selectedIds: [] },
        })),
        
      // Loading actions
      setLoading: (loading) => set({ isLoading: loading }),
      setSaving: (saving) => set({ isSaving: saving }),
      setExporting: (exporting) => set({ isExporting: exporting }),
    }),
    { name: 'solution-store' }
  )
);
