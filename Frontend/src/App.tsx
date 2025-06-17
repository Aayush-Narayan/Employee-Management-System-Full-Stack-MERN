import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import DarkModeToggle from "./components/DarkModeToggle";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import DashboardNavigation from "./components/DashboardNavigation";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <DarkModeToggle />
        </div>{" "}
        <Routes>
          <Route path="/" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ForgetPassword" element={<ForgotPassword />} />
          <Route path="/DashboardNavigation" element={<DashboardNavigation />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
