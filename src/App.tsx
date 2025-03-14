import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/user/Home";
import Doc from "./pages/user/Doc";
import Login from "./pages/user/Login";
import Dash from "./pages/user/Dash";
import ProtectedRoute from "./utils/ProtectedRoutes";
import ErrorBoundary from "./utils/ErrorBoundary";
import DashboardOverview from "./components/user/Console/DashboardOverview";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import  FullPageLoader from "./components/ui/loder"

// Lazy load components
const CandidateList = lazy(() => import("./pages/user/CandidateList"));
const SelectedCandidates = lazy(() => import("./pages/user/SelectedCandidates"));
const ScheduledCandidates = lazy(() => import("./pages/user/ScheduledCandidates"));
const JobPage = lazy(() => import("./pages/user/JobList"));
const CandidateDetails = lazy(() => import("./pages/user/CandidateDetails"));
const Settings = lazy(() => import("./pages/user/Settings"));
const InterviewRoom = lazy(() => import("./pages/user/InterviewRoom"));
const CreateRoom = lazy(() => import("./pages/user/CreateRoom"));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<FullPageLoader/>}>
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
              <Route path="payment-success" element={<PaymentSuccess />} />
            </Route>

            {/* Lazy-loaded Routes */}
            <Route path="/meet/:roomId" element={<InterviewRoom />} />
            <Route path="/create-room" element={<CreateRoom />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
