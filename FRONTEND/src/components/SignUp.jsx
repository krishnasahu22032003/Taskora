// src/components/SignUp.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Mail, Lock, User } from "lucide-react";

const API_URL = "http://localhost:5000";
const INITIAL_FORM = { username: "", email: "", password: "" };
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Futuristic neon styles
const STYLES = {
  container: "max-w-md w-full bg-[#2C2C3C] shadow-lg border border-[#6A0DAD] rounded-xl p-8",
  iconBg: "w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#FF6EC7] rounded-full mx-auto flex items-center justify-center mb-2",
  title: "text-2xl font-bold text-[#F0F0F5]",
  appName: "text-[#FF6EC7] font-bold text-lg mt-1",
  tagline: "text-[#A0A0B0] text-sm",
  inputWrapper: "flex items-center border border-[#6A0DAD] rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#FF6EC7] transition-all duration-200 mb-1",
  input: "w-full focus:outline-none text-sm text-[#F0F0F5] bg-[#2C2C3C] placeholder-[#A0A0B0]",
  button: "w-full bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2",
  successMsg: "bg-[#4EF066]/20 text-[#4EF066] p-3 rounded-lg text-sm mb-4 border border-[#4EF066]",
  errorMsg: "bg-[#FF4C61]/20 text-[#FF4C61] p-3 rounded-lg text-sm mb-4 border border-[#FF4C61]",
  validationText: "text-xs text-[#FF4C61] mt-1",
  switchMode: "text-[#FF6EC7] hover:text-[#FF00FF] hover:underline font-medium transition-colors",
};

const FIELDS = [
  { name: "username", type: "text", placeholder: "Full Name", icon: User },
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
  { name: "password", type: "password", placeholder: "Password", icon: Lock },
];

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "" });

  // Live validation
  useEffect(() => {
    const errors = { email: "", password: "" };
    if (formData.email && !EMAIL_REGEX.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (formData.password && !PASSWORD_REGEX.test(formData.password)) {
      errors.password =
        "Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 chars";
    }
    setValidationErrors(errors);
  }, [formData.email, formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.username || !formData.email || !formData.password) {
      setMessage({ text: "All fields are required", type: "error" });
      return;
    }
    if (validationErrors.email || validationErrors.password) {
      setMessage({ text: "Please fix validation errors", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/user/signup`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage({ text: "🎉 Registration successful! You can now log in.", type: "success" });
      setFormData(INITIAL_FORM);

      // Hide success message after 4s
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={STYLES.container}>
      <div className="mb-6 text-center">
        <div className={STYLES.iconBg}>
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className={STYLES.title}>Create Account</h2>
        <p className={STYLES.appName}>Taskora</p>
        <p className={STYLES.tagline}>Your productivity, simplified</p>
      </div>

      {message.text && (
        <div className={`transition-all duration-300 ${message.type === "success" ? STYLES.successMsg : STYLES.errorMsg}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name}>
            <div className={STYLES.inputWrapper}>
              <Icon className="text-[#FF6EC7] w-5 h-5 mr-2" />
              <input
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className={STYLES.input}
                required
              />
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
          {loading ? "Signing Up..." : <><UserPlus className="w-4 h-4" /> Sign Up</>}
        </button>
      </form>

      <p className="text-center text-sm text-[#A0A0B0] mt-6">
        Already have an account?{" "}
        <button onClick={onSwitchMode} className={STYLES.switchMode}>
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;
