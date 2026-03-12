import { create } from 'zustand';

export type Theme = 'light' | 'dark';

export interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

const stored = localStorage.getItem('kanban-theme') as Theme | null;
const initialTheme: Theme = stored === 'dark' ? 'dark' : 'light';

document.documentElement.setAttribute('data-theme', initialTheme);

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('kanban-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return { theme: next };
    }),
}));
