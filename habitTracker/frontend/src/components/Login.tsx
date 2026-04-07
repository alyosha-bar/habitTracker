import { useState } from "react";
import useAuthStore from "../stores/auth";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const authStore = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle login logic here

        if (!username || !password) {
            console.error('Username and password are required');
            return;
        }


        login();
    }

    const login = async () => {
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            // Handle error
            console.error('Login failed');
            return;
        }

        const {token, user} = await response.json();
        // Handle successful login, e.g., store token, redirect, etc.
        console.log('Login successful', {token, user});

        // set token in localStorage or context for future authenticated requests
        localStorage.setItem('token', token);

        authStore.setAuthData(token, user.username);

        // redirect to main page or dashboard
        navigate('/');
        
    }


    return ( 
        <div className="login">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>

            <div>{authStore.username}</div>

        </div>
    );
}
 
export default Login;