import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignIn from '../../pages/SignIn';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  useLocation: () => ['/signin', vi.fn()],
}));

// Mock ThemeToggle
vi.mock('../../components/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="button-theme-toggle">Theme Toggle</button>
}));

describe('SignIn Page', () => {
  it('renders sign in form with all fields', () => {
    render(<SignIn />);
    
    expect(screen.getByTestId('text-title')).toHaveTextContent('Welcome back');
    expect(screen.getByTestId('text-description')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('button-submit')).toHaveTextContent('Sign In');
  });

  it('renders Destinate logo that links to home', () => {
    render(<SignIn />);
    
    const logo = screen.getByTestId('text-logo');
    expect(logo).toHaveTextContent('Destinate');
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('prevents submission with invalid email', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<SignIn />);
    
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Wait a bit for potential validation
    await waitFor(() => {
      // Verify console.log was not called (form blocked submission due to validation)
      expect(consoleSpy).not.toHaveBeenCalled();
    }, { timeout: 1000 });
    
    consoleSpy.mockRestore();
  });

  it('displays validation error for short password', async () => {
    render(<SignIn />);
    
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('renders link to sign up page', () => {
    render(<SignIn />);
    
    const signUpLink = screen.getByTestId('link-signup');
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('renders link to forgot password page', () => {
    render(<SignIn />);
    
    const forgotPasswordLink = screen.getByTestId('link-forgot-password');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });

  it('submits form with valid credentials', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<SignIn />);
    
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign in data:', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    consoleSpy.mockRestore();
  });
});
