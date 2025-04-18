import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

const AuthSuccessAlert = () => {
  const { authSuccess, setAuthSuccess } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [lastAlert, setLastAlert] = useState(0);

  useEffect(() => {
    if (!authSuccess || !authSuccess.message) return;

    const currentTime = Date.now();

    if (authSuccess.errorCount > 1 && currentTime - lastAlert < 5000) return;
    if (!authSuccess.errorCount && currentTime - lastAlert < 2000) return;

    setShowAlert(true);
    setLastAlert(currentTime);

    setTimeout(() => {
      setAuthSuccess(null);
      setShowAlert(false);
    }, 1500);
  }, [authSuccess, lastAlert]);

  if (!authSuccess || !authSuccess.message || !showAlert) return null;

  return (
    <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 rounded-[12px] overflow-hidden z-50 text-[18px] font-semibold">
      <div
        className={`p-4 min-w-[275px] text-white border-white text-center ${
          authSuccess.success ? "bg-green-800" : "bg-red-800"
        }`}
      >
        <p className="max-w-[300px]">{authSuccess.message}</p>
        <span className="absolute bottom-0 left-0 w-full h-[4px] bg-white animate-borderShrink rounded-[12px]"></span>
      </div>
    </div>
  );
};

export default AuthSuccessAlert;
