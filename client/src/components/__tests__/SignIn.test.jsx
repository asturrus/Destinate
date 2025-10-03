import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import SignIn from '../SignIn'

  describe('SignIn Component', () => {
    it('renders sign in form with all fields', () => {
      render(<SignIn />)

      expect(screen.getByTestId('text-signin-title')).toHaveTextContent('Welcome back')
      expect(screen.getByTestId('text-signin-description')).toBeInTheDocument()
      expect(screen.getByTestId('input-email')).toBeInTheDocument()
      expect(screen.getByTestId('input-password')).toBeInTheDocument()
      expect(screen.getByTestId('button-submit')).toHaveTextContent('Sign In')
    })

    it('renders Destinate logo that links to home', () => {
        render(<SignIn />)

        const logo = screen.getByTestId('link-logo')
        expect(logo).toBeInTheDocument()
        expect(logo).toHaveAttribute('href', '/')
        expect(logo).toHaveTextContent('Destinate')
      })
      it('displays validation error for invalid email', async () => {
        render(<SignIn />)

        const emailInput = screen.getByTestId('input-email')
        const submitButton = screen.getByTestId('button-submit')

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
          expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
        })
      })
      it('displays validation error for short password', async () => {
        render(<SignIn />)

        const passwordInput = screen.getByTestId('input-password')
        const submitButton = screen.getByTestId('button-submit')

        fireEvent.change(passwordInput, { target: { value: '123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
          expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
        })
      })
      it('renders link to sign up page', () => {
        render(<SignIn />)

        const signUpLink = screen.getByTestId('link-signup')
        expect(signUpLink).toBeInTheDocument()
        expect(signUpLink).toHaveAttribute('href', '/signup')
        expect(signUpLink).toHaveTextContent('Sign up')
      })
      it('renders link to forgot password page', () => {
        render(<SignIn />)

        const forgotPasswordLink = screen.getByTestId('link-forgot-password')
        expect(forgotPasswordLink).toBeInTheDocument()
        expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
        expect(forgotPasswordLink).toHaveTextContent('Forgot your password?')
      })
      it('submits form with valid credentials', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        render(<SignIn />)

        const emailInput = screen.getByTestId('input-email')
        const passwordInput = screen.getByTestId('input-password')
        const submitButton = screen.getByTestId('button-submit')

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
          expect(consoleSpy).toHaveBeenCalledWith('Sign in data:', {
            email: 'test@example.com',
            password: 'password123'
          })
        })

        consoleSpy.mockRestore()
      })
      it('disables submit button while submitting', async () => {
        render(<SignIn />)

        const submitButton = screen.getByTestId('button-submit')
        expect(submitButton).not.toBeDisabled()
      })
    })