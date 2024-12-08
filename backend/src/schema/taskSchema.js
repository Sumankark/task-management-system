import { Schema } from "mongoose";
import mongoose from "mongoose";

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "title field is required."],
    },
    description: {
      type: String,
      required: [true, "description field is required."],
    },
    dueDate: {
      type: Date,
      required: [true, "dueDate field is required."],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy field is required."],
    },
  },
  { timestamps: true }
);

export default taskSchema;
