export const getAuthFields = ({ mode, revealPassword }) => {
  const isSignUp = mode === "signup";
  const isLogIn = mode === "login";
  const isProfile = mode === "profile";

  return [
    {
      inputName: "userName",
      inputDescr: "Username",
      type: "text",
      placeholder: "Enter your username"
    },
    isSignUp && {
      inputName: "userEmail",
      inputDescr: "Email",
      type: "text",
      placeholder: "Enter your email"
    },
    {
      inputName: "password",
      inputDescr: "Password",
      type: revealPassword ? "text" : "password",
      placeholder: "Enter your password"
    },
    isSignUp && {
      inputName: "repeatedPassword",
      inputDescr: "",
      type: revealPassword ? "text" : "password",
      placeholder: "Repeat your password"
    }
  ].filter(Boolean);
};

export const getProfileFields = () => {
  return [
    {
      inputName: "userName",
      inputDescr: "Username",
      type: "text",
      placeholder: "Enter your username"
    },
    {
      inputName: "userEmail",
      inputDescr: "Email",
      type: "text",
      placeholder: "Enter your email"
    }
  ];
};
