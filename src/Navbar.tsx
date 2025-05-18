import Button from "./Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NumberFormat from "@number-flow/react";
export default function Navbar({
  onBack,
  onNext,
  questionNumber,
  totalQuestions,
  className,
}: {
  onBack: () => void;
  onNext: () => void;
  questionNumber: number;
  totalQuestions: number;
  className?: string;
}) {
  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      <Button
        label="Back"
        icon={<ArrowLeft size={16} />}
        iconPosition="leading"
        onClick={onBack}
      />
      <p className="text-sm font-geist-mono w-24 text-center">
        <NumberFormat value={questionNumber} /> /{" "}
        <NumberFormat value={totalQuestions} />
      </p>
      <Button label="Next" icon={<ArrowRight size={16} />} onClick={onNext} />
    </nav>
  );
}
