"use client"
import styles from "./styles/output.module.css"
import { useState, useEffect } from "react";
import { auth } from "@/app/api/firebase/config";

type TestResult = {
    input: string;
    status: "PASS" | "FAIL";
};
type ResultPayload =
    | {
        compiled: true;
        tests: TestResult[];
    }
    | {
        compiled: false;
        error: string;
    };

type OutputModalProps = {
    resultVal: ResultPayload;
    onClose: () => void;
    probName: string;
    filename: string;
};
const comments = {
    perfect: [
        "You cooked 🔥",
        "All tests passed, respect 👑",
        "Clean run. Zero bugs.",
    ],
    mixed: [
        "Almost there 👀",
        "One bug away from greatness",
        "Code gods are watching…",
    ],
    fail: [
        "You broke the code 💀",
        "What was the plan here?",
        "Tests had other ideas",
    ],
    compileFail: [
        "It didn’t even compile 💀",
        "Compiler said: absolutely not.",
        "Syntax error speedrun any%",
        "Bro forgot a semicolon",
        "The compiler is disappointed.",
    ],
};
const Outputmodal = ({ resultVal, onClose, probName, filename }: OutputModalProps) => {

    const [isRunning, setIsRunning] = useState(false);
    const [disableLLM, setDisableLLM] = useState(false);
    useEffect(() => {
        if (!resultVal.compiled) return;

        const hasFailure = resultVal.tests.some(
            (test) => test.status !== "PASS"
        );

        setDisableLLM(hasFailure);
    }, [resultVal]);
    async function reqLLM() {
        const user = auth.currentUser;

        if (!user) return;

        const token = await user.getIdToken();
        const res = await fetch(`/api/llm`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
            body: JSON.stringify({
                problemName: probName,
                filename,
            }),
        })
        const data = await res.json();
        console.log(data.raw);

    }

    if (resultVal.compiled === false) {
        return (
            <div className={styles.backdrop}>
                <div className={styles.modal}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>

                    <h2 className={styles.title}>Compilation Failed</h2>
                    {/*
                    <div className={`${styles.testBox} ${styles.fail}`}>
                        <span className={styles.input}>Compiled</span>
                        <span className={styles.status}>FAIL</span>
                    </div>
*/}
                    <div className={styles.errorBox}>
                        <pre className={styles.errorText}>
                            {resultVal.error}
                        </pre>
                    </div>
                    {/*
                    <div className={styles.comment}>
                        {comments.compileFail[
                            Math.floor(Math.random() * comments.compileFail.length)
                        ]}
                    </div>
                    */}
                    <br />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button
                            className={styles.ideBtn}
                            onClick={reqLLM}
                            disabled={isRunning}
                        >
                            {isRunning ? (
                                <span className="run-loading">
                                    <span className="loader" />
                                    LLM Thinking
                                </span>
                            ) : (
                                "Challenge LLM"
                            )}
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    const tests = resultVal.tests;

    const fails = tests.filter(t => t.status === "FAIL").length;

    const commentPool =
        fails === 0
            ? comments.perfect
            : fails === tests.length
                ? comments.fail
                : comments.mixed;

    const comment =
        commentPool[Math.floor(Math.random() * commentPool.length)];

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <h2 className={styles.title}>Test Results</h2>
                <div className={styles.results}>

                    {tests.map((t, i) => (

                        <div
                            key={i}
                            className={`${styles.testBox} ${t.status === "PASS" ? styles.pass : styles.fail
                                }`}
                        >
                            <span className={styles.input}>{t.input}</span>
                            <span className={styles.status}>{t.status}</span>
                        </div>
                    ))}

                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        className={styles.ideBtn}

                        onClick={reqLLM}
                        disabled={disableLLM || isRunning}
                    >
                        {isRunning ? (
                            <span className={styles.runLoading}>
                                <span className={styles.loader} />
                                LLM Thinking
                            </span>
                        ) : (
                            "Challenge LLM"
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Outputmodal;
