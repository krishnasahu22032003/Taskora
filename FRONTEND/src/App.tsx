import { useState } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

const App: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center">
      {mode === "signup" ? (
        <SignUp onSwitchMode={() => setMode("login")} />
      ) : (
        <Login onSwitchMode={() => setMode("signup")} />
      )}
    </div>
  );
};

export default App;
