import { useNavigate } from "react-router-dom";
import { Zap, Settings, ChevronDown, LogOut } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface NavbarProps {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const menuref = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuref.current && !menuref.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard accessibility for dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMenuToggle();
    }
    if (e.key === "Escape") {
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer gap-2 group"
          onClick={() => navigate("/")}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl 
             bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 
             shadow-lg shadow-purple-500/30
             transition-all duration-300 ease-out 
             hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/40
             hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500">
            <Zap className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-3 h-3 shadow-md animate-ping" />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">
            Taskora
          </span>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full"
            onClick={() => navigate("/profile")}
          >
            <Settings className="w-5 h-5" />
          </button>

          <div ref={menuref} className="relative">
            <button
              onClick={handleMenuToggle}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-200"
            >
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="h-9 w-9 shadow-sm rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-md">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 bg-green-200 rounded-full animate-pulse -right-0.5 w-3 h-3 border-2 border-white" />
              </div>

              <div className="text-left hidden md:block">
                <p className="text-sm text-gray-800 font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 font-normal">{user.email}</p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <ul className="absolute top-14 right-0 bg-white w-56 rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fadeIn">
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 text-sm text-gray-700 transition-colors flex items-center gap-2"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-gray-700" />
                    Profile Setting
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full gap-2 rounded-lg text-sm hover:bg-red-50 text-red-600 px-3 py-2 items-center"
                  >
                    <LogOut className="w-4 h-4" />
                    LogOut
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
