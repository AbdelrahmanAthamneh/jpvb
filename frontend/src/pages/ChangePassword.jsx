import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../config/config";

const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchParams.get("token")) {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = {};

    if (!newPassword) {
      validationErrors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      validationErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/change-password?token=${searchParams.get(
          "token"
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password reset failed");
      }

      setSuccessMessage(
        "Password updated successfully! Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 2000);
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
              Set New Password
            </h1>
            <p className="text-[var(--color-muted)]">
              Create a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-muted)]">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full pl-10 pr-11 py-2 border ${
                    errors.newPassword
                      ? "border-red-500 dark:border-red-400"
                      : "border-[var(--color-border)]"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    errors.newPassword
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } bg-[var(--color-card)] text-[var(--color-card-foreground)]`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-muted)]">
                  <Lock size={18} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-11 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500 dark:border-red-400"
                      : "border-[var(--color-border)]"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } bg-[var(--color-card)] text-[var(--color-card-foreground)]`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.confirmPassword}
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
                  Updating...
                </span>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordPage;
