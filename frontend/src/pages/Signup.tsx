import React, { useState } from "react";
import { hitApi } from "../service/hitApi";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validate form inputs
  const validateForm = () => {
    if (!formData.email.includes("@")) return "Invalid email format.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (!formData.userName) return "Username is required.";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError); // Show validation error toast
      return;
    }

    setIsLoading(true);

    try {
      const response = await hitApi.post("/create-user", formData);

      if (response.status === 200) {
        toast.success(
          "Signup successful! click on the link on your email to verify its you."
        );
      } else {
        toast.error("Signup failed.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error signing up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      {/* ToastContainer renders the toasts */}
      <ToastContainer />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Signup
        </h2>

        <div className="mb-4">
          <input
            name="userName"
            type="text"
            placeholder="Username"
            value={formData.userName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Signup"}
        </button>
        <div className="text-center mt-2">
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="font-semibold">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
