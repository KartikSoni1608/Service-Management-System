import { useState } from "react";
import { API_URL } from "../../api/apiConfig";

//const API_URL = "https://localhost:5193/api/ITSRPAPI";

function DeleteRequest({ onBack }) {

    const [requestId, setRequestId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);


    // =========================
    // DELETE REQUEST
    // =========================

    const handleDelete = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        const confirmed = window.confirm(
            `Are you sure you want to delete request #${requestId}?`
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {

            const response = await fetch(
                `${API_URL}/Delete?id=${encodeURIComponent(requestId)}`
            );

            if (response.ok) {

                console.log(
                    `Request ${requestId} deleted successfully.`
                );

                setMessage(
                    `Request #${requestId} deleted successfully.`
                );

                setRequestId("");

            } else {

                const errorData = await response.text();

                console.error(errorData);

                setError(
                    `Unable to delete request #${requestId}.`
                );
            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to the API."
            );

        } finally {

            setDeleting(false);
        }
    };


    return (
        <div className="request-container">

            <button
                className="back-button"
                onClick={onBack}
            >
                ← Back
            </button>


            <h2>
                Delete Service Request
            </h2>


            <form
                className="request-form"
                onSubmit={handleDelete}
            >

                <div className="form-group">

                    <label>
                        Request ID
                    </label>

                    <input
                        type="number"
                        value={requestId}
                        onChange={(e) =>
                            setRequestId(e.target.value)
                        }
                        placeholder="Enter request ID"
                        min="1"
                        required
                    />

                </div>


                <div className="button-group">

                    <button
                        type="submit"
                        disabled={deleting}
                    >
                        {deleting
                            ? "Deleting..."
                            : "Delete Request"}
                    </button>


                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onBack}
                    >
                        Cancel
                    </button>

                </div>

            </form>


            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

        </div>
    );
}

export default DeleteRequest;