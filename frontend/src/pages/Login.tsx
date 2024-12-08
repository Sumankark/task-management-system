import React, { useState } from "react";
import { hitApi } from "../service/hitApi";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  // Handle input changes and update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validateForm = (): string | null => {
    if (!formData.email) return "email is required.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError); // Show error toast if validation fails
      return;
    }

    try {
      const response = await hitApi.post("/login", formData);

      console.log(response);
      if (response.status === 200) {
        const token = response.data.resulttoken;
        localStorage.setItem("token", token);
        toast.success("Login successful!"); // Show success toast

        navigate("/");
      } else {
        setError("Login failed.");
        toast.error("Login failed."); // Show error toast on failure
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in.");
      toast.error("Error logging in."); // Show error toast in case of API failure
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
          Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}{" "}
        {/* Display error message */}
        <div className="mb-4">
          <input
            name="email"
            type="text"
            placeholder="email"
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
        >
          Login
        </button>
        <div className="text-center mt-2">
          <p>
            Can't have an account?{" "}
            <Link to={"/signup"} className="font-semibold">
              SignUp
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
