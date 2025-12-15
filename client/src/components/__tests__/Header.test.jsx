import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Header } from '../Header'
import * as supabaseClient from '@/lib/supabaseClient'

vi.mock('wouter', () => ({
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  useLocation: () => ['/', vi.fn()],
}))

vi.mock('../ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="button-theme-toggle">Theme Toggle</button>
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, 'data-testid': testId, variant, ...props }) => (
    <button data-testid={testId} className={`button-${variant || 'default'}`} {...props}>
      {children}
    </button>
  )
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  DropdownMenuLabel: ({ children }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
}))

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    supabaseClient.supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabaseClient.supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    })
  })

  it('renders Destinate logo', async () => {
    render(<Header />)
    await waitFor(() => {
      const logo = screen.getByTestId('text-logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveTextContent('Destinate')
    })
  })

  it('renders all navigation links with correct names', async () => {
    render(<Header />)
    
    await waitFor(() => {
      expect(screen.getByTestId('link-nav-home')).toBeInTheDocument()
      expect(screen.getByTestId('link-nav-destinations')).toBeInTheDocument()
      expect(screen.getByTestId('link-nav-forum')).toBeInTheDocument()
      expect(screen.getByTestId('link-nav-about')).toBeInTheDocument()
    })

    expect(screen.getByTestId('link-nav-home')).toHaveTextContent('Home')
    expect(screen.getByTestId('link-nav-destinations')).toHaveTextContent('Destinations')
    expect(screen.getByTestId('link-nav-forum')).toHaveTextContent('Forum')
    expect(screen.getByTestId('link-nav-about')).toHaveTextContent('About')
  })

  it('navigation links have correct href attributes', async () => {
    render(<Header />)
    
    await waitFor(() => {
      expect(screen.getByTestId('link-nav-home')).toHaveAttribute('href', '/')
      expect(screen.getByTestId('link-nav-forum')).toHaveAttribute('href', '/forum')
      expect(screen.getByTestId('link-nav-destinations')).toHaveAttribute('href', '#features')
      expect(screen.getByTestId('link-nav-about')).toHaveAttribute('href', '#about')
    })
  })

  it('renders sign in button when user is not logged in', async () => {
    render(<Header />)
    
    await waitFor(() => {
      const signInButton = screen.getByTestId('button-sign-in')
      expect(signInButton).toBeInTheDocument()
      expect(signInButton).toHaveTextContent('Sign In')
    })
  })

  it('renders Plan your trip button', async () => {
    render(<Header />)
    
    await waitFor(() => {
      const getStartedButton = screen.getByTestId('button-get-started')
      expect(getStartedButton).toBeInTheDocument()
      expect(getStartedButton).toHaveTextContent('Plan your trip')
    })
  })

  it('renders theme toggle component', async () => {
    render(<Header />)
    await waitFor(() => {
      expect(screen.getByTestId('button-theme-toggle')).toBeInTheDocument()
    })
  })

  it('has proper header structure and classes', async () => {
    render(<Header />)
    
    await waitFor(() => {
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('fixed', 'top-0', 'w-full')
    })
  })

  it('shows user initials when logged in', async () => {
    supabaseClient.supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' }
          }
        }
      }
    })

    render(<Header />)
    
    await waitFor(() => {
      const accountButton = screen.getByTestId('button-account-menu')
      expect(accountButton).toBeInTheDocument()
      expect(accountButton).toHaveTextContent('TU')
    })
  })

  it('hides sign in button when user is logged in', async () => {
    supabaseClient.supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' }
          }
        }
      }
    })

    render(<Header />)
    
    await waitFor(() => {
      expect(screen.queryByTestId('button-sign-in')).not.toBeInTheDocument()
    })
  })
})
