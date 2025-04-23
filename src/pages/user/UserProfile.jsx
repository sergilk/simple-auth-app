import { useState, useEffect, useCallback, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  getErrorMessage,
  validateUserInputs,
  getDataFromInput,
  API_URL
} from "@utils";
import { getProfileFields } from "@data";
import FormContainer from "@components/layout/FormContainer";
import { FormInput, ActionButton, Loading } from "@ui";

const UserProfile = () => {
  const { setAuthSuccess } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    userName: localStorage.getItem("userName"),
    userEmail: localStorage.getItem("userEmail")
  });
  const [serverData, setServerData] = useState({
    regDate: localStorage.getItem("regDate"),
    totalUsers: localStorage.getItem("totalUsers")
  });
  const [customErrors, setCustomErrors] = useState({
    errorCount: 0,
    errorMessage: ""
  });
  const [isFieldEditing, setIsFieldEditing] = useState({
    userName: false,
    userEmail: false
  });

  useEffect(() => {
    document.title = `Welcome ${data.userName}!`;
  }, [data.userName]);

  const fieldError = useMemo(() => {
    return validateUserInputs({
      userName: data.userName,
      userEmail: data.userEmail,
      password: "",
      repeatedPassword: "",
      mode: "profile",
      isFrontEnd: true
    });
  }, [data.userName, data.userEmail]);

  const getUserData = useCallback(async () => {
    try {
      const response = await fetch(API_URL("/user/profile"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        setData(prev => ({
          ...prev,
          userName: result.userName,
          userEmail: result.userEmail
        }));
        setServerData(prev => ({
          ...prev,
          regDate: result.regDate,
          totalUsers: result.totalUsers
        }));
      }

      if (!response.ok) {
        console.error("Failed to fetch user profile.", result.message);
        if (result.isTokenValid === false || result.status === 401) {
          setAuthSuccess({
            success: false,
            message: "Your session has expired. Redirecting to login..."
          });
          navigate("/session-expired");
          return;
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [token]);

  const handleSave = useCallback(
    async input => {
      try {
        const response = await fetch(API_URL("/user/profile"), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userName: data.userName,
            userEmail: data.userEmail
          })
        });

        const result = await response.json();

        if (response.ok) {
          setData(prev => ({
            ...prev,
            userName: result.userName,
            userEmail: result.userEmail,
            regDate: result.regDate,
            totalUsers: result.totalUsers
          }));
          localStorage.setItem("userName", result.userName);
          localStorage.setItem("userEmail", result.userEmail);

          setIsFieldEditing(prev => ({
            ...prev,
            [input]: false
          }));

          setAuthSuccess({
            success: true,
            message: "Profile updated successfully!"
          });
        }

        if (!response.ok) {
          setIsFieldEditing(prev => ({
            ...prev,
            [input]: true
          }));
          setCustomErrors(prev => ({
            ...prev,
            errorCount: prev.errorCount + 1,
            errorMessage: result.message
          }));
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    [data.userName, data.userEmail, token]
  );

  const saveNewValue = input => {
    const currentValue = localStorage.getItem(input);
    const newValue = data[input];

    if (currentValue === newValue) {
      setIsFieldEditing(prev => ({
        ...prev,
        [input]: false
      }));
      return;
    }

    if (fieldError[input]) {
      const fieldName =
        {
          userName: "Username",
          userEmail: "Email"
        }[input] || input;

      setAuthSuccess({
        success: false,
        message: `First, fix the error in the "${fieldName}" field.`
      });
      return;
    }

    handleSave(input);
  };

  const toggleButton = input => {
    setIsFieldEditing(prev => ({
      ...prev,
      [input]: !prev[input]
    }));
  };

  const userLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("regDate");
    localStorage.removeItem("totalUsers");
  };

  useEffect(() => {
    if (customErrors.errorCount > 0 && customErrors.errorMessage) {
      setAuthSuccess({
        success: false,
        message: customErrors.errorMessage,
        errorCount: customErrors.errorCount
      });
    }
  }, [customErrors]);

  useEffect(() => {
    if (!token) return;

    if (token) {
      getUserData();
    }

    const intervalId = setInterval(() => {
      getUserData();
    }, 62000); // every 62s this timer checks token validity and refresh user data if token valid

    return () => clearInterval(intervalId);
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const profileFields = getProfileFields();

  return (
    <FormContainer>
      <h2 className="text-center text-lg font-semibold border-b-2 border-gray-700">
        User profile
      </h2>
      <div className="grid gap-2">
        <h2 className="text-amber-50 border-b-1 border-gray-700">Stats</h2>
        <div className="flex flex-col bg-gray-800 p-2 rounded-lg text-[16px]">
          <div className="text-gray-400 flex">
            Total users: {serverData.totalUsers ?? <Loading />}
          </div>
          <div className="text-gray-400 flex">
            Registration date: {serverData.regDate ?? <Loading />}
          </div>
        </div>
      </div>
      <h2 className="text-amber-50 text-lg border-b-1 border-gray-700">
        User data
      </h2>
      <div className="grid gap-10">
        {profileFields.map(
          ({ inputName, inputDescr, type, placeholder }, index) => {
            return (
              <div key={index} className="relative bg-gray-800 pr-2 rounded-lg">
                <h3 className="absolute -top-3 left-2.5 bg-gray-800 px-2 font-bold text-xs rounded">
                  {inputDescr}
                </h3>
                <div className="flex items-center gap-2">
                  <FormInput
                    name={inputName}
                    type={type}
                    placeholder={placeholder}
                    value={data[inputName]}
                    onChange={e => getDataFromInput(e, setData)}
                    disabled={!isFieldEditing[inputName]}
                  />
                  <ActionButton
                    className="w-[80px] h-[41px] bg-red-400 hover:bg-red-600 focus:ring-red-300"
                    onClick={() =>
                      isFieldEditing[inputName]
                        ? saveNewValue(inputName)
                        : toggleButton(inputName)
                    }
                    btnDescr={isFieldEditing[inputName] ? "Save" : "Edit"}
                  />
                </div>
                <div className="relative">
                  {fieldError[inputName] && (
                    <span className="absolute top-0 left-0 px-1 text-red-400 font-semibold text-[13px]">
                      {getErrorMessage(fieldError[inputName], inputName)}
                    </span>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
      <div className="flex justify-center mt-3">
        <ActionButton
          to="/"
          onClick={userLogOut}
          className="bg-red-400 hover:bg-red-600 focus:ring-red-300 rounded-lg w-full"
          btnDescr="Log out"
        />
      </div>
    </FormContainer>
  );
};

export default UserProfile;
