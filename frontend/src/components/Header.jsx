import {Link, useNavigate} from 'react-router-dom';
import logo from '../assets/logo.png';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';


function Header(){

    const {token, logout, userRole} = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header>
            <div className="head">
                <img src={logo} alt="Credential Manager Logo" />
                <h1>Credential Manager</h1>
            </div>

            <nav>
                <Link to = "/">Home</Link>

                {token ? (
                    <>
                    <div className='links'>
                    <Link to = "/user/credentials">Credentials</Link>
                    {userRole === "admin" && 
                        <Link to = "/admin">Admin</Link>}
                    </div>    
                    <button type = "button" className = "logoutBtn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (    
                    <div className='links'>
                        <Link to = "/login">Login</Link>
                        <Link to = "/signup">Sign Up</Link>
                    </div>
                )}
            </nav>

        </header>
    );
}

export default Header;