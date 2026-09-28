import { useState } from "react";
import { API_URL } from "../../api/apiConfig";

function RaiseRequest({ user, onBack }) {

    const [description, setDescription] = useState("");
    const [details, setDetails] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================
    // SUBMIT REQUEST
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Frontend validation
        if (!description.trim()) {
            setError("Description is required.");
            return;
        }

        if (!details.trim()) {
            setError("Details are required.");
            return;
        }

        setLoading(true);

        try {

            const newRequest = {
                description: description.trim(),
                details: details.trim(),
                raisedBy: user.userName,
                reqStatus: 1
            };

            console.log("Creating service request:", newRequest);

            const response = await fetch(
                `${API_URL}/CreateNewServiceRequest`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newRequest)
                }
            );

            // =========================
            // HANDLE VALIDATION ERROR
            // =========================

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "Create request API error:",
                    errorText
                );

                setError(
                    `Unable to create service request. (${response.status})`
                );

                return;
            }

            // =========================
            // SUCCESS
            // =========================

            const result = await response.json();

            console.log(
                "Request created successfully:",
                result
            );

            setSuccess(
                `Request added successfully. Your request ID is ${result}.`
            );

            // Clear form
            setDescription("");
            setDetails("");

        } catch (error) {

            console.error(
                "Create request error:",
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
            >
                ← Back
            </button>


            <h1>Raise Service Request</h1>


            {/* ERROR */}

            {error && (

                <p className="error-message">
                    {error}
                </p>

            )}


            {/* SUCCESS */}

            {success && (

                <div className="success-message">

                    <p>
                        {success}
                    </p>

                    <button
                        className="back-button"
                        onClick={onBack}
                    >
                        Back to My Requests
                    </button>

                </div>

            )}


            {/* FORM */}

            {!success && (

                <form
                    onSubmit={handleSubmit}
                    className="request-form"
                >

                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <input
                            id="description"
                            type="text"
                            placeholder="Enter request description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>


                    {/* DETAILS */}

                    <div className="form-group">

                        <label htmlFor="details">
                            Details
                        </label>

                        <textarea
                            id="details"
                            placeholder="Enter request details"
                            value={details}
                            onChange={(e) =>
                                setDetails(e.target.value)
                            }
                            rows="5"
                        />

                    </div>


                    {/* RAISED BY */}

                    <div className="form-group">

                        <label htmlFor="raisedBy">
                            Raised By
                        </label>

                        <input
                            id="raisedBy"
                            type="text"
                            value={user.userName}
                            readOnly
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
                                ? "Submitting..."
                                : "Submit Request"
                            }

                        </button>


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onBack}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            )}

        </div>
    );
}

export default RaiseRequest;