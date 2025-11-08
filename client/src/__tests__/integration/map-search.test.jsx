import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InteractiveMap from '../../components/InteractiveMap';
import { destinations } from '../../../../shared/destinations';

// Mock MapLibre GL
vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(),
      remove: vi.fn(),
      flyTo: vi.fn(),
      addControl: vi.fn(),
    })),
    Marker: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    })),
    NavigationControl: vi.fn(),
  },
}));

describe('Map and Search Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Search Functionality', () => {
    it('filters destinations based on search query', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'Tokyo');

      await waitFor(() => {
        expect(screen.getByTestId('search-result-tokyo')).toBeInTheDocument();
        expect(screen.queryByTestId('search-result-paris')).not.toBeInTheDocument();
      });
    });

    it('shows all results when search is cleared', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'Tokyo');
      await waitFor(() => {
        expect(screen.getByTestId('search-result-tokyo')).toBeInTheDocument();
      });

      await user.clear(searchInput);
      
      await waitFor(() => {
        expect(screen.queryByTestId('search-result-tokyo')).not.toBeInTheDocument();
      });
    });

    it('shows "no results" message for non-matching search', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'NonExistentCity123');

      await waitFor(() => {
        expect(screen.getByText('No destinations found')).toBeInTheDocument();
      });
    });

    it('search is case-insensitive', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'TOKYO');

      await waitFor(() => {
        expect(screen.getByTestId('search-result-tokyo')).toBeInTheDocument();
      });
    });

    it('filters by partial match', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'Tok');

      await waitFor(() => {
        expect(screen.getByTestId('search-result-tokyo')).toBeInTheDocument();
      });
    });
  });

  describe('Search Result Selection', () => {
    it('selects destination when search result is clicked', async () => {
      const user = userEvent.setup();
      const onSelectDestination = vi.fn();
      
      render(
        <InteractiveMap 
          destinations={destinations} 
          onSelectDestination={onSelectDestination}
        />
      );

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'Paris');

      await waitFor(() => {
        expect(screen.getByTestId('search-result-paris')).toBeInTheDocument();
      });

      const parisResult = screen.getByTestId('search-result-paris');
      await user.click(parisResult);

      await waitFor(() => {
        expect(onSelectDestination).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'paris' })
        );
      });
    });

    it('closes search results after selection', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'Venice');

      await waitFor(() => {
        expect(screen.getByTestId('search-result-venice')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('search-result-venice'));

      await waitFor(() => {
        expect(screen.queryByTestId('search-result-venice')).not.toBeInTheDocument();
      });
    });
  });

  describe('Destination Display', () => {
    it('shows destination info card when selected', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'London');
      await waitFor(() => {
        expect(screen.getByTestId('search-result-london')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('search-result-london'));

      await waitFor(() => {
        expect(screen.getByText('London')).toBeInTheDocument();
        expect(screen.getByText(/United Kingdom/i)).toBeInTheDocument();
      });
    });

    it('updates info card when different destination is selected', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      // Select Tokyo first
      await user.type(searchInput, 'Tokyo');
      await user.click(screen.getByTestId('search-result-tokyo'));

      await waitFor(() => {
        expect(screen.getByText('Tokyo')).toBeInTheDocument();
      });

      // Clear and select Paris
      await user.clear(searchInput);
      await user.type(searchInput, 'Paris');
      await user.click(screen.getByTestId('search-result-paris'));

      await waitFor(() => {
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.queryByText('Tokyo')).not.toBeInTheDocument();
      });
    });
  });

  describe('Map State Management', () => {
    it('maintains search query state during interactions', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'Amsterdam');

      expect(searchInput).toHaveValue('Amsterdam');

      await user.click(screen.getByTestId('search-result-amsterdam'));

      expect(searchInput).toHaveValue('Amsterdam');
    });
  });

  describe('Multiple Destination Selection', () => {
    it('allows selecting multiple destinations sequentially', async () => {
      const user = userEvent.setup();
      render(<InteractiveMap destinations={destinations} />);

      const searchInput = screen.getByTestId('input-search-destination');
      
      // Select first destination
      await user.type(searchInput, 'Tokyo');
      await user.click(screen.getByTestId('search-result-tokyo'));

      await waitFor(() => {
        expect(screen.getByText('Tokyo')).toBeInTheDocument();
      });

      // Select second destination
      await user.clear(searchInput);
      await user.type(searchInput, 'Paris');
      await user.click(screen.getByTestId('search-result-paris'));

      await waitFor(() => {
        expect(screen.getByText('Paris')).toBeInTheDocument();
      });

      // Select third destination
      await user.clear(searchInput);
      await user.type(searchInput, 'London');
      await user.click(screen.getByTestId('search-result-london'));

      await waitFor(() => {
        expect(screen.getByText('London')).toBeInTheDocument();
      });
    });
  });
});
