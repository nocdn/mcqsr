import Option from "./Option";

export default function Question({
  question,
  options,
  className,
  isAnimating = false,
  isEntering = true,
}: {
  question: string;
  options: string[];
  className?: string;
  isAnimating?: boolean;
  isEntering?: boolean;
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
      <h1 className="text-xl font-normal mb-8">{question}</h1>
      <div className="flex flex-col gap-2 w-full">
        {options.map((option) => (
          <Option key={option} label={option} className="w-full" />
        ))}
      </div>
    </div>
  );
}
