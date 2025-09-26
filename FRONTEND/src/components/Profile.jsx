import { useState, useEffect } from "react"
import axios from "axios"
import { Lock, ChevronLeft, Shield, LogOut, Save, UserCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { INPUT_WRAPPER, FULL_BUTTON, SECTION_WRAPPER, BACK_BUTTON, DANGER_BTN, personalFields, securityFields } from '../assets/dummy'

const API_URL = "http://localhost:5000"

export default function Profile({ setCurrentUser, onLogout }) {
  const [profile, setProfile] = useState({ username: "", email: "" })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const navigate = useNavigate()

  // Fetch current user
  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/me`, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) setProfile({ username: data.user.username, email: data.user.email })
        else toast.error(data.message)
      })
      .catch(() => toast.error("Unable to load profile."))
  }, [])

  // Save profile
  const saveProfile = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { username: profile.username, email: profile.email },
        { withCredentials: true }
      )
      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          username: profile.username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`,
        }))
        toast.success("Profile updated")
      } else toast.error(data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed")
    }
  }

  // Change password
  const changePassword = async (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match")

    try {
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        { currentpassword: passwords.current, newpassword: passwords.new },
        { withCredentials: true }
      )
      if (data.success) {
        toast.success("Password changed")
        setPasswords({ current: "", new: "", confirm: "" })
      } else toast.error(data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed")
    }
  }

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/user/logout`, {}, { withCredentials: true })
      onLogout()
      navigate("/signin")
    } catch (err) {
      toast.error("Logout failed")
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-6 text-[#F0F0F5]">
        <button onClick={() => navigate(-1)} className={`${BACK_BUTTON} cursor-pointer text-[#F0F0F5] hover:text-[#FF6EC7]`}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6A0DAD] to-[#FF6EC7] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.username ? profile.username[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#F0F0F5]">Account Settings</h1>
            <p className="text-[#A0A0B0] text-sm">Manage your profile and security settings</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <section className={`${SECTION_WRAPPER} bg-[#2C2C3C] p-6 rounded-xl shadow-md`}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-[#FF6EC7] w-5 h-5" />
              <h2 className="text-xl font-semibold text-[#F0F0F5]">Personal Information</h2>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className="text-[#FF6EC7] w-5 h-5 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) => setProfile({ ...profile, [name]: e.target.value })}
                    className="w-full text-sm focus:outline-none text-[#F0F0F5] placeholder-[#A0A0B0] px-3 py-2 rounded-md"
                    required
                  />
                </div>
              ))}
              <button className={`${FULL_BUTTON} cursor-pointer bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white`}>
                <Save className="w-4 h-4 mr-1" /> Save Changes
              </button>
            </form>
          </section>

          {/* Security */}
          <section className={`${SECTION_WRAPPER} bg-[#2C2C3C] p-6 rounded-xl shadow-md`}>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-[#FF6EC7] w-5 h-5" />
              <h2 className="text-xl font-semibold text-[#F0F0F5]">Security</h2>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Lock className="text-[#FF6EC7] w-5 h-5 mr-2" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={passwords[name]}
                    onChange={(e) => setPasswords({ ...passwords, [name]: e.target.value })}
                    className="w-full text-sm focus:outline-none  text-[#F0F0F5] placeholder-[#A0A0B0] px-3 py-2 rounded-md"
                    required
                  />
                </div>
              ))}
              <button className={`${FULL_BUTTON} cursor-pointer bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white`}>
                <Shield className="w-4 h-4 mr-1" /> Change Password
              </button>

              <div className="mt-8 pt-6 border-t border-[#6A0DAD]/30">
                <h3 className="text-[#FF6EC7] font-semibold mb-4 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Danger Zone
                </h3>
                <button onClick={handleLogout} className={`${DANGER_BTN} cursor-pointer bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white`}>
                  Logout
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
