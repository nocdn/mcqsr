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

  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch(
          "https://4mu4p3ymqfloak377n6whzywpy0jcfki.lambda-url.eu-west-2.on.aws/namedsets"
        );
        const fetchedSets: Set[] = await response.json();
        setSets(fetchedSets);

        let initialSetIdx = 0;
        const storedSet = localStorage.getItem("lastSelectedSet");
        if (storedSet) {
          const parsedIndex = parseInt(storedSet, 10);
          if (
            parsedIndex >= 0 &&
            fetchedSets.length > 0 &&
            parsedIndex < fetchedSets.length
          ) {
            initialSetIdx = parsedIndex;
          } else {
            initialSetIdx = 0;
            if (fetchedSets.length > 0) {
              localStorage.setItem("lastSelectedSet", "0");
            } else {
              localStorage.removeItem("lastSelectedSet");
            }
          }
        } else if (fetchedSets.length > 0) {
          localStorage.setItem("lastSelectedSet", "0");
        }

        let initialQuestionIdx = 0;
        const lastKnownPositionStr = localStorage.getItem("lastKnownPosition");

        if (fetchedSets.length > 0) {
          if (lastKnownPositionStr) {
            try {
              const lastPos = JSON.parse(lastKnownPositionStr);
              if (
                lastPos.setId === initialSetIdx &&
                fetchedSets[initialSetIdx]?.questions &&
                lastPos.questionId >= 0 &&
                lastPos.questionId < fetchedSets[initialSetIdx].questions.length
              ) {
                initialQuestionIdx = lastPos.questionId;
                console.log(
                  "Restored Q:",
                  initialQuestionIdx,
                  "for Set:",
                  initialSetIdx
                );
              } else {
                initialQuestionIdx = 0;
                localStorage.setItem(
                  "lastKnownPosition",
                  JSON.stringify({ setId: initialSetIdx, questionId: 0 })
                );
                console.log(
                  "Mismatch/invalid lastKnownPosition. Resetting Q to 0 for Set:",
                  initialSetIdx
                );
              }
            } catch (e) {
              initialQuestionIdx = 0;
              localStorage.setItem(
                "lastKnownPosition",
                JSON.stringify({ setId: initialSetIdx, questionId: 0 })
              );
              console.error("Error parsing lastKnownPosition. Resetting.", e);
            }
          } else {
            initialQuestionIdx = 0;
            localStorage.setItem(
              "lastKnownPosition",
              JSON.stringify({ setId: initialSetIdx, questionId: 0 })
            );
            console.log(
              "No lastKnownPosition. Initializing Q to 0 for Set:",
              initialSetIdx
            );
          }

          setSelectedSet(initialSetIdx);
          if (fetchedSets[initialSetIdx]?.questions) {
            setQuestions(fetchedSets[initialSetIdx].questions);
          } else {
            setQuestions([]);
          }
          setCurrentQuestionIndex(initialQuestionIdx);
        } else {
          setQuestions([]);
          setSelectedSet(0);
          setCurrentQuestionIndex(0);
          localStorage.removeItem("lastSelectedSet");
          localStorage.removeItem("lastKnownPosition");
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setSets([]);
        setQuestions([]);
        setSelectedSet(0);
        setCurrentQuestionIndex(0);
        localStorage.removeItem("lastSelectedSet");
        localStorage.removeItem("lastKnownPosition");
      }
    }

    const storedAnsweredQuestions = localStorage.getItem("answeredQuestions");
    if (storedAnsweredQuestions) {
      setAnsweredQuestions(JSON.parse(storedAnsweredQuestions));
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (
      sets.length > 0 &&
      typeof selectedSet === "number" &&
      selectedSet >= 0 &&
      selectedSet < sets.length
    ) {
      setQuestions(sets[selectedSet].questions || []);
    } else if (sets.length === 0) {
      setQuestions([]);
      setCurrentQuestionIndex(0);
    }
  }, [selectedSet, sets]);

  // effect to save current question index on navigation
  useEffect(() => {
    if (
      sets.length > 0 &&
      typeof selectedSet === "number" &&
      selectedSet >= 0 &&
      selectedSet < sets.length &&
      questions.length > 0 &&
      currentQuestionIndex >= 0 &&
      currentQuestionIndex < questions.length
    ) {
      const currentStoredPosStr = localStorage.getItem("lastKnownPosition");
      let shouldUpdate = true;
      if (currentStoredPosStr) {
        try {
          const currentStoredPos = JSON.parse(currentStoredPosStr);
          if (
            currentStoredPos.setId === selectedSet &&
            currentStoredPos.questionId === currentQuestionIndex
          ) {
            shouldUpdate = false;
          }
        } catch (e) {}
      }

      if (shouldUpdate) {
        localStorage.setItem(
          "lastKnownPosition",
          JSON.stringify({
            setId: selectedSet,
            questionId: currentQuestionIndex,
          })
        );
        console.log(
          `Nav: Q ${currentQuestionIndex} for Set ${selectedSet}. Updated lastKnownPosition.`
        );
      }
    }
  }, [currentQuestionIndex, selectedSet, sets, questions]);

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
            localStorage.setItem("lastSelectedSet", index.toString());
            setCurrentQuestionIndex(0); // Reset question index for the new set
            localStorage.setItem(
              "lastKnownPosition",
              JSON.stringify({ setId: index, questionId: 0 })
            );
            console.log(
              "User selected Set:",
              index,
              ". Reset Q to 0. Updated lastKnownPosition."
            );
            // setQuestions and setCurrentQuestionIndex are handled by the useEffect hook listening to selectedSet and sets.
            // However, setting currentQuestionIndex to 0 here is crucial for the logic.
            // The useEffect for [selectedSet, sets] will then update the questions list.
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
