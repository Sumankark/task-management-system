import { Schema } from "mongoose";

const userSchema = Schema(
  {
    userName: {
      type: String,
      required: [true, "userName field is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email field is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password field is required."],
    },
    isVerifiedEmail: {
      type: String,
      required: [true, "isVerifiedEmail field is required."],
      default: false,
    },
  },
  { timestamps: true }
);

export default userSchema;
