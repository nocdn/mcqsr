import Option from "./Option";
import { Sparkles } from "lucide-react";

interface QuestionData {
  question: string;
  options: string[];
  answer: string;
}

export default function Question({
  questionData,
  className,
  isAnimating = false,
  isEntering = true,
  hasAnswered = false,
  onExplain = () => {},
  selectedAnswers,
  onOptionClick,
}: {
  questionData: QuestionData;
  className?: string;
  isAnimating?: boolean;
  isEntering?: boolean;
  hasAnswered?: boolean;
  onExplain?: () => void;
  selectedAnswers: { [key: string]: string };
  onOptionClick: (questionText: string, selectedOption: string) => void;
}) {
  const { question, options, answer } = questionData; // Destructure answer as it's needed now

  // Determine animation classes based on state
  const animationClasses = isAnimating
    ? "motion-blur-out-sm motion-opacity-out-0 motion-duration-100"
    : isEntering
    ? "motion-preset-focus"
    : "";

  const userSelectedOption = selectedAnswers[question];

  return (
    <div
      className={`max-w-5xl min-w-5xl flex flex-col gap-2 ${className} ${animationClasses}`}
    >
      <div className="text-xl font-medium mb-8">
        {question}
        {hasAnswered ? ( // This hasAnswered prop might be redundant now given selectedAnswers
          <p className="text-sm font-medium text-gray-500 mt-2 font-jetbrains-mono">
            QUESTION ALREADY ANSWERED
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 w-full">
        {options.map((optionLabel) => {
          let status: "correct" | "incorrect" | "default" = "default";
          if (userSelectedOption) {
            if (optionLabel === userSelectedOption) {
              status = userSelectedOption === answer ? "correct" : "incorrect";
            } else if (optionLabel === answer) {
              status = "correct";
            }
          }

          return (
            <Option
              key={optionLabel}
              label={optionLabel}
              className="w-full"
              status={status}
              onClick={() => onOptionClick(question, optionLabel)}
              disabled={!!userSelectedOption} // Disable options if question is answered
            />
          );
        })}
      </div>
      <div
        onMouseDown={onExplain}
        className="flex items-center gap-2 mt-6 font-jetbrains-mono text-sm opacity-20 hover:opacity-60 font-medium ml-0.5 transition-opacity duration-200 cursor-pointer"
      >
        <Sparkles size={15} /> EXPLAIN THIS
      </div>
    </div>
  );
}
