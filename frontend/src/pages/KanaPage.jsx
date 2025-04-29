import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import KanaGrid from "../components/KanaGrid";
import KanaReview from "../components/KanaReview";
import {
  hiragana,
  katakana,
  hiraganaBase,
  hiraganaDakuten,
  hiraganaLongVowels,
  hiraganaYoon,
  hiraganaSokuon,
  katakanaBase,
  katakanaDakuten,
  katakanaLongVowels,
  katakanaYoon,
  katakanaForeign,
  katakanaSokuon,
} from "../data/kana";

const KanaPage = () => {
  const [activeTab, setActiveTab] = useState("hiragana");
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewSection, setReviewSection] = useState(null);

  const startReview = (section) => {
    setReviewSection(section);
    setIsReviewing(true);
  };

  if (isReviewing && reviewSection) {
    let kanaToReview = [];
    let sectionTitle = "";

    if (activeTab === "hiragana") {
      if (reviewSection === "all") {
        kanaToReview = [
          ...hiraganaBase.flat().filter(Boolean),
          ...hiraganaDakuten.flat().filter(Boolean),
          ...hiraganaYoon.flat().filter(Boolean),
          ...hiraganaSokuon.flat().filter(Boolean),
          ...hiraganaLongVowels.flat().filter(Boolean),
        ];
        sectionTitle = "All Hiragana";
      } else if (reviewSection === "base") {
        kanaToReview = hiraganaBase.flat().filter(Boolean);
        sectionTitle = "Basic Hiragana";
      } else if (reviewSection === "dakuten") {
        kanaToReview = hiraganaDakuten.flat().filter(Boolean);
        sectionTitle = "Dakuten & Handakuten";
      } else if (reviewSection === "yoon") {
        kanaToReview = hiraganaYoon.flat().filter(Boolean);
        sectionTitle = "Yōon Combinations";
      } else if (reviewSection === "sokuon") {
        kanaToReview = hiraganaSokuon.flat().filter(Boolean);
      } else if (reviewSection === "long") {
        kanaToReview = hiraganaLongVowels.flat().filter(Boolean);
        sectionTitle = "Long Vowels";
      }
    } else if (activeTab === "katakana") {
      if (reviewSection === "all") {
        kanaToReview = [
          ...katakanaBase.flat().filter(Boolean),
          ...katakanaDakuten.flat().filter(Boolean),
          ...katakanaYoon.flat().filter(Boolean),
          ...katakanaForeign.flat().filter(Boolean),
          ...katakanaSokuon.flat().filter(Boolean),
          ...katakanaLongVowels.flat().filter(Boolean),
        ];
        sectionTitle = "All Katakana";
      } else if (reviewSection === "base") {
        kanaToReview = katakanaBase.flat().filter(Boolean);
        sectionTitle = "Basic Katakana";
      } else if (reviewSection === "dakuten") {
        kanaToReview = katakanaDakuten.flat().filter(Boolean);
        sectionTitle = "Dakuten & Handakuten";
      } else if (reviewSection === "yoon") {
        kanaToReview = katakanaYoon.flat().filter(Boolean);
        sectionTitle = "Yōon Combinations";
      } else if (reviewSection === "foreign") {
        kanaToReview = katakanaForeign.flat().filter(Boolean);
        sectionTitle = "Foreign Sounds";
      } else if (reviewSection === "sokuon") {
        kanaToReview = katakanaSokuon.flat().filter(Boolean);
      } else if (reviewSection === "long") {
        kanaToReview = katakanaLongVowels.flat().filter(Boolean);
        sectionTitle = "Long Vowels";
      }
    }

    return (
      <KanaReview
        kana={kanaToReview}
        type={sectionTitle}
        onFinish={() => setIsReviewing(false)}
      />
    );
  }

  const tabVariants = {
    inactive: {
      color: "var(--color-muted)",
      backgroundColor: "transparent",
      boxShadow: "none",
    },
    active: {
      color: "#2563EB",
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  if (typeof window !== "undefined") {
    window.hiraganaBase = hiraganaBase;
    window.hiraganaDakuten = hiraganaDakuten;
    window.hiraganaYoon = hiraganaYoon;
    window.hiraganaSokuon = hiraganaSokuon;
    window.hiraganaLongVowels = hiraganaLongVowels;

    window.katakanaBase = katakanaBase;
    window.katakanaDakuten = katakanaDakuten;
    window.katakanaYoon = katakanaYoon;
    window.katakanaForeign = katakanaForeign;
    window.hiraganaSokuon = hiraganaSokuon;
    window.katakanaSokuon = katakanaSokuon;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
          Japanese Kana
        </h1>
        <p className="text-[var(--color-muted)]">
          Learn and practice Hiragana and Katakana characters
        </p>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1 bg-[var(--color-card)] p-1 rounded-lg shadow-sm">
          <motion.button
            variants={tabVariants}
            animate={activeTab === "hiragana" ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("hiragana")}
            className="px-4 py-2 rounded-md font-medium text-sm"
          >
            Hiragana
          </motion.button>
          <motion.button
            variants={tabVariants}
            animate={activeTab === "katakana" ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("katakana")}
            className="px-4 py-2 rounded-md font-medium text-sm"
          >
            Katakana
          </motion.button>
          <motion.button
            variants={tabVariants}
            animate={activeTab === "kanji" ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("kanji")}
            className="px-4 py-2 rounded-md font-medium text-sm"
          >
            Kanji
          </motion.button>
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg flex items-center shadow-sm"
          onClick={() => startReview("all")}
          disabled={activeTab === "kanji"}
        >
          <BookOpen size={18} className="mr-2" />
          Review All
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "hiragana" && (
          <motion.div
            key="hiragana"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <KanaGrid
              kana={hiragana}
              type="hiragana"
              onStartReview={startReview}
            />
          </motion.div>
        )}

        {activeTab === "katakana" && (
          <motion.div
            key="katakana"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <KanaGrid
              kana={katakana}
              type="katakana"
              onStartReview={startReview}
            />
          </motion.div>
        )}

        {activeTab === "kanji" && (
          <motion.div
            key="kanji"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-[var(--color-card)] rounded-xl shadow-sm p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-card-foreground)]">
                Kanji Coming Soon
              </h2>
              <p className="text-[var(--color-muted)] mb-4 max-w-2xl mx-auto">
                We're working on adding a comprehensive Kanji section to help
                you learn and practice Japanese Kanji characters.
              </p>
              <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
                In the meantime, you can practice Hiragana and Katakana to build
                a strong foundation for your Japanese learning journey.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KanaPage;
