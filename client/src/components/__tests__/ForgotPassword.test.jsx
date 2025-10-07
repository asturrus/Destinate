import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPassword from '../../pages/ForgotPassword';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  useLocation: () => ['/forgot-password', vi.fn()],
}));

// Mock ThemeToggle
vi.mock('../../components/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="button-theme-toggle">Theme Toggle</button>
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CheckCircle2: (props) => <div data-testid="icon-success" {...props} />
}));

describe('ForgotPassword Page', () => {
  it('renders forgot password form initially', () => {
    render(<ForgotPassword />);
    
    expect(screen.getByTestId('text-title')).toHaveTextContent('Forgot your password?');
    expect(screen.getByTestId('text-description')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('button-submit')).toHaveTextContent('Send Reset Link');
  });

  it('renders Destinate logo that links to home', () => {
    render(<ForgotPassword />);
    
    const logo = screen.getByTestId('text-logo');
    expect(logo).toHaveTextContent('Destinate');
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('prevents submission with invalid email', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ForgotPassword />);
    
    const emailInput = screen.getByTestId('input-email');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    // The form should show validation error and not submit
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByTestId('text-title')).toHaveTextContent('Forgot your password?');
    });
    
    // Verify console.log was not called (form didn't submit)
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('renders link back to sign in page', () => {
    render(<ForgotPassword />);
    
    const backLink = screen.getByTestId('link-back-to-signin');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/signin');
  });

  it('shows success state after submitting valid email', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ForgotPassword />);
    
    const emailInput = screen.getByTestId('input-email');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('text-success-title')).toHaveTextContent('Check your email');
      expect(screen.getByTestId('text-success-description')).toBeInTheDocument();
      expect(screen.getByTestId('icon-success')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('renders back to sign in button in success state', async () => {
    render(<ForgotPassword />);
    
    const emailInput = screen.getByTestId('input-email');
    const submitButton = screen.getByTestId('button-submit');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const backButton = screen.getByTestId('button-back-to-signin');
      expect(backButton).toBeInTheDocument();
      expect(backButton.closest('a')).toHaveAttribute('href', '/signin');
    });
  });
});
