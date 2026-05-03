import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManagerDashboard from "./pages/ManagerDashboard";
import StaffDashboard from "./pages/StaffDashboard";

const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={user.role === "MANAGER" ? "/manager" : "/staff"} />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/manager"
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;