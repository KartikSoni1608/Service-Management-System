import { useState, useEffect } from "react";
import { API_URL } from "../../api/apiConfig";

function AllRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [closingId, setClosingId] = useState(null);

    const [searchUserName, setSearchUserName] = useState("");

    // =========================
    // LOAD ALL REQUESTS
    // =========================

    const fetchRequests = async () => {

        setLoading(true);
        setError("");
        setMessage("");

        try {

            const response = await fetch(
                `${API_URL}/GetAllRequest`
            );

            if (response.ok) {

                const data = await response.json();

                console.log("All requests:", data);

                setRequests(
                    Array.isArray(data) ? data : []
                );

            } else {

                setError(
                    "Unable to load service requests."
                );

                setRequests([]);
            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to the API."
            );

            setRequests([]);

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // SEARCH REQUESTS BY USER
    // =========================

    const handleSearch = async () => {

        const userName = searchUserName.trim();

        setError("");
        setMessage("");

        // If search box is empty,
        // show all requests again.
        if (!userName) {

            fetchRequests();

            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/GetRequestByUserName?userName=${encodeURIComponent(
                    userName
                )}`
            );

            if (response.ok) {

                const data = await response.json();

                console.log(
                    `Requests for ${userName}:`,
                    data
                );

                setRequests(
                    Array.isArray(data) ? data : []
                );

            } else if (response.status === 404) {

                setRequests([]);

                setError(
                    `No requests found for user "${userName}".`
                );

            } else {

                setRequests([]);

                setError(
                    "Unable to search service requests."
                );
            }

        } catch (error) {

            console.error(error);

            setRequests([]);

            setError(
                "Unable to connect to the API."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // CLEAR SEARCH
    // =========================

    const handleClearSearch = () => {

        setSearchUserName("");
        setError("");
        setMessage("");

        fetchRequests();
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchRequests();

    }, []);


    // =========================
    // CLOSE REQUEST
    // =========================

    const handleCloseRequest = async (requestId) => {

        const confirmed = window.confirm(
            `Are you sure you want to close request ${requestId}?`
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");
        setClosingId(requestId);

        try {

            const response = await fetch(
                `${API_URL}/CloseRequest?id=${requestId}`
            );

            if (response.ok) {

                console.log(
                    `Request ${requestId} closed successfully.`
                );

                setMessage(
                    `Request ${requestId} closed successfully.`
                );

                // Reload current search results
                if (searchUserName.trim()) {

                    await handleSearch();

                } else {

                    await fetchRequests();
                }

            } else {

                const errorData =
                    await response.text();

                console.error(errorData);

                setError(
                    `Unable to close request ${requestId}.`
                );
            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to the API."
            );

        } finally {

            setClosingId(null);
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <div className="requests-page">

            <h2>All Service Requests</h2>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="search-container">

                <input
                    type="text"
                    className="search-input"
                    value={searchUserName}
                    onChange={(e) =>
                        setSearchUserName(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    placeholder="Search by username"
                />

                <button
                    type="button"
                    className="search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

                <button
                    type="button"
                    className="clear-button"
                    onClick={handleClearSearch}
                >
                    Clear
                </button>

            </div>


            {/* =========================
                SUCCESS MESSAGE
            ========================= */}

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}


            {/* =========================
                ERROR MESSAGE
            ========================= */}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* =========================
                LOADING
            ========================= */}

            {loading && (
                <p>Loading requests...</p>
            )}


            {/* =========================
                NO REQUESTS
            ========================= */}

            {!loading &&
                !error &&
                requests.length === 0 && (

                    <p>
                        No service requests found.
                    </p>

                )
            }


            {/* =========================
                REQUESTS TABLE
            ========================= */}

            {!loading &&
                requests.length > 0 && (

                    <div className="table-container">

                        <table>

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

                                    const isOpen =
                                        status.toLowerCase() === "open";


                                    return (

                                        <tr
                                            key={request.requestId}
                                        >

                                            <td>
                                                {request.requestId}
                                            </td>


                                            <td>
                                                {request.description}
                                            </td>


                                            <td>
                                                {request.details}
                                            </td>


                                            <td>
                                                {request.raisedBy}
                                            </td>


                                            <td>
                                                {new Date(
                                                    request.raisedOn
                                                ).toLocaleString()}
                                            </td>


                                            <td>
                                                {request.justification ||
                                                    "—"}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        status.toLowerCase() ===
                                                            "open"
                                                            ? "status-open"
                                                            : "status-closed"
                                                    }
                                                >
                                                    {status}
                                                </span>

                                            </td>


                                            <td>

                                                {isOpen ? (

                                                    <button
                                                        onClick={() =>
                                                            handleCloseRequest(
                                                                request.requestId
                                                            )
                                                        }
                                                        disabled={
                                                            closingId ===
                                                            request.requestId
                                                        }
                                                    >

                                                        {closingId ===
                                                            request.requestId
                                                            ? "Closing..."
                                                            : "Close"}

                                                    </button>

                                                ) : (

                                                    <span>
                                                        —
                                                    </span>

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

export default AllRequests;