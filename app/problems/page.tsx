"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import styles from "./styles/ProblemList.module.css";
import Navbar from "../components/navbar/Navbar";
import ProblemListContext from "@/context/ProblemList/ProblemListContext";
import ToggleTheme from "../components/toggle_theme/ToggleTheme";

export default function ProblemsPage() {
    const ctx = useContext(ProblemListContext);

    if (!ctx) {
        throw new Error("ProblemListContext not found");
    }

    const { problemList, listProblems } = ctx;

    useEffect(() => {
        listProblems();
    }, []);


    return (
        <div className={styles.pageWrapper}>
            <Navbar />

            <div className={styles.mainBox}>
                <h2 className={styles.heading}>Problems</h2>

                <div className={styles.listWrapper}>
                    {problemList.map((p, index) => (
                        <Link
                            key={p.slug}
                            href={`/editor?slug=${p.slug}`}
                            className={styles.listItem}
                        >
                            <span className={styles.index}>{index + 1}.</span>
                            <span className={styles.title}>{p.slug}</span>
                            <span
                                className={`${styles.difficulty} }`}
                            >
                                easy
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <ToggleTheme />
        </div>
    );
}

