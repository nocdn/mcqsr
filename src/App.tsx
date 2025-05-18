import Navbar from "./Navbar";
import Question from "./Question";
import { useState } from "react";

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  // Sample questions array - in a real app this would come from your data source
  const questions = [
    {
      question:
        "In a famous experiment, Ivan Pavlov trained dogs to salivate at the sound of a bell by repeatedly pairing the bell with food. What is the bell considered in the context of classical conditioning after the dogs have learned to associate it with food?",
      options: [
        "Unconditioned stimulus",
        "Unconditioned response",
        "Conditioned stimulus",
        "Conditioned response",
      ],
    },
    {
      question:
        "Which psychological perspective emphasizes the role of unconscious processes in shaping behavior?",
      options: [
        "Cognitive perspective",
        "Behavioral perspective",
        "Psychodynamic perspective",
        "Humanistic perspective",
      ],
    },
    // Add more questions as needed
  ];

  function handleBack() {
    if (currentQuestionIndex > 0 && !isAnimating) {
      // Start exit animation
      setIsAnimating(true);
      setIsEntering(false);

      // After animation completes, change the question and start entrance animation
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsAnimating(false);
        setIsEntering(true);
      }, 300); // Match this to your animation duration
    }
  }

  function handleNext() {
    if (currentQuestionIndex < questions.length - 1 && !isAnimating) {
      // Start exit animation
      setIsAnimating(true);
      setIsEntering(false);

      // After animation completes, change the question and start entrance animation
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnimating(false);
        setIsEntering(true);
      }, 300); // Match this to your animation duration
    }
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="w-full h-dvh flex flex-col items-center justify-center">
      <Question
        question={currentQuestion.question}
        options={currentQuestion.options}
        className="mt-24"
        isAnimating={isAnimating}
        isEntering={isEntering}
      />
      <Navbar
        onBack={handleBack}
        onNext={handleNext}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        className="mt-auto mb-16"
      />
    </main>
  );
}
