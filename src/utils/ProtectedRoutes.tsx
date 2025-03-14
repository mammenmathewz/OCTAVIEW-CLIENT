import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAccessToken } from '../service/redux/store';
//example of a function that would validate the token.
function isTokenValid(token: string | null): boolean {
    if (!token) {
        return false;
    }
    //Add token validation logic here.
    //for example, check the token expiration.
    return true; // Replace with actual validation logic.
}

const ProtectedRoute = () => {
    const token = useSelector(selectAccessToken);
    if (!isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;