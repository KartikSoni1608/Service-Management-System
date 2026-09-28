import { useState } from "react";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import "./App.css";
import "./index.css";

const USER_STORAGE_KEY = "loggedInUser";

function getStoredUser() {
    try {
        const savedUser = sessionStorage.getItem(USER_STORAGE_KEY);

        return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        console.error("Unable to restore login session:", error);

        sessionStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
}

function App() {
    const [loggedInUser, setLoggedInUser] = useState(getStoredUser);

    const handleLogin = (user) => {
        sessionStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(user)
        );

        setLoggedInUser(user);
    };

    const handleLogout = () => {
        sessionStorage.removeItem(USER_STORAGE_KEY);
        setLoggedInUser(null);
    };

    if (!loggedInUser) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Service Desk</h1>

                    <p>
                        Welcome, {loggedInUser.userName}
                    </p>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                {loggedInUser.roleId === 1 ? (
                    <AdminDashboard user={loggedInUser} />
                ) : (
                    <UserDashboard user={loggedInUser} />
                )}
            </main>
        </div>
    );
}

export default App;