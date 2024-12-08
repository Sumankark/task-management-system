import cron from "node-cron";
import { Task } from "../schema/model.js";

export const checkOverdueTasks = () => {
  // Schedule the job to run every hour at the start of the hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running Overdue Task Check...");
    const now = new Date();

    try {
      // Find tasks that are overdue and not completed
      const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        status: { $ne: "completed" },
      });

      // Log each overdue task
      overdueTasks.forEach((task) => {
        console.log(`Task [${task.title}] is overdue!`);
      });

      if (overdueTasks.length === 0) {
        console.log("No overdue tasks found.");
      }
    } catch (err) {
      console.error("Error checking overdue tasks:", err.message);
    }
  });
};
