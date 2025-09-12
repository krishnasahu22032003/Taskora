import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";

/**
 * SignUp.tsx
 * - Modern glassmorphism styling (Tailwind)
 * - Frontend validation matching backend constraints
 */

const Inputwrapper =
  "flex items-center gap-3 bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 transition-shadow focus-within:shadow-[0_8px_32px_rgba(124,58,237,0.06)]";
const BUTTONCLASSES =
  "w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white shadow-lg transition-transform active:scale-95";
const SUCCESS_BADGE = "text-sm text-emerald-800 bg-emerald-100 px-3 py-2 rounded-lg";
const ERROR_BADGE = "text-sm text-red-800 bg-red-100 px-3 py-2 rounded-lg";

const FIELDS = [
  { name: "username", type: "text", placeholder: "Username", icon: UserPlus },
  { name: "email", type: "email", placeholder: "Email", icon: UserPlus },
  { name: "password", type: "password", placeholder: "Password", icon: UserPlus },
];

const API_URL = "http://localhost:5000";

interface SignUpForm {
  username: string;
  email: string;
  password: string;
}

interface Message {
  text: string;
  type: "success" | "error" | "";
}

interface SignUpProps {
  onSwitchMode?: () => void;
}

const INITIAL_FORM: SignUpForm = { username: "", email: "", password: "" };

const SignUp: React.FC<SignUpProps> = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState<SignUpForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ text: "", type: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isUsernameValid = (v: string) => v.trim().length > 0;
  const isEmailValid = (v: string) => {
    if (!v) return false;
    if (v.length < 5 || v.length > 50) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v);
  };
  const isPasswordValid = (v: string) => {
    if (!v) return false;
    if (v.length < 5 || v.length > 50) return false;
    if (!/[a-z]/.test(v)) return false;
    if (!/[A-Z]/.test(v)) return false;
    return true;
  };

  const validateAll = (data: SignUpForm) => {
    const e: Record<string, string> = {};
    if (!isUsernameValid(data.username)) e.username = "Username is required.";
    if (!isEmailValid(data.email)) e.email = "Email must be valid and 5–50 characters.";
    if (!isPasswordValid(data.password))
      e.password =
        "Password must be 5–50 chars and include at least one lowercase and one uppercase letter.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validateAll(formData)) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/user/signup`, formData, {
        withCredentials: true,
      });

  if (data?.success === false) {
  setMessage({ text: data.message || "Signup failed", type: "error" });
} else {
  setMessage({ text: "Registration successful! You can now log in.", type: "success" });
  setFormData(INITIAL_FORM);
  setErrors({});

  // Clear the success message after 3 seconds
  setTimeout(() => {
    setMessage({ text: "", type: "" });
  }, 3000);
}
    } catch (err: unknown) {
      let msg = "An error occurred. Please try again.";
      if (axios.isAxiosError(err)) msg = err.response?.data?.message || msg;
      else if (err instanceof Error) msg = err.message;
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const copy = { ...prev };
      if (name === "username") {
        if (!isUsernameValid(value)) copy.username = "Username is required.";
        else delete copy.username;
      } else if (name === "email") {
        if (!isEmailValid(value)) copy.email = "Email must be valid and 5–50 chars.";
        else delete copy.email;
      } else if (name === "password") {
        if (!isPasswordValid(value))
          copy.password =
            "Password must be 5–50 chars and include at least one lowercase and one uppercase letter.";
        else delete copy.password;
      }
      return copy;
    });
  };

  const strengthLabel = (pw: string) => {
    if (pw.length >= 12 && /[a-z]/.test(pw) && /[A-Z]/.test(pw)) return "Strong";
    if (pw.length >= 8) return "Medium";
    if (pw.length > 0) return "Weak";
    return "";
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      {/* Full page wrapper */}
      <div className="w-full max-w-lg p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-24 w-72 h-72 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-indigo-400 opacity-20 blur-3xl transform rotate-45 animate-tilt"></div>
        <div className="pointer-events-none absolute -right-20 -bottom-24 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-400 to-teal-300 opacity-12 blur-3xl transform -rotate-12"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-md">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create an account</h1>
              <p className="text-sm text-slate-200/80">Join Taskora — organize your life with style.</p>
            </div>
          </div>

          {message.text && (
            <div className="mb-4">
              <div className={message.type === "success" ? SUCCESS_BADGE : ERROR_BADGE}>
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
              <div key={name}>
                <label className="sr-only" htmlFor={name}>{placeholder}</label>
                <div className={Inputwrapper}>
                  <div className="text-slate-300/80">
                    <Icon className="w-5 h-5" />
                  </div>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={String(formData[name as keyof SignUpForm] ?? "")}
                    onChange={handleChange}
                    className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder:text-slate-300/50"
                    aria-invalid={errors[name] ? "true" : "false"}
                    aria-describedby={errors[name] ? `${name}-error` : undefined}
                    required
                  />
                </div>

                {errors[name] && (
                  <p id={`${name}-error`} className="mt-2 text-xs text-red-200">{errors[name]}</p>
                )}

                {name === "password" && (
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-300/80">
                    <span>Password must be 5–50 chars and include lowercase & uppercase</span>
                    <span className="font-medium">{strengthLabel(String(formData.password ?? ""))}</span>
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              className={`${BUTTONCLASSES} bg-gradient-to-r from-fuchsia-500 to-purple-600`}
              disabled={loading || Object.keys(errors).length > 0}
              aria-disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? "Creating..." : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-200/80">
            Already have an account?{" "}
            <button
              onClick={onSwitchMode}
              className="text-white font-semibold underline-offset-2 hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
