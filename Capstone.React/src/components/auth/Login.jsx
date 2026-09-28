import { useState } from "react";
import { API_URL } from "../../api/apiConfig";

function Login({ onLogin }) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/Authenticate?userName=${encodeURIComponent(
                    userName.trim()
                )}&password=${encodeURIComponent(password)}`
            );

            if (!response.ok) {
                setMessage("Invalid username or password.");
                return;
            }

            const user = await response.json();

            // sessionStorage belongs to this browser tab only.
            sessionStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            onLogin(user);
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Unable to connect to the API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Service Desk</h1>
                <p>Login to continue</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="userName">Username</label>

                        <input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter username"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {message && (
                    <p className="error-message">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;