import React, { createContext, useContext, useState} from "react";
import api from "../api/api";

const AuthContext=createContext({
    isAuthenticated: false,
    user: null,
    login: ()=> {},
    logout: ()=> {},
    roles: [],
    hasAnyRole: (roles)=> false
});

const AuthProvider=({children})=>
{
    const [isAuthenticated,setIsAuthenticated]=useState(false);
    const [user,setUser]=useState(null);
    const [roles,setRoles]=useState([]);

    const login=async (credentials)=>
    {
        const { email, password }=credentials;
        try
        {
            const response=await api.post('/api/user',credentials);
            const { data }=response;

            setUser(data.user);
            setRoles(data.roles);
            setIsAuthenticated(true);
        }
        catch(error)
        {
            console.log("Login error:", error);
        }
    };

    const logout=()=>
    {
        setUser(null);
        setRoles([]);
        setToken(null);
        setIsAuthenticated(false);
    };

    const hasAnyRole=(requiredRoles)=>
    {
        return requiredRoles.some((role)=>roles.includes(role));
    };

    return <AuthContext.Provider 
        value={{ 
            isAuthenticated, 
            user,
            login,
            logout,
            roles,
            hasAnyRole
             }}>
        {children}
    </AuthContext.Provider>
};

export { AuthContext, AuthProvider };

export const useAuthenticate=()=> useContext(AuthContext);