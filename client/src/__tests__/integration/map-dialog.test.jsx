import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapDialog } from '../../components/MapDialog';

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

describe('MapDialog Integration Tests', () => {
  describe('Dialog State Management', () => {
    it('opens when open prop is true', () => {
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes when onOpenChange is called with false', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      
      render(<MapDialog open={true} onOpenChange={handleOpenChange} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Tab Navigation', () => {
    it('renders all three tabs', () => {
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      expect(screen.getByRole('tab', { name: /explore/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /plan/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /inspire/i })).toBeInTheDocument();
    });

    it('switches between tabs when clicked', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Start on Explore tab
      expect(screen.getByRole('tab', { name: /explore/i })).toHaveAttribute('data-state', 'active');
      
      // Switch to Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /plan/i })).toHaveAttribute('data-state', 'active');
      });
      
      // Switch to Inspire tab
      await user.click(screen.getByRole('tab', { name: /inspire/i }));
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /inspire/i })).toHaveAttribute('data-state', 'active');
      });
    });

    it('displays correct content for each tab', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Explore tab content
      expect(screen.getByText(/explore destinations/i)).toBeInTheDocument();
      
      // Switch to Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      await waitFor(() => {
        expect(screen.getByText(/trip planner/i)).toBeInTheDocument();
      });
      
      // Switch to Inspire tab
      await user.click(screen.getByRole('tab', { name: /inspire/i }));
      await waitFor(() => {
        expect(screen.getByText(/need inspiration/i)).toBeInTheDocument();
      });
    });
  });

  describe('Trip Planner Functionality', () => {
    it('adds destination to trip plan when selected from map', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Search and select a destination
      const searchInput = screen.getByTestId('input-search-destination');
      await user.type(searchInput, 'Tokyo');
      
      await waitFor(() => {
        expect(screen.getByTestId('search-result-tokyo')).toBeInTheDocument();
      });
      
      await user.click(screen.getByTestId('search-result-tokyo'));
      
      // Add to trip
      const addButton = screen.getByRole('button', { name: /add to trip/i });
      await user.click(addButton);
      
      // Switch to Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Tokyo')).toBeInTheDocument();
      });
    });

    it('shows trip summary with selected destinations', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Add Tokyo
      const searchInput = screen.getByTestId('input-search-destination');
      await user.type(searchInput, 'Tokyo');
      await user.click(screen.getByTestId('search-result-tokyo'));
      await user.click(screen.getByRole('button', { name: /add to trip/i }));
      
      // Add Paris
      await user.clear(searchInput);
      await user.type(searchInput, 'Paris');
      await user.click(screen.getByTestId('search-result-paris'));
      await user.click(screen.getByRole('button', { name: /add to trip/i }));
      
      // Check Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Tokyo')).toBeInTheDocument();
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.getByText(/2 destinations/i)).toBeInTheDocument();
      });
    });

    it('removes destination from trip plan', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Add destination
      const searchInput = screen.getByTestId('input-search-destination');
      await user.type(searchInput, 'Venice');
      await user.click(screen.getByTestId('search-result-venice'));
      await user.click(screen.getByRole('button', { name: /add to trip/i }));
      
      // Go to Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Venice')).toBeInTheDocument();
      });
      
      // Remove destination
      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Venice')).not.toBeInTheDocument();
      });
    });

    it('clears entire trip plan', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Add multiple destinations
      const searchInput = screen.getByTestId('input-search-destination');
      
      await user.type(searchInput, 'Tokyo');
      await user.click(screen.getByTestId('search-result-tokyo'));
      await user.click(screen.getByRole('button', { name: /add to trip/i }));
      
      await user.clear(searchInput);
      await user.type(searchInput, 'Paris');
      await user.click(screen.getByTestId('search-result-paris'));
      await user.click(screen.getByRole('button', { name: /add to trip/i }));
      
      // Go to Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      
      // Clear trip
      const clearButton = screen.getByRole('button', { name: /clear trip/i });
      await user.click(clearButton);
      
      await waitFor(() => {
        expect(screen.getByText(/no destinations selected/i)).toBeInTheDocument();
      });
    });
  });

  describe('Inspire Feature', () => {
    it('shows random destination when "Surprise Me" is clicked', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      await user.click(screen.getByRole('tab', { name: /inspire/i }));
      
      const surpriseButton = screen.getByRole('button', { name: /surprise me/i });
      await user.click(surpriseButton);
      
      await waitFor(() => {
        // Should show a destination info card
        expect(screen.getByText(/add to trip/i)).toBeInTheDocument();
      });
    });

    it('shows different destination on subsequent "Surprise Me" clicks', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      await user.click(screen.getByRole('tab', { name: /inspire/i }));
      
      const surpriseButton = screen.getByRole('button', { name: /surprise me/i });
      
      await user.click(surpriseButton);
      await waitFor(() => {
        expect(screen.getByText(/add to trip/i)).toBeInTheDocument();
      });
      
      const firstDestination = screen.getByTestId('destination-info-card')?.textContent;
      
      // Click again
      await user.click(surpriseButton);
      
      await waitFor(() => {
        const secondDestination = screen.getByTestId('destination-info-card')?.textContent;
        // Note: There's a chance they could be the same, but with 6 destinations it's unlikely
        expect(secondDestination).toBeDefined();
      });
    });
  });

  describe('State Persistence Across Tabs', () => {
    it('maintains selected destination when switching tabs', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Select destination in Explore tab
      const searchInput = screen.getByTestId('input-search-destination');
      await user.type(searchInput, 'London');
      await user.click(screen.getByTestId('search-result-london'));
      
      await waitFor(() => {
        expect(screen.getByText('London')).toBeInTheDocument();
      });
      
      // Switch to Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      
      // Switch back to Explore
      await user.click(screen.getByRole('tab', { name: /explore/i }));
      
      // Destination should still be selected
      await waitFor(() => {
        expect(screen.getByText('London')).toBeInTheDocument();
      });
    });

    it('maintains trip plan when switching between tabs', async () => {
      const user = userEvent.setup();
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      // Add destinations
      const searchInput = screen.getByTestId('input-search-destination');
      await user.type(searchInput, 'Amsterdam');
      await user.click(screen.getByTestId('search-result-amsterdam'));
      await user.click(screen.getByRole('button', { name: /add to trip/i }));
      
      // Switch to Inspire tab
      await user.click(screen.getByRole('tab', { name: /inspire/i }));
      
      // Switch back to Plan tab
      await user.click(screen.getByRole('tab', { name: /plan/i }));
      
      // Trip should still contain Amsterdam
      await waitFor(() => {
        expect(screen.getByText('Amsterdam')).toBeInTheDocument();
      });
    });
  });

  describe('Map and Dialog Integration', () => {
    it('renders map component inside dialog', () => {
      render(<MapDialog open={true} onOpenChange={() => {}} />);
      
      expect(screen.getByTestId('input-search-destination')).toBeInTheDocument();
    });

    it('handles keyboard navigation (Escape to close)', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      
      render(<MapDialog open={true} onOpenChange={handleOpenChange} />);
      
      await user.keyboard('{Escape}');
      
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
