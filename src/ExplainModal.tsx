import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import NumberFlow from "@number-flow/react";
import Spinner from "./Spinner";
import { motion } from "motion/react";
interface ExplainModalProps {
  explanation: string;
  citations: string[];
  onDismiss?: () => void;
}

const ExplainModal: React.FC<ExplainModalProps> = ({
  explanation,
  citations,
  onDismiss = () => {},
}) => {
  const [dismissing, setDismissing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log("countdown finished!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
          className={`bg-white p-6 rounded-lg shadow-xl w-1/2 ${
            explanation === "" ? "max-w-lg min-w-lg" : "max-w-3xl min-w-3xl"
          } flex flex-col gap-3 overflow-y-hidden ${
            dismissing
              ? "animate-settings-modal-down"
              : "animate-settings-modal-up"
          }`}
        >
          <p className="text-md font-medium font-geist-mono flex justify-between opacity-75">
            <span className="text-gray-600">EXPLANATION</span>
            <X
              size={16}
              className="cursor-pointer"
              onMouseDown={dismissModal}
            />
          </p>
          {explanation === "" ? (
            <div className="inline-flex gap-2">
              <Spinner />
              <div>
                <p>Loading explanation</p>
                <p className="opacity-50 font-medium text-sm mt-1">
                  This will take around{" "}
                  <NumberFlow
                    value={secondsLeft}
                    className="font-mono font-semibold"
                  />{" "}
                  seconds
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="motion-opacity-in-0">{explanation}</p>
              <p className="text-gray-500 opacity-75 font-medium font-geist-mono mt-3 mb-1">
                CITATIONS
              </p>
              <div className="motion-opacity-in-0 flex flex-col">
                {citations.map((citation, index) => (
                  <a
                    key={index}
                    href={citation}
                    className="text-gray-500 rounded-sm py-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-jetbrains-mono text-sm opacity-65 hover:opacity-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-gray-400 font-mono">
                      [{index + 1}]
                    </span>{" "}
                    {citation.replace(/^https?:\/\/(www\.)?/i, "")}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ExplainModal;
