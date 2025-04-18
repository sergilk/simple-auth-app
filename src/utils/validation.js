export const validationRules = {
  minLength: 6,
  userNameRegex: /^[A-Za-z0-9]+$/,
  userEmailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
  passwordRegex: {
    basic: /^[A-Za-z0-9!@#$%^&*.,?"|<>]+$/,
    special: /[!@#$%^&*.,?"|<>]/,
    upper: /[A-Z]/
  }
};

export function validateUserInputs({
  userName,
  userEmail,
  password,
  repeatedPassword,
  mode = "signup",
  isFrontEnd = false
}) {
  const {
    minLength,
    userNameRegex,
    userEmailRegex,
    passwordRegex: { basic, special, upper }
  } = validationRules;

  const isSignUp = mode === "signup";
  const isLogIn = mode === "login";
  const isProfile = mode === "profile";

  return {
    emptyFields:
      !userName || !password || (isSignUp && (!repeatedPassword || !userEmail)),
    userName: isFrontEnd
      ? (isSignUp || isProfile) &&
        userName &&
        (userName.length < minLength || !userNameRegex.test(userName))
      : userName.length < minLength || !userNameRegex.test(userName),
    userEmail: isFrontEnd
      ? (isSignUp || isProfile) && userEmail && !userEmailRegex.test(userEmail)
      : !userEmailRegex.test(userEmail),
    password: isFrontEnd
      ? isSignUp && {
          length: password && password.length < minLength,
          basic: password && !basic.test(password),
          special: password && !special.test(password),
          upper: password && !upper.test(password),
          repeated: password && password !== repeatedPassword
        }
      : {
          length: password.length < minLength,
          basic: !basic.test(password),
          special: !special.test(password),
          upper: !upper.test(password),
          repeated: password !== repeatedPassword
        },
    repeatedPassword: isFrontEnd
      ? isSignUp &&
        repeatedPassword &&
        (!basic.test(repeatedPassword) || password !== repeatedPassword)
      : !basic.test(repeatedPassword) || password !== repeatedPassword
  };
}

export const getErrorMessage = (fieldError, inputName) => {
  if (!fieldError) return null;

  if (inputName === "password") {
    const passwordErrors = [
      {
        error: fieldError.length,
        message: "Minimum password length is 6 characters."
      },
      {
        error: fieldError.basic,
        message:
          'Only Latin, Digit 0-9 and Symbol characters. Example: ! @ # $ % ^ & * . , ? " < | >'
      },
      {
        error: fieldError.special,
        message:
          "Password should contain at least one special symbol. Example: ! @ # $ % ^ & * . , ?"
      },
      {
        error: fieldError.upper,
        message: "Password should contain at least one uppercase character."
      }
    ];

    for (const { error, message } of passwordErrors) {
      if (error) return message;
    }
  }

  const errorMessage = {
    userName: "Minimum 6 characters, only Latin and digit characters.",
    userEmail: "Invalid email format. Example: user@example.com",
    repeatedPassword: "Your passwords don't match. Please check both fields."
  };

  return errorMessage[inputName] || null;
};
