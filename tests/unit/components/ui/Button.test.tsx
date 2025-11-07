import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from '@/src/components/ui/Button';

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should apply primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-slate-800');
  });

  it('should apply secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-slate-100');
  });

  it('should apply ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('should apply success variant', () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-600');
  });

  it('should apply danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('should apply info variant', () => {
    render(<Button variant="info">Info</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('should apply neutral variant', () => {
    render(<Button variant="neutral">Neutral</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-300');
  });

  it('should apply md size by default', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
  });

  it('should apply sm size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
  });

  it('should apply fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger click when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should spread additional props to button element', () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>
    );
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should combine variant and size classes', () => {
    render(
      <Button variant="danger" size="sm">
        Small Danger
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('h-8');
  });

  it('should render without crashing when no props are provided', () => {
    render(<Button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
