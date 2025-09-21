import { render, screen } from '@testing-library/react'
import { Features } from '../Features'

describe('Features Component', () => {
  test('renders all destination cards', () => {
      render(<Features />)

      // Test for popular destinations
      expect(screen.getByText('Tokyo')).toBeInTheDocument()
      expect(screen.getByText('Venice')).toBeInTheDocument()
      expect(screen.getByText('Paris')).toBeInTheDocument()
      expect(screen.getByText('London')).toBeInTheDocument()
      expect(screen.getByText('Amsterdam')).toBeInTheDocument()
      expect(screen.getByText('Santorini')).toBeInTheDocument()
    })
    test('renders section heading', () => {
      render(<Features />)
      expect(screen.getByTestId('text-features-title')).toBeInTheDocument()
    })
  })
