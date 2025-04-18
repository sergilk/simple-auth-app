import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AppContainer from "@components/layout/AppContainer.jsx";
import { AuthSuccessAlert } from "@ui";
import { StarterPage, AuthForm, UserProfile, SessionExpired } from "@pages";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthSuccessAlert />
        <AppContainer>
          <Routes>
            <Route path="/" element={<StarterPage />} />
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/registration" element={<AuthForm type="signup" />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/session-expired" element={<SessionExpired />} />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}
export default App;
