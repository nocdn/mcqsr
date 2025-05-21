import { motion } from "motion/react";

interface OptionProps {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: "leading" | "trailing";
  onClick?: () => void;
  className?: string;
  status?: "correct" | "incorrect" | "default";
  disabled?: boolean;
}

export default function Option({
  label,
  icon,
  iconPosition = "trailing",
  onClick,
  className,
  status = "default",
  disabled = false,
}: OptionProps) {
  let finalBackgroundColor: string;
  switch (status) {
    case "correct":
      finalBackgroundColor = "#D1FFD1"; // light green
      break;
    case "incorrect":
      finalBackgroundColor = "#FFD1D1"; // light coral
      break;
    default:
      finalBackgroundColor = "white";
  }

  let buttonContent = (
    <>
      {label}
      {icon}
    </>
  );
  if (iconPosition === "leading") {
    buttonContent = (
      <>
        {icon}
        {label}
      </>
    );
  }
  return (
    <motion.button
      className={`font-jetbrains-mono border border-gray-200 w-fit px-5.5 py-2.5 rounded-md flex items-center gap-2 ${className} ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`}
      whileHover={
        !disabled
          ? {
              boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.3)",
              scale: 1.005,
            }
          : {}
      }
      onHoverStart={() => {}}
      style={{
        backgroundColor: finalBackgroundColor,
      }}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {buttonContent}
    </motion.button>
  );
}
