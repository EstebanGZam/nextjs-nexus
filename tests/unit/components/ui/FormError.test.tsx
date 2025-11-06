import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormError from '@/src/components/ui/FormError';

describe('FormError', () => {
  it('should render error message', () => {
    render(<FormError message="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('should not render when message is undefined', () => {
    const { container } = render(<FormError />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when message is empty string', () => {
    const { container } = render(<FormError message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should have role alert', () => {
    render(<FormError message="Error message" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have aria-live polite', () => {
    render(<FormError message="Error message" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('should apply default error styles', () => {
    render(<FormError message="Error message" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50');
    expect(alert).toHaveClass('text-red-800');
    expect(alert).toHaveClass('border-red-200');
  });

  it('should accept custom className', () => {
    render(<FormError message="Error message" className="custom-class" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });

  it('should render error icon', () => {
    const { container } = render(<FormError message="Error message" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-red-600');
  });

  it('should have hidden aria attribute on icon', () => {
    const { container } = render(<FormError message="Error message" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render long error messages', () => {
    const longMessage = 'This is a very long error message that should still render correctly';
    render(<FormError message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should handle special characters in message', () => {
    render(<FormError message="Error: <script>alert('xss')</script>" />);
    expect(screen.getByText("Error: <script>alert('xss')</script>")).toBeInTheDocument();
  });

  it('should apply animation classes', () => {
    render(<FormError message="Error message" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('animate-in');
    expect(alert).toHaveClass('fade-in-0');
  });
});
