import { useState, useContext } from 'react';
import {loginUser} from '../api.js';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext.jsx';

function Login() {
    const [loginEmail,setLoginEmail] = useState("");
    const [loginPassword,setLoginPassword] = useState("");
    const [loginMessage,setLoginMessage] = useState(""); 
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {login} = useContext(AuthContext);


async function handleLogin(e) {
    e.preventDefault();
    if(!loginEmail || !loginPassword){
      setLoginMessage("Email and password required");
      return;
    }
     try {
    const response = await loginUser(loginEmail,loginPassword);
    login(response.token);
    setLoginMessage(response.message);
    navigate("/user/credentials");
  } catch (error) {
      setLoginMessage("Invalid email or password");
  }
}

return (
    <div>
         <h2 className='page-title'>Login</h2>
         <form onSubmit={handleLogin}>

  <div className="input-group">
    <label>Email:</label>
    <input type="email" value={loginEmail} placeholder="Enter your email" onChange={(e) => setLoginEmail(e.target.value)}/>
  </div>

  <div className='password-input'>
  <div className="input-group">
    <label>Password:</label><input type={showPassword ? "text":"password"} value={loginPassword} placeholder="Enter the password" onChange={(e) => setLoginPassword(e.target.value)}/>
    <button type = "button" onClick={() => setShowPassword(!showPassword)}>👁</button>
  </div>
  </div>

  <div className='input-group'><button type="submit">Login</button>
  </div>

  <div className='input-group'>
    <Link to="/forgot-password">
    Forgot password
</Link>
  </div>

  <div className='error-message'> <p>{loginMessage}</p></div>

</form>
<p>Don't have an account?
    <Link to = "/signup"><button type="button">Sign Up</button></Link>
</p>

</div>
)
}

export default Login;