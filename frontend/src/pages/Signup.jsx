import { useState } from 'react';
import { signup } from '../api';
import { Link } from 'react-router-dom';

function Signup() {
  const [name,setName] = useState("");
  const [signUpEmail,setSignUpEmail] = useState("");
  const [signUpMessage,setSignUpMessage] = useState("");

async function handleSignUp(e) {
  e.preventDefault();
  if (!signUpEmail || !name) {
    setSignUpMessage("All Fields required");
    return;
        }
  if (!signUpEmail.includes('@')) {
    setSignUpMessage("Email should include '@'");
    return;
        }
  if(name.length<3 || name.length>50){
    setSignUpMessage("Name must contain minimum 3 characters and should not exceed 50 characters"); 
    return;          
     }
  try {
    const data = await signup(name,signUpEmail);
    setSignUpMessage(data.message);
    console.log(setSignUpMessage);
  } catch(error) {
    console.log(error.response?.data);
    setSignUpMessage(error.response?.data?.message || "Signup failed");
}}

return (
    <>
      <h2 className='page-title'>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className='input-group'>
        <label>Name:</label><input type = "text" value={name} placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='input-group'>
        <label>Email:</label><input type = "email" value={signUpEmail} placeholder="Enter your email" onChange ={(e) => setSignUpEmail(e.target.value)} />
        </div>
        <div className='input-group'>
        <button type = "submit">Sign Up</button>
        </div>
        <div className='error-message'>
        <p>{signUpMessage}</p>
        </div>
      </form>
      <p>Already have an account?
        <Link to= "/login"><button type = "button">Login</button></Link>
      </p>
      </>
)}

export default Signup;