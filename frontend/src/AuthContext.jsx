import { createContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const userRole = token ? jwtDecode(token).userRole : null;
    const userId = token ? jwtDecode(token).userId : null;

    function login(newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
    <AuthContext.Provider value={{token, login, logout, userRole, userId}}>
        {children}
    </AuthContext.Provider>
    );
}

export {AuthProvider};