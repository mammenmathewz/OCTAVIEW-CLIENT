import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Doc from "./pages/user/Doc";
import Login from "./pages/user/Login";
import Dash from "./pages/user/Dash";
import CandidateList from "./pages/user/CandidateList";
import SelectedCandidates from "./pages/user/SelectedCandidates";
import ScheduledCandidates from "./pages/user/ScheduledCandidates";
import Settings from "./pages/user/Settings";
import AdminDash from "./pages/admin/AdminDash";
import AdminLogin from "./pages/admin/Login";
import ProtectedRoute from "./utils/ProtectedRoutes";
import DashboardOverview from "./components/user/Console/DashboardOverview"; 
import JobPage from "./pages/user/JobList";
import CandidateDetails from "./pages/user/CandidateDetails";
import ErrorBoundary from "./utils/ErrorBoundary";  // Import the ErrorBoundary component
import CreateRoom from "./pages/user/CreateRoom";  // Import CreateRoom component
import InterviewRoom from "./pages/user/InterviewRoom";  // Import InterviewRoom component

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary> {/* Wrap all the routes inside ErrorBoundary */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Doc />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dash" element={<Dash />}>
              <Route index element={<DashboardOverview />} />
              <Route path="candidates" element={<CandidateList />} />
              <Route path="selected-candidates" element={<SelectedCandidates />} />
              <Route path="candidate-details" element={<CandidateDetails />} />
              <Route path="scheduled-interviews" element={<ScheduledCandidates />} />
              <Route path="jobs" element={<JobPage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="/meet/:roomId" element={<InterviewRoom />} />
          <Route path="/create-room" element={<CreateRoom />} />  {/* Add CreateRoom route */}
          {/* <Route path="/admin" element={<AdminDash />} /> 
          <Route path="/admin-login" element={<AdminLogin />} /> */}
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;


