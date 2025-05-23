import Navbar from "./Navbar";
import Question from "./Question";
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
  const [selectedSet, setSelectedSet] = useState<number>(0);
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
        const storedSet = localStorage.getItem("lastSelectedSet");
        let initialSetIndex = 0;
        if (storedSet) {
          const parsedIndex = parseInt(storedSet, 10);
          if (parsedIndex >= 0 && parsedIndex < data.length) {
            initialSetIndex = parsedIndex;
            console.log(
              "using last selected set from storage:",
              initialSetIndex
            );
          } else {
            initialSetIndex = 0;
            localStorage.setItem("lastSelectedSet", "0");
            console.log(
              "stored set index out of bounds, defaulting to 0 and correcting localStorage"
            );
          }
        } else {
          console.log("no stored set, using first set (0)");
          initialSetIndex = 0;
        }
        setSelectedSet(initialSetIndex);
      } else {
        setSelectedSet(0);
      }
    } catch (error) {
      console.error("Failed to fetch sets:", error);
      setSets([]);
      setSelectedSet(0);
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
    if (
      sets.length > 0 &&
      typeof selectedSet === "number" &&
      selectedSet >= 0 &&
      selectedSet < sets.length
    ) {
      setQuestions(sets[selectedSet].questions);
      setCurrentQuestionIndex(0);
    } else if (sets.length === 0) {
      // If there are no sets, clear questions.
      setQuestions([]);
      setCurrentQuestionIndex(0);
    }
    // The localStorage saving logic has been removed from here.
    // It's now handled when the user explicitly selects a set,
    // or during initial load validation in fetchSets.
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
            name: set.name || `General ${index + 1}`,
          }))}
          className="mt-16"
          selectedSet={selectedSet}
          setSelectedSet={(index) => {
            setSelectedSet(index);
            // Save to localStorage when user explicitly changes the set
            localStorage.setItem("lastSelectedSet", index.toString());
            console.log("User selected set, saving to localStorage:", index);
            // setQuestions and setCurrentQuestionIndex are removed from here;
            // they are handled by the useEffect hook listening to selectedSet and sets.
          }}
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
