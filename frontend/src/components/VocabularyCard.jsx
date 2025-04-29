import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Edit } from "lucide-react";
import RomajiText from "./RomajiText";
import { AUTH_TOKEN_KEY } from "../config/config";

const VocabularyCard = ({ vocabulary, onEdit, onDelete }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem(AUTH_TOKEN_KEY));
  }, []);

  return (
    <motion.div
      key={vocabulary._id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-[var(--color-card)] rounded-xl shadow-sm overflow-hidden border border-[var(--color-border)]"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-card-foreground)] leading-loose mb-1">
              <RomajiText text={vocabulary.word} />
            </h3>
            {vocabulary.wordTranslated && (
              <p className="text-[var(--color-muted)] text-sm">
                {vocabulary.wordTranslated}
              </p>
            )}
          </div>

          {isAuthenticated && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--color-muted)] hover:text-blue-600"
                onClick={() => onEdit(vocabulary)}
              >
                <Edit size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--color-muted)] hover:text-red-600"
                onClick={() => onDelete(vocabulary._id)}
              >
                <Trash2 size={18} />
              </motion.button>
            </div>
          )}
        </div>

        {(vocabulary.meaning || vocabulary.meaningTranslated) && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            {vocabulary.meaning && (
              <div className="mb-3 leading-loose">
                <RomajiText text={vocabulary.meaning} />
              </div>
            )}
            {vocabulary.meaningTranslated && (
              <p className="text-[var(--color-muted)] text-sm">
                {vocabulary.meaningTranslated}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VocabularyCard;
