import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Settings,
  LogOut,
  Languages,
  Info,
  Menu,
  X,
  Sun,
  Monitor,
  Moon,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { toggleRomaji } from "../store/settingsSlice";
import { setTheme } from "../store/themeSlice";
import { THEMES } from "../store/themeSlice.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { romajiEnabled } = useSelector((state) => state.settings);
  const { themePreference } = useSelector((state) => state.theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settingsRef = useRef(null);

  const navItems = [
    { path: "/", label: "Vocabulary", icon: <Book className="h-5 w-5" /> },
    { path: "/kana", label: "Kana", icon: <Languages className="h-5 w-5" /> },
    { path: "/about", label: "About", icon: <Info className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsSettingsOpen(false);
    navigate("/");
  };

  const handleRomajiToggle = () => {
    dispatch(toggleRomaji());
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-card)] shadow-md py-2"
          : "bg-[var(--color-card)]/90 backdrop-blur-md py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-blue-600 dark:text-blue-400">日本語</span>{" "}
              <span className="text-[var(--color-card-foreground)]">
                Vocabulary Builder
              </span>
            </span>
          </Link>

          <div className="flex items-center">
            <nav className="hidden md:flex items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-[var(--color-muted)] hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center ml-2" ref={settingsRef}>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-2 rounded-full text-[var(--color-muted)] hover:bg-[var(--color-background)] focus:outline-none"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 bg-[var(--color-card)] rounded-lg shadow-lg py-2 z-10 border border-[var(--color-border)]"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--color-card-foreground)]">
                            Romaji
                          </span>
                          <button
                            onClick={handleRomajiToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              romajiEnabled
                                ? "bg-blue-600"
                                : "bg-[var(--color-border)]"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                romajiEnabled
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-[var(--color-border)]">
                        <p className="text-sm font-medium text-[var(--color-card-foreground)] mb-2">
                          Theme
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => dispatch(setTheme(THEMES.LIGHT))}
                            className={`flex flex-col items-center justify-center p-2 rounded-md ${
                              themePreference === THEMES.LIGHT
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-600 dark:ring-blue-400"
                                : "text-[var(--color-muted)] hover:bg-[var(--color-background)]"
                            }`}
                            aria-label="Light mode"
                          >
                            <Sun size={18} />
                            <span className="text-xs mt-1">Light</span>
                          </button>
                          <button
                            onClick={() => dispatch(setTheme(THEMES.SYSTEM))}
                            className={`flex flex-col items-center justify-center p-2 rounded-md ${
                              themePreference === THEMES.SYSTEM
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-600 dark:ring-blue-400"
                                : "text-[var(--color-muted)] hover:bg-[var(--color-background)]"
                            }`}
                            aria-label="System preference"
                          >
                            <Monitor size={18} />
                            <span className="text-xs mt-1">System</span>
                          </button>
                          <button
                            onClick={() => dispatch(setTheme(THEMES.DARK))}
                            className={`flex flex-col items-center justify-center p-2 rounded-md ${
                              themePreference === THEMES.DARK
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-600 dark:ring-blue-400"
                                : "text-[var(--color-muted)] hover:bg-[var(--color-background)]"
                            }`}
                            aria-label="Dark mode"
                          >
                            <Moon size={18} />
                            <span className="text-xs mt-1">Dark</span>
                          </button>
                        </div>
                      </div>

                      <div className="px-4 py-2 border-t border-[var(--color-border)]">
                        {isAuthenticated ? (
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>Logout</span>
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <Link
                              to="/login"
                              onClick={() => setIsSettingsOpen(false)}
                              className="flex items-center w-full px-3 py-2 text-sm text-[var(--color-card-foreground)] hover:bg-[var(--color-background)] rounded-md"
                            >
                              <LogIn className="h-4 w-4 mr-2" />
                              <span>Login</span>
                            </Link>
                            <Link
                              to="/register"
                              onClick={() => setIsSettingsOpen(false)}
                              className="flex items-center w-full px-3 py-2 text-sm text-[var(--color-card-foreground)] hover:bg-[var(--color-background)] rounded-md"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              <span>Register</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-2 p-2 rounded-md text-[var(--color-muted)] md:hidden focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-[var(--color-card)] border-t border-[var(--color-border)]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[var(--color-muted)]">Romaji</span>
                  <button
                    onClick={handleRomajiToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      romajiEnabled ? "bg-blue-600" : "bg-[var(--color-border)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        romajiEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="px-3 py-2">
                  <p className="text-sm text-[var(--color-muted)] mb-2">
                    Theme
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(setTheme(THEMES.LIGHT))}
                      className={`flex-1 flex items-center justify-center p-2 rounded-md ${
                        themePreference === THEMES.LIGHT
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-[var(--color-muted)] bg-[var(--color-background)]"
                      }`}
                    >
                      <Sun size={16} className="mr-1" />
                      <span className="text-xs">Light</span>
                    </button>
                    <button
                      onClick={() => dispatch(setTheme(THEMES.SYSTEM))}
                      className={`flex-1 flex items-center justify-center p-2 rounded-md ${
                        themePreference === THEMES.SYSTEM
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-[var(--color-muted)] bg-[var(--color-background)]"
                      }`}
                    >
                      <Monitor size={16} className="mr-1" />
                      <span className="text-xs">System</span>
                    </button>
                    <button
                      onClick={() => dispatch(setTheme(THEMES.DARK))}
                      className={`flex-1 flex items-center justify-center p-2 rounded-md ${
                        themePreference === THEMES.DARK
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-[var(--color-muted)] bg-[var(--color-background)]"
                      }`}
                    >
                      <Moon size={16} className="mr-1" />
                      <span className="text-xs">Dark</span>
                    </button>
                  </div>
                </div>

                <div className="px-3 py-2 mt-2 border-t border-[var(--color-border)]">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex items-center w-full px-3 py-2 text-sm text-[var(--color-card-foreground)] hover:bg-[var(--color-background)] rounded-md"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="flex items-center w-full px-3 py-2 text-sm text-[var(--color-card-foreground)] hover:bg-[var(--color-background)] rounded-md"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        <span>Register</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
