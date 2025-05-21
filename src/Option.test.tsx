import { render, screen } from '@testing-library/react';
import Option from './Option';
import { describe, it, expect } from 'vitest';

describe('Option Component', () => {
  it('applies correct background color for status "correct"', () => {
    render(<Option label="Test" status="correct" />);
    const button = screen.getByRole('button', { name: /Test/i });
    expect(button).toHaveStyle('background-color: #D1FFD1');
  });

  it('applies correct background color for status "incorrect"', () => {
    render(<Option label="Test" status="incorrect" />);
    const button = screen.getByRole('button', { name: /Test/i });
    expect(button).toHaveStyle('background-color: #FFD1D1');
  });

  it('applies default background color for status "default"', () => {
    render(<Option label="Test" status="default" />);
    const button = screen.getByRole('button', { name: /Test/i });
    expect(button).toHaveStyle('background-color: white');
  });

  it('applies default background color when status is not provided', () => {
    render(<Option label="Test" />);
    const button = screen.getByRole('button', { name: /Test/i });
    expect(button).toHaveStyle('background-color: white');
  });

  it('applies the disabled attribute when disabled prop is true', () => {
    render(<Option label="Test" disabled={true} />);
    const button = screen.getByRole('button', { name: /Test/i });
    expect(button).toBeDisabled();
  });

  it('does not apply the disabled attribute when disabled prop is false', () => {
    render(<Option label="Test" disabled={false} />);
    const button = screen.getByRole('button', { name: /Test/i });
    expect(button).not.toBeDisabled();
  });

  it('does not apply the disabled attribute when disabled prop is not provided', () => {
    render(<Option label="Test" />);
    const button = screen.getByRole('button', { name: /Test/i });
    expect(button).not.toBeDisabled();
  });

  it('renders the label correctly', () => {
    render(<Option label="Option Label" />);
    expect(screen.getByText('Option Label')).toBeInTheDocument();
  });
});
