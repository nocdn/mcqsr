import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Button from "./Button";
interface SettingsModalProps {
  onDismiss?: () => void;
  onResetAnsweredQuestions?: () => void;
  onResetQuestionProgress?: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onDismiss = () => {},
  onResetAnsweredQuestions = () => {},
  onResetQuestionProgress = () => {},
}) => {
  const [dismissing, setDismissing] = useState(false);

  const dismissModal = () => {
    setDismissing(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-30 flex items-center justify-center ${
          dismissing ? "animate-bg-fade-out" : "animate-bg-fade-in"
        }`}
        onMouseDown={dismissModal}
        role="dialog"
        tabIndex={0}
      >
        <motion.div
          layout
          role="button"
          tabIndex={0}
          onMouseDown={(e) => e.stopPropagation()}
          className={`bg-white p-6 rounded-lg shadow-xl w-1/2 max-w-lg min-w-lg flex flex-col gap-3 overflow-y-scroll ${
            dismissing
              ? "animate-settings-modal-down"
              : "animate-settings-modal-up"
          }`}
        >
          <p className="text-md font-medium font-geist-mono flex justify-between opacity-75 mb-3">
            <span className="text-gray-600">SETTINGS</span>
            <X
              size={16}
              className="cursor-pointer"
              onMouseDown={dismissModal}
            />
          </p>
          <Button
            label="Reset Answered Questions"
            className="text-sm !py-2 !px-3.5"
            onClick={() => {
              onResetAnsweredQuestions();
            }}
          />
          <Button
            className="text-sm !py-2 !px-3.5"
            label="Reset Question Progress"
            onClick={() => {
              onResetQuestionProgress();
            }}
          />
        </motion.div>
      </div>
    </>
  );
};

export default SettingsModal;
