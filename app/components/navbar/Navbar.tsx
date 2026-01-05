
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles/style.module.css";
import Auth from "../auth/Auth";
import { auth } from "@/api/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                setShowAuth(false);
            }
        });

        return () => unsub();
    }, []);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>{'</>'}</span>
                        <span>Break the Code</span>
                    </Link>
                    <ul className={styles.navLinks}>
                        <li><Link href="/problems" className={styles.navLink}>Problems</Link></li>
                        <li><Link href="/contests" className={styles.navLink}>Contests</Link></li>
                        <li><Link href="/leaderboard" className={styles.navLink}>Leaderboard</Link></li>
                        <li><Link href="/discuss" className={styles.navLink}>Discuss</Link></li>
                    </ul>
                    <div className={styles.userSection}>
                        {user ? (
                            <button className={styles.profileBtn}>
                                {user.displayName}
                            </button>
                        ) : (
                            <button
                                className={styles.profileBtn}
                                onClick={() => setShowAuth(true)}
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {showAuth && (
                <Auth onClose={() => setShowAuth(false)} />
            )}
        </>
    );
};

export default Navbar;

