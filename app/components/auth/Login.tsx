"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "./styles/style.module.css";
import { auth, db } from "@/app/api/firebase/config";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className={styles.form}>
            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.btn} onClick={handleLogin}>Login</button>
        </div>
    );
}

