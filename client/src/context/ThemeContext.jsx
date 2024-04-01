import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext=createContext();

export const ThemeProvider=({ children })=>
{
    const [dark,setDark]=useState(localStorage.getItem("darkMode")=="true");

    useEffect(()=>
    {
        localStorage.setItem("darkMode",dark?"true":"false");
        if(dark)
        {
            document.body.classList.add("dark");
        }
        else
        {
            document.body.classList.remove("dark");
        }
    },[ dark ]);

    const toggleDarkMode=()=>
    {
        setDark(prev=>!prev);
    }

    return (
    <ThemeContext.Provider value={{ dark, toggleDarkMode }}>
        { children }
    </ThemeContext.Provider>
    );
}

export const useTheme=()=>useContext(ThemeContext);