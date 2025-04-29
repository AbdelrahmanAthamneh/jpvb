import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "../config/config";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      setSuccessMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setErrors({ server: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto"
    >
      <motion.div
        className="bg-[var(--color-card)] rounded-xl shadow-lg overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-[var(--color-card-foreground)]">
              Reset Password
            </h1>
            <p className="text-[var(--color-muted)]">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-muted)]">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.email
                      ? "border-red-500 dark:border-red-400"
                      : "border-[var(--color-border)]"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } bg-[var(--color-card)] text-[var(--color-card-foreground)]`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {errors.server && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {errors.server}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 ${
                isLoading
                  ? "bg-blue-400 dark:bg-blue-600"
                  : "bg-blue-600 dark:bg-blue-500"
              } text-white rounded-lg font-medium flex items-center justify-center`}
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
