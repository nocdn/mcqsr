import Option from "./Option";
import { Sparkles } from "lucide-react";

export default function Question({
  question,
  options,
  className,
  isAnimating = false,
  isEntering = true,
  hasAnswered = false,
  onExplain = () => {},
}: {
  question: string;
  options: string[];
  className?: string;
  isAnimating?: boolean;
  isEntering?: boolean;
  hasAnswered?: boolean;
  onExplain?: () => void;
}) {
  // Determine animation classes based on state
  const animationClasses = isAnimating
    ? "motion-blur-out-sm motion-opacity-out-0 motion-duration-100"
    : isEntering
    ? "motion-preset-focus"
    : "";

  return (
    <div
      className={`max-w-5xl min-w-5xl flex flex-col gap-2 ${className} ${animationClasses}`}
    >
      <div className="text-xl font-medium mb-8">
        {question}
        {hasAnswered ? (
          <p className="text-sm font-medium text-gray-500 mt-2 font-jetbrains-mono">
            QUESTION ALREADY ANSWERED
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 w-full">
        {options.map((option) => (
          <Option
            key={option}
            label={option}
            className="w-full"
            onClick={() => {}}
          />
        ))}
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
