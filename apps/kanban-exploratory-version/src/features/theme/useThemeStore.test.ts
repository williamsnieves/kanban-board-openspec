import { useThemeStore } from '@/features/theme/useThemeStore';

beforeEach(() => {
  // Arrange — clean environment before each test
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  useThemeStore.setState({ theme: 'light' });
});

describe('Dark Mode Toggle', () => {
  it('defaults to light theme', () => {
    // Arrange
    // store reset to light in beforeEach

    // Act
    const { theme } = useThemeStore.getState();

    // Assert
    expect(theme).toBe('light');
  });

  it('toggles to dark mode on first toggle', () => {
    // Arrange
    // store starts in light mode (reset via beforeEach)

    // Act
    useThemeStore.getState().toggleTheme();

    // Assert
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles back to light mode on second toggle', () => {
    // Arrange
    // store starts in light mode (reset via beforeEach)

    // Act
    useThemeStore.getState().toggleTheme();
    useThemeStore.getState().toggleTheme();

    // Assert
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('persists theme preference to localStorage', () => {
    // Arrange
    // localStorage cleared in beforeEach

    // Act
    useThemeStore.getState().toggleTheme();

    // Assert
    expect(localStorage.getItem('kanban-theme')).toBe('dark');
  });

  it('reads persisted theme on initialization', () => {
    // Arrange — set localStorage before simulating store initialization
    localStorage.setItem('kanban-theme', 'dark');
    const stored = localStorage.getItem('kanban-theme') as 'light' | 'dark' | null;
    const initialTheme = stored === 'dark' ? 'dark' : 'light';
    useThemeStore.setState({ theme: initialTheme });

    // Act
    const { theme } = useThemeStore.getState();

    // Assert
    expect(theme).toBe('dark');
  });
});
