import { motion } from "motion/react";

interface ButtonProps {
  label: string;
  backgroundColor?: string;
  icon?: React.ReactNode;
  iconPosition?: "leading" | "trailing";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  label,
  backgroundColor = "white",
  icon,
  iconPosition = "trailing",
  onClick,
  className,
}: ButtonProps) {
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
      className={`cursor-pointer font-jetbrains-mono border border-gray-200 w-fit px-5.5 py-2.5 rounded-md flex items-center gap-2 ${className}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.1)" }}
      onHoverStart={() => {}}
      style={{
        backgroundColor: backgroundColor,
      }}
      onClick={onClick}
    >
      {buttonContent}
    </motion.button>
  );
}
