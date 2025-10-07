import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ForgotPassword from '../../pages/ForgotPassword'

describe('ForgotPassword Component', () => {
  it('renders forgot password form initially', () => {
    render(<ForgotPassword />)
    
    expect(screen.getByTestId('text-forgot-title')).toHaveTextContent('Forgot password?')
    expect(screen.getByTestId('text-forgot-description')).toBeInTheDocument()
    expect(screen.getByTestId('input-email')).toBeInTheDocument()
    expect(screen.getByTestId('button-submit')).toHaveTextContent('Reset Password')
  })

  it('renders Destinate logo that links to home', () => {
    render(<ForgotPassword />)
    
    const logo = screen.getByTestId('link-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
    expect(logo).toHaveTextContent('Destinate')
  })

  it('prevents submission with invalid email', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    render(<ForgotPassword />)
    
    const emailInput = screen.getByTestId('input-email')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(emailInput, { target: { value: 'notanemail' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(consoleSpy).not.toHaveBeenCalledWith('Password reset for:', expect.any(String))
    })
    
    consoleSpy.mockRestore()
  })

  it('renders link back to sign in page', () => {
    render(<ForgotPassword />)
    
    const backLink = screen.getByTestId('link-back-signin')
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/signin')
    expect(backLink).toHaveTextContent('Back to Sign In')
  })

  it('shows success state after submitting valid email', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    render(<ForgotPassword />)
    
    const emailInput = screen.getByTestId('input-email')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Password reset for:', 'test@example.com')
      expect(screen.getByTestId('text-success-title')).toHaveTextContent('Check your email')
      expect(screen.getByTestId('text-success-message')).toBeInTheDocument()
    })
    
    consoleSpy.mockRestore()
  })

  it('renders back to sign in button in success state', async () => {
    render(<ForgotPassword />)
    
    const emailInput = screen.getByTestId('input-email')
    const submitButton = screen.getByTestId('button-submit')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      const backButton = screen.getByTestId('button-back-signin')
      expect(backButton).toBeInTheDocument()
      expect(backButton).toHaveAttribute('href', '/signin')
    })
  })
})
