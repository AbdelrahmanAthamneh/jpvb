import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, BookOpen, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VocabularyCard from "../components/VocabularyCard";
import VocabularyReview from "../components/VocabularyReview";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "../config/config";

const VocabularyPage = () => {
  const navigate = useNavigate();
  const [vocabularies, setVocabularies] = useState([]);
  const [isAddingVocab, setIsAddingVocab] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newVocab, setNewVocab] = useState({
    word: "",
    wordTranslated: "",
    meaning: "",
    meaningTranslated: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    console.log("Vocabularies:", vocabularies);
  }, [vocabularies]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      navigate("/login");
    } else {
      fetchVocabulary().finally(() => setInitialLoad(false));
    }
  }, [navigate]);

  const fetchVocabulary = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/vocabulary`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-cache",
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          navigate("/login");
        }
        throw new Error("Failed to fetch vocabulary");
      }

      const data = await response.json();
      setVocabularies(data.vocabularies || data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.message.includes("401")) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        navigate("/login");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vocabulary?"))
      return;

    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}/vocabulary/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete vocabulary");

      setVocabularies((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      if (error.message.includes("401")) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        navigate("/login");
      }
    }
  };

  const handleAddVocab = () => {
    setIsAddingVocab(true);
    setEditingId(null);
    setNewVocab({
      word: "",
      wordTranslated: "",
      meaning: "",
      meaningTranslated: "",
    });
  };

  const handleEdit = (vocab) => {
    setEditingId(vocab._id || vocab.id);
    setNewVocab({
      word: vocab.word,
      wordTranslated: vocab.wordTranslated,
      meaning: vocab.meaning,
      meaningTranslated: vocab.meaningTranslated,
    });
    setIsAddingVocab(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!newVocab.word.trim()) {
      setErrors({ word: "Word is required" });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const isEditing = !!editingId;
      const url = isEditing
        ? `${API_BASE_URL}/vocabulary/${editingId}`
        : `${API_BASE_URL}/vocabulary`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVocab),
      });

      const responseData = await response.json();
      const data = responseData.vocabulary || responseData;

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          navigate("/login");
        }
        throw new Error(responseData.message || "Operation failed");
      }

      if (isEditing) {
        setVocabularies((prev) =>
          prev.map((v) => (v._id === data._id ? data : v))
        );
      } else {
        setVocabularies((prev) => [data, ...prev]);

        // Check if this is the first vocabulary item
        if (vocabularies.length === 0) {
          // Wait for state to update, then reload the page
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      }

      setNewVocab({
        word: "",
        wordTranslated: "",
        meaning: "",
        meaningTranslated: "",
      });
      setEditingId(null);
      setIsAddingVocab(false);
    } catch (error) {
      console.error("Save error:", error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVocab((prev) => ({ ...prev, [name]: value }));
  };

  const startReview = () => {
    if (vocabularies.length < 5) {
      alert("Add at least 5 words to start review");
      return;
    }
    setIsReviewing(true);
  };

  if (isReviewing) {
    return (
      <VocabularyReview
        vocabularies={vocabularies}
        onFinish={() => setIsReviewing(false)}
      />
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const filteredVocabularies = searchTerm.trim()
    ? vocabularies.filter((vocab) => {
        // Skip empty placeholder objects
        if (!vocab.word) return false;

        return Object.values(vocab).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : vocabularies.filter((vocab) => vocab.word); // Filter out empty objects

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
          Vocabulary Builder
        </h1>
        <p className="text-[var(--color-muted)]">
          Build your Japanese vocabulary collection
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <motion.div
          className="relative w-full sm:w-64"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search vocabulary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-[var(--color-muted)]" />
        </motion.div>

        <motion.div
          className="flex gap-3 w-full sm:w-auto"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {vocabularies.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg flex items-center shadow-sm flex-1 sm:flex-none justify-center"
              onClick={startReview}
            >
              <BookOpen size={18} className="mr-2" />
              Review
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg flex items-center shadow-sm flex-1 sm:flex-none justify-center"
            onClick={handleAddVocab}
          >
            <Plus size={18} className="mr-2" />
            {editingId ? "Edit Word" : "Add Word"}
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isAddingVocab && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-[var(--color-card)] rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[var(--color-card-foreground)]">
                {editingId ? "Edit Vocabulary" : "Add New Vocabulary"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsAddingVocab(false);
                  setEditingId(null);
                  setNewVocab({
                    word: "",
                    wordTranslated: "",
                    meaning: "",
                    meaningTranslated: "",
                  });
                }}
                className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <X size={20} />
              </motion.button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1">
                    Word{" "}
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="word"
                    value={newVocab.word}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.word
                        ? "border-red-500 dark:border-red-400"
                        : "border-[var(--color-border)]"
                    } bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg focus:outline-none focus:ring-2 ${
                      errors.word ? "focus:ring-red-500" : "focus:ring-blue-500"
                    }`}
                    placeholder="e.g. 猫"
                  />
                  {errors.word && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.word}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1">
                    Word Translated
                  </label>
                  <input
                    type="text"
                    name="wordTranslated"
                    value={newVocab.wordTranslated}
                    onChange={handleChange}
                    className="w-full p-2 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Cat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1">
                    Meaning
                  </label>
                  <textarea
                    name="meaning"
                    value={newVocab.meaning}
                    onChange={handleChange}
                    className="w-full p-2 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Japanese meaning"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1">
                    Meaning Translated
                  </label>
                  <textarea
                    name="meaningTranslated"
                    value={newVocab.meaningTranslated}
                    onChange={handleChange}
                    className="w-full p-2 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="English meaning"
                  />
                </div>
              </div>
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {errors.submit}
                </div>
              )}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 ${
                    isLoading
                      ? "bg-blue-400 dark:bg-blue-600"
                      : "bg-blue-600 dark:bg-blue-500"
                  } text-white rounded-lg flex items-center shadow-sm`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {editingId ? "Updating..." : "Saving..."}
                    </span>
                  ) : (
                    <>
                      <Check size={18} className="mr-2" />
                      {editingId ? "Update" : "Save"}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {initialLoad ? (
        <div className="text-center py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ) : vocabularies.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-[var(--color-card)] rounded-xl shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <BookOpen size={64} className="mx-auto text-blue-400/80 mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-card-foreground)] mb-2">
            No Vocabulary Found
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg inline-flex items-center shadow-sm"
            onClick={handleAddVocab}
          >
            <Plus size={18} className="mr-2" />
            Add First Word
          </motion.button>
        </motion.div>
      ) : filteredVocabularies.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-card)] rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--color-card-foreground)] mb-2">
            No Matching Words
          </h2>
          <p className="text-[var(--color-muted)]">
            Try different search terms
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredVocabularies.map((vocab) => (
            <motion.div key={vocab._id} variants={item}>
              <VocabularyCard
                vocabulary={vocab}
                onEdit={() => handleEdit(vocab)}
                onDelete={() => handleDelete(vocab._id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default VocabularyPage;
