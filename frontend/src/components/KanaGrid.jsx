import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import {
  hiraganaBase,
  hiraganaDakuten,
  hiraganaYoon,
  katakanaBase,
  katakanaDakuten,
  hiraganaLongVowels,
  katakanaLongVowels,
  katakanaYoon,
  katakanaForeign,
  hiraganaSokuon,
  katakanaSokuon,
} from "../data/kana";

import baseAudio from "../assets/01.mp3";
import dakutenAudio from "../assets/02.mp3";
import yoonAudio from "../assets/03.mp3";
import foreignAudio from "../assets/04.mp3";

const audioFiles = {
  base: baseAudio,
  dakuten: dakutenAudio,
  yoon: yoonAudio,
  foreign: foreignAudio,
  sokuon: baseAudio,
  long: baseAudio,
};

const audioCategoryMap = {
  base: "base",
  dakuten: "dakuten",
  yoon: "yoon",
  foreign: "foreign",
  sokuon: "base",
  long: "base",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const columnHeaders = ["a", "i", "u", "e", "o"];

const KanaGrid = ({ type, onStartReview }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    base: true,
    dakuten: true,
    small: true,
    yoon: true,
    foreign: true,
    sokuon: true,
    long: true,
  });
  const audioRef = useRef(null);
  const stopTimeout = useRef(null);

  const playAudio = (categoryKey, startTime, endTime) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (stopTimeout.current) {
      clearTimeout(stopTimeout.current);
    }

    const audioCategory = audioCategoryMap[categoryKey];
    const src = audioFiles[audioCategory];
    if (!src || !startTime || !endTime) return;

    const audio = new Audio(src);
    audioRef.current = audio;

    audio.currentTime = startTime;
    audio.play();

    const duration = (endTime - startTime) * 1000;
    stopTimeout.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, duration);
  };

  const toggleCategory = (category) =>
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));

  const renderKanaRow = (row, rowIndex, categoryKey) => (
    <div key={`row-${rowIndex}`} className="flex items-center mb-4">
      <div className="flex flex-1">
        {row.map((cell, colIndex) => (
          <div
            key={`cell-${rowIndex}-${colIndex}`}
            className="flex-1 text-center"
          >
            {cell.character ? (
              <motion.div
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                  backgroundColor: "var(--color-card)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-[var(--color-card)] rounded-xl shadow-sm cursor-pointer mx-1 p-2"
                onClick={() =>
                  playAudio(categoryKey, cell.startTime, cell.endTime)
                }
              >
                <div className="text-2xl font-bold mb-1 text-[var(--color-card-foreground)]">
                  {cell.character}
                </div>
                <div className="text-[var(--color-muted)] text-xs">
                  {cell.romaji}
                </div>
              </motion.div>
            ) : (
              <div className="h-16"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderKanaCategory = (data, title, key, showHeaders = false) => {
    if (!data?.length) return null;

    const showReviewButton = key !== "small";

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between bg-[var(--color-card)] rounded-lg p-3 mb-4 shadow-sm">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => toggleCategory(key)}
          >
            <h3 className="text-lg font-semibold text-[var(--color-card-foreground)]">
              {title}
            </h3>
          </div>

          {showReviewButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg flex items-center text-sm mr-3"
              onClick={() => onStartReview(key)}
            >
              <BookOpen size={14} className="mr-1" />
              Review
            </motion.button>
          )}

          <div
            className="cursor-pointer text-[var(--color-muted)]"
            onClick={() => toggleCategory(key)}
          >
            {expandedCategories[key] ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {expandedCategories[key] && (
          <motion.div
            className="overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="min-w-max">
              {showHeaders && (
                <div className="flex mb-2">
                  {columnHeaders.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center font-medium text-[var(--color-foreground)]"
                    >
                      {h}
                    </div>
                  ))}
                </div>
              )}
              {data.map((row, i) => renderKanaRow(row, i, key))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const sets =
    type === "hiragana"
      ? {
          base: [hiraganaBase, "Basic Hiragana", true],
          dakuten: [
            hiraganaDakuten,
            "Dakuten & Handakuten (Add a symbol to make a new sound)",
            true,
          ],
          yoon: [
            hiraganaYoon,
            "Yōon Combinations (Add a small kana to make a new syllable)",
            false,
          ],
          sokuon: [
            hiraganaSokuon,
            "Sokuon (Add a small っ before a consonant to double it)",
            false,
          ],
          long: [hiraganaLongVowels, "Long Vowels", false],
        }
      : {
          base: [katakanaBase, "Basic Katakana", true],
          dakuten: [
            katakanaDakuten,
            "Dakuten & Handakuten (Add a symbol to make a new sound)",
            true,
          ],
          yoon: [
            katakanaYoon,
            "Yōon Combinations (Add a small kana to make a new syllable)",
            false,
          ],
          foreign: [
            katakanaForeign,
            "Foreign Sounds (Only in katakana)",
            false,
          ],
          sokuon: [
            katakanaSokuon,
            "Sokuon (Add a small っ before a consonant to double it)",
            false,
          ],
          long: [katakanaLongVowels, "Long Vowels", false],
        };

  return (
    <div className="space-y-4">
      {Object.entries(sets).map(([key, [data, title, show]]) =>
        renderKanaCategory(data, title, key, show)
      )}
    </div>
  );
};

export default KanaGrid;
