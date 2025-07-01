import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QuickAction } from '@/lib/types/home';
import { mockQuickActions } from '@/lib/mock/quick-actions';

interface QuickActionsState {
  actions: QuickAction[];
  hiddenActionIds: string[];
  setActions: (actions: QuickAction[]) => void;
  toggleVisibility: (id: string) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useQuickActionsStore = create<QuickActionsState>()(
  persist(
    (set, get) => ({
      actions: mockQuickActions,
      hiddenActionIds: [],
      setActions: (actions) => set({ actions }),
      toggleVisibility: (id) =>
        set((state) => ({
          hiddenActionIds: state.hiddenActionIds.includes(id)
            ? state.hiddenActionIds.filter((actionId) => actionId !== id)
            : [...state.hiddenActionIds, id],
        })),
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'quick-actions-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1, // Increment version when schema changes
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          // If the stored version is 0 (old schema), return the default mock actions
          return { ...persistedState, actions: mockQuickActions, hiddenActionIds: [] };
        }
        return persistedState; // Otherwise, return the persisted state as is
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);