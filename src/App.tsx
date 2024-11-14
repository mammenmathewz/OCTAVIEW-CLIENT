import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./pages/user/Home"
import Doc from "./pages/user/Doc"
import Login from "./pages/user/Login"
import Dash from "./pages/user/Dash"
import CandidateList from "./pages/user/CandidateList"
import SelectedCandidates from "./pages/user/SelectedCandidates"
import ScheduledCandidates from "./pages/user/ScheduledCandidates"
import Meet from "./pages/user/Meet"
import Settings from "./pages/user/Settings"
import AdminDash from "./pages/admin/AdminDash"
import AdminLogin from "./pages/admin/Login"
import ProtectedRoute from "./utils/ProtectedRoutes"


function App() {
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/docs" element={<Doc/>}/>
      <Route path="/login" element={<Login/>}/>

      <Route element={<ProtectedRoute/>}>
      <Route path="/dash" element={<Dash/>}/>
      <Route path="/candidates" element={<CandidateList/>}/>
      <Route path="/selected-candidates" element={<SelectedCandidates/>}/>
      <Route path="/scheduled-iterviews" element={<ScheduledCandidates/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/meet" element={<Meet/>}/>
      </Route>

      <Route path="/admin" element={<AdminDash/>}/>
      <Route path="/admin-login" element={<AdminLogin/>}/>

 
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
