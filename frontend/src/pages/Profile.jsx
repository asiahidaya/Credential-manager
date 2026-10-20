import {useState, useEffect} from "react";
import {profile , addCredential, deleteCredential, updateCredential} from "../api.js";
import Modal from "../components/Modal.jsx";

function Profile() {

    const [openModal, setOpenModal] = useState(false);

    const [user,setUser] = useState(null);
    const [username , setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [website, setWebsite] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [editingId , setEditingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const [error, setError] = useState("");

    useEffect( ()=> {
        async function getProfile() {
            try {
                const response = await profile();
                setUser(response);
            } catch(error) {
                console.log(error);
            }
        }
        getProfile();
    }, []);

     function validation() {
        if(!website) {
            return "Website is required";
        }
        if(!username) {
            return "Username is required";
        }
        if(!password) {
            return "Password is required";
        }
    }

    async function handleAddCredential(e) {
        e.preventDefault();

        const validationError = validation();
          if(validationError) {
            setError(validationError);
            return;
          }
        setError("");

        try {
            await addCredential(username,password,website);
            const updatedProfile = await profile();
            setUser(updatedProfile);
            setUsername("");
            setPassword("");
            setWebsite("");

            setOpenModal(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteCredential(id) {
        try {
            await deleteCredential(id);
            const updatedProfile = await profile();
            setUser(updatedProfile);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleCopyPassword(password, id) {
        try {
        await navigator.clipboard.writeText(password);
        setCopiedId(id);
        setTimeout(() => {
        setCopiedId(null);
        }, 2000);

        console.log("Password copied");
        } catch(error) {
            console.log(error);
        }
    }

    function handleUpdateCredential(id) {
        const credential = user.credentials.find((credential)=> credential.credential_id === id);
        if(!credential) {
            return ("Credential not found");
        }
        setEditingId(id);
        setWebsite(credential.website);
        setUsername(credential.account_username);
        setPassword(credential.account_password);

        setOpenModal(true);
    }

    async function handleUpdateSubmit(e) {
    e.preventDefault();

     const validationError = validation();
        if(validationError) {
        setError(validationError);
        return;
        }
        setError("");

    try {
        await updateCredential(editingId, username,password,website);
        const updatedProfile = await profile();
        setUser(updatedProfile);
        setEditingId(null);
        setUsername("");
        setPassword("");
        setWebsite("");

        setOpenModal(false);
    } catch (error) {
        console.log(error.response?.data);
    }
    }

    return (
        <div>
            {openModal && ( <Modal 
            username = {username} password = {password} website = {website} editingId = {editingId} error = {error}
            setPassword={setPassword} setUsername={setUsername} setWebsite={setWebsite}
            handleAddCredential = {handleAddCredential} handleUpdateSubmit = {handleUpdateSubmit} setOpenModal={setOpenModal}/>
            )}
             {user && (
                <h1>Welcome, {user.userName}!</h1>
            )}

            <div className="add-container">
            <button type="button" className="addBtn" onClick={() => {
                setEditingId(null);
                setUsername("");
                setPassword("");
                setWebsite("");
                setError("");
                setOpenModal(true);
                }}>
                    Add Credential</button>
                    </div>

            <h2>My Credentials</h2>

            <table className="table">
                <thead>
                    <tr>
                    <th>No.</th>
                    <th>Website</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {user && user.credentials.map((credential, index) => (
                    <tr key ={credential.credential_id}>
                        <td>{index + 1}</td>
                        <td><a href={credential.website} target="_blank" rel = "noopener norefferer">{credential.website}</a></td>
                        <td>{credential.account_username}</td>
                        <td>{showPassword === credential.credential_id ? (credential.account_password) : ("•••••••")}
                        <button className = "showBtn" type="button" onClick={() => {showPassword === credential.credential_id ? setShowPassword(false):setShowPassword(credential.credential_id)}}>👁</button>
                        <button type="button" onClick={() => handleCopyPassword(credential.account_password, credential.credential_id)}>{copiedId === credential.credential_id ? "Copied!":"Copy" }</button></td>
                        <td>
                            <button onClick={() => handleDeleteCredential(credential.credential_id)}>Delete</button>
                            <button onClick={() => handleUpdateCredential(credential.credential_id)}>Edit</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )}

export default Profile;
