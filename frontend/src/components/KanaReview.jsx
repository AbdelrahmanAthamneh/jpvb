import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, RotateCcw, ArrowLeft } from "lucide-react";

const KanaReview = ({ kana, type, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledKana, setShuffledKana] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [isReviewComplete, setIsReviewComplete] = useState(false);

  useEffect(() => {
    const validKana = kana.filter(
      (k) => k.character !== null && k.character !== undefined
    );
    const shuffled = [...validKana].sort(() => Math.random() - 0.5);
    setShuffledKana(shuffled);
  }, [kana]);

  const currentKana = shuffledKana[currentIndex];
  const progress =
    shuffledKana.length > 0 ? (currentIndex / shuffledKana.length) * 100 : 0;

  if (!shuffledKana.length || !currentKana) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8">
        <h2 className="text-xl font-bold mb-4 text-[var(--color-foreground)]">
          No kana available for review
        </h2>
        <button
          onClick={onFinish}
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg"
        >
          Back to Kana
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const longVowelMap = {
      ā: ["aa"],
      ī: ["ii"],
      ū: ["uu"],
      ē: ["ee", "ei"],
      ō: ["oo", "ou"],
    };

    const userAnswerNormalized = userAnswer.trim().toLowerCase();
    const correctRomaji = currentKana.romaji.toLowerCase();

    let isAnswerCorrect = userAnswerNormalized === correctRomaji;

    if (!isAnswerCorrect && longVowelMap[correctRomaji]) {
      isAnswerCorrect =
        longVowelMap[correctRomaji].includes(userAnswerNormalized);
    }

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      setResults((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setResults((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const goToNext = () => {
    if (currentIndex < shuffledKana.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setIsCorrect(null);
      setShowAnswer(false);
    } else {
      setIsReviewComplete(true);
    }
  };

  const restartReview = () => {
    const validKana = kana.filter(
      (k) => k.character !== null && k.character !== undefined
    );
    const shuffled = [...validKana].sort(() => Math.random() - 0.5);
    setShuffledKana(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setShowAnswer(false);
    setResults({ correct: 0, incorrect: 0 });
    setIsReviewComplete(false);
  };

  if (isReviewComplete) {
    const percentage = Math.round(
      (results.correct / shuffledKana.length) * 100
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-2xl mx-auto"
      >
        <motion.div
          className="bg-[var(--color-card)] rounded-xl shadow-lg p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-card-foreground)]">
            {type} Review Complete!
          </h2>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-[var(--color-card-foreground)]">
                Score:
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-4 rounded-full bg-blue-500 dark:bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-2">
                <Check
                  size={20}
                  className="text-green-500 dark:text-green-400 mr-2"
                />
                <h3 className="font-semibold text-green-800 dark:text-green-300">
                  Correct
                </h3>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {results.correct}
              </p>
            </motion.div>
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <X size={20} className="text-red-500 dark:text-red-400 mr-2" />
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Incorrect
                </h3>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {results.incorrect}
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg flex items-center justify-center shadow-sm"
              onClick={restartReview}
            >
              <RotateCcw size={18} className="mr-2" />
              Restart Review
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-card-foreground)] rounded-lg flex items-center justify-center"
              onClick={onFinish}
            >
              Back to Kana
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={onFinish}
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Kana
        </motion.button>
        <div className="text-[var(--color-muted)] font-medium">
          {currentIndex + 1} / {shuffledKana.length}
        </div>
      </div>

      <div className="w-full dark:bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
        <motion.div
          className="h-2 rounded-full bg-blue-500 dark:bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </div>

      <motion.div
        className="bg-[var(--color-card)] rounded-xl shadow-lg overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="mb-2 text-center">
            <h2 className="text-xl font-bold text-[var(--color-card-foreground)]">
              {type}
            </h2>
          </div>
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-8xl font-bold mb-2 text-blue-600 dark:text-blue-400"
            >
              {currentKana.character}
            </motion.div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-card-foreground)] mb-2">
                What is the romaji for this character?
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showAnswer}
                className="w-full p-3 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your answer here..."
                autoFocus
              />
            </div>

            <AnimatePresence>
              {showAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-4 rounded-lg mb-6 ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/20"
                      : "bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  <div className="flex items-start">
                    {isCorrect ? (
                      <Check
                        size={20}
                        className="text-green-500 dark:text-green-400 mr-2 mt-0.5"
                      />
                    ) : (
                      <X
                        size={20}
                        className="text-red-500 dark:text-red-400 mr-2 mt-0.5"
                      />
                    )}
                    <div>
                      <p
                        className={`font-medium ${
                          isCorrect
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </p>
                      {!isCorrect && (
                        <p className="text-[var(--color-muted)] mt-1">
                          Correct answer:{" "}
                          <span className="font-medium">
                            {currentKana.romaji}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium mb-6 shadow-sm"
                >
                  Check Answer
                </motion.button>
              )}
            </AnimatePresence>

            {showAnswer && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={goToNext}
                className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center shadow-sm"
              >
                {currentIndex < shuffledKana.length - 1 ? (
                  <>
                    Next <ArrowRight size={18} className="ml-2" />
                  </>
                ) : (
                  <>Finish Review</>
                )}
              </motion.button>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default KanaReview;
