import Navbar from "./Navbar";
import Question from "./Question";
import Sets from "./Sets";
import ExplainModal from "./ExplainModal";
import SettingsModal from "./SettingsModal";
import { useEffect, useState } from "react";
import FeedbackModal from "./FeedbackModal";
import Summary from "./Summary";

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
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [citations, setCitations] = useState<string[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [showingRestoreToast, setShowingRestoreToast] =
    useState<boolean>(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (consecutiveCorrect === 10) {
      console.log("user got 10 correct");
      setConsecutiveCorrect(0);
    }
  }, [consecutiveCorrect]);

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
                setTimeout(() => {
                  setShowingRestoreToast(true);
                }, 100);
                setTimeout(() => {
                  setShowingRestoreToast(false);
                }, 1100);
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
        // console.log(
        //   `Nav: Q ${currentQuestionIndex} for Set ${selectedSet}. Updated lastKnownPosition.`
        // );
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
    if (currentQuestion && selectedOption === currentQuestion.answer) {
      setConsecutiveCorrect((prev) => prev + 1);
    } else {
      setConsecutiveCorrect(0);
    }
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
    if (!currentQuestion) return;
    setModalOpen(true);
    const questionText = currentQuestion.question;
    const answerText = currentQuestion.answer;

    try {
      const response = await fetch("https://mcqsproxy.bartoszbak.org/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          question: questionText,
          correct_answer: answerText,
        }),
      });

      if (!response.ok) {
        console.error(
          "proxy /explain error:",
          response.status,
          await response.text()
        );
        return;
      }

      const data = await response.json();
      // data is exactly what the Perplexity API returned
      setExplanation(data.choices?.[0]?.message?.content || "");
      setCitations(data.citations || []);
      console.log("citations:", data.citations);
    } catch (err) {
      console.error("network error calling /explain:", err);
    }
  }

  return (
    <>
      <main className="w-full h-dvh flex flex-col items-center justify-center">
        <Sets
          sets={sets.map((set, index) => ({
            name: set.name || `General ${index + 1}`,
          }))}
          className="mt-8 sm:mt-16"
          selectedSet={selectedSet}
          setSelectedSet={(index) => {
            setSelectedSet(index);
            localStorage.setItem("lastSelectedSet", index.toString());
            setCurrentQuestionIndex(0);
            localStorage.setItem(
              "lastKnownPosition",
              JSON.stringify({ setId: index, questionId: 0 })
            );
            console.log(
              "User selected Set:",
              index,
              ". Reset Q to 0. Updated lastKnownPosition."
            );
          }}
          onSettingsClick={() => {
            setSettingsModalOpen(true);
          }}
          openFeedbackModal={() => {
            setFeedbackModalOpen(true);
          }}
        />
        {currentQuestion && (
          // <Question
          //   questionData={currentQuestion}
          //   className="mt-4 sm:mt-12"
          //   isAnimating={isAnimating}
          //   hasAnswered={answeredQuestions.includes(currentQuestion.question)}
          //   isEntering={isEntering}
          //   onExplain={handleExplain}
          //   selectedAnswers={selectedAnswers}
          //   onOptionClick={handleOptionClick}
          // />
          <Summary
            correct={10}
            incorrect={2}
            onTryWrongOnly={() => {
              console.log("try wrong only");
            }}
          />
        )}
        <Navbar
          onBack={handleBack}
          onNext={handleNext}
          showingRestoreToast={showingRestoreToast}
          questionNumber={questions.length > 0 ? currentQuestionIndex + 1 : 0}
          totalQuestions={questions.length}
          className="mt-auto mb-5 sm:mb-16 transition-opacity duration-200"
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
      {settingsModalOpen && (
        <SettingsModal
          onDismiss={() => {
            setSettingsModalOpen(false);
          }}
          onResetAnsweredQuestions={() => {
            setAnsweredQuestions([]);
            localStorage.removeItem("answeredQuestions");
          }}
          onResetQuestionProgress={() => {
            setCurrentQuestionIndex(0);
            localStorage.removeItem("lastKnownPosition");
          }}
        />
      )}
      {feedbackModalOpen && (
        <FeedbackModal
          onDismiss={() => {
            setFeedbackModalOpen(false);
          }}
        />
      )}
    </>
  );
}
