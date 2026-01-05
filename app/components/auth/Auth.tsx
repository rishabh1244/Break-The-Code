"use client";

import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import styles from "./styles/style.module.css";

export default function Auth({ onClose }: { onClose: () => void }) {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <div
            className={styles.backdrop}
            onClick={onClose} // click outside closes
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <h2 className={styles.title}>
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>

                {mode === "login" ? <Login /> : <Register />}

                <p className={styles.switch}>
                    {mode === "login" ? (
                        <>
                            No account?{" "}
                            <button
                                className={styles.switchBtn}
                                onClick={() => setMode("register")}
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                className={styles.switchBtn}
                                onClick={() => setMode("login")}
                            >
                                Login
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

