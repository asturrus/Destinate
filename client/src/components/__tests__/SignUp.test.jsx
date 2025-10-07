import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignUp from '../../pages/SignUp';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  useLocation: () => ['/signup', vi.fn()],
}));

// Mock ThemeToggle
vi.mock('../../components/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="button-theme-toggle">Theme Toggle</button>
}));

describe('SignUp Page', () => {
  it('renders sign up form with all fields', () => {
    render(<SignUp />);
    
    expect(screen.getByTestId('text-title')).toHaveTextContent('Create your account');
    expect(screen.getByTestId('text-description')).toBeInTheDocument();
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirm-password')).toBeInTheDocument();
    expect(screen.getByTestId('button-submit')).toHaveTextContent('Sign Up');
  });

  it('renders Destinate logo that links to home', () => {
    render(<SignUp />);
    
    const logo = screen.getByTestId('text-logo');
    expect(logo).toHaveTextContent('Destinate');
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('displays validation error for short name', async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByTestId('input-name');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.blur(nameInput);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('prevents submission with invalid email', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<SignUp />);
    
    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmPasswordInput = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // The form should show validation error and not submit
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
    
    // Verify console.log was not called (form didn't submit)
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('displays validation error for short password', async () => {
    render(<SignUp />);
    
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('displays validation error when passwords do not match', async () => {
    render(<SignUp />);
    
    const passwordInput = screen.getByTestId('input-password');
    const confirmPasswordInput = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('renders link to sign in page', () => {
    render(<SignUp />);
    
    const signInLink = screen.getByTestId('link-signin');
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest('a')).toHaveAttribute('href', '/signin');
  });

  it('submits form with valid data and matching passwords', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<SignUp />);
    
    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmPasswordInput = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign up data:', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });
    
    consoleSpy.mockRestore();
  });
});
