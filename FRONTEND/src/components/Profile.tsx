import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Lock, ChevronLeft, Shield, LogOut, Save, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { User } from "../types/types";
import {
  INPUT_WRAPPER,
  FULL_BUTTON,
  SECTION_WRAPPER,
  BACK_BUTTON,
  DANGER_BTN,
  personalFields,
  securityFields,
} from "../assets/dummy";

const API_URL = "http://localhost:5000";

interface ProfileData {
  name: string;
  email: string;
  [key: string]: string;
}

interface PasswordsData {
  current: string;
  new: string;
  confirm: string;
  [key: string]: string;
}

interface ProfileProps {
  user: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ setCurrentUser, onLogout }) => {
  const [profile, setProfile] = useState<ProfileData>({ name: "", email: "" });
  const [passwords, setPasswords] = useState<PasswordsData>({ current: "", new: "", confirm: "" });
  const navigate = useNavigate();

  // Load current user
  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/me`, { withCredentials: true }) // ✅ send cookie
      .then(({ data }) => {
        if (data.success) setProfile({ name: data.user.username, email: data.user.email });
        else toast.error(data.message);
      })
      .catch(() => toast.error("Unable to load profile."));
  }, []);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { username: profile.name, email: profile.email }, // backend expects username
        { withCredentials: true } // ✅ send cookie
      );
      if (data.success) {
        setCurrentUser((prev: any) => ({
          ...prev,
          username: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`,
        }));
        toast.success("Profile updated");
      } else toast.error(data.message);
    } catch (err: unknown) {
      let msg = "Profile update failed";
      if (axios.isAxiosError(err)) msg = err.response?.data?.message || msg;
      else if (err instanceof Error) msg = err.message;
      toast.error(msg);
    }
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match");

    try {
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        { currentpassword: passwords.current, newpassword: passwords.new },
        { withCredentials: true } // ✅ send cookie
      );
      if (data.success) {
        toast.success("Password changed");
        setPasswords({ current: "", new: "", confirm: "" });
      } else toast.error(data.message);
    } catch (err: unknown) {
      let msg = "Password change failed";
      if (axios.isAxiosError(err)) msg = err.response?.data?.message || msg;
      else if (err instanceof Error) msg = err.message;
      toast.error(msg);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/user/logout`, {}, { withCredentials: true }); // ✅ send cookie
      onLogout();
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-gray-500 text-sm">Manage your profile and security settings</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={handleProfileChange}
                    className="w-full text-sm focus:outline-none"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </section>

          {/* Security */}
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Lock className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type="password"
                    name={name}
                    placeholder={placeholder}
                    value={passwords[name]}
                    onChange={handlePasswordChange}
                    className="w-full text-sm focus:outline-none"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Shield className="w-4 h-4" /> Change Password
              </button>

              {/* Danger Zone */}
              <div className="mt-8 pt-6 border-t border-purple-100">
                <h3 className="text-red-600 font-semibold mb-4 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Danger Zone
                </h3>
                <button onClick={handleLogout} className={DANGER_BTN}>
                  Logout
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
