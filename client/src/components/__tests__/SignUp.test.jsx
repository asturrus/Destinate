import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SignUp from '../../pages/SignUp'

describe('SignUp Component', () => {
  it('renders sign up form with all fields', () => {
    render(<SignUp />)
    
    expect(screen.getByTestId('text-signup-title')).toHaveTextContent('Create your account')
    expect(screen.getByTestId('text-signup-description')).toBeInTheDocument()
    expect(screen.getByTestId('input-name')).toBeInTheDocument()
    expect(screen.getByTestId('input-email')).toBeInTheDocument()
    expect(screen.getByTestId('input-password')).toBeInTheDocument()
    expect(screen.getByTestId('input-confirm-password')).toBeInTheDocument()
    expect(screen.getByTestId('button-submit')).toHaveTextContent('Sign Up')
  })

  it('renders Destinate logo that links to home', () => {
    render(<SignUp />)
    
    const logo = screen.getByTestId('link-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
    expect(logo).toHaveTextContent('Destinate')
  })

  it('displays validation error for short name', async () => {
    render(<SignUp />)
    
    const nameInput = screen.getByTestId('input-name')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
    })
  })

  it('prevents submission with invalid email', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    render(<SignUp />)
    
    const nameInput = screen.getByTestId('input-name')
    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    const confirmPasswordInput = screen.getByTestId('input-confirm-password')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'notanemail' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(consoleSpy).not.toHaveBeenCalledWith('Sign up data:', expect.any(Object))
    })
    
    consoleSpy.mockRestore()
  })

  it('displays validation error for short password', async () => {
    render(<SignUp />)
    
    const passwordInput = screen.getByTestId('input-password')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('displays validation error when passwords do not match', async () => {
    render(<SignUp />)
    
    const passwordInput = screen.getByTestId('input-password')
    const confirmPasswordInput = screen.getByTestId('input-confirm-password')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
    })
  })

  it('renders link to sign in page', () => {
    render(<SignUp />)
    
    const signInLink = screen.getByTestId('link-signin')
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveAttribute('href', '/signin')
    expect(signInLink).toHaveTextContent('Sign in')
  })

  it('submits form with valid data and matching passwords', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    render(<SignUp />)
    
    const nameInput = screen.getByTestId('input-name')
    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    const confirmPasswordInput = screen.getByTestId('input-confirm-password')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign up data:', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
    })
    
    consoleSpy.mockRestore()
  })
})
