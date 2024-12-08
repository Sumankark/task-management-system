import { User } from "../schema/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secretKey } from "../../config.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ userName, email, password: hashedPassword });
    const result = await newUser.save();

    // send email with link
    // generate token
    let infoObj = {
      _id: result._id,
    };
    let expireInfo = {
      expiresIn: "5d",
    };

    let token = jwt.sign(infoObj, secretKey, expireInfo);
    // link=> frontend link
    // send mail
    await sendEmail({
      from: "'Houseobj'<karkisuman0627@gmail.com>",
      to: result.email,
      subject: "account create",
      html: `
                <h1> Your account  has been created successfully </h1>
    
                <a href="http://localhost:3000/verify-email?token=${token}">http://localhost:3000/verify-email?token=${token}</a>
                `,
    });

    res.status(200).json({
      success: true,
      message: "Webuser created successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];
    // verify token

    let infoObj = jwt.verify(token, secretKey);

    let userId = infoObj._id;

    let result = await User.findByIdAndUpdate(
      userId,
      { isVerifiedEmail: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User verified successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate JWT
    const infoObj = {
      id: user.id,
    };

    const expireInfo = {
      expiresIn: "30d",
    };

    const token = jwt.sign(infoObj, secretKey, expireInfo);

    res.status(200).json({
      success: true,
      message: "User Login successfully.",
      result: user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
