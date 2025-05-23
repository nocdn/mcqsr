import Button from "./Button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import NumberFormat from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
export default function Navbar({
  onBack,
  onNext,
  questionNumber,
  totalQuestions,
  className,
  showingRestoreToast,
}: {
  onBack: () => void;
  onNext: () => void;
  questionNumber: number;
  totalQuestions: number;
  className?: string;
  showingRestoreToast?: boolean;
}) {
  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      <Button
        label="Back"
        icon={<ArrowLeft size={16} />}
        iconPosition="leading"
        onClick={onBack}
      />
      <div className="text-sm font-geist-mono w-24 text-center relative">
        <NumberFormat value={questionNumber} /> /{" "}
        <NumberFormat value={totalQuestions} />
        <AnimatePresence>
          {showingRestoreToast && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 5, scale: 0.7, filter: "blur(6px)" }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="text-green-700 flex items-center gap-1 absolute bottom-16 left-1/2 -translate-x-1/2 opacity-100 min-w-max text-center"
              style={{ whiteSpace: "nowrap" }}
            >
              <CheckCircle size={16} />
              Progress restored
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button label="Next" icon={<ArrowRight size={16} />} onClick={onNext} />
    </nav>
  );
}
