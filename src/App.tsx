import Navbar from "./Navbar";
import Question from "./Question";
import Sets from "./Sets";
import ExplainModal from "./ExplainModal";
import { useEffect, useState } from "react";

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("Set 1");
  const [explanation, setExplanation] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [citations, setCitations] = useState<string[]>([]);
  const [sets, setSets] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  async function fetchSets() {
    try {
      const response = await fetch(
        "https://4mu4p3ymqfloak377n6whzywpy0jcfki.lambda-url.eu-west-2.on.aws/namedsets"
      );
      const data = await response.json();
      setSets(data);
      console.log(data);
      console.log(data[0]);
    } catch (error) {
      console.error("Failed to fetch sets:", error);
    }
  }

  useEffect(() => {
    const answeredQuestions = localStorage.getItem("answeredQuestions");
    if (answeredQuestions) {
      setAnsweredQuestions(JSON.parse(answeredQuestions));
    }
    fetchSets();
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

  async function handleExplain() {
    setModalOpen(true);
    const question = currentQuestion.question;
    const answer = currentQuestion.answer;
    const prompt = `Please explain clearly and in simple terms but without being too verbose, why the answer to the question ${question} is ${answer}. Do not use markdown. Just plain text`;
    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
          },
          body: JSON.stringify({
            model: "sonar-pro",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );
      const data = await response.json();
      setExplanation(data.choices[0].message.content);
      setCitations(data.citations);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="w-full h-dvh flex flex-col items-center justify-center">
        <Sets
          sets={sets}
          className="mt-16"
          selectedSet={selectedSet}
          setSelectedSet={setSelectedSet}
        />
        {/* <Question
          question={currentQuestion.question}
          options={currentQuestion.options}
          className="mt-12"
          isAnimating={isAnimating}
          isEntering={isEntering}
          hasAnswered={answeredQuestions.includes(currentQuestion.question)}
          onExplain={handleExplain}
        /> */}
        <Navbar
          onBack={handleBack}
          onNext={handleNext}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          className="mt-auto mb-16 opacity-20 hover:opacity-100 transition-opacity duration-200"
        />
      </main>
      {modalOpen && (
        <ExplainModal
          explanation={explanation}
          citations={citations}
          onDismiss={() => {
            setModalOpen(false);
            setExplanation("");
            setCitations([]);
          }}
        />
      )}
    </>
  );
}
