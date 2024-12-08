import express, { json } from "express";
import cors from "cors";
import { port } from "./config.js";
import connectToMongoDB from "./src/database/connectToDB.js";
import userRouter from "./src/router/userRouter.js";
import taskRouter from "./src/router/taskRouter.js";
import { checkOverdueTasks } from "./src/cron/overdueTasks.js";

// Create an Express application instance
const expressApp = express();

// Start the server and listen on the specified port
expressApp.listen(port, () => {
  console.log(`Express application is listening at port ${port}`);
});

// Connect to MongoDB database
connectToMongoDB();

// Serve static files from the "public" directory
expressApp.use(express.static("public"));

// Middleware to parse JSON request bodies
expressApp.use(json());

// Enable Cross-Origin Resource Sharing (CORS)
expressApp.use(cors());

checkOverdueTasks();

// Connect application routes
// The userRouter will handle requests starting from the root ("/").
expressApp.use("/", userRouter);
// The taskRouter will handle requests starting from the root ("/task").
expressApp.use("/task", taskRouter);
