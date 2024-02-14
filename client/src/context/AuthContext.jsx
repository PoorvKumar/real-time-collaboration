import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
    roles: [],
    hasAnyRole: (roles) => false,
    loading: false
});

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            setLoading(true);

            const authToken = localStorage.getItem("authToken");
            if (authToken) {
                try {
                    const decodedToken = jwtDecode(authToken);
                    const { exp } = decodedToken;

                    // Token expired
                    if (Date.now() >= exp * 1000) {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("refreshToken");
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                    else {
                        setUser(decodedToken.user);
                        setIsAuthenticated(true);
                    }
                }
                catch (error) {
                    console.log("Error decoding token", error);
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("refreshToken");
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            else {
                setIsAuthenticated(false);
            }

            setLoading(false);
        }

        checkAuth();
    }, []);

    const login = async (credentials) => {
        const { email, password } = credentials;
        setLoading(true);

        try {
            const response = await api.post('/api/auth', credentials);
            const { data } = response;

            //Storing tokens in localStorage
            localStorage.setItem("authToken", data.authToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            const decodedToken = jwtDecode(authToken);
            setUser(decodedToken.user);

            // setUser(data.user);
            // setRoles(data.roles);
            setIsAuthenticated(true);
        }
        catch (error) {
            console.log("Login error:", error);
        }
        finally {
            setLoading(false);
        }
    };

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