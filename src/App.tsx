import Navbar from "./Navbar";
import Question from "./Question";
import Sets from "./Sets";
import { useEffect, useState } from "react";

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("Set 1");
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
  ];

  useEffect(() => {
    const answeredQuestions = localStorage.getItem("answeredQuestions");
    if (answeredQuestions) {
      setAnsweredQuestions(JSON.parse(answeredQuestions));
    }
  }, []);

  function addAnsweredQuestion(question: string) {
    setAnsweredQuestions([...answeredQuestions, question]);
    localStorage.setItem(
      "answeredQuestions",
      JSON.stringify(answeredQuestions)
    );
  }

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
      }, 100);
    }
  }

  function handleNext() {
    if (currentQuestionIndex < questions.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setIsEntering(false);

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnimating(false);
        setIsEntering(true);
      }, 100);
    }
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="w-full h-dvh flex flex-col items-center justify-center">
      <Sets
        sets={["Set 1", "Set 2", "Occupational, Clinical and Educational"]}
        className="mt-16"
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
      />
      <Question
        question={currentQuestion.question}
        options={currentQuestion.options}
        className="mt-12"
        isAnimating={isAnimating}
        isEntering={isEntering}
        hasAnswered={answeredQuestions.includes(currentQuestion.question)}
        onExplain={() => {
          console.log("explain");
        }}
      />
      <Navbar
        onBack={handleBack}
        onNext={handleNext}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        className="mt-auto mb-16 opacity-20 hover:opacity-100 transition-opacity duration-200"
      />
    </main>
  );
}
