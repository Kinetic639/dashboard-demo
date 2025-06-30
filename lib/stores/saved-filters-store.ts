import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedFilter } from '@/lib/types/saved-filters';

interface SavedFiltersState {
  savedFilters: SavedFilter[];
  _hasHydrated: boolean;
  addSavedFilter: (filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSavedFilter: (id: string, updates: Partial<SavedFilter>) => void;
  deleteSavedFilter: (id: string) => void;
  getSavedFiltersByBranch: (branchId: string) => SavedFilter[];
  getPublicFiltersByBranch: (branchId: string) => SavedFilter[];
  getUserFiltersByBranch: (branchId: string, userId: string) => SavedFilter[];
  getSidebarFilters: (branchId: string) => SavedFilter[];
  clonePublicFilter: (filterId: string, userId: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useSavedFiltersStore = create<SavedFiltersState>()(
  persist(
    (set, get) => ({
      savedFilters: [],
      _hasHydrated: false,
      
      addSavedFilter: (filterData) => {
        const newFilter: SavedFilter = {
          ...filterData,
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          savedFilters: [...state.savedFilters, newFilter],
        }));
      },
      
      updateSavedFilter: (id, updates) => {
        set((state) => ({
          savedFilters: state.savedFilters.map((filter) =>
            filter.id === id
              ? { ...filter, ...updates, updatedAt: new Date().toISOString() }
              : filter
          ),
        }));
      },
      
      deleteSavedFilter: (id) => {
        set((state) => ({
          savedFilters: state.savedFilters.filter((filter) => filter.id !== id),
        }));
      },
      
      getSavedFiltersByBranch: (branchId) => {
        return get().savedFilters.filter((filter) => filter.branchId === branchId);
      },

      getPublicFiltersByBranch: (branchId) => {
        return get().savedFilters.filter(
          (filter) => filter.branchId === branchId && filter.isPublic
        );
      },

      getUserFiltersByBranch: (branchId, userId) => {
        return get().savedFilters.filter(
          (filter) => filter.branchId === branchId && filter.userId === userId
        );
      },
      
      getSidebarFilters: (branchId) => {
        return get().savedFilters.filter(
          (filter) => filter.branchId === branchId && filter.addToSidebar
        );
      },

      clonePublicFilter: (filterId, userId) => {
        const originalFilter = get().savedFilters.find(f => f.id === filterId);
        if (!originalFilter || !originalFilter.isPublic) return;

        const clonedFilter: SavedFilter = {
          ...originalFilter,
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `${originalFilter.name} (kopia)`,
          userId: userId,
          isPublic: false,
          addToSidebar: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          savedFilters: [...state.savedFilters, clonedFilter],
        }));
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },
    }),
    {
      name: 'saved-filters-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);