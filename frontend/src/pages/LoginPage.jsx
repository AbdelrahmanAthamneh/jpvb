import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "../config/config";
import { ThemeToggle } from "../components/ThemeToggle";
import AuthForm from "../components/AuthForm";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Required";
    if (!formData.password) errs.password = "Required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      dispatch(login({ username: formData.username }));
      navigate("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <AuthForm
        isLogin={true}
        formData={{ ...formData, email: "", confirmPassword: "" }}
        errors={errors}
        serverError={serverError}
        isLoading={isLoading}
        showPassword={showPassword}
        showConfirmPassword={false}
        onChange={handleChange}
        onTogglePassword={() => setShowPassword((v) => !v)}
        onToggleConfirmPassword={() => {}}
        onSubmit={handleSubmit}
        onForgotPassword={() => navigate("/forgot-password")}
        onSwitchPage={() => navigate("/register")}
      />
    </motion.div>
  );
}
