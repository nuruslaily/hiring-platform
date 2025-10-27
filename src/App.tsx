import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobPages from "./pages/JobPages";
import ManageJobPage from "./pages/ManageJobPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import ApplyPage from "./pages/ApplyPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Auth Pages --- */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          }
        />

        {/* --- Protected Pages (pakai ProtectedRoute) --- */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/manage/:id"
          element={
            <ProtectedRoute>
              <ManageJobPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute>
              <ApplyPage />
            </ProtectedRoute>
          }
        />

        {/* --- Default Redirects --- */}
        <Route path="/" element={<Navigate to="/jobs" replace />} />

        {/* --- Catch-all Route --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
