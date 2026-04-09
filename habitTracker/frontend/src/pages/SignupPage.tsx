import { useNavigate } from "react-router-dom";
import Signup from "../components/Signup";
import { useEffect } from "react";
import useAuthStore from "../stores/auth";


const SignupPage = () => {

    const navigate = useNavigate()

    // automatic redirect
    useEffect(() => {
        if (useAuthStore.getState().isAuthenticated) {
            navigate('/')
        }
    }, [])

    return ( 
        <div className="signup-page">
            <Signup />
        </div>
    );
}
 
export default SignupPage;