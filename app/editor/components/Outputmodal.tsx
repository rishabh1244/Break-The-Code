"use client"
import styles from "./styles/output.module.css"

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
const Outputmodal = ({ resultVal, onClose }: OutputModalProps) => {
    // 🚨 CASE 1: compilation failed
    if (resultVal.compiled === false) {
        return (
            <div className={styles.backdrop}>
                <div className={styles.modal}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>

                    <h2 className={styles.title}>Compilation Failed</h2>

                    <div className={`${styles.testBox} ${styles.fail}`}>
                        <span className={styles.input}>Compiled</span>
                        <span className={styles.status}>FAIL</span>
                    </div>

                    <div className={styles.comment}>
                        {comments.compileFail[
                            Math.floor(Math.random() * comments.compileFail.length)
                        ]}
                    </div>
                </div>
            </div>
        );
    }

    // ✅ CASE 2: compilation succeeded
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

                <div className={styles.comment}>{comment}</div>
            </div>
        </div>
    );
};

export default Outputmodal;
