import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, 5000);
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-red-500 font-bold text-lg">
        Session expired: Your login token is no longer valid.
      </h2>
      <p className="after:animate-dots">Redirecting in 5 seconds</p>
    </div>
  );
};

export default SessionExpired;
