import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import SignIn from '../../pages/SignIn';
import SignUp from '../../pages/SignUp';
import ForgotPassword from '../../pages/ForgotPassword';

describe('Authentication Integration Tests', () => {
  describe('SignIn with Supabase API', () => {
    it('successfully signs in user with valid credentials', async () => {
      const user = userEvent.setup();
      render(<SignIn />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const submitButton = screen.getByTestId('button-submit');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Signed in successfully:',
          expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com'
            })
          })
        );
      }, { timeout: 3000 });
    });

    it('shows error message with invalid credentials', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<SignIn />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const submitButton = screen.getByTestId('button-submit');

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error signing in:',
          'Invalid login credentials'
        );
      }, { timeout: 3000 });

      consoleErrorSpy.mockRestore();
    });

    it('validates email format before submission', async () => {
      const user = userEvent.setup();
      render(<SignIn />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const submitButton = screen.getByTestId('button-submit');

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('validates password minimum length', async () => {
      const user = userEvent.setup();
      render(<SignIn />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const submitButton = screen.getByTestId('button-submit');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '12345');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });
  });

  describe('SignUp with Supabase API', () => {
    it('successfully creates new user account', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<SignUp />);

      await user.type(screen.getByTestId('input-name'), 'Test User');
      await user.type(screen.getByTestId('input-email'), 'newuser@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.type(screen.getByTestId('input-confirm-password'), 'password123');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Sign-up successful! Check your email to confirm your account.'
        );
      }, { timeout: 3000 });

      alertSpy.mockRestore();
    });

    it('shows error when email already exists', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<SignUp />);

      await user.type(screen.getByTestId('input-name'), 'Existing User');
      await user.type(screen.getByTestId('input-email'), 'existing@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.type(screen.getByTestId('input-confirm-password'), 'password123');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Error signing up: User already registered'
        );
      }, { timeout: 3000 });

      alertSpy.mockRestore();
    });

    it('validates passwords match', async () => {
      const user = userEvent.setup();
      render(<SignUp />);

      await user.type(screen.getByTestId('input-name'), 'Test User');
      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.type(screen.getByTestId('input-confirm-password'), 'different123');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('validates all required fields', async () => {
      const user = userEvent.setup();
      render(<SignUp />);

      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('successfully requests password reset', async () => {
      const user = userEvent.setup();
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(<ForgotPassword />);

      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(screen.getByText(/Check your email/i)).toBeInTheDocument();
        expect(screen.getByTestId('button-back-to-signin')).toBeInTheDocument();
      });

      consoleLogSpy.mockRestore();
    });

    it('validates email before sending reset request', async () => {
      const user = userEvent.setup();
      render(<ForgotPassword />);

      await user.type(screen.getByTestId('input-email'), 'invalid');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling', () => {
    it('handles network errors gracefully during sign-in', async () => {
      server.use(
        http.post('https://yalzwjzfumdjjsjhxgim.supabase.co/auth/v1/token', () => {
          return HttpResponse.error();
        })
      );

      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<SignIn />);

      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      }, { timeout: 3000 });

      consoleErrorSpy.mockRestore();
    });

    it('handles unexpected API response format', async () => {
      server.use(
        http.post('https://yalzwjzfumdjjsjhxgim.supabase.co/auth/v1/signup', () => {
          return HttpResponse.json({ unexpected: 'format' });
        })
      );

      const user = userEvent.setup();
      render(<SignUp />);

      await user.type(screen.getByTestId('input-name'), 'Test User');
      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.type(screen.getByTestId('input-confirm-password'), 'password123');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        const alertSpy = vi.spyOn(window, 'alert');
        expect(alertSpy).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });
});
