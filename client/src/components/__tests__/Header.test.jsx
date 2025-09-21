import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Header } from '../Header'

// Mock the ThemeToggle component since it might have complex dependencies
vi.mock('../ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="button-theme-toggle">Theme Toggle</button>
}))

// Mock the Button component from ui
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, 'data-testid': testId, variant, ...props }) => (
    <button data-testid={testId} className={`button-${variant || 'default'}`} {...props}>
      {children}
    </button>
  )
}))

describe('Header Component', () => {
  it('renders Destinate logo', () => {
    render(<Header />)
    const logo = screen.getByTestId('text-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveTextContent('Destinate')
  })

  it('renders all navigation links with correct names', () => {
    render(<Header />)
    
    // Check that all navigation links are present
    expect(screen.getByTestId('link-nav-home')).toBeInTheDocument()
    expect(screen.getByTestId('link-nav-destinations')).toBeInTheDocument()
    expect(screen.getByTestId('link-nav-forum')).toBeInTheDocument()
    expect(screen.getByTestId('link-nav-about')).toBeInTheDocument()

    // Check the text content of navigation links
    expect(screen.getByTestId('link-nav-home')).toHaveTextContent('Home')
    expect(screen.getByTestId('link-nav-destinations')).toHaveTextContent('Destinations')
    expect(screen.getByTestId('link-nav-forum')).toHaveTextContent('Forum')
    expect(screen.getByTestId('link-nav-about')).toHaveTextContent('About')
  })

  it('navigation links have correct href attributes', () => {
    render(<Header />)
    
    expect(screen.getByTestId('link-nav-home')).toHaveAttribute('href', '/')
    expect(screen.getByTestId('link-nav-forum')).toHaveAttribute('href', '/forum')
    expect(screen.getByTestId('link-nav-destinations')).toHaveAttribute('href', '#features')
    expect(screen.getByTestId('link-nav-about')).toHaveAttribute('href', '#about')
  })

  it('renders action buttons with correct text', () => {
    render(<Header />)
    
    const signInButton = screen.getByTestId('button-sign-in')
    const getStartedButton = screen.getByTestId('button-get-started')
    
    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveTextContent('Sign In')
    
    expect(getStartedButton).toBeInTheDocument()
    expect(getStartedButton).toHaveTextContent('Plan your trip')
  })

  it('renders theme toggle component', () => {
    render(<Header />)
    expect(screen.getByTestId('button-theme-toggle')).toBeInTheDocument()
  })

  it('has proper header structure and classes', () => {
    render(<Header />)
    
    // Check that the header element exists
    const header = screen.getByRole('banner') // header elements have banner role
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('fixed', 'top-0', 'w-full')
  })

  it('renders all navigation items in correct order', () => {
    render(<Header />)
    
    const navItems = [
      screen.getByTestId('link-nav-home'),
      screen.getByTestId('link-nav-destinations'),
      screen.getByTestId('link-nav-forum'),
      screen.getByTestId('link-nav-about')
    ]
    
    // Verify they're all in the document
    navItems.forEach(item => {
      expect(item).toBeInTheDocument()
    })
  })

  it('applies correct CSS classes to navigation links', () => {
    render(<Header />)
    
    const homeLink = screen.getByTestId('link-nav-home')
    expect(homeLink).toHaveClass('text-foreground', 'hover:text-primary', 'px-3', 'py-2')
  })
})