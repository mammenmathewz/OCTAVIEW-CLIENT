import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Doc from "./pages/user/Doc";
import Login from "./pages/user/Login";
import Dash from "./pages/user/Dash";
import CandidateList from "./pages/user/CandidateList";
import SelectedCandidates from "./pages/user/SelectedCandidates";
import ScheduledCandidates from "./pages/user/ScheduledCandidates";
import Meet from "./pages/user/Meet";
import Settings from "./pages/user/Settings";
import AdminDash from "./pages/admin/AdminDash";
import AdminLogin from "./pages/admin/Login";
import ProtectedRoute from "./utils/ProtectedRoutes";

import DashboardOverview from "./components/user/Console/DashboardOverview"; // Your default dashboard component
import JobPage from "./pages/user/JobList";
import CandidateDetails from "./pages/user/CandidateDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Doc />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dash" element={<Dash />}>
            {/* Default route for /dash */}
            <Route index element={<DashboardOverview />} />  {/* Default Dashboard content */}

            {/* Nested routes for sidebar links */}
            <Route path="candidates" element={<CandidateList />} />
            <Route path="selected-candidates" element={<SelectedCandidates />} />
            <Route path="candidate-details" element={<CandidateDetails/>} />
            <Route path="scheduled-iterviews" element={<ScheduledCandidates />} />
            <Route path="jobs" element={<JobPage/>} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/meet" element={<Meet />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
