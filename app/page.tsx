"use client";
import { useEffect, useContext } from "react";
import styles from "./home.module.css";

import ProblemListContext from "@/context/ProblemList/ProblemListContext";

import Navbar from "./components/navbar/Navbar";
import ToggleTheme from "./components/toggle_theme/ToggleTheme";

export default function Home() {

    const { problemList, listProblems } = useContext(ProblemListContext);

    useEffect(() => {
        listProblems();
    }, []);
    return (
        <>
            <div>
                <Navbar />

                <section className={styles.hero}>
                    <h1 className={styles.title}>
                        Break The Code
                    </h1>
                    <p className={styles.subtitle}>
                        Outsmart the AI. Exploit the logic. It's Human vs Machine<br />
                        <span>Can you find the flaw before the machine does?</span>
                    </p>

                    <div className={styles.buttons}>
                        <button className={styles.btnPrimary}>
                            🚀 Start Breaking Code
                        </button>
                        <button className={styles.btnSecondary}>
                            📚 Learn How
                        </button>
                    </div>

                    <div className={styles.features}>
                        <span>⚡ AI-Generated Challenges</span>
                        <span>🕵️ Bug Hunts</span>
                        <span>🥇 Competitive Scoring</span>
                        <span>👨‍💻 Be the Codebreaker</span>
                    </div>
                </section>
            </div>
            <ToggleTheme ></ToggleTheme>
        </>
    );
}

