import { useState, useRef, useEffect } from "react"
import { Settings, ChevronDown, LogOut, ClipboardCheck, Bell, Lock, Activity } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Navbar = ({ user = {}, onLogout, unreadNotifications = 0, loadingUser = false }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const handleMenuToggle = () => setMenuOpen(prev => !prev)
  const handleLogout = () => {
    setMenuOpen(false)
    onLogout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  // Generate gradient color fallback based on user name
  const getGradient = (name) => {
    if (!name) return "from-[#6A0DAD] to-[#FF6EC7]"
    const colors = [
      "from-[#6A0DAD] to-[#FF6EC7]",
      "from-[#FF6EC7] to-[#6A0DAD]",
      "from-[#8A2BE2] to-[#FF69B4]"
    ]
    return colors[name.charCodeAt(0) % colors.length]
  }

  return (
    <header className="sticky top-0 z-50 bg-[#2C2C3C]/90 backdrop-blur-md shadow-sm border-b border-[#6A0DAD] font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* Left - Logo + Brand */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
          <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${getGradient(user.username)} shadow-lg group-hover:shadow-[#FF6EC7]/50 group-hover:scale-105 transition-all duration-300`}>
            <ClipboardCheck className="w-6 h-6 text-white" />
          
          </div>

          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] bg-clip-text text-transparent tracking-wide">
            Taskora
          </span>
        </div>

        {/* Right - User Controls */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative cursor-pointer p-2 rounded-full hover:bg-[#6A0DAD]/20 transition-colors">
            <Bell className="w-5 h-5 text-[#F0F0F5]" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>

          {/* Settings Button */}
          <button
            className="p-2 text-[#F0F0F5] hover:text-[#FF6EC7] transition-colors duration-300 hover:bg-[#6A0DAD]/20 rounded-full"
            onClick={() => navigate("/profile")}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-[#6A0DAD]/20 transition-colors duration-300 border border-transparent hover:border-[#FF6EC7]"
            >
              <div className="relative">
                {loadingUser ? (
                  <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
                ) : user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6A0DAD] to-[#FF6EC7] shadow-sm"
                  />
                ) : (
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${getGradient(user.username)} text-white font-semibold shadow-md`}>
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#2C2C3C] animate-pulse" />
              </div>

              <div className="text-left md:block hidden">
                <p className="text-sm font-medium text-[#F0F0F5]">{user.username || "Guest User"}</p>
                <p className="text-xs text-[#A0A0B0] font-normal">{user.email || "user@taskflow.com"}</p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-[#F0F0F5] transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <ul className="absolute top-14 right-0 w-60 bg-[#2C2C3C] rounded-2xl shadow-xl border border-[#6A0DAD] z-50 overflow-hidden animate-fadeIn">
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/profile")
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#6A0DAD]/20 text-sm text-[#F0F0F5] transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-[#FF6EC7]" />
                    Profile Settings
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/profile")
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#6A0DAD]/20 text-sm text-[#F0F0F5] transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-[#FF6EC7]" />
                    Change Password
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/activity-log")
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#6A0DAD]/20 text-sm text-[#F0F0F5] transition-colors flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-[#FF6EC7]" />
                    Activity Log
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[#FF4C61]/20 text-[#FF4C61]"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
