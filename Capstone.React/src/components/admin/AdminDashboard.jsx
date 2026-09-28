import AllRequests from "./AllRequests";

function AdminDashboard({ user }) {
    return (
        <AllRequests user={user} />
    );
}

export default AdminDashboard;