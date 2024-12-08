import React, { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "../component/types";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/tasks`, {
        params: { page, search, status: statusFilter },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data.result);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    try {
      await axios.post(`http://localhost:8080/tasks`, newTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsModalOpen(false);
      fetchTasks(); // Refresh the tasks list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, search, statusFilter]);

  return (
    <div className="font-sans p-5">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Dashboard</h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks"
          className="p-2 border border-gray-300 rounded w-1/3 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border border-gray-300 mb-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm mt-2">
              <span className="font-medium">Status:</span> {task.status}
            </p>
            <p className="text-sm">
              <span className="font-medium">Due Date:</span> {task.dueDate}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Add Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Add New Task
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="overdue">On Progress</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded mr-2 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
