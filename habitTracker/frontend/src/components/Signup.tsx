import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Signup = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle signup logic here

        if (!username || !password) {
            console.error('Username and password are required');
            return;
        }

        signup();

    }

    const signup = async () => {
        // Implement signup logic, e.g., send POST request to /api/auth/signup

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password, 
            })
        });

        if (!response.ok) {
            // Handle error
            console.error('Signup failed');
            return;
        }

        const {message} = await response.json();
        // Handle successful signup, e.g., show success message, redirect to login, etc.
        console.log('Signup successful', {message});

        // redirect to login page
        navigate('/login');
        
    }


    return ( 
        <div>
            <h1>Signup</h1>
            {/* Signup form goes here */}
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
 
export default Signup;