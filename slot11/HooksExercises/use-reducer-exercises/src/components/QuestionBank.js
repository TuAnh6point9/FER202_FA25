import React, { useEffect, useReducer, useState } from "react";
import { Button, Container, Card, ProgressBar } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
const initialState = {
  questions: [
    {
      id: 1,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Canberra", "Melbourne", "Perth"],
      answer: "Canberra",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      id: 3,
      question: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Pacific Ocean",
        "Arctic Ocean",
      ],
      answer: "Pacific Ocean",
    },
  ],
  currentQuestion: 0,
  selectedOption: "",
  score: 0,
  showScore: false,
  // New state for timer and answer status
  timeLeft: 10, // seconds per question
  isAnswered: false, // true when user selected or timeout
  timedOut: false, // true when time hits 0 without selection
};

function quizReducer(state, action) {
  switch (action.type) {
    case "SELECT_OPTION":
      return { ...state, selectedOption: action.payload, isAnswered: true, timedOut: false };

    case "TICK": {
      if (state.showScore || state.isAnswered) return state; // don't tick when finished or already answered
      const nextTime = Math.max(0, state.timeLeft - 1);
      // If time reaches 0, mark as answered via timeout
      if (nextTime === 0) {
        return { ...state, timeLeft: 0, isAnswered: true, timedOut: true, selectedOption: "" };
      }
      return { ...state, timeLeft: nextTime };
    }

    case "NEXT_QUESTION":
      const isCorrect =
        state.selectedOption === state.questions[state.currentQuestion].answer;
      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        currentQuestion: state.currentQuestion + 1,
        selectedOption: "",
        showScore: state.currentQuestion + 1 === state.questions.length, // Hiển thị điểm khi hết câu hỏi
        // reset per-question state
        timeLeft: 10,
        isAnswered: false,
        timedOut: false,
      };

    case "RESTART_QUIZ":
      return {
        ...initialState, // Reset về trạng thái ban đầu
      };

    default:
      return state;
  }
}
// Component chính
function QuestionBank() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { questions, currentQuestion, selectedOption, score, showScore, timeLeft, isAnswered, timedOut } =
    state;

  // High score local state
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem("quizHighScore");
    return stored ? parseInt(stored, 10) : 0;
  });

  // Tick timer every second when on a question and not yet answered
  useEffect(() => {
    if (showScore) return; // stop when finished
    if (isAnswered) return; // stop ticking after answer selected or timeout
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [currentQuestion, isAnswered, showScore]);

  // When finishing quiz, update high score in localStorage
  useEffect(() => {
    if (!showScore) return;
    const stored = localStorage.getItem("quizHighScore");
    const prevBest = stored ? parseInt(stored, 10) : 0;
    const best = Math.max(score, prevBest);
    setHighScore(best);
    try {
      localStorage.setItem("quizHighScore", String(best));
    } catch {}
  }, [showScore, score]);

  const handleOptionSelect = (option) => {
    dispatch({ type: "SELECT_OPTION", payload: option });
  };

  const handleNextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
  };

  const handleRestartQuiz = () => {
    dispatch({ type: "RESTART_QUIZ" });
  };

  return (
    <Container className="mt-4">
      <Card className="p-4">
        {showScore ? (
          <div className="text-center">
            <h2>
              Your Score: {score} / {questions.length}
            </h2>
            <p>High Score: {highScore}</p>
            <Button variant="primary" onClick={handleRestartQuiz}>
              Restart Quiz
            </Button>
          </div>
        ) : (
          <div>
            {/* Progress display */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                Question {currentQuestion + 1}/{questions.length}
              </div>
              <div style={{ fontWeight: "bold", color: timeLeft < 5 ? "#dc3545" : "#333" }}>
                Time left: {timeLeft}s
              </div>
            </div>
            <ProgressBar
              now={((currentQuestion + 1) / questions.length) * 100}
              className="mb-3"
            />
            <h4>
              Question {questions[currentQuestion].id}:<br />
              {questions[currentQuestion].question}
            </h4>
            <div className="mt-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    selectedOption === option ? "success" : "outline-secondary"
                  }
                  className="m-2"
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswered} // prevent changing answer after select or timeout
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Feedback section after answering or timeout */}
            {isAnswered && (
              <div className="mt-3" role="status">
                {timedOut ? (
                  <div style={{ color: "#dc3545", fontWeight: 600 }}>
                    <FaTimesCircle style={{ marginRight: 8 }} /> Time's up! The correct answer is "
                    {questions[currentQuestion].answer}"
                  </div>
                ) : selectedOption === questions[currentQuestion].answer ? (
                  <div style={{ color: "#28a745", fontWeight: 600 }}>
                    <FaCheckCircle style={{ marginRight: 8 }} /> Correct! 🎉
                  </div>
                ) : (
                  <div style={{ color: "#dc3545", fontWeight: 600 }}>
                    <FaTimesCircle style={{ marginRight: 8 }} /> Incorrect! The correct answer is "
                    {questions[currentQuestion].answer}"
                  </div>
                )}
              </div>
            )}

            <Button
              variant="primary"
              className="mt-3"
              disabled={!isAnswered}
              onClick={handleNextQuestion}
            >
              {currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
}

export default QuestionBank;
