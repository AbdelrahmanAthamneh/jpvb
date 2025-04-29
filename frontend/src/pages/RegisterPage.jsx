import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../store/authSlice";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "../config/config";
import { ThemeToggle } from "../components/ThemeToggle";
import AuthForm from "../components/AuthForm";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Valid email required";
    if (!formData.password || formData.password.length < 8)
      errs.password = "At least 8 characters";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords must match";
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
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      dispatch(register({ username: formData.username }));
      navigate("/login");
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
        isLogin={false}
        formData={formData}
        errors={errors}
        serverError={serverError}
        isLoading={isLoading}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onChange={handleChange}
        onTogglePassword={() => setShowPassword((v) => !v)}
        onToggleConfirmPassword={() => setShowConfirmPassword((v) => !v)}
        onSubmit={handleSubmit}
        onForgotPassword={() => {}}
        onSwitchPage={() => navigate("/login")}
      />
    </motion.div>
  );
}
