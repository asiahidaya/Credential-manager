import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { insertPassword } from "../api";

function SetPassword() {

    const { setUpToken } = useParams();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function handlePassword(e) {
        e.preventDefault();
        if(!newPassword || !confirmPassword){
            setMessage("Set new password and confirm")
            return;
        }
        if(newPassword !== confirmPassword) {
            setMessage("Passwords do not match")
            return;
        }
        if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword) || newPassword.length < 8) {
            setMessage("Password must include atleast 8 characters and should have an uppercase character, a special character and a number");
            return;
        }
        try {
        await insertPassword(setUpToken,newPassword);
        alert("Password created successfully")
        navigate('/login');
        } catch(error) {
            console.log(error);
            setMessage("Password creation failed")
        }
    }

    return (
        <>
        <h2 className="page-title">Set up your Password</h2>
        <form onSubmit={handlePassword}>
        <div className="password">
            <label>New Password:</label>
            <input type = {showPassword ? "text":"password"} value={newPassword}  placeholder="Enter new password" onChange={(e) => setNewPassword(e.target.value)} />
            <button type = "button" onClick={() => setShowPassword(!showPassword)}>👁</button>
        </div>
        <div className="password">
            <label>Confirm Password:</label>
            <input type = "password" value={confirmPassword} placeholder="Confirm the password" onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className='error-message'> <p>{message}</p></div>
        <div className="password">
        <button type = "submit">Set Password</button>
        </div>
        </form>
        </>

    )
}

export default SetPassword;