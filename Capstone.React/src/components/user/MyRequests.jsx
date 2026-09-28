import { useEffect, useState } from "react";
import { API_URL } from "../../api/apiConfig";
import ReopenRequest from "./ReopenRequest";

function MyRequests({ userName, onAddRequest }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [reopeningId] = useState(null);
    const [requestToReopen, setRequestToReopen] = useState(null);

    // =========================
    // LOAD REQUESTS
    // =========================

    const loadRequests = async () => {
        setLoading(true);
        setError("");

        try {
            const url =
                `${API_URL}/GetRequestByUserName?userName=${encodeURIComponent(userName)}`;

            const response = await fetch(url);

            // 404 means user has no requests
            if (response.status === 404) {
                setRequests([]);
                return;
            }

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();

            console.log("Requests received:", data);

            if (Array.isArray(data)) {
                setRequests(data);
            } else if (data && Array.isArray(data.requests)) {
                setRequests(data.requests);
            } else {
                setRequests([]);
            }

        } catch (error) {
            console.error("Error loading requests:", error);
            setError("Unable to load service requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [userName]);


    // =========================
    // DELETE REQUEST
    // =========================

    const handleDelete = async (requestId) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete request #${requestId}?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(requestId);
        setError("");

        try {

            const response = await fetch(
                `${API_URL}/Delete?id=${requestId}`,
                {
                    method: "GET"
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "Delete API error:",
                    errorText
                );

                setError(
                    `Unable to delete request #${requestId}.`
                );

                return;
            }

            alert(
                `Request #${requestId} deleted successfully.`
            );

            // Refresh list
            await loadRequests();

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            setError(
                "Unable to connect to the API."
            );

        } finally {
            setDeletingId(null);
        }
    };


    // =========================
    // REOPEN REQUEST
    // =========================

    


    // =========================
    // UI
    // =========================
    if (requestToReopen) {
        return (
            <ReopenRequest
                request={requestToReopen}
                onBack={() => setRequestToReopen(null)}
                onSuccess={async () => {
                    setRequestToReopen(null);
                    await loadRequests();
                }}
            />
        );
    }
    return (
        <div className="requests-container">

            

            <h1>My Service Requests</h1>


            {/* ADD NEW REQUEST */}

            <button
                type="button"
                className="add-request-button"
                onClick={onAddRequest}
            >
                + Add New Request
            </button>


            {/* LOADING */}

            {loading && (
                <p>Loading requests...</p>
            )}


            {/* ERROR */}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* NO REQUESTS */}

            {!loading &&
                !error &&
                requests.length === 0 && (
                    <div>

                        <p>
                            No service requests found.
                        </p>

                    </div>
                )
            }


            {/* REQUEST TABLE */}

            {!loading &&
                !error &&
                requests.length > 0 && (

                    <div className="table-container">

                        <table className="requests-table">

                            <thead>

                                <tr>

                                    <th>Request ID</th>
                                    <th>Description</th>
                                    <th>Details</th>
                                    <th>Raised By</th>
                                    <th>Raised On</th>
                                    <th>Justification</th>
                                    <th>Status</th>
                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody>

                                {requests.map((request) => {

                                    const status =
                                        request.status?.description ||
                                        "Unknown";

                                    const isClosed =
                                        status.toLowerCase() === "closed";


                                    return (

                                        <tr
                                            key={request.requestId}
                                        >

                                            <td>
                                                {request.requestId}
                                            </td>


                                            <td className="text-cell">
                                                {request.description}
                                            </td>


                                            <td className="text-cell">
                                                {request.details}
                                            </td>


                                            <td>
                                                {request.raisedBy}
                                            </td>


                                            <td className="date-cell">

                                                {request.raisedOn
                                                    ? new Date(
                                                        request.raisedOn
                                                    ).toLocaleString()
                                                    : "-"
                                                }

                                            </td>


                                            <td className="text-cell">

                                                {request.justification ||
                                                    "-"
                                                }

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        isClosed
                                                            ? "status-closed"
                                                            : "status-open"
                                                    }
                                                >
                                                    {status}
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                {/* DELETE AVAILABLE
                                                    FOR BOTH OPEN
                                                    AND CLOSED */}

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            request.requestId
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        request.requestId ||
                                                        reopeningId ===
                                                        request.requestId
                                                    }
                                                >

                                                    {deletingId ===
                                                        request.requestId
                                                        ? "Deleting..."
                                                        : "Delete"}

                                                </button>


                                                {/* REOPEN ONLY
                                                    FOR CLOSED */}

                                                {isClosed && (

                                                    <button
                                                        className="reopen-button"
                                                        onClick={() =>
                                                            setRequestToReopen(request)
                                                        }
                                                        disabled={
                                                            reopeningId ===
                                                            request.requestId ||
                                                            deletingId ===
                                                            request.requestId
                                                        }
                                                    >

                                                        {reopeningId ===
                                                            request.requestId
                                                            ? "Reopening..."
                                                            : "Reopen"}

                                                    </button>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )
            }

        </div>
    );
}

export default MyRequests;