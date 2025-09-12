import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginForm {
  email: string;
  password: string;
}

interface User {
  id: string;
  [key: string]: any;
}

interface LoginProps {
  onSubmit?: (data: { userId: string } & User) => void;
  onSwitchMode?: () => void;
}

const INITIAL_FORM: LoginForm = { email: "", password: "" };

const Login: React.FC<LoginProps> = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginForm>(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = "http://localhost:5000";

  // Auto-login using cookie
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${url}/api/user/signin`, {
          withCredentials: true,
        });
        if (data.success) {
          onSubmit?.({ userId: data.user.id, ...data.user });
          toast.success("Session restored. Redirecting...");
          navigate("/");
        }
      } catch {
        // ignore if no session
      }
    })();
  }, [navigate, onSubmit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/user/signin`, formData, {
        withCredentials: true,
      });

      if (!data.success) throw new Error(data.message || "Login failed.");

      localStorage.setItem("userId", data.user.id);
      setFormData(INITIAL_FORM);
      onSubmit?.({ userId: data.user.id, ...data.user });
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: unknown) {
      let msg = "Login failed.";
      if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
      else if (err instanceof Error) msg = err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-20 -top-24 w-72 h-72 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-indigo-400 opacity-20 blur-3xl animate-tilt"></div>
      <div className="pointer-events-none absolute -right-20 -bottom-24 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-400 to-teal-300 opacity-12 blur-3xl"></div>

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-xl p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-2xl shadow-2xl relative z-10">
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-md">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-sm text-slate-200/80">Sign in to continue to TaskFlow</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
              <div key={name} className="flex items-center gap-3 bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 focus-within:shadow-[0_8px_32px_rgba(124,58,237,0.06)]">
                <Icon className="w-5 h-5 text-slate-300/80" />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={formData[name as keyof LoginForm] || ""}
                  onChange={handleChange}
                  name={name}
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder:text-slate-300/50"
                  required
                />
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
            ))}

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
                required
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-white/90">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-lg transition-transform active:scale-95"
              disabled={loading}
            >
              {loading ? "Logging in..." : <><LogIn className="w-4 h-4" /> Login</>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/80">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-white font-semibold underline-offset-2 hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
