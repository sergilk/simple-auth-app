import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authSuccess, setAuthSuccess] = useState(null);

  return (
    <AuthContext.Provider value={{ authSuccess, setAuthSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
