import Navbar from "./Navbar";
import Question from "./Question"; // Commented out as per existing code
import Sets from "./Sets";
import ExplainModal from "./ExplainModal";
import { useEffect, useState } from "react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Set {
  name: string | null;
  questions: Question[];
}

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>(""); // Initialize as empty, will be set in useEffect
  const [explanation, setExplanation] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [citations, setCitations] = useState<string[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const currentQuestion = questions[currentQuestionIndex];

  async function fetchSets() {
    try {
      const response = await fetch(
        "https://4mu4p3ymqfloak377n6whzywpy0jcfki.lambda-url.eu-west-2.on.aws/namedsets"
      );
      const data: Set[] = await response.json();
      setSets(data);
      if (data.length > 0) {
        setSelectedSet(data[0].name || "Set 1");
      }
      console.log(data);
      console.log(data[0]);
    } catch (error) {
      console.error("Failed to fetch sets:", error);
    }
  }

  useEffect(() => {
    const storedAnsweredQuestions = localStorage.getItem("answeredQuestions");
    if (storedAnsweredQuestions) {
      setAnsweredQuestions(JSON.parse(storedAnsweredQuestions));
    }
    fetchSets();
  }, []);

  useEffect(() => {
    if (sets.length === 0) {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      return;
    }

    let foundSet = sets.find((set, index) => {
      const setName = set.name || `Set ${index + 1}`;
      return setName === selectedSet;
    });

    if (foundSet) {
      setQuestions(foundSet.questions);
    } else if (sets.length > 0) {
      // Default to the first set if selectedSet is not found
      setQuestions(sets[0].questions);
      setSelectedSet(sets[0].name || "Set 1"); // Also update selectedSet to reflect this default
    } else {
      setQuestions([]);
    }
    setCurrentQuestionIndex(0);
  }, [selectedSet, sets]);

  function addAnsweredQuestion(questionText: string) {
    // Avoid adding duplicates if already answered
    if (!answeredQuestions.includes(questionText)) {
      const newAnsweredQuestions = [...answeredQuestions, questionText];
      setAnsweredQuestions(newAnsweredQuestions);
      localStorage.setItem(
        "answeredQuestions",
        JSON.stringify(newAnsweredQuestions)
      );
    }
  }

  function handleOptionClick(questionText: string, selectedOption: string) {
    setSelectedAnswers((prev) => ({ ...prev, [questionText]: selectedOption }));
    addAnsweredQuestion(questionText);
  }

  function handleBack() {
    if (currentQuestionIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setIsEntering(false);
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
    if (!currentQuestion) return; // Add guard clause for undefined currentQuestion
    setModalOpen(true);
    const questionText = currentQuestion.question;
    const answerText = currentQuestion.answer;
    const prompt = `Please explain clearly and in simple terms but without being too verbose, why the answer to the question ${questionText} is ${answerText}. Do not use markdown. Just plain text`;
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
      console.log("citations: ", data.citations);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="w-full h-dvh flex flex-col items-center justify-center">
        <Sets
          sets={sets.map((set, index) => ({
            name: set.name || `Set ${index + 1}`,
          }))}
          className="mt-16"
          selectedSet={selectedSet}
          setSelectedSet={setSelectedSet}
        />
        {currentQuestion && (
          <Question
            questionData={currentQuestion}
            className="mt-12"
            isAnimating={isAnimating}
            isEntering={isEntering}
            hasAnswered={answeredQuestions.includes(currentQuestion.question)}
            onExplain={handleExplain}
            selectedAnswers={selectedAnswers}
            onOptionClick={handleOptionClick}
          />
        )}
        <Navbar
          onBack={handleBack}
          onNext={handleNext}
          questionNumber={questions.length > 0 ? currentQuestionIndex + 1 : 0}
          totalQuestions={questions.length}
          className="mt-auto mb-16 opacity-20 hover:opacity-100 transition-opacity duration-200"
        />
      </main>
      {modalOpen && (
        <ExplainModal
          explanation={explanation}
          citations={citations} // Citations might be empty if not returned by API
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
