import { render, screen } from '@testing-library/react';
import Question from './Question';
import { describe, it, expect, vi } from 'vitest';

// Mock the Option component
vi.mock('./Option', () => ({
  default: vi.fn(({ label, status, disabled, onClick }) => (
    <button
      data-testid={`option-${label}`}
      data-status={status}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )),
}));

const mockQuestionData = {
  question: 'What is 2 + 2?',
  options: ['3', '4', '5'],
  answer: '4',
};

describe('Question Component', () => {
  const mockOnOptionClick = vi.fn();
  const mockOnExplain = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the question text', () => {
    render(
      <Question
        questionData={mockQuestionData}
        selectedAnswers={{}}
        onOptionClick={mockOnOptionClick}
        onExplain={mockOnExplain}
      />
    );
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  it('passes default status to all options if no answer is selected', () => {
    render(
      <Question
        questionData={mockQuestionData}
        selectedAnswers={{}}
        onOptionClick={mockOnOptionClick}
        onExplain={mockOnExplain}
      />
    );
    mockQuestionData.options.forEach(optionLabel => {
      const optionButton = screen.getByTestId(`option-${optionLabel}`);
      expect(optionButton).toHaveAttribute('data-status', 'default');
      expect(optionButton).not.toBeDisabled();
    });
  });

  it('passes "correct" status to selected correct option and disables options', () => {
    const selectedAnswers = { [mockQuestionData.question]: '4' }; // Correct answer
    render(
      <Question
        questionData={mockQuestionData}
        selectedAnswers={selectedAnswers}
        onOptionClick={mockOnOptionClick}
        onExplain={mockOnExplain}
      />
    );

    const correctOptionButton = screen.getByTestId('option-4');
    expect(correctOptionButton).toHaveAttribute('data-status', 'correct');
    expect(correctOptionButton).toBeDisabled();

    const incorrectOptionButton1 = screen.getByTestId('option-3');
    expect(incorrectOptionButton1).toHaveAttribute('data-status', 'default'); // Other non-answered, non-correct options are default
    expect(incorrectOptionButton1).toBeDisabled();
    
    const incorrectOptionButton2 = screen.getByTestId('option-5');
    expect(incorrectOptionButton2).toHaveAttribute('data-status', 'default');
    expect(incorrectOptionButton2).toBeDisabled();
  });

  it('passes "incorrect" to selected, "correct" to actual answer, and disables options if incorrect answer is selected', () => {
    const selectedAnswers = { [mockQuestionData.question]: '3' }; // Incorrect answer
    render(
      <Question
        questionData={mockQuestionData}
        selectedAnswers={selectedAnswers}
        onOptionClick={mockOnOptionClick}
        onExplain={mockOnExplain}
      />
    );

    const selectedIncorrectOptionButton = screen.getByTestId('option-3');
    expect(selectedIncorrectOptionButton).toHaveAttribute('data-status', 'incorrect');
    expect(selectedIncorrectOptionButton).toBeDisabled();

    const actualCorrectOptionButton = screen.getByTestId('option-4');
    expect(actualCorrectOptionButton).toHaveAttribute('data-status', 'correct');
    expect(actualCorrectOptionButton).toBeDisabled();
    
    const otherOptionButton = screen.getByTestId('option-5');
    expect(otherOptionButton).toHaveAttribute('data-status', 'default');
    expect(otherOptionButton).toBeDisabled();
  });

  it('calls onOptionClick with question text and option label when an option is clicked', () => {
    render(
      <Question
        questionData={mockQuestionData}
        selectedAnswers={{}} // No answer selected yet, so options are not disabled
        onOptionClick={mockOnOptionClick}
        onExplain={mockOnExplain}
      />
    );
    const optionButton = screen.getByTestId('option-3');
    optionButton.click();
    expect(mockOnOptionClick).toHaveBeenCalledWith(mockQuestionData.question, '3');
  });
  
  it('displays "QUESTION ALREADY ANSWERED" text if hasAnswered is true', () => {
    render(
      <Question
        questionData={mockQuestionData}
        selectedAnswers={{}}
        onOptionClick={mockOnOptionClick}
        onExplain={mockOnExplain}
        hasAnswered={true} 
      />
    );
    expect(screen.getByText('QUESTION ALREADY ANSWERED')).toBeInTheDocument();
  });

  it('does not display "QUESTION ALREADY ANSWERED" text if hasAnswered is false or not provided', () => {
    render(
      <Question
        questionData={mockQuestionData}
        selectedAnswers={{}}
        onOptionClick={mockOnOptionClick}
        onExplain={mockOnExplain}
        // hasAnswered is false by default in the component
      />
    );
    expect(screen.queryByText('QUESTION ALREADY ANSWERED')).not.toBeInTheDocument();
  });
});
