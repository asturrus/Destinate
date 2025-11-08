import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../components/ThemeProvider';
import { ThemeToggle } from '../../components/ThemeToggle';

describe('Theme Persistence Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('ThemeProvider and localStorage', () => {
    it('initializes with default theme when localStorage is empty', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <div data-testid="theme-content">Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('loads theme from localStorage on mount', () => {
      localStorage.setItem('vite-ui-theme', 'dark');

      render(
        <ThemeProvider>
          <div data-testid="theme-content">Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('persists theme to localStorage when changed', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('button-theme-toggle');
      await user.click(toggleButton);

      await waitFor(() => {
        expect(localStorage.getItem('vite-ui-theme')).toBe('dark');
      });
    });

    it('applies theme class to document element', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);

      const toggleButton = screen.getByTestId('button-theme-toggle');
      await user.click(toggleButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(false);
      });
    });
  });

  describe('Theme Toggle Component', () => {
    it('toggles between light and dark themes', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('button-theme-toggle');

      // Start with light theme
      expect(document.documentElement.classList.contains('light')).toBe(true);

      // Toggle to dark
      await user.click(toggleButton);
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });

      // Toggle back to light
      await user.click(toggleButton);
      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
      });
    });

    it('maintains theme after multiple toggles', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('button-theme-toggle');

      // Toggle 5 times
      for (let i = 0; i < 5; i++) {
        await user.click(toggleButton);
        await waitFor(() => {
          const expectedTheme = i % 2 === 0 ? 'dark' : 'light';
          expect(document.documentElement.classList.contains(expectedTheme)).toBe(true);
        });
      }
    });
  });

  describe('Theme Persistence Across Components', () => {
    it('maintains theme when remounting components', async () => {
      const user = userEvent.setup();
      
      const { unmount } = render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('button-theme-toggle');
      await user.click(toggleButton);

      await waitFor(() => {
        expect(localStorage.getItem('vite-ui-theme')).toBe('dark');
      });

      unmount();

      // Remount with new instance
      render(
        <ThemeProvider>
          <div data-testid="theme-content">Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('vite-ui-theme')).toBe('dark');
    });

    it('theme changes propagate to all consuming components', async () => {
      const user = userEvent.setup();
      
      const TestComponent = () => (
        <ThemeProvider defaultTheme="light">
          <div>
            <ThemeToggle />
            <div data-testid="consumer-1">Consumer 1</div>
            <div data-testid="consumer-2">Consumer 2</div>
          </div>
        </ThemeProvider>
      );

      render(<TestComponent />);

      expect(document.documentElement.classList.contains('light')).toBe(true);

      const toggleButton = screen.getByTestId('button-theme-toggle');
      await user.click(toggleButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(screen.getByTestId('consumer-1')).toBeInTheDocument();
        expect(screen.getByTestId('consumer-2')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid localStorage value gracefully', () => {
      localStorage.setItem('vite-ui-theme', 'invalid-theme');

      render(
        <ThemeProvider defaultTheme="light">
          <div data-testid="theme-content">Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('handles rapid theme toggles', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('button-theme-toggle');

      // Rapid clicks
      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);

      await waitFor(() => {
        const theme = localStorage.getItem('vite-ui-theme');
        expect(['light', 'dark']).toContain(theme);
      });
    });

    it('uses custom storage key when provided', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider defaultTheme="light" storageKey="custom-theme-key">
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('button-theme-toggle');
      await user.click(toggleButton);

      await waitFor(() => {
        expect(localStorage.getItem('custom-theme-key')).toBe('dark');
        expect(localStorage.getItem('vite-ui-theme')).toBeNull();
      });
    });
  });
});
