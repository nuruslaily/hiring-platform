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
import NotificationPage from "./pages/NotificationPage";
import LoginEmailPage from "./pages/LoginEmailPage";
import TestingRedirect from "./components/TestingRedirect";
// import LoginPasswordPage from "./pages/LoginPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Auth Pages --- */}
        <Route
          path="/loginemail"
          element={
            <TestingRedirect>
              <LoginEmailPage />
            </TestingRedirect>
          }
        />
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

        <Route
          path="/notification"
          element={
            <TestingRedirect>
              <NotificationPage />
            </TestingRedirect>
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
