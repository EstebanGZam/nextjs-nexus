import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormSuccess from '@/src/components/ui/FormSuccess';

describe('FormSuccess', () => {
  it('should render success message', () => {
    render(<FormSuccess message="Operation successful" />);
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('should not render when message is undefined', () => {
    const { container } = render(<FormSuccess />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when message is empty string', () => {
    const { container } = render(<FormSuccess message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should have role status', () => {
    render(<FormSuccess message="Success message" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have aria-live polite', () => {
    render(<FormSuccess message="Success message" />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('should apply default success styles', () => {
    render(<FormSuccess message="Success message" />);
    const status = screen.getByRole('status');
    expect(status).toHaveClass('bg-green-50');
    expect(status).toHaveClass('text-green-800');
    expect(status).toHaveClass('border-green-200');
  });

  it('should accept custom className', () => {
    render(<FormSuccess message="Success message" className="custom-class" />);
    const status = screen.getByRole('status');
    expect(status).toHaveClass('custom-class');
  });

  it('should render success icon', () => {
    const { container } = render(<FormSuccess message="Success message" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-green-600');
  });

  it('should have hidden aria attribute on icon', () => {
    const { container } = render(<FormSuccess message="Success message" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render long success messages', () => {
    const longMessage = 'This is a very long success message that should still render correctly';
    render(<FormSuccess message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should handle special characters in message', () => {
    render(<FormSuccess message="Success: <tag>content</tag>" />);
    expect(screen.getByText('Success: <tag>content</tag>')).toBeInTheDocument();
  });

  it('should apply animation classes', () => {
    render(<FormSuccess message="Success message" />);
    const status = screen.getByRole('status');
    expect(status).toHaveClass('animate-in');
    expect(status).toHaveClass('fade-in-0');
  });
});
