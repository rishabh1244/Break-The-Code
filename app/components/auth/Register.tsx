"use client";

import { useState } from "react";
import { auth, db } from "@/app/api/firebase/config";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import styles from "./styles/style.module.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            const cred = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(cred.user, {
                displayName: username,
            });

            // 3️⃣ Store full profile in Firestore
            await setDoc(doc(db, "users", cred.user.uid), {
                uid: cred.user.uid,
                username,
                email,
                createdAt: serverTimestamp(),
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.form}>
            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
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
            <input
                placeholder="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.btn} onClick={handleRegister}>Create Account</button>
        </div>
    );
}

