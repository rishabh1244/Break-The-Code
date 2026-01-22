"use client"
import styles from "./styles/output.module.css"
import { useState, useEffect } from "react";

import { auth } from "@/app/api/firebase/config";
import LLMResult from "./LLMResult";
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
const Outputmodal = ({ resultVal, onClose, probName, filename }: OutputModalProps) => {

    const [isRunning, setIsRunning] = useState(false);
    const [disableLLM, setDisableLLM] = useState(false);
    const [switchModalDisplay, setSwitchModalDisplay] = useState(false);

    const [llmResult, setLLMResult] = useState<any>(null);

    const hasLLMResult = llmResult !== null;

    useEffect(() => {
        if (!resultVal.compiled) return;
        if (!resultVal.tests || !Array.isArray(resultVal.tests)) return;

        const hasFailure = resultVal.tests.some(
            (test) => test.status !== "PASS"
        );

        setDisableLLM(hasFailure);
    }, [resultVal]);
    async function reqLLM() {
        setIsRunning(true);
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
        console.log(data.message);

        setLLMResult(data.message);
        setIsRunning(false);
        setSwitchModalDisplay(true);
    }

    if (switchModalDisplay) {
        return (
            <LLMResult
                resultVal={llmResult}
                onClose={onClose}
                onBack={() => setSwitchModalDisplay(false)}
            >

            </LLMResult>
        )
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
                            disabled={disableLLM || isRunning || hasLLMResult}
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
                    {hasLLMResult && (
                        <button
                            className={styles.backBtn}
                            onClick={() => setSwitchModalDisplay(true)}
                            style={{ marginTop: "8px" }}
                        >
                            →
                        </button>
                    )}


                </div>
            </div>
        );
    }

    // Safety check: ensure tests exists and is an array
    if (!resultVal.compiled || !resultVal.tests || !Array.isArray(resultVal.tests)) {
        return (
            <div className={styles.backdrop}>
                <div className={styles.modal}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                    <h2 className={styles.title}>Error</h2>
                    <div className={styles.errorBox}>
                        <pre className={styles.errorText}>
                            Invalid result format. Expected tests array.
                        </pre>
                    </div>
                </div>
            </div>
        );
    }

    const tests = resultVal.tests;


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
                {hasLLMResult && (
                    <button
                        onClick={() => setSwitchModalDisplay(true)}
                        className={styles.backBtn}
                        aria-label="Back to your result"
                    >
                        →
                    </button>


                )}


            </div>
        </div>
    );
};

export default Outputmodal;
