import Option from "./Option";
import { CheckCircle, Sparkles } from "lucide-react";
import { useMemo } from "react";

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
  const { question, options, answer } = questionData;

  // shuffle options when question changes
  const shuffledOptions = useMemo(() => {
    const arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [question]);

  // animation classes
  const animationClasses = isAnimating
    ? "motion-safe:motion-blur-out-sm motion-safe:motion-opacity-out-0 motion-safe:motion-duration-100"
    : isEntering
    ? "motion-safe:motion-preset-focus"
    : "";

  const userSelectedOption = selectedAnswers[question];

  return (
    <div
      className={`w-full sm:max-w-5xl sm:min-w-5xl flex flex-col gap-2 px-4 sm:px-0 ${className} ${animationClasses}`}
    >
      <div className="text-base sm:text-xl font-medium mb-4 sm:mb-8">
        {question}
      </div>
      <div className="flex flex-col gap-2 w-full">
        {shuffledOptions.map((optionLabel) => {
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
              className="w-full text-sm sm:text-base"
              status={status}
              onClick={() => onOptionClick(question, optionLabel)}
              disabled={!!userSelectedOption}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-6">
        <div
          onMouseDown={onExplain}
          className="hidden sm:flex items-center gap-2 mt-6 font-jetbrains-mono text-sm opacity-20 hover:opacity-60 font-medium ml-0.5 transition-opacity duration-200 cursor-pointer"
        >
          <Sparkles size={15} /> EXPLAIN THIS
        </div>
        {hasAnswered && (
          <div className="flex items-center mt-3 sm:mt-6 gap-2 font-jetbrains-mono text-sm font-medium text-blue-600/75 motion-preset-focus ml-1 sm:ml-0.5">
            <CheckCircle size={15} /> ALREADY ANSWERED
          </div>
        )}
      </div>
    </div>
  );
}
