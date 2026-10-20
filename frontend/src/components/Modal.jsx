import "./Modal.css";
function Modal({website, username, password, editingId, error, setUsername, setPassword, setWebsite, handleAddCredential, handleUpdateSubmit, setOpenModal}) {
return (
    <div className="modalBackground">
    <div className="modalContainer">
<form onSubmit = {editingId ? handleUpdateSubmit : handleAddCredential}>
    <button className="closeBtn" type="button" onClick={() => setOpenModal(false)}>X</button>
    <h2>{editingId ? "Edit Credentials" : "Add Credentials"}</h2>
    {error && (
        <p className="error-message">{error}</p>
        )}
        <div className="input-group">
            <label>Website:</label>
            <input type = "url" value= {website} placeholder = "Enter the website url" onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="input-group">
            <label>Account username:</label>
            <input type = "text" value= {username} placeholder = "Enter the account username" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-group">
            <label>Account password:</label>
            <input type = "password" value= {password} placeholder = "Enter the account password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="buttons">
            <button className="submitBtn" type = "submit">Submit</button>
            <button className="cancelBtn" type = "button" onClick={() => {setOpenModal(false)}}>Cancel</button>
            </div>
            </form>
            </div>
            </div>
)}

export default Modal;