import { useEffect } from "react";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";


const LoginPage = () => {

    const navigate = useNavigate()

    // automatic redirect
    useEffect(() => {
        if (useAuthStore.getState().isAuthenticated) {
            navigate('/')
        }
    }, [])

    return ( 
        <div className="login-page">
            <Login />
        </div>
    );
}
 
export default LoginPage;