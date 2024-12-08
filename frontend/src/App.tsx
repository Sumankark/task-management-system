import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyUser from "./pages/Verify";
import DashBoard from "./pages/DashBoard";
import AddTaskForm from "./component/AddTask";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyUser />} />
        <Route path="/" element={<DashBoard />} />
        <Route path="/create-task" element={<AddTaskForm />} />
        <Route path="/edit-task/:taskId" element={<AddTaskForm />} />
      </Routes>
    </div>
  );
}

export default App;
