import { useState } from "react";
import { API_URL } from "../../api/apiConfig";

function ReopenRequest({ request, onBack, onSuccess }) {

    const [justification, setJustification] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // REOPEN REQUEST
    // =========================

    const handleReopen = async (e) => {

        e.preventDefault();

        setError("");

        // Justification is mandatory
        if (!justification.trim()) {
            setError(
                "Justification is required to reopen the request."
            );
            return;
        }

        setLoading(true);

        try {

            const reopenData = {
                requestId: request.requestId,
                description: request.description,
                details: request.details,
                raisedBy: request.raisedBy,
                raisedOn: request.raisedOn,
                justification: justification.trim(),
                reqStatus: 1
            };

            console.log(
                "Reopening request:",
                reopenData
            );

            const response = await fetch(
                `${API_URL}/ReOpenRequest`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reopenData)
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "Reopen API error:",
                    errorText
                );

                setError(
                    `Unable to reopen request #${request.requestId}.`
                );

                return;
            }

            const result = await response.json();

            console.log(
                "Reopen response:",
                result
            );

            alert(
                `Request #${request.requestId} reopened successfully.`
            );

            // Tell MyRequests to reload
            onSuccess();

        } catch (error) {

            console.error(
                "Reopen error:",
                error
            );

            setError(
                "Unable to connect to the API."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // UI
    // =========================

    return (

        <div className="requests-container">

            {/* BACK */}

            <button
                className="back-button"
                onClick={onBack}
                disabled={loading}
            >
                ← Back
            </button>


            <h1>Re-Open Request</h1>


            {/* ERROR */}

            {error && (

                <p className="error-message">
                    {error}
                </p>

            )}


            <form
                onSubmit={handleReopen}
                className="request-form"
            >

                {/* REQUEST ID */}

                <div className="form-group">

                    <label>
                        Request ID
                    </label>

                    <input
                        type="text"
                        value={request.requestId}
                        readOnly
                    />

                </div>


                {/* DESCRIPTION */}

                <div className="form-group">

                    <label>
                        Description
                    </label>

                    <input
                        type="text"
                        value={request.description || ""}
                        readOnly
                    />

                </div>


                {/* DETAILS */}

                <div className="form-group">

                    <label>
                        Details
                    </label>

                    <textarea
                        value={request.details || ""}
                        readOnly
                        rows="5"
                    />

                </div>


                {/* RAISED BY */}

                <div className="form-group">

                    <label>
                        Raised By
                    </label>

                    <input
                        type="text"
                        value={request.raisedBy || ""}
                        readOnly
                    />

                </div>


                {/* CREATION DATE */}

                <div className="form-group">

                    <label>
                        Creation Date
                    </label>

                    <input
                        type="text"
                        value={
                            request.raisedOn
                                ? new Date(
                                    request.raisedOn
                                ).toLocaleString()
                                : ""
                        }
                        readOnly
                    />

                </div>


                {/* JUSTIFICATION */}

                <div className="form-group">

                    <label htmlFor="justification">
                        Justification
                    </label>

                    <textarea
                        id="justification"
                        placeholder="Enter justification for reopening the request"
                        value={justification}
                        onChange={(e) =>
                            setJustification(e.target.value)
                        }
                        rows="4"
                        required
                    />

                </div>


                {/* BUTTONS */}

                <div className="form-actions">

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Reopening..."
                            : "Reopen Request"
                        }

                    </button>


                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onBack}
                        disabled={loading}
                    >
                        Back to List
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ReopenRequest;