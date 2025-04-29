import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AuthForm({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  isLogin,
  isLoading,
  serverError,
  onChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
  onForgotPassword,
  onSwitchPage,
}) {
  return (
    <motion.div
      className="bg-[var(--color-card)] rounded-xl shadow-lg overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold mb-2 text-[var(--color-card-foreground)]">
            {isLogin ? "Login" : "Register"}
          </h1>
          <p className="text-[var(--color-muted)]">
            {isLogin
              ? "Sign in to access your vocabulary collection"
              : "Create an account to start building your vocabulary"}
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1"
            >
              Username or Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-muted)]">
                <User size={18} />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={onChange}
                className={`w-full pl-10 pr-4 py-2 border ${
                  errors.username
                    ? "border-red-500 dark:border-red-400"
                    : "border-[var(--color-border)]"
                } rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username ? "focus:ring-red-500" : "focus:ring-blue-500"
                } bg-[var(--color-card)] text-[var(--color-card-foreground)]`}
                placeholder="Enter username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.username}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="relative">
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
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.email
                      ? "border-red-500 dark:border-red-400"
                      : "border-[var(--color-border)]"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } bg-[var(--color-card)] text-[var(--color-card-foreground)]`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-muted)]">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className={`w-full pl-10 pr-11 py-2 border ${
                  errors.password
                    ? "border-red-500 dark:border-red-400"
                    : "border-[var(--color-border)]"
                } rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
                } bg-[var(--color-card)] text-[var(--color-card-foreground)]`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="relative">
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  className={`w-full pl-10 pr-11 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500 dark:border-red-400"
                      : "border-[var(--color-border)]"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } bg-[var(--color-card)] text-[var(--color-card-foreground)]`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={onToggleConfirmPassword}
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
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {serverError && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 ${
              isLoading
                ? "bg-blue-400 dark:bg-blue-600"
                : "bg-blue-600 dark:bg-blue-500"
            } text-white rounded-lg font-medium flex items-center justify-center`}
          >
            {isLoading ? (
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
                <path className="opacity-75" fill="currentColor" />
              </svg>
            ) : (
              <>
                {isLogin ? "Login" : "Register"}{" "}
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-6 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onSwitchPage}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
