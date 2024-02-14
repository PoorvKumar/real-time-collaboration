import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    isAuthenticated: localStorage.getItem("token")?true:false,
    user: localStorage.getItem("user") === null ? null : JSON.parse(localStorage.getItem("user")),
    login: () => { },
    googleLogin: () => { },
    logout: () => { },
    roles: [],
    hasAnyRole: (roles) => false,
    loading: false
});

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token")?true:false);
    const [user, setUser] = useState(localStorage.getItem("user") === null ? null : JSON.parse(localStorage.getItem("user")));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            setLoading(true);

            const authToken = localStorage.getItem("token");
            if (authToken) {
                try {
                    const decodedToken = jwtDecode(authToken);
                    const { exp } = decodedToken;

                    // Token expired
                    if (Date.now() >= exp * 1000) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("refreshToken");
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                    else {
                        // setUser(decodedToken.user);
                        setIsAuthenticated(true);
                    }
                }
                catch (error) {
                    console.log("Error decoding token", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    setIsAuthenticated(false);
                    setUser(null);
                }
                // setIsAuthenticated(true);
            }
            else {
                setIsAuthenticated(false);
            }

            setLoading(false);
        }

        checkAuth();
    }, []);

    const setDetails=(data)=>
    {
        //Storing tokens in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user",JSON.stringify(data.userData));

        // const decodedToken = jwtDecode(authToken);
        // setUser(decodedToken.user);

        setUser(data.userData);
        // setRoles(data.roles);
        setIsAuthenticated(true);
    }

    const login = async (credentials) => {
        setLoading(true);
        const { email, password } = credentials;

        try {
            const response = await api.post('/auth/signin', credentials);
            const { data } = response;

            setDetails(data);
            setLoading(false);

            return true;
        }
        catch (error) {
            console.log("Login error:", error.message);
            setLoading(false);
        }

        return false;
    };

    const googleLogin=async (codeResponse)=>
    {
        setLoading(true);
        const { code }=codeResponse;

        try
        {
            const response=await api.post('/auth/google',{ code });
            const { data }=response;

            setDetails(data);
            setLoading(false);

            return true;
        }
        catch(error)
        {
            console.log("Google Login error:", error.message);
            setLoading(false);
        }

        return false;
    }

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const hasAnyRole = (requiredRoles) => {
        return requiredRoles.some((role) => roles.includes(role));
    };

    return <AuthContext.Provider
        value={{
            isAuthenticated,
            user,
            login,
            googleLogin,
            logout,
            hasAnyRole,
            loading,
            setLoading
        }}>
        {children}
    </AuthContext.Provider>
};

export { AuthContext, AuthProvider };

export const useAuthenticate = () => useContext(AuthContext);