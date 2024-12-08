import { model } from "mongoose";
import userSchema from "./userschema.js";
import taskSchema from "./taskSchema.js";

export const User = model("User", userSchema);
export const Task = model("Task", taskSchema);
