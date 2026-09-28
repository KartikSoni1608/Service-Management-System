import MyRequests from "./MyRequests";
import RaiseRequest from "./RaiseRequest";
import { useState } from "react";

function UserDashboard({ user }) {

    const [showRaiseRequest, setShowRaiseRequest] = useState(false);

    return (

        <>

            {showRaiseRequest ? (

                <RaiseRequest
                    user={user}
                    onBack={() => setShowRaiseRequest(false)}
                />

            ) : (

                    <MyRequests
                        userName={user.userName}
                        onAddRequest={() => setShowRaiseRequest(true)}
                    />

            )}

        </>

    );
}

export default UserDashboard;