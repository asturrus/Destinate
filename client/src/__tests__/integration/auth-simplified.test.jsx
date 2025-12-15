import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '../../pages/SignIn';
import SignUp from '../../pages/SignUp';
import ForgotPassword from '../../pages/ForgotPassword';
import * as supabaseClient from '../../lib/supabaseClient';

vi.mock('wouter', () => ({
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  useLocation: () => ['/signin', vi.fn()],
}));

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseClient.supabase.auth.signInWithPassword.mockReset();
    supabaseClient.supabase.auth.signUp.mockReset();
  });

  describe('SignIn Integration', () => {
    it('handles successful sign-in with mocked Supabase', async () => {
      const user = userEvent.setup();
      
      supabaseClient.supabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'mock-token' },
        },
        error: null,
      });

      render(<SignIn />);

      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(supabaseClient.supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('handles sign-in error from Supabase', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      supabaseClient.supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      render(<SignIn />);

      await user.type(screen.getByTestId('input-email'), 'wrong@example.com');
      await user.type(screen.getByTestId('input-password'), 'wrongpassword');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('validates form before calling Supabase API', async () => {
      const user = userEvent.setup();
      render(<SignIn />);

      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.type(screen.getByTestId('input-password'), '123');
      await user.click(screen.getByTestId('button-submit'));

      expect(supabaseClient.supabase.auth.signInWithPassword).not.toHaveBeenCalled();
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });
  });

  describe('SignUp Integration', () => {
    it('handles successful sign-up with mocked Supabase', async () => {
      const user = userEvent.setup();
      
      supabaseClient.supabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: '456', email: 'newuser@example.com' },
          session: null,
        },
        error: null,
      });

      render(<SignUp />);

      await user.type(screen.getByTestId('input-name'), 'Test User');
      await user.type(screen.getByTestId('input-email'), 'newuser@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.type(screen.getByTestId('input-confirm-password'), 'password123');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(supabaseClient.supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'password123',
          options: {
            data: {
              name: 'Test User',
            },
          },
        });
      });
    });

    it('validates password matching before calling API', async () => {
      const user = userEvent.setup();
      render(<SignUp />);

      await user.type(screen.getByTestId('input-name'), 'Test User');
      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.type(screen.getByTestId('input-password'), 'password123');
      await user.type(screen.getByTestId('input-confirm-password'), 'different123');
      await user.click(screen.getByTestId('button-submit'));

      expect(supabaseClient.supabase.auth.signUp).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      });
    });
  });

  describe('Form Navigation', () => {
    it('has link from sign-in to sign-up page', async () => {
      render(<SignIn />);
      const signUpLink = screen.getByTestId('link-signup');
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup');
    });

    it('has link from sign-in to forgot password page', async () => {
      render(<SignIn />);
      const forgotPasswordLink = screen.getByTestId('link-forgot-password');
      expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    });

    it('has link from sign-up to sign-in page', async () => {
      render(<SignUp />);
      const signInLink = screen.getByTestId('link-signin');
      expect(signInLink.closest('a')).toHaveAttribute('href', '/signin');
    });

    it('shows password reset success state', async () => {
      const user = userEvent.setup();
      render(<ForgotPassword />);

      await user.type(screen.getByTestId('input-email'), 'test@example.com');
      await user.click(screen.getByTestId('button-submit'));

      await waitFor(() => {
        expect(screen.getByText(/Check your email/i)).toBeInTheDocument();
      });
    });
  });
});
