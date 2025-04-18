import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  getDataFromInput,
  formattedDate,
  getErrorMessage,
  validateUserInputs
} from "@utils";
import { getAuthFields } from "@data";
import FormContainer from "@components/layout/FormContainer";
import { FormInput, ActionButton, BackButton, RevealPassword } from "@ui";

const AuthForm = ({ type = "login" }) => {
  const { setAuthSuccess } = useAuth();
  const navigate = useNavigate();
  const isSignUp = type === "signup";

  const [data, setData] = useState({
    userName: "",
    userEmail: "",
    password: "",
    repeatedPassword: ""
  });
  const [revealPassword, setRevealPassword] = useState(false);
  const [customErrors, setCustomErrors] = useState({
    errorCount: 0,
    errorMessage: ""
  });

  const fieldError = useMemo(() => {
    return validateUserInputs({
      userName: data.userName,
      userEmail: data.userEmail,
      password: data.password,
      repeatedPassword: data.repeatedPassword,
      mode: isSignUp ? "signup" : "login",
      isFrontEnd: true
    });
  }, [
    data.userName,
    data.userEmail,
    data.password,
    data.repeatedPassword,
    isSignUp
  ]);

  const someFormErrors = fieldError.emptyFields || fieldError.userName;

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (someFormErrors) {
        setAuthSuccess({
          success: false,
          message: `${
            isSignUp
              ? "Please fill up signup fields or fix validation errors before submit."
              : "Please fill up login fields before submit."
          }`
        });
        return;
      }

      const { URL, requestData, AuthAction } = isSignUp
        ? {
            URL: "http://localhost:3000/API/signup",
            requestData: {
              userName: data.userName,
              userEmail: data.userEmail,
              password: data.password,
              repeatedPassword: data.repeatedPassword,
              regDate: formattedDate
            },
            AuthAction: () => {
              setData({
                userName: "",
                userEmail: "",
                password: "",
                repeatedPassword: ""
              });
              navigate("/login");
            }
          }
        : {
            URL: "http://localhost:3000/API/login",
            requestData: {
              userName: data.userName,
              password: data.password
            },
            AuthAction: result => {
              sessionStorage.setItem("userName", result.userName);
              sessionStorage.setItem("userEmail", result.userEmail);
              sessionStorage.setItem("token", result.token);
              navigate("/user");
            }
          };

      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok) {
          setAuthSuccess({
            success: true,
            message: result.message,
            type: isSignUp ? "signup" : "login"
          });

          AuthAction(result);
        }

        if (!response.ok) {
          setCustomErrors(prev => ({
            ...prev,
            errorCount: prev.errorCount + 1,
            errorMessage: result.message
          }));
        }
      } catch (error) {
        console.error("Error during authentication:", error.message);
      }
    },
    [
      data.userName,
      data.userEmail,
      data.password,
      data.repeatedPassword,
      isSignUp,
      setAuthSuccess,
      navigate,
      fieldError
    ]
  );

  useEffect(() => {
    if (customErrors.errorCount > 0 && customErrors.errorMessage) {
      setAuthSuccess({
        success: false,
        message: customErrors.errorMessage,
        type: isSignUp ? "signup" : "login",
        errorCount: customErrors.errorCount
      });
    }
  }, [customErrors]);

  const authFields = getAuthFields({
    mode: isSignUp ? "signup" : "login",
    revealPassword
  });

  return (
    <FormContainer>
      <BackButton to="/" />
      <h2 className="text-center text-lg font-semibold border-b-2 border-gray-700">
        {isSignUp ? "Registration form" : "Login form"}
      </h2>
      <div className="flex flex-col gap-10">
        {authFields.map(
          ({ inputName, inputDescr, type, placeholder }, index) => {
            const isPasswordField =
              inputName === "password" || inputName === "repeatedPassword";

            return (
              <div key={index} className="relative">
                <p className="text-sm">
                  {inputDescr}
                  {inputDescr ? <span className="text-red-500">*</span> : ""}
                </p>
                <FormInput
                  name={inputName}
                  type={type}
                  placeholder={placeholder}
                  value={data[inputName]}
                  onChange={e => getDataFromInput(e, setData)}
                />
                <div className="relative">
                  {fieldError[inputName] && (
                    <span className="absolute top-0 left-0 px-1 text-red-400 font-semibold text-[13px]">
                      {getErrorMessage(fieldError[inputName], inputName)}
                    </span>
                  )}
                </div>
                {isPasswordField && (
                  <RevealPassword
                    onClick={() => setRevealPassword(!revealPassword)}
                  />
                )}
              </div>
            );
          }
        )}
      </div>
      <div className="flex justify-center">
        <ActionButton
          onClick={handleSubmit}
          btnDescr={isSignUp ? "Sign Up" : "Log in"}
        />
      </div>
    </FormContainer>
  );
};

export default AuthForm;
