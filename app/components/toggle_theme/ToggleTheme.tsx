"use client";
import { useEffect, useState } from "react";
import styles from "./styles/toggle.module.css";

const ToggleTheme = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute("data-theme", storedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button className={styles.togButton} onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
};

export default ToggleTheme;

