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
  let finalBorderColor: string;
  switch (status) {
    case "correct":
      finalBackgroundColor = "#DCFCE7"; // light green
      finalBorderColor = "#16A34A";
      break;
    case "incorrect":
      finalBackgroundColor = "#FFE2E1"; // light coral
      finalBorderColor = "#DC2626";
      break;
    default:
      finalBackgroundColor = "white";
      finalBorderColor = "#D1D5DB";
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
      className={`font-jetbrains-mono border text-left border-gray-200 w-fit px-5.5 py-2.5 rounded-md flex items-center gap-2 ${className} ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`}
      whileHover={
        !disabled
          ? {
              boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.3)",
            }
          : {}
      }
      onHoverStart={() => {}}
      style={{
        backgroundColor: finalBackgroundColor,
        borderColor: finalBorderColor,
      }}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {buttonContent}
    </motion.button>
  );
}
