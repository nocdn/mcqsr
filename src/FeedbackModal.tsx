import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Button from "./Button";
import Spinner from "./Spinner";
interface SettingsModalProps {
  onDismiss?: () => void;
}

const FeedbackModal: React.FC<SettingsModalProps> = ({
  onDismiss = () => {},
}) => {
  const [dismissing, setDismissing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  async function submitFeedback() {
    console.log("Submitting feedback: ", feedback);
    setIsSubmitting(true);
    setIsSubmitted(false);

    const response = await fetch(
      "https://vdkpzy2ervdn3ycyd6z276tzky0retcl.lambda-url.eu-west-2.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: "MCQS Feedback",
          html_body: feedback,
          to: ["bartek.bak@protonmail.com"],
        }),
      }
    );

    if (response.ok) {
      console.log("Feedback submitted successfully");
      console.log(response);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } else {
      console.error("Failed to submit feedback");
      setIsSubmitting(false);
      setIsError(true);
    }
  }

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
          className={`bg-white p-6 rounded-lg shadow-xl w-1/2 max-w-lg min-w-lg flex flex-col gap-3 overflow-y-hidden ${
            dismissing
              ? "animate-settings-modal-down"
              : "animate-settings-modal-up"
          }`}
        >
          <p className="text-md font-medium font-geist-mono flex justify-between opacity-75">
            <span className="text-gray-600">FEEDBACK</span>
            <X
              size={16}
              className="cursor-pointer"
              onMouseDown={dismissModal}
            />
          </p>
          <p className="text-sm text-gray-600">
            Please share any suggestions for features, improvements, or issues
            you come across. Keep in mind, I love working on this so don't hold
            back! Just make sure to be descriptive.
          </p>
          <textarea
            className="w-full h-38 p-2 border border-gray-300 rounded-md font-geist focus:outline-blue-700/15 focus:ring-offset-0"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="For example:

Please add more questions on perception and cognition
The explain feature could be improved by adding a follow up question input box.
"
          />
          <div className="flex items-center gap-2">
            <Button
              className="text-sm !py-2 !px-3.5"
              label="Send Feedback"
              onClick={() => {
                submitFeedback();
              }}
            />
            {isSubmitting && <Spinner />}
            {isError && (
              <p className="text-sm text-red-600 ml-2 motion-preset-focus">
                <span className="font-medium">Error submitting.</span>
                Try again later.
              </p>
            )}
            {isSubmitted && (
              <p className="text-sm text-blue-800 ml-2 motion-preset-focus">
                <span className="font-medium">Feedback submitted.</span> Thank
                you!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default FeedbackModal;
