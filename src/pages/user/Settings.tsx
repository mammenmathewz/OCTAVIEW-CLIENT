import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../service/redux/authSlice";


function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <>
    <div>Settings</div>
    <button onClick={handleLogout}>Logout</button>
    </>
    
  )
}

export default Settings