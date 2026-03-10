import type { Board } from './types';

const STORAGE_KEY = 'flowboard-state';

export function saveState(boards: Board[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // Ignore write errors (e.g. private browsing quota)
  }
}

export function loadState(): Board[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Board[];
  } catch {
    return null;
  }
}
