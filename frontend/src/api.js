import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

async function signup(name,email){
    const response = await axios.post(`${URL}/users/signup`, {name,email});
    return response.data;
  }

async function loginUser(email,password){
      const response = await axios.post(`${URL}/users/login`, {email,password});
      return response.data;
}  

async function profile(){
  const token = localStorage.getItem("token");
  const response = await axios.get(`${URL}/credentials/profile` , {
    headers: {Authorization : `Bearer ${token}`}
  });
  return response.data;
}

async function addCredential(account_username,account_password,website) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${URL}/credentials` , {account_username,account_password,website},{headers:{Authorization: `Bearer ${token}`}});
  return response.data;
}

async function deleteCredential(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${URL}/credentials/${id}`,{headers: {Authorization: `Bearer ${token}`}});
  return response.data;
}

async function updateCredential(id,account_username,account_password,website) {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${URL}/credentials/${id}`, { account_username, account_password, website},{headers: {Authorization:`Bearer ${token}`}});
  return response.data;
}

async function adminUsers() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${URL}/admin/users` ,{headers : {Authorization:`Bearer ${token}`}});
  return response.data;
}

async function deleteUsers(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${URL}/admin/users/${id}`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
}

async function updateUsers(id) {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${URL}/admin/users/${id}`,{role},{headers: {Authorization: `Bearer ${token}`}});
  return response.data;
}

async function insertPassword(token,password) {
  const response = await axios.post(`${URL}/users/set-password`, {token, password});
  return response.data;
}

async function updatePassword(password) {
  const response = await axios.post(`${URL}/users/forgot-password`, {token, password});
  return response.data;
}

export {loginUser,signup,profile,addCredential,deleteCredential,updateCredential, adminUsers, deleteUsers, updateUsers, insertPassword, updatePassword}