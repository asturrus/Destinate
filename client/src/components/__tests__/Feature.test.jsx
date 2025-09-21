import { render, screen } from '@testing-library/react'
import { Features } from '../Features'

describe('Features Component', () => {
  test('renders all destination cards', () => {
      render(<Features />)

       // Test for popular destinations
      expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument()
      expect(screen.getByText('Venice, Italy')).toBeInTheDocument()
      expect(screen.getByText('Paris, France')).toBeInTheDocument()
      expect(screen.getByText('London, England')).toBeInTheDocument()
      expect(screen.getByText('Amsterdam, Netherlands')).toBeInTheDocument()
      expect(screen.getByText('Santorini, Greece')).toBeInTheDocument()

    })
    test('renders section heading', () => {
      render(<Features />)
      expect(screen.getByTestId('text-locations-title')).toBeInTheDocument()
    })
  })
