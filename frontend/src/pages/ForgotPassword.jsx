import { useState } from "react";
import { updatePassword } from "../api";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handlePassword(e) {
        e.preventDefault();

        if(!email) {
            setMessage("Email is required")
        }
        await updatePassword();
    }

    return(
        <>
        <h2>Forgot Password</h2>
        <form onSubmit={handlePassword}>
            <div className="input-group">
            <label>Email:</label>
            <input type = "email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
            <button type = "submit">Reset password</button>
            </div>
        </form>
        <div className="error-message">
            <p>{message}</p>
        </div>
        </>
    )
}

export {ForgotPassword};