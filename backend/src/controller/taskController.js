import { Task } from "../schema/model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      createdBy: req.user.id, // User ID from the token
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: "task Created Successfully.",
      result: savedTask,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: err.message,
    });
  }
};

export const getAllTask = async (req, res) => {
  try {
    // Extract query parameters with default values
    const { page = 1, limit = 10, search = "", status } = req.query;

    // Initialize the query object for MongoDB
    const query = { createdBy: req.user?.id }; // Ensure `req.user` exists

    // Add search and status filters
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (status) {
      query.status = status;
    }

    // Calculate pagination offsets
    const skip = (+page - 1) * +limit; // Convert page and limit to numbers

    // Fetch tasks with filtering, sorting, and pagination
    const tasks = await Task.find(query)
      .sort({ dueDate: 1 }) // Sort by dueDate in ascending order
      .skip(skip)
      .limit(+limit);

    // Fetch total count of tasks matching the query
    const totalTasks = await Task.countDocuments(query);

    // Send response
    res.status(200).json({
      success: true,
      message: "read all task successfully.",
      result: tasks,
      totalPages: Math.ceil(totalTasks / +limit), // Calculate total pages
      currentPage: +page,
    });
  } catch (err) {
    // Handle and log errors
    console.error("Error fetching tasks:", err); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: err.message || "An unexpected error occurred",
    });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.createdBy.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task get Successfully.",
      result: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: err.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task || task.createdBy.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized",
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task Update Successfully.",
      result: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: err.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.createdBy.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized",
      });
    }

    await task.remove();
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: err.message,
    });
  }
};
