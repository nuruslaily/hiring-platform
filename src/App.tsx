import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobPages from "./pages/JobPages";
import ManageJobPage from "./pages/ManageJobPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import ApplyPage from "./pages/ApplyPage";
import EmailSend from "./components/state/EmailSend";
import LoginEmailPage from "./pages/LoginEmailPage";
import TestingRedirect from "./components/TestingRedirect";

function App() {
  return (
    <Router>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
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
              <EmailSend />
            </TestingRedirect>
          }
        />

        <Route path="/" element={<Navigate to="/jobs" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
