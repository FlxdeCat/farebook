import { createContext } from "react";

export const THEME = {
    light : {
        theme: "light"
    },
    dark : {
        theme: "dark"
    },
}

export const ThemeContext = createContext(THEME.light)