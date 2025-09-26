// src/components/Login.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000";
const INITIAL_FORM = { email: "", password: "" };
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Futuristic neon styles (same as SignUp)
const STYLES = {
  container: "max-w-md w-full bg-[#2C2C3C] shadow-lg border border-[#6A0DAD] rounded-xl p-8",
  iconBg: "w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#FF6EC7] rounded-full mx-auto flex items-center justify-center mb-2",
  title: "text-2xl font-bold text-[#F0F0F5]",
  appName: "text-[#FF6EC7] font-bold text-lg mt-1",
  tagline: "text-[#A0A0B0] text-sm",
  inputWrapper: "flex items-center border border-[#6A0DAD] rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#FF6EC7] transition-all duration-200 mb-1",
  input: "w-full focus:outline-none text-sm text-[#F0F0F5] bg-[#2C2C3C] placeholder-[#A0A0B0]",
  button: "w-full bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2",
  validationText: "text-xs text-[#FF4C61] mt-1",
  switchMode: "text-[#FF6EC7] hover:text-[#FF00FF] hover:underline font-medium transition-colors",
};

const FIELDS = [
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
  { name: "password", type: "password", placeholder: "Password", icon: Lock, isPassword: true },
];

const Login = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Live validation
  useEffect(() => {
    const errors = { email: "", password: "" };
    if (formData.email && !EMAIL_REGEX.test(formData.email)) errors.email = "Enter a valid email address";
    if (formData.password && !PASSWORD_REGEX.test(formData.password))
      errors.password = "Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 chars";
    setValidationErrors(errors);
  }, [formData.email, formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }
    if (validationErrors.email || validationErrors.password) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      // Send POST request to backend (cookie-based auth)
      const { data } = await axios.post(`${API_URL}/api/user/signin`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // crucial for cookies
      });

      if (!data.success) throw new Error(data.message || "Login failed");
      toast.success("🎉 Login successful! Redirecting...");
      onSubmit?.(data.user); // pass user info to parent
      setFormData(INITIAL_FORM);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  return (
    <div className={STYLES.container}>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="mb-6 text-center">
        <div className={STYLES.iconBg}>
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className={STYLES.title}>Welcome Back</h2>
        <p className={STYLES.appName}>Taskora</p>
        <p className={STYLES.tagline}>Your productivity, simplified</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name}>
            <div className={STYLES.inputWrapper}>
              <Icon className="text-[#FF6EC7] w-5 h-5 mr-2" />
              <input
                type={isPassword && showPassword ? "text" : type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className={STYLES.input}
                required
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-[#A0A0B0] hover:text-[#FF6EC7] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
            </div>
            {name === "email" && validationErrors.email && (
              <p className={STYLES.validationText}>{validationErrors.email}</p>
            )}
            {name === "password" && validationErrors.password && (
              <p className={STYLES.validationText}>{validationErrors.password}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className={`${STYLES.button} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : <><LogIn className="w-4 h-4" /> Login</>}
        </button>
      </form>

      <p className="text-center text-[#A0A0B0] text-sm mt-6">
        Don't have an account?{" "}
        <button onClick={handleSwitchMode} className={STYLES.switchMode}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
