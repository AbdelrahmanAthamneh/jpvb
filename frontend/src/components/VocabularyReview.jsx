import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, RotateCcw, ArrowLeft } from "lucide-react";
import RomajiText from "./RomajiText";

const VocabularyReview = ({ vocabularies, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledVocabs, setShuffledVocabs] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [isReviewComplete, setIsReviewComplete] = useState(false);

  useEffect(() => {
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    setShuffledVocabs(shuffled);
  }, [vocabularies]);

  const currentVocab = shuffledVocabs[currentIndex];
  const progress = (currentIndex / shuffledVocabs.length) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();

    const correctAnswer = currentVocab.wordTranslated || currentVocab.word;
    const isAnswerCorrect =
      userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      setResults((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setResults((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const goToNext = () => {
    if (currentIndex < shuffledVocabs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setIsCorrect(null);
      setShowAnswer(false);
    } else {
      setIsReviewComplete(true);
    }
  };

  const restartReview = () => {
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    setShuffledVocabs(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setShowAnswer(false);
    setResults({ correct: 0, incorrect: 0 });
    setIsReviewComplete(false);
  };

  if (!currentVocab) return null;

  if (isReviewComplete) {
    const percentage = Math.round(
      (results.correct / shuffledVocabs.length) * 100
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
            Review Complete!
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
                className="h-4 rounded-full bg-blue-600 dark:bg-blue-500"
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
              Back to Vocabulary
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
          Back to Vocabulary
        </motion.button>
        <div className="text-[var(--color-muted)] font-medium">
          {currentIndex + 1} / {shuffledVocabs.length}
        </div>
      </div>

      <div className="w-ful dark:bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
        <motion.div
          className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
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
          <div className="mb-8">
            <div className="w-full h-48 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-2 text-center text-[var(--color-card-foreground)]">
                  <RomajiText text={currentVocab.word} />
                </h2>
                {showAnswer && (
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold mb-2 text-[var(--color-card-foreground)]">
                      {currentVocab.wordTranslated}
                    </h3>
                    {currentVocab.meaning && (
                      <p className="text-[var(--color-muted)] mb-2">
                        <RomajiText text={currentVocab.meaning} />
                      </p>
                    )}
                    {currentVocab.meaningTranslated && (
                      <p className="text-[var(--color-muted)]">
                        {currentVocab.meaningTranslated}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-card-foreground)] mb-2">
                Enter the translation:
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
                            {currentVocab.wordTranslated || currentVocab.word}
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
                {currentIndex < shuffledVocabs.length - 1 ? (
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

export default VocabularyReview;
