import { useContext, useEffect, useState } from "react";
import { adminUsers, deleteUsers } from "../api";
import { AuthContext } from "../AuthContext";

function Admin() {

    const[users, setUsers] = useState([]);
    const {userId} = useContext(AuthContext);

    async function getUsers() {
        try {
            const response = await adminUsers();
            setUsers(response.users);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    async function handleDeleteUser(id) {
        try {
            const response = await deleteUsers(id);
            console.log(response);
            await getUsers();
    } catch (error) {
        console.log(error);
    }}

    return (
        <>
        <h2>User Details</h2>
        <table className="table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {users.map((user,index) => (
                    <tr key={user.email}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.user_id === userId ? ("Current user") : ( <button type="button" onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                    )}
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    )
}
export default Admin;