import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { usersDB } from "../../data/usersDB.js";
import { SECRET_KEY } from "../config/env.js";
import { validateUserInputs } from "../../utils/validation.js";

const generateToken = user => {
  return jwt.sign(
    {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      regDate: user.regDate
    },
    SECRET_KEY,
    { expiresIn: "10m" } // after this time, the user will be automatically deauthorized
  );
};

export const signUp = async (req, res) => {
  const { userName, password, repeatedPassword, userEmail, regDate } = req.body;

  try {
    const userExists = usersDB.find(
      u => u.userName === userName || u.userEmail === userEmail
    );

    const fieldError = validateUserInputs({
      userName,
      userEmail,
      password,
      repeatedPassword,
      mode: "signup",
      isFrontEnd: false
    });

    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    if (fieldError.emptyFields) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (
      fieldError.userName ||
      fieldError.userEmail ||
      fieldError.password.basic ||
      fieldError.password.length ||
      fieldError.password.special ||
      fieldError.password.upper ||
      fieldError.password.repeated ||
      fieldError.repeatedPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Rejected. Some fields do not meet the required format."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      userId: uuidv4(),
      userName,
      password: hashedPassword,
      userEmail,
      regDate
    };
    usersDB.push(newUser);

    res.json({
      success: true,
      message: "Registration successful",
      token: generateToken(newUser),
      userName: newUser.userName,
      userEmail: newUser.userEmail,
      regDate: newUser.regDate
    });
  } catch (error) {
    console.log("Error during signup:", error.message);
  }
};

export const logIn = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = usersDB.find(u => u.userName === userName);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      userName: user.userName,
      userEmail: user.userEmail,
      regDate: user.regDate
    });
  } catch (error) {
    console.log("Error during login:", error.message);
  }
};
